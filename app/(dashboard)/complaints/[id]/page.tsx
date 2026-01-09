"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Loader2, Edit, Image as ImageIcon } from "lucide-react";
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
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | "">(
    ""
  );
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
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      OPEN: { variant: "destructive", label: "Open" },
      IN_PROGRESS: { variant: "secondary", label: "In Progress" },
      RESOLVED: { variant: "default", label: "Resolved" },
      CLOSED: { variant: "outline", label: "Closed" },
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
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Complaint not found</p>
            <Link href="/complaints">
              <Button className="mt-4">Back to Complaints</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusBadge = getStatusBadge(complaint.status);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/complaints">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Complaint Details</h1>
          <p className="text-muted-foreground">View and manage complaint</p>
        </div>
      </div>

      {/* Complaint Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Complaint Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Title</p>
              <p className="font-medium">{complaint.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-sm whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tenant ID</p>
              <p className="font-mono text-sm">{complaint.tenantId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Submitted Date</p>
              <p className="font-medium">
                {format(new Date(complaint.createdAt), "dd MMMM yyyy HH:mm")}
              </p>
            </div>
            {complaint.resolutionNotes && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Resolution Notes
                </p>
                <p className="text-sm whitespace-pre-wrap">
                  {complaint.resolutionNotes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status and Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Status & Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Current Status</p>
                {canUpdate && complaint.status !== "RESOLVED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedStatus(complaint.status);
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

            {/* Status Timeline */}
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Status History
              </p>
              <div className="space-y-3">
                {[
                  { status: "OPEN", label: "Open" },
                  { status: "IN_PROGRESS", label: "In Progress" },
                  { status: "RESOLVED", label: "Resolved" },
                ].map((step) => {
                  const isActive = complaint.status === step.status;
                  const isPassed =
                    ["OPEN", "IN_PROGRESS", "RESOLVED"].indexOf(
                      complaint.status
                    ) >
                    ["OPEN", "IN_PROGRESS", "RESOLVED"].indexOf(step.status);

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

      {/* Photos */}
      {complaint.photos && complaint.photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Photos
            </CardTitle>
            <CardDescription>
              {complaint.photos.length} photo(s) attached
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {complaint.photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border bg-muted"
                >
                  <Image
                    src={photo}
                    alt={`Complaint photo ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>
              Change the complaint status. Only valid transitions are allowed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Status</Label>
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as ComplaintStatus)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select new status</option>
                {complaint.status === "OPEN" && (
                  <option value="IN_PROGRESS">In Progress</option>
                )}
                {complaint.status === "IN_PROGRESS" && (
                  <option value="RESOLVED">Resolved</option>
                )}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Resolution Notes (Optional)</Label>
              <Textarea
                placeholder="Add notes about the resolution..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setStatusDialogOpen(false);
                setResolutionNotes("");
              }}
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
    </div>
  );
}
