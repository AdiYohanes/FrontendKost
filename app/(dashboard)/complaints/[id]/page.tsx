"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Loader2, Edit, Image as ImageIcon, CheckCircle2, Clock, FileText, User, Wrench, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import Image from "next/image";

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
import { Textarea } from "@/components/ui/textarea";

import {
  useComplaint,
  useUpdateComplaintStatus,
} from "@/lib/hooks/useComplaints";
import { useAuthStore } from "@/lib/stores/authStore";
import { ComplaintStatus, UserRole } from "@/lib/api/types";

export default function ComplaintDetailPage() {
  const params = useParams();
  const { user } = useAuthStore();
  const id = params.id as string;

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | "">("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch complaint
  const { data: complaint, isLoading } = useComplaint(id);

  // Mutation
  const updateStatus = useUpdateComplaintStatus();

  // Get status badge variant
  const getStatusBadge = (status: ComplaintStatus) => {
    const variants: Record<
      ComplaintStatus,
      {
        className: string;
        label: string;
        icon: React.ElementType;
      }
    > = {
      OPEN: { 
        className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900", 
        label: "Open",
        icon: Loader2
      },
      IN_PROGRESS: { 
        className: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-900", 
        label: "In Progress",
        icon: Wrench 
      },
      RESOLVED: { 
        className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900", 
        label: "Resolved",
        icon: CheckCircle2
      },
      CLOSED: { 
        className: "bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-900/20 dark:text-zinc-300 dark:border-zinc-800", 
        label: "Closed",
        icon: XCircle
      },
    };
    return variants[status];
  };

  // Validate status transition (OPEN → IN_PROGRESS → RESOLVED)
  const isValidStatusTransition = (
    currentStatus: ComplaintStatus,
    newStatus: ComplaintStatus
  ): boolean => {
    const validTransitions: Record<ComplaintStatus, ComplaintStatus[]> = {
      [ComplaintStatus.OPEN]: [ComplaintStatus.IN_PROGRESS],
      [ComplaintStatus.IN_PROGRESS]: [ComplaintStatus.RESOLVED],
      [ComplaintStatus.RESOLVED]: [],
      [ComplaintStatus.CLOSED]: [],
    };
    return validTransitions[currentStatus]?.includes(newStatus) || false;
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!complaint || !selectedStatus) return;

    // Validate transition
    if (!isValidStatusTransition(complaint.status, selectedStatus)) {
      toast.error("Invalid status transition");
      return;
    }

    try {
      setIsUpdating(true);
      await updateStatus.mutateAsync({
        id: complaint.id,
        data: {
          status: selectedStatus,
          resolutionNotes: resolutionNotes || undefined,
        },
      });
      toast.success("Status updated successfully");
      setStatusDialogOpen(false);
      setSelectedStatus("");
      setResolutionNotes("");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsUpdating(false);
    }
  };

  // Check if user can update (staff only)
  const canUpdate =
    user?.role === UserRole.PENJAGA || user?.role === UserRole.OWNER;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-5xl space-y-8">
        <Skeleton className="h-8 w-32 rounded-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-16 w-3/4 rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-3xl" />
           </div>
           <div className="space-y-6">
              <Skeleton className="h-48 w-full rounded-3xl" />
           </div>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="container mx-auto py-20 px-4 text-center max-w-lg">
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-12 border border-dashed border-zinc-200 dark:border-zinc-800">
           <div className="h-20 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
             <Wrench className="h-10 w-10 text-zinc-300" />
           </div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 mb-2">Complaint Not Found</h2>
            <p className="text-zinc-500 mb-8">The complaint you are looking for does not exist or has been removed.</p>
            <Link href="/complaints">
              <Button size="lg" className="rounded-xl w-full">Return to Complaints</Button>
            </Link>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(complaint.status);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Breadcrumb / Back */}
      <div className="mb-8">
        <Link 
          href="/complaints" 
          className="inline-flex items-center text-sm font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Complaints
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Title Header */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusBadge.className}`}>
                {statusBadge.label}
              </span>
              <span className="text-sm font-mono text-zinc-400">#{complaint.id.slice(0, 8)}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
              {complaint.title}
            </h1>
          </div>

          {/* Description Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm">
             <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description
             </h3>
             <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap font-medium">
                {complaint.description}
             </p>
          </div>

           {/* Resolution Notes (If any) */}
           {complaint.resolutionNotes && (
             <div className="bg-green-50/50 dark:bg-green-900/10 rounded-[2rem] p-8 border border-green-100 dark:border-green-900/20">
                <h3 className="text-xs font-black uppercase tracking-widest text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
                   <CheckCircle2 className="h-4 w-4" />
                   Resolution Notes
                </h3>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap font-medium">
                   {complaint.resolutionNotes}
                </p>
             </div>
           )}

          {/* Photos */}
          {complaint.photos && complaint.photos.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 ml-2">Attached Photos</h3>
              <div className="grid grid-cols-2 gap-4">
                {complaint.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 group"
                  >
                    <Image
                      src={photo}
                      alt={`Evidence ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-8 border border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 text-sm font-bold">
               No photos attached
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-8">
           {/* Meta Card */}
           <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-black/20">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">Details</h3>
              
              <div className="space-y-6">
                 <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                       <Clock className="h-5 w-5 text-zinc-400" />
                    </div>
                    <div>
                       <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mb-1">Submitted</p>
                       <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {format(new Date(complaint.createdAt), "dd MMM yyyy")}
                       </p>
                       <p className="text-xs text-zinc-400">
                          {format(new Date(complaint.createdAt), "HH:mm")}
                       </p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                       <User className="h-5 w-5 text-zinc-400" />
                    </div>
                    <div>
                       <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mb-1">Tenant ID</p>
                       <p className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[150px]">
                          {complaint.tenantId}
                       </p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${statusBadge.className.replace('text-', 'bg-').split(' ')[0]} bg-opacity-20`}>
                       <StatusIcon className={`h-5 w-5 ${statusBadge.className.split(' ')[1]}`} />
                    </div>
                    <div className="flex-1">
                       <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mb-1">Current Status</p>
                       <p className={`text-sm font-black ${statusBadge.className.split(' ')[1]}`}>
                          {statusBadge.label}
                       </p>
                    </div>
                 </div>
              </div>

              {/* Action Button */}
              {canUpdate && complaint.status !== "RESOLVED" && (
                <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <Button 
                    className="w-full h-12 rounded-2xl font-black text-xs uppercase tracking-widest"
                    onClick={() => {
                      setSelectedStatus(complaint.status);
                      setStatusDialogOpen(true);
                    }}
                  >
                    Update Status
                  </Button>
                </div>
              )}
           </div>

           {/* Timeline Preview (Simplified) */}
           <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800">
               <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">Timeline Progress</h3>
               <div className="relative pl-2 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
                  {[
                    { status: "OPEN", label: "Reported" },
                    { status: "IN_PROGRESS", label: "In Review/Work" },
                    { status: "RESOLVED", label: "Resolved" },
                  ].map((step, i) => {
                     const isCompleted = ["OPEN", "IN_PROGRESS", "RESOLVED"].indexOf(complaint.status) >= i;
                     const isCurrent = complaint.status === step.status;

                     return (
                        <div key={step.status} className="relative pl-8">
                           <div className={`absolute left-0 top-1 h-6 w-6 rounded-full border-4 flex items-center justify-center transition-colors bg-white dark:bg-zinc-950 ${
                              isCompleted ? 'border-green-500' : 'border-zinc-200 dark:border-zinc-800'
                           }`}>
                              {isCompleted && <div className="h-2 w-2 rounded-full bg-green-500" />}
                           </div>
                           <p className={`text-xs font-black uppercase tracking-wide transition-colors ${isCompleted ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}`}>
                              {step.label}
                           </p>
                           {isCurrent && (
                              <p className="text-[10px] font-bold text-green-600 dark:text-green-500 mt-1">Current Stage</p>
                           )}
                        </div>
                     )
                  })}
               </div>
           </div>
        </div>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
             <DialogTitle className="text-xl font-black tracking-tight">Update Status</DialogTitle>
             <DialogDescription className="text-zinc-500 font-medium">
               Change the complaint status to keep the tenant informed.
             </DialogDescription>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-zinc-500">New Status</Label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
                className="w-full h-12 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 text-sm font-bold text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none transition-all appearance-none"
              >
                <option value="">Select Action</option>
                {complaint.status === "OPEN" && <option value="IN_PROGRESS">Start Working (In Progress)</option>}
                {complaint.status === "IN_PROGRESS" && <option value="RESOLVED">Mark as Resolved</option>}
              </select>
            </div>
            
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-zinc-500">Resolution Notes</Label>
              <Textarea
                placeholder="Describe what was done to fix the issue..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={4}
                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl resize-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>
          </div>

          <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setStatusDialogOpen(false);
                setResolutionNotes("");
              }}
              className="rounded-xl font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={isUpdating || !selectedStatus}
              className="rounded-xl font-bold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
