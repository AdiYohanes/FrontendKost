"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LaundryStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import {
  Clock,
  Loader2,
  CheckCircle,
  Package,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";

interface StatusStep {
  status: LaundryStatus;
  label: string;
  description: string;
  icon: React.ReactNode;
  nextStatus?: LaundryStatus;
  nextLabel?: string;
}

interface LaundryStatusTimelineProps {
  currentStatus: LaundryStatus;
  createdAt: string;
  updatedAt: string;
  onStatusUpdate: (status: LaundryStatus, notes?: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Laundry Status Timeline Component
 * 
 * Visual timeline showing laundry status progression with quick actions
 * 
 * Features:
 * - Visual status timeline
 * - Quick action buttons for next status
 * - Status history with timestamps
 * - Notes for status updates
 * - Validation for status transitions
 */
export function LaundryStatusTimeline({
  currentStatus,
  createdAt,
  updatedAt,
  onStatusUpdate,
  isLoading = false,
}: LaundryStatusTimelineProps) {
  const [notes, setNotes] = useState("");
  const [selectedNextStatus, setSelectedNextStatus] = useState<LaundryStatus | null>(null);

  const statusSteps: StatusStep[] = [
    {
      status: LaundryStatus.PENDING,
      label: "Pending",
      description: "Laundry received, waiting to be processed",
      icon: <Clock className="h-5 w-5" />,
      nextStatus: LaundryStatus.ON_PROCESS,
      nextLabel: "Start Processing",
    },
    {
      status: LaundryStatus.ON_PROCESS,
      label: "On Process",
      description: "Laundry is being washed and dried",
      icon: <Loader2 className="h-5 w-5" />,
      nextStatus: LaundryStatus.READY_TO_PICKUP,
      nextLabel: "Mark as Ready",
    },
    {
      status: LaundryStatus.READY_TO_PICKUP,
      label: "Ready to Pickup",
      description: "Laundry is ready for pickup",
      icon: <Package className="h-5 w-5" />,
      nextStatus: LaundryStatus.COMPLETED,
      nextLabel: "Mark as Completed",
    },
    {
      status: LaundryStatus.COMPLETED,
      label: "Completed",
      description: "Laundry has been picked up",
      icon: <CheckCircle className="h-5 w-5" />,
    },
  ];

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex((step) => step.status === currentStatus);
  };

  const isStepCompleted = (stepIndex: number) => {
    return stepIndex < getCurrentStepIndex();
  };

  const isStepCurrent = (stepIndex: number) => {
    return stepIndex === getCurrentStepIndex();
  };

  const handleStatusUpdate = async (nextStatus: LaundryStatus) => {
    setSelectedNextStatus(nextStatus);
    await onStatusUpdate(nextStatus, notes || undefined);
    setNotes("");
    setSelectedNextStatus(null);
  };

  const currentStepIndex = getCurrentStepIndex();
  const currentStep = statusSteps[currentStepIndex];

  // Check if cancelled
  const isCancelled = currentStatus === LaundryStatus.CANCELLED;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-[#1baa56]" />
          Status Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeline */}
        <div className="space-y-4">
          {statusSteps.map((step, index) => {
            const isCompleted = isStepCompleted(index);
            const isCurrent = isStepCurrent(index);
            const isUpcoming = index > currentStepIndex;

            return (
              <div key={step.status} className="relative">
                {/* Connector Line */}
                {index < statusSteps.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-5 top-12 w-0.5 h-12 -ml-px",
                      isCompleted
                        ? "bg-[#1baa56]"
                        : "bg-gray-200 dark:bg-slate-700"
                    )}
                  />
                )}

                {/* Step Content */}
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all",
                      isCompleted &&
                        "bg-[#1baa56] text-white ring-4 ring-[#1baa56]/20",
                      isCurrent &&
                        "bg-[#1baa56] text-white ring-4 ring-[#1baa56]/20 animate-pulse",
                      isUpcoming && "bg-gray-200 dark:bg-slate-700 text-gray-500"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.icon
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div>
                        <p
                          className={cn(
                            "font-semibold",
                            (isCompleted || isCurrent) &&
                              "text-gray-900 dark:text-white",
                            isUpcoming && "text-gray-500"
                          )}
                        >
                          {step.label}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          {step.description}
                        </p>
                      </div>

                      {/* Status Badge */}
                      {isCurrent && (
                        <Badge className="bg-[#1baa56] hover:bg-[#148041]">
                          Current
                        </Badge>
                      )}
                      {isCompleted && (
                        <Badge variant="outline" className="text-[#1baa56] border-[#1baa56]">
                          Done
                        </Badge>
                      )}
                    </div>

                    {/* Timestamp */}
                    {(isCompleted || isCurrent) && (
                      <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">
                        {isCurrent
                          ? `Updated: ${format(new Date(updatedAt), "MMM dd, yyyy HH:mm")}`
                          : isCompleted && index === 0
                            ? `Started: ${format(new Date(createdAt), "MMM dd, yyyy HH:mm")}`
                            : ""}
                      </p>
                    )}

                    {/* Quick Action Button */}
                    {isCurrent && step.nextStatus && !isCancelled && (
                      <div className="mt-3 space-y-3">
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(step.nextStatus!)}
                          disabled={isLoading && selectedNextStatus === step.nextStatus}
                          className="bg-[#1baa56] hover:bg-[#148041] text-white"
                        >
                          {isLoading && selectedNextStatus === step.nextStatus ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              {step.nextLabel}
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>

                        {/* Notes Input */}
                        <div className="space-y-2">
                          <Label htmlFor="notes" className="text-xs">
                            Add notes (optional)
                          </Label>
                          <Textarea
                            id="notes"
                            placeholder="Add any notes about this status update..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="text-sm min-h-[60px]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Cancelled Status */}
          {isCancelled && (
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-red-100 dark:bg-red-900/30 text-red-600 ring-4 ring-red-100 dark:ring-red-900/30">
                  <XCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-red-600">Cancelled</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    This laundry order has been cancelled
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                    {format(new Date(updatedAt), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>



        {/* Completion Message */}
        {currentStatus === LaundryStatus.COMPLETED && (
          <div className="rounded-2xl bg-[#1baa56]/10 dark:bg-[#1baa56]/20 p-4 border border-[#1baa56]/20">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-[#1baa56]" />
              <div>
                <p className="font-semibold text-[#1baa56]">
                  Order Completed!
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  This laundry order has been successfully completed
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
