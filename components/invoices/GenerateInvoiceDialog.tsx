"use client";

import { useState, useMemo } from "react";
import { useResidents } from "@/lib/hooks/useResidents";
import { useUtilitiesByResident } from "@/lib/hooks/useUtilities";
import { useGenerateInvoice } from "@/lib/hooks/useInvoices";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  FileText,
  User,
  Home,
  Check,
  Building2,
  Droplets,
  Zap,
  Loader2,
  ArrowRight
} from "lucide-react";
import { UtilityType } from "@/lib/api/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface GenerateInvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GenerateInvoiceDialog({
  isOpen,
  onOpenChange,
}: GenerateInvoiceDialogProps) {
  const [selectedResidentId, setSelectedResidentId] = useState<string>("");
  const [step, setStep] = useState<1 | 2>(1); // 1: Select, 2: Review

  // Fetch active residents
  const { data: residents, isLoading: loadingResidents } = useResidents({
    isActive: true,
  });

  // Fetch unbilled utilities for selected resident
  const { data: utilities, isLoading: loadingUtilities } =
    useUtilitiesByResident(selectedResidentId, { status: 'unbilled' });

  const generateInvoice = useGenerateInvoice();

  // Get selected resident details
  const selectedResident = useMemo(() => {
    if (!selectedResidentId || !residents) return null;
    return residents.find((r) => r.id === selectedResidentId);
  }, [selectedResidentId, residents]);

  // Calculate totals
  const totals = useMemo(() => {
    if (!selectedResident || !utilities) {
      return {
        rentAmount: 0,
        utilityAmount: 0,
        totalAmount: 0,
        waterCost: 0,
        electricityCost: 0,
      };
    }

    const rentAmount = selectedResident.room?.rentalPrice || 0;
    const waterCost =
      utilities
        .filter((u) => u.utilityType === UtilityType.WATER)
        .reduce((sum, u) => sum + u.totalCost, 0) || 0;
    const electricityCost =
      utilities
        .filter((u) => u.utilityType === UtilityType.ELECTRICITY)
        .reduce((sum, u) => sum + u.totalCost, 0) || 0;
    const utilityAmount = waterCost + electricityCost;
    const totalAmount = rentAmount + utilityAmount;

    return {
      rentAmount,
      utilityAmount,
      totalAmount,
      waterCost,
      electricityCost,
    };
  }, [selectedResident, utilities]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleGenerate = async () => {
    if (!selectedResidentId) return;

    try {
      await generateInvoice.mutateAsync(selectedResidentId);
      toast.success("Invoice generated successfully");
      handleClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setSelectedResidentId("");
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white dark:bg-zinc-950 border-none shadow-2xl rounded-3xl">
        <DialogTitle className="sr-only">Generate Invoice</DialogTitle>
        <DialogDescription className="sr-only">Create a new invoice for a resident</DialogDescription>

        <div className="flex flex-col">
          {/* Header */}
          <div className="bg-zinc-50/50 dark:bg-zinc-900/50 p-8 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
              Generate Invoice
            </h2>
            <p className="text-zinc-500 text-sm font-medium">
              {step === 1 ? "Select resident to bill" : "Review and confirm charges"}
            </p>
          </div>

          <div className="p-8 space-y-8">
            {step === 1 ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">
                    Resident Account
                  </label>
                  <Select
                    value={selectedResidentId}
                    onValueChange={setSelectedResidentId}
                    disabled={loadingResidents}
                  >
                    <SelectTrigger className="h-14 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-6 focus:ring-4 focus:ring-[#1baa56]/10 focus:border-[#1baa56] transition-all font-bold text-zinc-900 dark:text-zinc-100 shadow-sm">
                      <SelectValue placeholder={loadingResidents ? "Loading..." : "Select Resident"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-2xl p-2 bg-white dark:bg-zinc-950 max-h-[300px]">
                      {residents && residents.length > 0 ? (
                        residents.map((resident) => (
                          <SelectItem
                            key={resident.id}
                            value={resident.id}
                            className="rounded-2xl py-4 pl-10 pr-4 focus:bg-[#1baa56] focus:text-white transition-all cursor-pointer group"
                          >
                            <div className="flex flex-col">
                              <span className="font-black text-sm">
                                {resident.user.name || resident.user.username}
                              </span>
                              <span className="text-[10px] opacity-70 font-bold group-focus:opacity-100">
                                Room {resident.room.roomNumber}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-8 text-center text-xs font-black text-zinc-400 uppercase tracking-widest">
                          No active residents
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedResidentId}
                  className="w-full h-14 rounded-2xl bg-[#1baa56] hover:bg-[#168a46] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-[#1baa56]/20 transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Summary Card */}
                {selectedResident && (
                  <div className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 space-y-6">
                    <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                      <div className="h-12 w-12 rounded-2xl bg-white dark:bg-zinc-950 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <User className="h-6 w-6 text-zinc-400" />
                      </div>
                      <div>
                        <h3 className="font-black text-lg text-zinc-900 dark:text-zinc-100">
                          {selectedResident.user.name || selectedResident.user.username}
                        </h3>
                        <div className="flex items-center gap-2">
                           <Badge variant="outline" className="border-0 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                              Room {selectedResident.room.roomNumber}
                           </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-bold text-zinc-500">Room Rent</span>
                        </div>
                        <span className="font-black text-sm">{formatCurrency(totals.rentAmount)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                            <Droplets className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-bold text-zinc-500">Water Usage</span>
                        </div>
                        <span className="font-black text-sm">{formatCurrency(totals.waterCost)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-xl bg-yellow-50 text-yellow-500 flex items-center justify-center">
                            <Zap className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-bold text-zinc-500">Electricity</span>
                        </div>
                        <span className="font-black text-sm">{formatCurrency(totals.electricityCost)}</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-between">
                      <span className="font-black text-zinc-400 uppercase tracking-widest text-xs">Total Bill</span>
                      <span className="font-black text-2xl text-[#1baa56]">{formatCurrency(totals.totalAmount)}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="h-14 px-6 rounded-2xl text-zinc-500 font-bold"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={generateInvoice.isPending || loadingUtilities}
                    className="flex-1 h-14 rounded-2xl bg-[#1baa56] hover:bg-[#168a46] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-[#1baa56]/20 transition-all"
                  >
                    {generateInvoice.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Confirm & Generate <Check className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
