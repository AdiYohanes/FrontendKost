"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComplaintStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";

interface StatusHistoryItem {
  status: ComplaintStatus;
  timestamp: string;
  notes?: string;
}

interface ComplaintStatusManagerProps {
  currentStatus: ComplaintStatus;
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  resolutionNotes?: string;
  onStatusUpdate: (status: ComplaintStatus, notes?: string) => Promise<void>;
  isLoading?: boolean;
  canUpdate?: boolean;
}

/**
 * Complaint Status Manager Component
 * 
 * Comprehensive status management for complaints
 * 
 * Features:
 * - Status badge with color coding
 * - Priority indicator
 * - Status update with notes
 * - Status history timeline (simulated)
 * - Validation for status transitions
 */
export function ComplaintStatusManager({
  currentStatus,
  priority,
  createdAt,
  updatedAt,
  resolutionNotes,
  onStatusUpdate,
  isLoading = false,
  canUpdate = true,
}: ComplaintStatusManagerProps) {
  const [newStatus, setNewStatus] = useState<ComplaintStatus>(currentStatus);
  const [notes, setNotes] = useState("");

  const getStatusConfig = (status: ComplaintStatus) => {
    const configs = {
      [ComplaintStatus.OPEN]: {
        color: "bg-red-100 text-red-700 border-red-200",
        icon: <AlertCircle className="h-4 w-4" />,
        label: "Open",
      },
      [ComplaintStatus.IN_PROGRESS]: {
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: <Clock className="h-4 w-4" />,
        label: "In Progress",
      },
      [ComplaintStatus.RESOLVED]: {
        color: "bg-green-100 text-green-700 border-green-200",
        icon: <CheckCircle className="h-4 w-4" />,
        label: "Resolved",
      },
      [ComplaintStatus.CLOSED]: {
        color: "bg-gray-100 text-gray-700 border-gray-200",
        icon: <XCircle className="h-4 w-4" />,
        label: "Closed",
      },
    };
    return configs[status];
  };

  const getPriorityConfig = (priority: string) => {
    const configs = {
      low: {
        color: "bg-blue-100 text-blue-700",
        label: "Low Priority",
      },
      medium: {
        color: "bg-orange-100 text-orange-700",
        label: "Medium Priority",
      },
      high: {
        color: "bg-red-100 text-red-700",
        label: "High Priority",
      },
    };
    return configs[priority as keyof typeof configs];
  };

  const getAvailableStatuses = (current: ComplaintStatus): ComplaintStatus[] => {
    const transitions: Record<ComplaintStatus, ComplaintStatus[]> = {
      [ComplaintStatus.OPEN]: [ComplaintStatus.IN_PROGRESS, ComplaintStatus.CLOSED],
      [ComplaintStatus.IN_PROGRESS]: [ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED],
      [ComplaintStatus.RESOLVED]: [ComplaintStatus.CLOSED],
      [ComplaintStatus.CLOSED]: [],
    };
    return transitions[current] || [];
  };

  const handleSubmit = async () => {
    if (newStatus === currentStatus && !notes) {
      return;
    }
    await onStatusUpdate(newStatus, notes || undefined);
    setNotes("");
  };

  const statusConfig = getStatusConfig(currentStatus);
  const priorityConfig = getPriorityConfig(priority);
  const availableStatuses = getAvailableStatuses(currentStatus);
  const isResolved = currentStatus === ComplaintStatus.RESOLVED || currentStatus === ComplaintStatus.CLOSED;

  // Simulated status history (in real app, this would come from backend)
  const statusHistory: StatusHistoryItem[] = [
    {
      status: ComplaintStatus.OPEN,
      timestamp: createdAt,
      notes: "Complaint submitted",
    },
  ];

  if (currentStatus !== ComplaintStatus.OPEN) {
    statusHistory.push({
      status: ComplaintStatus.IN_PROGRESS,
      timestamp: updatedAt,
      notes: "Started working on the complaint",
    });
  }

  if (currentStatus === ComplaintStatus.RESOLVED || currentStatus === ComplaintStatus.CLOSED) {
    statusHistory.push({
      status: ComplaintStatus.RESOLVED,
      timestamp: updatedAt,
      notes: resolutionNotes || "Complaint resolved",
    });
  }

  if (currentStatus === ComplaintStatus.CLOSED) {
    statusHistory.push({
      status: ComplaintStatus.CLOSED,
      timestamp: updatedAt,
      notes: "Complaint closed",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-[#1baa56]" />
          Status Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status & Priority */}
        <div className="flex flex-wrap gap-3">
          <Badge
            className={cn(
              "px-3 py-1.5 flex items-center gap-2 border",
              statusConfig.color
            )}
          >
            {statusConfig.icon}
            {statusConfig.label}
          </Badge>
          <Badge className={cn("px-3 py-1.5", priorityConfig.color)}>
            {priorityConfig.label}
          </Badge>
        </div>

        {/* Status Update Form */}
        {canUpdate && !isResolved && availableStatuses.length > 0 && (
          <div className="space-y-4 p-4 rounded-2xl bg-gray-50 dark:bg-slate-900">
            <div className="space-y-2">
              <Label htmlFor="newStatus">Update Status</Label>
              <Select
                value={newStatus}
                onValueChange={(value) => setNewStatus(value as ComplaintStatus)}
              >
                <SelectTrigger id="newStatus" className="h-12 rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value={currentStatus}>
                    {getStatusConfig(currentStatus).label} (Current)
                  </SelectItem>
                  {availableStatuses.map((status) => {
                    const config = getStatusConfig(status);
                    return (
                      <SelectItem key={status} value={status}>
                        <span className="flex items-center gap-2">
                          {config.icon}
                          {config.label}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">
                Notes {newStatus === ComplaintStatus.RESOLVED && "(Required for resolution)"}
              </Label>
              <Textarea
                id="notes"
                placeholder={
                  newStatus === ComplaintStatus.RESOLVED
                    ? "Describe how the complaint was resolved..."
                    : "Add any notes about this status update..."
                }
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-2xl min-h-[100px]"
              />
              <p className="text-xs text-gray-500 dark:text-slate-400">
                These notes will be visible in the status history
              </p>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={
                isLoading ||
                (newStatus === currentStatus && !notes) ||
                (newStatus === ComplaintStatus.RESOLVED && !notes)
              }
              className="w-full h-12 rounded-full bg-[#1baa56] hover:bg-[#148041]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Status...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Update Status
                </>
              )}
            </Button>
          </div>
        )}

        {/* Resolved Message */}
        {isResolved && (
          <div className="rounded-2xl bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-700 dark:text-green-400">
                  {currentStatus === ComplaintStatus.CLOSED ? "Complaint Closed" : "Complaint Resolved"}
                </p>
                <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                  {currentStatus === ComplaintStatus.CLOSED
                    ? "This complaint has been closed and archived."
                    : "This complaint has been successfully resolved."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status History */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-gray-700 dark:text-slate-300">
            Status History
          </h4>
          <div className="space-y-3">
            {statusHistory.map((item, index) => {
              const config = getStatusConfig(item.status);
              const isLast = index === statusHistory.length - 1;

              return (
                <div key={index} className="relative">
                  {/* Connector Line */}
                  {!isLast && (
                    <div className="absolute left-4 top-10 w-0.5 h-full bg-gray-200 dark:bg-slate-700" />
                  )}

                  {/* Status Item */}
                  <div className="flex gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2",
                        config.color
                      )}
                    >
                      {config.icon}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-medium text-sm">{config.label}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">
                          {format(new Date(item.timestamp), "MMM dd, yyyy HH:mm")}
                        </p>
                      </div>
                      {item.notes && (
                        <p className="text-sm text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-900 p-2 rounded-lg">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resolution Notes (if resolved) */}
        {resolutionNotes && isResolved && (
          <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-sm text-green-700 dark:text-green-400 mb-2">
              Resolution Notes
            </h4>
            <p className="text-sm text-gray-700 dark:text-slate-300">
              {resolutionNotes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
