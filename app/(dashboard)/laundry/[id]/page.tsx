"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Loader2, Edit } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/errorHandler";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { LaundryStatusTimeline } from "@/components/laundry/LaundryStatusTimeline";

import {
  useLaundry,
  useUpdateLaundryStatus,
  useUpdateLaundryPayment,
} from "@/lib/hooks/useLaundry";
import { useAuthStore } from "@/lib/stores/authStore";
import { LaundryStatus, LaundryPaymentStatus, UserRole } from "@/lib/api/types";

export default function LaundryDetailPage() {
  const params = useParams();
  const { user } = useAuthStore();
  const id = params.id as string;

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<
    LaundryPaymentStatus | ""
  >("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch laundry transactions
  const { data: laundryTransactions, isLoading } = useLaundry();
  const transaction = laundryTransactions?.find((t) => t.id === id);

  // Mutations
  const updateStatus = useUpdateLaundryStatus();
  const updatePayment = useUpdateLaundryPayment();

  // Get payment badge variant
  const getPaymentBadge = (paymentStatus: LaundryPaymentStatus) => {
    switch (paymentStatus) {
      case "PAID":
        return { variant: "default" as const, label: "Paid" };
      case "PARTIAL":
        return { variant: "secondary" as const, label: "Partial" };
      default:
        return { variant: "destructive" as const, label: "Unpaid" };
    }
  };

  // Validate status transition
  const isValidStatusTransition = (
    currentStatus: LaundryStatus,
    newStatus: LaundryStatus
  ): boolean => {
    const validTransitions: Record<LaundryStatus, LaundryStatus[]> = {
      [LaundryStatus.PENDING]: [
        LaundryStatus.ON_PROCESS,
        LaundryStatus.CANCELLED,
      ],
      [LaundryStatus.ON_PROCESS]: [
        LaundryStatus.READY_TO_PICKUP,
        LaundryStatus.CANCELLED,
      ],
      [LaundryStatus.READY_TO_PICKUP]: [
        LaundryStatus.COMPLETED,
        LaundryStatus.CANCELLED,
      ],
      [LaundryStatus.COMPLETED]: [],
      [LaundryStatus.CANCELLED]: [],
    };
    return validTransitions[currentStatus]?.includes(newStatus) || false;
  };

  // Handle status update with notes
  const handleStatusUpdate = async (newStatus: LaundryStatus, notes?: string) => {
    if (!transaction) return;

    // Validate transition
    if (!isValidStatusTransition(transaction.status, newStatus)) {
      toast.error("Invalid status transition");
      return;
    }

    // Check payment requirement for COMPLETED
    if (
      newStatus === "COMPLETED" &&
      transaction.paymentStatus === "UNPAID"
    ) {
      toast.error("Cannot complete laundry without payment");
      return;
    }

    try {
      await updateStatus.mutateAsync({
        id: transaction.id,
        data: { status: newStatus },
      });
      toast.success(`Status updated to ${newStatus}${notes ? ` - ${notes}` : ""}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error; // Re-throw to let component handle loading state
    }
  };

  // Handle payment update
  const handlePaymentUpdate = async () => {
    if (!transaction || !selectedPayment) return;

    try {
      setIsUpdating(true);
      await updatePayment.mutateAsync({
        id: transaction.id,
        data: { paymentStatus: selectedPayment },
      });
      toast.success("Payment status updated successfully");
      setPaymentDialogOpen(false);
      setSelectedPayment("");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsUpdating(false);
    }
  };

  // Check if user can update
  const canUpdate = user?.role === UserRole.PENJAGA;

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Transaction not found</p>
            <Link href="/laundry">
              <Button className="mt-4">Back to Laundry</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const paymentBadge = getPaymentBadge(transaction.paymentStatus);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/laundry">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Laundry Transaction Details</h1>
          <p className="text-muted-foreground">View and manage transaction</p>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information - 1 column */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Resident</p>
              <p className="font-medium">
                {transaction.resident
                  ? ("name" in transaction.resident 
                      ? transaction.resident.name 
                      : (transaction.resident as any)?.user?.name || "Unknown")
                  : "Resident #" + transaction.residentId.slice(0, 5)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Room</p>
              <p className="font-medium">
                {transaction.resident
                  ? ("roomNumber" in transaction.resident 
                      ? transaction.resident.roomNumber 
                      : (transaction.resident as any)?.room?.roomNumber || "N/A")
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Service Type</p>
              <p className="font-medium">{transaction.serviceType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Weight</p>
              <p className="font-medium">{transaction.weight} kg</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-medium">
                Rp {transaction.price.toLocaleString("id-ID")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">
                {format(new Date(transaction.orderDate || transaction.createdAt), "dd MMMM yyyy")}
              </p>
            </div>
            {transaction.completedDate && (
              <div>
                <p className="text-sm text-muted-foreground">Completed Date</p>
                <p className="font-medium">
                  {format(new Date(transaction.completedDate), "dd MMMM yyyy")}
                </p>
              </div>
            )}
            
            {/* Payment Status */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Payment Status</p>
                {canUpdate && transaction.paymentStatus === "UNPAID" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedPayment(transaction.paymentStatus);
                      setPaymentDialogOpen(true);
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Update
                  </Button>
                )}
              </div>
              <Badge variant={paymentBadge.variant}>{paymentBadge.label}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Status Timeline - 2 columns */}
        <div className="lg:col-span-2">
          <LaundryStatusTimeline
            currentStatus={transaction.status}
            createdAt={transaction.createdAt}
            updatedAt={transaction.updatedAt}
            onStatusUpdate={handleStatusUpdate}
            isLoading={updateStatus.isPending}
          />
        </div>
      </div>

      {/* Payment Update Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Payment Status</DialogTitle>
            <DialogDescription>
              Change the payment status of this transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Payment Status</Label>
              <select
                value={selectedPayment}
                onChange={(e) =>
                  setSelectedPayment(e.target.value as LaundryPaymentStatus)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select payment status</option>
                <option value="UNPAID">Unpaid</option>
                <option value="PARTIAL">Partial</option>
                <option value="PAID">Paid</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPaymentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePaymentUpdate}
              disabled={isUpdating || !selectedPayment}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
