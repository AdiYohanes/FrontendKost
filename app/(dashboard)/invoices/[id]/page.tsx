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
import { PaymentForm } from "@/components/forms/PaymentForm";
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
import { getErrorMessage } from "@/lib/utils/errorHandler";
import { logger } from "@/lib/utils/logger";

export default function InvoiceDetailsPage() {
  const params = useParams();
  const invoiceId = params.id as string;

  const { data: invoice, isLoading, error } = useInvoice(invoiceId);
  const updatePaymentStatus = useUpdatePaymentStatus();

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

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
      toast.error(getErrorMessage(error));
    }
  };

  // Handle payment recording
  const handlePaymentSubmit = async (data: any) => {
    try {
      // Backend currently only accepts paymentStatus
      // TODO: Request backend to support: paidDate, paymentAmount, paymentMethod, notes
      await updatePaymentStatus.mutateAsync({
        id: invoiceId,
        data: {
          paymentStatus: data.paymentStatus,
        },
      });
      toast.success(
        `Payment recorded successfully! Status: ${data.paymentStatus}`
      );
      setIsPaymentDialogOpen(false);
    } catch (error) {
      logger.error('Payment submission error:', error);
      toast.error(getErrorMessage(error));
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
        <div className="rounded-3xl border-none bg-red-50 dark:bg-red-950/20 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-red-600 text-sm md:text-base uppercase tracking-wide">
                This invoice is overdue!
              </p>
              <p className="text-red-600/80 text-xs font-bold mt-1">
                Payment was due on{" "}
                {format(parseISO(invoice.dueDate), "MMMM dd, yyyy")}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Invoice Details */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Invoice Information */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-sm border border-zinc-100 dark:border-zinc-800">
             <div className="flex items-center gap-2 mb-6">
                <FileText className="h-5 w-5 text-[#1baa56]" />
                <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">
                  Invoice Information
                </h2>
             </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                  Invoice Number
                </p>
                <p className="font-black text-lg text-zinc-900 dark:text-zinc-100 mobile:text-base">
                  {invoice.invoiceNumber}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                  Payment Status
                </p>
                <div className="mt-1">
                  {getStatusBadge(invoice.paymentStatus, invoice.dueDate)}
                </div>
              </div>

              <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                  Billing Date
                </p>
                <p className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-[#1baa56]" />
                  {format(parseISO(invoice.billingDate), "MMM dd, yyyy")}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                  Due Date
                </p>
                <p
                  className={`font-bold flex items-center gap-2 text-sm ${
                    isOverdue
                      ? "text-red-600"
                      : "text-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  {format(parseISO(invoice.dueDate), "MMM dd, yyyy")}
                </p>
              </div>

              {invoice.paidDate && (
                <div className="col-span-1 md:col-span-2 rounded-2xl bg-[#1baa56]/5 dark:bg-[#1baa56]/10 p-5 border border-[#1baa56]/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#1baa56]/70 mb-2">
                    Paid Date
                  </p>
                  <p className="font-bold text-[#1baa56] flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    {format(parseISO(invoice.paidDate), "MMM dd, yyyy")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-sm border border-zinc-100 dark:border-zinc-800">
             <div className="flex items-center gap-2 mb-6">
                <DollarSign className="h-5 w-5 text-[#1baa56]" />
                <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">
                  Amount Breakdown
                </h2>
             </div>

            <div className="space-y-4">
              {/* Rent Amount */}
              <div className="flex items-center justify-between p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-700 shadow-sm">
                    <Home className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-zinc-900 dark:text-zinc-100">
                      Room Rent
                    </p>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wide">
                      Monthly rental fee
                    </p>
                  </div>
                </div>
                <p className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(invoice.rentAmount)}
                </p>
              </div>

              {/* Utility Breakdown */}
              {invoice.utilityRecords && invoice.utilityRecords.length > 0 ? (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 px-1">
                    <div className="h-px bg-zinc-100 dark:bg-zinc-800 flex-1" />
                    <span className="text-[10px] font-black uppercase text-zinc-300 tracking-widest">Utilities</span>
                    <div className="h-px bg-zinc-100 dark:bg-zinc-800 flex-1" />
                  </div>
                  
                  {invoice.utilityRecords.map((utility) => (
                    <div
                      key={utility.id}
                      className="flex items-center justify-between p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={
                            "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-700 shadow-sm bg-white dark:bg-zinc-900"
                          }
                        >
                          {utility.utilityType === UtilityType.WATER ? (
                            <Droplet className="h-5 w-5 text-blue-500" />
                          ) : (
                            <Zap className="h-5 w-5 text-yellow-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-sm text-zinc-900 dark:text-zinc-100">
                            {utility.utilityType === UtilityType.WATER
                              ? "Water"
                              : "Electricity"}
                          </p>
                          <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wide">
                            {utility.usage} units ×{" "}
                            {formatCurrency(utility.ratePerUnit)}
                          </p>
                        </div>
                      </div>
                      <p className="font-black text-zinc-900 dark:text-zinc-100 text-sm">
                        {formatCurrency(utility.totalCost)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-dashed border-zinc-200 dark:border-zinc-700">
                  <p className="text-xs font-bold text-zinc-400 text-center uppercase tracking-wide">
                    No utility charges
                  </p>
                </div>
              )}

              {/* Total */}
              <div className="flex items-center justify-between p-6 md:p-8 rounded-3xl bg-[#1baa56] shadow-xl shadow-[#1baa56]/20 mt-6 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-white/20" />
                 
                <div className="flex items-center gap-4 relative z-10">
                  <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
                    <DollarSign className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-lg text-white">
                      Total Amount
                    </p>
                    <p className="text-[10px] uppercase font-bold text-white/60 tracking-widest">
                      Rent + Utilities
                    </p>
                  </div>
                </div>
                <p className="text-2xl md:text-4xl font-black text-white relative z-10">
                  {formatCurrency(invoice.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Resident Info & Actions */}
        <div className="space-y-4 md:space-y-6">
          {/* Resident Information */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-sm border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-6">
                <User className="h-5 w-5 text-[#1baa56]" />
                <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">
                  Resident Info
                </h2>
             </div>

            <div className="flex items-center gap-4 mb-6 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
              <div className="h-14 w-14 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center shrink-0 shadow-sm">
                <User className="h-6 w-6 text-zinc-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-lg text-zinc-900 dark:text-zinc-100 truncate">
                  {/* Handle both flat (new) and nested (old) structure */}
                  {"name" in invoice.resident 
                    ? invoice.resident.name 
                    : (invoice.resident as any)?.user?.name || "N/A"}
                </p>
                <p className="text-xs font-bold text-zinc-400 truncate">
                  {/* Username might not be in the flat structure, fallback safely */}
                  {"user" in invoice.resident ? `@${(invoice.resident as any).user?.username}` : ""}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center py-3 border-b border-dashed border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 px-2 rounded-lg transition-colors">
                 <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Room Number</span>
                 <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {"roomNumber" in invoice.resident 
                      ? invoice.resident.roomNumber 
                      : (invoice.resident as any)?.room?.roomNumber || "N/A"}
                 </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-dashed border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 px-2 rounded-lg transition-colors">
                 <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Billing Cycle</span>
                 <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Day {invoice.resident?.billingCycleDate || "N/A"}</span>
              </div>

               {/* Only show phone if available (likely only in nested old structure or if added to new one later) */}
               {(invoice.resident as any)?.user?.phoneNumber && (
                  <div className="flex justify-between items-center py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 px-2 rounded-lg transition-colors">
                    <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Phone</span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{(invoice.resident as any).user.phoneNumber}</span>
                  </div>
               )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-sm border border-zinc-100 dark:border-zinc-800">
             <div className="flex items-center gap-2 mb-6">
                <Zap className="h-5 w-5 text-[#1baa56]" />
                <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">
                  Quick Actions
                </h2>
             </div>
            <div className="space-y-3">
              {invoice.paymentStatus !== InvoiceStatus.PAID && (
                <Button
                  onClick={() => setIsPaymentDialogOpen(true)}
                  className="w-full h-14 rounded-2xl bg-[#1baa56] hover:bg-[#168a46] text-white shadow-xl shadow-[#1baa56]/20 hover:shadow-[#1baa56]/30 hover:-translate-y-1 active:scale-95 transition-all duration-300 cursor-pointer justify-between px-6 font-black text-xs uppercase tracking-widest"
                >
                  <span>Record Payment</span>
                  <DollarSign className="h-5 w-5" />
                </Button>
              )}
              <Button
                onClick={() => {
                  setSelectedStatus(invoice.paymentStatus);
                  setIsUpdateDialogOpen(true);
                }}
                variant="outline"
                className="w-full h-14 rounded-2xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-pointer justify-between px-6 font-bold text-xs uppercase tracking-widest"
              >
                 <span>Update Status</span>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full h-14 rounded-2xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-pointer justify-between px-6 font-bold text-xs uppercase tracking-widest"
                onClick={() => window.print()}
              >
                <span>Print Invoice</span>
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </div>
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

      {/* Record Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="rounded-3xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Record Payment
            </DialogTitle>
            <DialogDescription>
              Record payment for invoice {invoice.invoiceNumber}
            </DialogDescription>
          </DialogHeader>
          <PaymentForm
            invoiceId={invoiceId}
            totalAmount={invoice.totalAmount}
            paidAmount={0} // TODO: Track paid amount from backend
            currentStatus={invoice.paymentStatus}
            onSubmit={handlePaymentSubmit}
            isLoading={updatePaymentStatus.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
