"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Loader2, Edit } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/errorHandler";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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

import {
  useLaundry,
  useUpdateLaundryStatus,
  useUpdateLaundryPayment,
} from "@/lib/hooks/useLaundry";
import { useAuthStore } from "@/lib/stores/authStore";
import { LaundryStatus, LaundryPaymentStatus, UserRole } from "@/lib/api/types";

export default function LaundryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const id = params.id as string;

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<LaundryStatus | "">("");
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

  // Get status badge variant
  const getStatusBadge = (status: LaundryStatus) => {
    const variants: Record<
      LaundryStatus,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      PENDING: { variant: "secondary", label: "Pending" },
      ON_PROCESS: { variant: "default", label: "On Process" },
      READY_TO_PICKUP: { variant: "outline", label: "Ready to Pickup" },
      COMPLETED: { variant: "default", label: "Completed" },
      CANCELLED: { variant: "destructive", label: "Cancelled" },
    };
    return variants[status];
  };

  // Get payment badge variant
  const getPaymentBadge = (paymentStatus: LaundryPaymentStatus) => {
    return paymentStatus === "PAID"
      ? { variant: "default" as const, label: "Paid" }
      : { variant: "destructive" as const, label: "Unpaid" };
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

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!transaction || !selectedStatus) return;

    // Validate transition
    if (!isValidStatusTransition(transaction.status, selectedStatus)) {
      toast.error("Invalid status transition");
      return;
    }

    // Check payment requirement for COMPLETED
    if (
      selectedStatus === "COMPLETED" &&
      transaction.paymentStatus === "UNPAID"
    ) {
      toast.error("Cannot complete laundry without payment");
      return;
    }

    try {
      setIsUpdating(true);
      await updateStatus.mutateAsync({
        id: transaction.id,
        data: { status: selectedStatus },
      });
      toast.success("Status updated successfully");
      setStatusDialogOpen(false);
      setSelectedStatus("");
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsUpdating(false);
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
    } catch (error: any) {
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

  const statusBadge = getStatusBadge(transaction.status);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Resident</p>
              <p className="font-medium">
                {transaction.resident.user.name ||
                  transaction.resident.user.username}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Room</p>
              <p className="font-medium">
                {transaction.resident.room.roomNumber}
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
                {format(new Date(transaction.orderDate), "dd MMMM yyyy")}
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
          </CardContent>
        </Card>

        {/* Status and Payment */}
        <Card>
          <CardHeader>
            <CardTitle>Status & Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Status</p>
                {canUpdate &&
                  transaction.status !== "COMPLETED" &&
                  transaction.status !== "CANCELLED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedStatus(transaction.status);
                        setStatusDialogOpen(true);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Update
                    </Button>
                  )}
              </div>
              <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
            </div>

            {/* Payment Status */}
            <div>
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

            {/* Progress Timeline */}
            <div>
              <p className="text-sm text-muted-foreground mb-4">Progress</p>
              <div className="space-y-3">
                {[
                  { status: "PENDING", label: "Pending" },
                  { status: "ON_PROCESS", label: "On Process" },
                  { status: "READY_TO_PICKUP", label: "Ready to Pickup" },
                  { status: "COMPLETED", label: "Completed" },
                ].map((step, index) => {
                  const isActive = transaction.status === step.status;
                  const isPassed =
                    [
                      "PENDING",
                      "ON_PROCESS",
                      "READY_TO_PICKUP",
                      "COMPLETED",
                    ].indexOf(transaction.status) >
                    [
                      "PENDING",
                      "ON_PROCESS",
                      "READY_TO_PICKUP",
                      "COMPLETED",
                    ].indexOf(step.status);

                  return (
                    <div key={step.status} className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isActive
                            ? "bg-primary"
                            : isPassed
                              ? "bg-primary/50"
                              : "bg-muted"
                        }`}
                      />
                      <p
                        className={`text-sm ${
                          isActive
                            ? "font-medium"
                            : isPassed
                              ? "text-muted-foreground"
                              : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>
              Change the transaction status. Only valid transitions are allowed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Status</Label>
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as LaundryStatus)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select new status</option>
                {transaction.status === "PENDING" && (
                  <>
                    <option value="ON_PROCESS">On Process</option>
                    <option value="CANCELLED">Cancelled</option>
                  </>
                )}
                {transaction.status === "ON_PROCESS" && (
                  <>
                    <option value="READY_TO_PICKUP">Ready to Pickup</option>
                    <option value="CANCELLED">Cancelled</option>
                  </>
                )}
                {transaction.status === "READY_TO_PICKUP" && (
                  <>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </>
                )}
              </select>
            </div>
            {selectedStatus === "COMPLETED" &&
              transaction.paymentStatus === "UNPAID" && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                  Cannot complete transaction without payment. Please update
                  payment status first.
                </div>
              )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={isUpdating || !selectedStatus}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
