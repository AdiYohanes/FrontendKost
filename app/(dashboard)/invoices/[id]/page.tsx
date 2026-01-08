"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useInvoice, useUpdatePaymentStatus } from "@/lib/hooks/useInvoices";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  FileText,
  User,
  Home,
  Calendar,
  DollarSign,
  Droplet,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Edit,
  Printer,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { format, isPast, parseISO } from "date-fns";
import { InvoiceStatus, UtilityType } from "@/lib/api/types";
import { toast } from "sonner";

export default function InvoiceDetailsPage() {
  const params = useParams();
  const invoiceId = params.id as string;

  const { data: invoice, isLoading, error } = useInvoice(invoiceId);
  const updatePaymentStatus = useUpdatePaymentStatus();

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status: InvoiceStatus, dueDate: string) => {
    const isOverdue =
      status === InvoiceStatus.UNPAID && isPast(parseISO(dueDate));

    if (isOverdue) {
      return (
        <Badge className="bg-red-600 hover:bg-red-700 text-white">
          <AlertCircle className="mr-1 h-3 w-3" />
          Overdue
        </Badge>
      );
    }

    switch (status) {
      case InvoiceStatus.PAID:
        return (
          <Badge className="bg-[#1baa56] hover:bg-[#148041] text-white">
            <CheckCircle className="mr-1 h-3 w-3" />
            Paid
          </Badge>
        );
      case InvoiceStatus.PARTIAL:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
            <Clock className="mr-1 h-3 w-3" />
            Partial
          </Badge>
        );
      case InvoiceStatus.UNPAID:
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600 text-white">
            <AlertCircle className="mr-1 h-3 w-3" />
            Unpaid
          </Badge>
        );
      default:
        return null;
    }
  };

  // Handle payment status update
  const handleUpdateStatus = async () => {
    if (!selectedStatus) {
      toast.error("Please select a payment status");
      return;
    }

    try {
      await updatePaymentStatus.mutateAsync({
        id: invoiceId,
        data: { paymentStatus: selectedStatus },
      });
      toast.success("Payment status updated successfully");
      setIsUpdateDialogOpen(false);
      setSelectedStatus("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update status";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1baa56] mx-auto"></div>
            <p className="mt-4 text-gray-500 dark:text-slate-400">
              Loading invoice...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="p-4 md:p-6">
        <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg p-6">
          <p className="text-red-600 dark:text-red-400">
            Error loading invoice: {error?.message || "Invoice not found"}
          </p>
          <Link href="/invoices">
            <Button
              variant="outline"
              className="mt-4 rounded-full cursor-pointer"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Invoices
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const isOverdue =
    invoice.paymentStatus === InvoiceStatus.UNPAID &&
    isPast(parseISO(invoice.dueDate));

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/invoices">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
          </Button>
        </Link>

        <div className="flex items-center gap-4">
          <div className="h-14 w-14 md:h-16 md:w-16 rounded-3xl bg-[#1baa56]/10 flex items-center justify-center shrink-0">
            <FileText className="h-7 w-7 md:h-8 md:w-8 text-[#1baa56]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              {invoice.invoiceNumber}
            </h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm md:text-base">
              Invoice Details
            </p>
          </div>
        </div>
      </div>

      {/* Overdue Warning */}
      {isOverdue && (
        <Card className="rounded-3xl border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 shadow-lg">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-600 text-sm md:text-base">
                  This invoice is overdue!
                </p>
                <p className="text-red-600/80 text-sm">
                  Payment was due on{" "}
                  {format(parseISO(invoice.dueDate), "MMMM dd, yyyy")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Invoice Details */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Invoice Information */}
          <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg">
            <CardContent className="p-4 md:p-6">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                Invoice Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-gray-50 dark:bg-slate-900 p-4">
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                    Invoice Number
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {invoice.invoiceNumber}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 dark:bg-slate-900 p-4">
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                    Payment Status
                  </p>
                  <div className="mt-1">
                    {getStatusBadge(invoice.paymentStatus, invoice.dueDate)}
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-50 dark:bg-slate-900 p-4">
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                    Billing Date
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#1baa56]" />
                    {format(parseISO(invoice.billingDate), "MMM dd, yyyy")}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 dark:bg-slate-900 p-4">
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                    Due Date
                  </p>
                  <p
                    className={`font-bold flex items-center gap-2 ${
                      isOverdue
                        ? "text-red-600"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    {format(parseISO(invoice.dueDate), "MMM dd, yyyy")}
                  </p>
                </div>

                {invoice.paidDate && (
                  <div className="col-span-1 md:col-span-2 rounded-2xl bg-[#1baa56]/5 dark:bg-[#1baa56]/10 p-4">
                    <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                      Paid Date
                    </p>
                    <p className="font-bold text-[#1baa56] flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      {format(parseISO(invoice.paidDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Amount Breakdown */}
          <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg">
            <CardContent className="p-4 md:p-6">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                Amount Breakdown
              </h2>

              <div className="space-y-3">
                {/* Rent Amount */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-[#1baa56]/10 flex items-center justify-center shrink-0">
                      <Home className="h-5 w-5 text-[#1baa56]" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">
                        Room Rent
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        Monthly rental fee
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(invoice.rentAmount)}
                  </p>
                </div>

                {/* Utility Breakdown */}
                {invoice.utilityRecords && invoice.utilityRecords.length > 0 ? (
                  <>
                    <div className="pt-2">
                      <p className="font-bold text-sm text-gray-500 dark:text-slate-400 mb-2">
                        Utility Charges
                      </p>
                    </div>
                    {invoice.utilityRecords.map((utility) => (
                      <div
                        key={utility.id}
                        className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-slate-900"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${
                              utility.utilityType === UtilityType.WATER
                                ? "bg-blue-100 dark:bg-blue-900/30"
                                : "bg-yellow-100 dark:bg-yellow-900/30"
                            }`}
                          >
                            {utility.utilityType === UtilityType.WATER ? (
                              <Droplet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-900 dark:text-white">
                              {utility.utilityType === UtilityType.WATER
                                ? "Water"
                                : "Electricity"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                              {utility.usage} units ×{" "}
                              {formatCurrency(utility.ratePerUnit)}
                            </p>
                          </div>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {formatCurrency(utility.totalCost)}
                        </p>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-900">
                    <p className="text-sm text-gray-500 dark:text-slate-400 text-center">
                      No utility charges for this period
                    </p>
                  </div>
                )}

                {/* Total */}
                <div className="flex items-center justify-between p-4 md:p-6 rounded-2xl bg-[#1baa56]/10 dark:bg-[#1baa56]/20 border-2 border-[#1baa56]/20 dark:border-[#1baa56]/30 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-[#1baa56] flex items-center justify-center shrink-0">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-base md:text-lg text-gray-900 dark:text-white">
                        Total Amount
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        Rent + Utilities
                      </p>
                    </div>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-[#1baa56]">
                    {formatCurrency(invoice.totalAmount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Resident Info & Actions */}
        <div className="space-y-4 md:space-y-6">
          {/* Resident Information */}
          <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg">
            <CardContent className="p-4 md:p-6">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                Resident Info
              </h2>

              <div className="flex items-center gap-3 mb-4 p-4 rounded-2xl bg-gray-50 dark:bg-slate-900">
                <div className="h-12 w-12 rounded-2xl bg-[#1baa56]/10 flex items-center justify-center shrink-0">
                  <User className="h-6 w-6 text-[#1baa56]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white truncate">
                    {invoice.resident?.user?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-slate-400 truncate">
                    @{invoice.resident?.user?.username || "N/A"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-slate-900">
                  <Home className="h-5 w-5 text-gray-500 dark:text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Room Number
                    </p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {invoice.resident?.room?.roomNumber || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-slate-900">
                  <Calendar className="h-5 w-5 text-gray-500 dark:text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Billing Cycle
                    </p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      Day {invoice.resident?.billingCycleDate || "N/A"}
                    </p>
                  </div>
                </div>

                {invoice.resident?.user?.phoneNumber && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-slate-900">
                    <Phone className="h-5 w-5 text-gray-500 dark:text-slate-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        Phone Number
                      </p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {invoice.resident.user.phoneNumber}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg">
            <CardContent className="p-4 md:p-6">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    setSelectedStatus(invoice.paymentStatus);
                    setIsUpdateDialogOpen(true);
                  }}
                  className="w-full h-12 rounded-full bg-[#1baa56] hover:bg-[#148041] text-white shadow-lg shadow-[#1baa56]/30 hover:shadow-[#1baa56]/50 hover:-translate-y-1 active:scale-95 transition-all duration-200 cursor-pointer justify-start"
                >
                  <Edit className="mr-2 h-5 w-5" />
                  Update Payment Status
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-full border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer justify-start"
                  onClick={() => window.print()}
                >
                  <Printer className="mr-2 h-5 w-5" />
                  Print Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Update Payment Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Update Payment Status
            </DialogTitle>
            <DialogDescription>
              Change the payment status for invoice {invoice.invoiceNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 dark:text-white">
                Payment Status
              </label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-12 rounded-2xl cursor-pointer">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value={InvoiceStatus.UNPAID}>Unpaid</SelectItem>
                  <SelectItem value={InvoiceStatus.PARTIAL}>Partial</SelectItem>
                  <SelectItem value={InvoiceStatus.PAID}>Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsUpdateDialogOpen(false)}
              className="rounded-full cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={updatePaymentStatus.isPending}
              className="rounded-full bg-[#1baa56] hover:bg-[#148041] cursor-pointer"
            >
              {updatePaymentStatus.isPending ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
