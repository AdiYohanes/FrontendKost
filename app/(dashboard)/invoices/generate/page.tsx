"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useResidents } from "@/lib/hooks/useResidents";
import { useUtilitiesByResident } from "@/lib/hooks/useUtilities";
import { useGenerateInvoice } from "@/lib/hooks/useInvoices";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  FileText,
  User,
  Home,
  DollarSign,
  Droplet,
  Zap,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { UtilityType } from "@/lib/api/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/errorHandler";

export default function GenerateInvoicePage() {
  const router = useRouter();
  const [selectedResidentId, setSelectedResidentId] = useState<string>("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Fetch active residents
  const { data: residents, isLoading: loadingResidents } = useResidents({
    isActive: true,
  });

  // Fetch unbilled utilities for selected resident
  const { data: utilities, isLoading: loadingUtilities } =
    useUtilitiesByResident(selectedResidentId, { isBilled: false });

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

  // Handle generate invoice
  const handleGenerateInvoice = async () => {
    if (!selectedResidentId) {
      toast.error("Please select a resident");
      return;
    }

    try {
      const result = await generateInvoice.mutateAsync(selectedResidentId);
      toast.success("Invoice generated successfully");
      setIsConfirmDialogOpen(false);
      router.push(`/invoices/${result.id}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Link href="/invoices">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Generate Invoice</h1>
            <p className="text-muted-foreground">
              Create a new invoice for a resident
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resident Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Resident</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resident</label>
                <Select
                  value={selectedResidentId}
                  onValueChange={setSelectedResidentId}
                  disabled={loadingResidents}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a resident" />
                  </SelectTrigger>
                  <SelectContent>
                    {residents?.map((resident) => (
                      <SelectItem key={resident.id} value={resident.id}>
                        {resident.user?.name} - Room {resident.room?.roomNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Only active residents are shown
                </p>
              </div>

              {selectedResident && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {selectedResident.user?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        @{selectedResident.user?.username}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Room</p>
                        <p className="font-semibold text-sm">
                          {selectedResident.room?.roomNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Monthly Rent
                        </p>
                        <p className="font-semibold text-sm">
                          {formatCurrency(
                            selectedResident.room?.rentalPrice || 0
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice Preview */}
          {selectedResidentId && (
            <Card>
              <CardHeader>
                <CardTitle>Invoice Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingUtilities ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Loading utilities...
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Rent Amount */}
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-semibold">Room Rent</p>
                          <p className="text-sm text-muted-foreground">
                            Monthly rental fee
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-bold">
                        {formatCurrency(totals.rentAmount)}
                      </p>
                    </div>

                    {/* Utility Breakdown */}
                    <div className="space-y-2">
                      <p className="font-semibold text-sm text-muted-foreground">
                        Unbilled Utility Charges
                      </p>
                      {utilities && utilities.length > 0 ? (
                        <>
                          {/* Water */}
                          {totals.waterCost > 0 && (
                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                  <Droplet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">Water</p>
                                  <p className="text-xs text-muted-foreground">
                                    {
                                      utilities.filter(
                                        (u) =>
                                          u.utilityType === UtilityType.WATER
                                      ).length
                                    }{" "}
                                    record(s)
                                  </p>
                                </div>
                              </div>
                              <p className="font-semibold">
                                {formatCurrency(totals.waterCost)}
                              </p>
                            </div>
                          )}

                          {/* Electricity */}
                          {totals.electricityCost > 0 && (
                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                                  <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">
                                    Electricity
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {
                                      utilities.filter(
                                        (u) =>
                                          u.utilityType ===
                                          UtilityType.ELECTRICITY
                                      ).length
                                    }{" "}
                                    record(s)
                                  </p>
                                </div>
                              </div>
                              <p className="font-semibold">
                                {formatCurrency(totals.electricityCost)}
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <AlertCircle className="h-4 w-4" />
                            <p className="text-sm">
                              No unbilled utilities for this resident
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border-2 border-primary">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-bold text-lg">Total Amount</p>
                          <p className="text-sm text-muted-foreground">
                            Rent + Utilities
                          </p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold">
                        {formatCurrency(totals.totalAmount)}
                      </p>
                    </div>

                    {/* Generate Button */}
                    <Button
                      onClick={() => setIsConfirmDialogOpen(true)}
                      className="w-full"
                      size="lg"
                      disabled={generateInvoice.isPending}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Invoice
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>How it works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Select Resident</p>
                    <p className="text-xs text-muted-foreground">
                      Choose an active resident to generate invoice for
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Review Preview</p>
                    <p className="text-xs text-muted-foreground">
                      Check rent and unbilled utilities breakdown
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Generate</p>
                    <p className="text-xs text-muted-foreground">
                      Confirm to create invoice and mark utilities as billed
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                    Important Notes
                  </p>
                  <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                    <li>Invoice includes monthly rent</li>
                    <li>All unbilled utilities will be included</li>
                    <li>Utilities will be marked as billed</li>
                    <li>Due date is 10 days from billing date</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Invoice Generation</DialogTitle>
            <DialogDescription>
              Are you sure you want to generate this invoice?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Resident:</span>
                <span className="font-semibold">
                  {selectedResident?.user?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Room:</span>
                <span className="font-semibold">
                  {selectedResident?.room?.roomNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Rent Amount:
                </span>
                <span className="font-semibold">
                  {formatCurrency(totals.rentAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Utility Amount:
                </span>
                <span className="font-semibold">
                  {formatCurrency(totals.utilityAmount)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Total Amount:</span>
                <span className="font-bold text-lg">
                  {formatCurrency(totals.totalAmount)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                This action will mark all unbilled utilities as billed and
                cannot be undone.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateInvoice}
              disabled={generateInvoice.isPending}
            >
              {generateInvoice.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm & Generate
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
