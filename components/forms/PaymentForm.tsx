"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { InvoiceStatus } from "@/lib/api/types";
import { DollarSign, Calendar, CreditCard, FileText } from "lucide-react";

/**
 * Payment Form Schema
 * Validates payment recording with partial payment support
 */
const paymentSchema = z.object({
  paymentAmount: z
    .number()
    .min(1, "Payment amount must be at least 1")
    .positive("Payment amount must be positive"),
  paymentMethod: z.enum(["cash", "transfer", "e-wallet", "other"]),
  paymentDate: z.string().min(1, "Payment date is required"),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  invoiceId: string;
  totalAmount: number;
  paidAmount?: number;
  currentStatus: InvoiceStatus;
  onSubmit: (data: PaymentFormData & { paymentStatus: InvoiceStatus }) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Enhanced Payment Form Component
 * 
 * Features:
 * - Partial payment support
 * - Payment method selection
 * - Payment date picker
 * - Remaining amount calculation
 * - Auto-determine payment status (paid/partial)
 * - Payment notes
 */
export function PaymentForm({
  invoiceId,
  totalAmount,
  paidAmount = 0,
  currentStatus,
  onSubmit,
  isLoading = false,
}: PaymentFormProps) {
  const remainingAmount = totalAmount - paidAmount;
  const [calculatedStatus, setCalculatedStatus] = useState<InvoiceStatus>(
    currentStatus
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentAmount: remainingAmount,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "cash",
      notes: "",
    },
  });

  const paymentAmount = watch("paymentAmount");
  const paymentMethod = watch("paymentMethod");

  // Auto-calculate payment status based on amount
  useEffect(() => {
    if (paymentAmount) {
      const newPaidAmount = paidAmount + paymentAmount;
      
      if (newPaidAmount >= totalAmount) {
        setCalculatedStatus(InvoiceStatus.PAID);
      } else if (newPaidAmount > 0) {
        setCalculatedStatus(InvoiceStatus.PARTIAL);
      } else {
        setCalculatedStatus(InvoiceStatus.UNPAID);
      }
    }
  }, [paymentAmount, paidAmount, totalAmount]);

  const handleFormSubmit = async (data: PaymentFormData) => {
    await onSubmit({
      ...data,
      paymentStatus: calculatedStatus,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return "💵";
      case "transfer":
        return "🏦";
      case "e-wallet":
        return "📱";
      default:
        return "💳";
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Backend Limitation Warning */}
      <div className="rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          ⚠️ <strong>Note:</strong> Currently, only payment status is saved to the backend. 
          Payment amount, method, date, and notes are for your reference only.
        </p>
      </div>
      {/* Amount Summary */}
      <div className="rounded-2xl bg-gray-50 dark:bg-slate-900 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-slate-400">
            Total Invoice
          </span>
          <span className="font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalAmount)}
          </span>
        </div>
        
        {paidAmount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-slate-400">
              Already Paid
            </span>
            <span className="font-medium text-green-600">
              - {formatCurrency(paidAmount)}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-700">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Remaining Amount
          </span>
          <span className="text-lg font-bold text-[#1baa56]">
            {formatCurrency(remainingAmount)}
          </span>
        </div>
      </div>

      {/* Payment Amount */}
      <div className="space-y-2">
        <Label htmlFor="paymentAmount" className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-[#1baa56]" />
          Payment Amount
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            Rp
          </span>
          <Input
            id="paymentAmount"
            type="number"
            step="1000"
            max={remainingAmount}
            className="pl-10 h-12 rounded-2xl"
            {...register("paymentAmount", { valueAsNumber: true })}
          />
        </div>
        {errors.paymentAmount && (
          <p className="text-sm text-red-600">{errors.paymentAmount.message}</p>
        )}
        
        {/* Quick Amount Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setValue("paymentAmount", remainingAmount)}
          >
            Full Amount
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setValue("paymentAmount", remainingAmount / 2)}
          >
            Half
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setValue("paymentAmount", remainingAmount / 4)}
          >
            Quarter
          </Button>
        </div>
        
        {paymentAmount > remainingAmount && (
          <p className="text-sm text-orange-600">
            ⚠️ Payment amount exceeds remaining amount. Excess will be recorded.
          </p>
        )}
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <Label htmlFor="paymentMethod" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-[#1baa56]" />
          Payment Method
        </Label>
        <Select
          value={paymentMethod}
          onValueChange={(value) =>
            setValue("paymentMethod", value as PaymentFormData["paymentMethod"])
          }
        >
          <SelectTrigger className="h-12 rounded-2xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="cash">
              <span className="flex items-center gap-2">
                💵 Cash
              </span>
            </SelectItem>
            <SelectItem value="transfer">
              <span className="flex items-center gap-2">
                🏦 Bank Transfer
              </span>
            </SelectItem>
            <SelectItem value="e-wallet">
              <span className="flex items-center gap-2">
                📱 E-Wallet (GoPay, OVO, Dana)
              </span>
            </SelectItem>
            <SelectItem value="other">
              <span className="flex items-center gap-2">
                💳 Other
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.paymentMethod && (
          <p className="text-sm text-red-600">{errors.paymentMethod.message}</p>
        )}
      </div>

      {/* Payment Date */}
      <div className="space-y-2">
        <Label htmlFor="paymentDate" className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#1baa56]" />
          Payment Date
        </Label>
        <Input
          id="paymentDate"
          type="date"
          max={new Date().toISOString().split("T")[0]}
          className="h-12 rounded-2xl"
          {...register("paymentDate")}
        />
        {errors.paymentDate && (
          <p className="text-sm text-red-600">{errors.paymentDate.message}</p>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#1baa56]" />
          Notes (Optional)
        </Label>
        <Textarea
          id="notes"
          placeholder="Add any notes about this payment..."
          className="rounded-2xl min-h-[80px]"
          {...register("notes")}
        />
        {errors.notes && (
          <p className="text-sm text-red-600">{errors.notes.message}</p>
        )}
      </div>

      {/* Status Preview */}
      <div className="rounded-2xl bg-[#1baa56]/10 dark:bg-[#1baa56]/20 p-4">
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
          After this payment:
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">New Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              calculatedStatus === InvoiceStatus.PAID
                ? "bg-green-100 text-green-700"
                : calculatedStatus === InvoiceStatus.PARTIAL
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
            }`}
          >
            {calculatedStatus}
          </span>
        </div>
        {calculatedStatus === InvoiceStatus.PARTIAL && (
          <p className="text-xs text-gray-600 dark:text-slate-400 mt-2">
            Remaining: {formatCurrency(remainingAmount - (paymentAmount || 0))}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 rounded-full bg-[#1baa56] hover:bg-[#148041] text-white shadow-lg"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            Recording Payment...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Record Payment
          </span>
        )}
      </Button>
    </form>
  );
}
