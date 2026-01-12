"use client";

import { useRoom, useDeleteRoom } from "@/lib/hooks/useRooms";
import { RoomStatus } from "@/lib/api/types";
import {
  getRoomStatusColor,
  formatCurrency,
  formatFacilityKey,
} from "@/lib/utils/roomUtils";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  Home,
  DollarSign,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  Edit,
  Trash2,
  Info,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface RoomDetailDialogProps {
  roomId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoomDetailDialog({
  roomId,
  open,
  onOpenChange,
}: RoomDetailDialogProps) {
  const { data: room, isLoading, error } = useRoom(roomId || "");
  const deleteRoom = useDeleteRoom();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    if (!roomId) return;
    try {
      await deleteRoom.mutateAsync(roomId);
      toast.success("Room deleted successfully");
      setShowDeleteDialog(false);
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setShowDeleteDialog(false);
    }
  };

  if (!roomId && open) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-hidden flex flex-col gap-0 p-0 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-2xl">
          <DialogHeader className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#1baa56]/10 flex items-center justify-center text-[#1baa56]">
                  <Home className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {isLoading ? "Loading..." : `Room ${room?.roomNumber}`}
                  </DialogTitle>
                  <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-xs">
                    Detailed room information and status
                  </DialogDescription>
                </div>
              </div>
              {!isLoading && room && (
                <Badge
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    getRoomStatusColor(room.status)
                  )}
                >
                  {room.status}
                </Badge>
              )}
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-12 flex flex-col items-center justify-center space-y-4">
                <div className="h-8 w-8 border-4 border-[#1baa56]/20 border-t-[#1baa56] rounded-full animate-spin" />
                <p className="text-sm text-zinc-500 animate-pulse font-medium">
                  Fetching room details...
                </p>
              </div>
            ) : error || !room ? (
              <div className="p-12 text-center space-y-4">
                <XCircle className="h-12 w-12 text-red-500 mx-auto opacity-50" />
                <p className="text-sm text-zinc-500">
                  {error?.message || "Failed to load room details."}
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Visual Stats Overview */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                      Monthly Rate
                    </p>
                    <p className="text-xl font-black text-[#1baa56]">
                      {formatCurrency(room.rentalPrice)}
                    </p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                      Facilities
                    </p>
                    <p className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                      {Object.keys(room.facilities).length} Items
                    </p>
                  </div>
                </div>

                {/* Facilities List */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1baa56]" />
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      Room Amenities
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(room.facilities).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800"
                      >
                        <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 capitalize">
                          {formatFacilityKey(key)}
                        </span>
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Occupancy Info if occupied */}
                {room.status === RoomStatus.OCCUPIED && (
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-blue-900 dark:text-blue-300">
                          Current Resident
                        </p>
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                          Active rental period
                        </p>
                      </div>
                      <Link href="/residents">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-[10px] border-blue-200 hover:bg-blue-100 dark:border-blue-800"
                        >
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Details / Meta */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-zinc-400" />
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      Record History
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-[10px]">
                    <div>
                      <p className="text-zinc-400 font-bold uppercase mb-0.5">
                        Date Created
                      </p>
                      <p className="text-zinc-600 dark:text-zinc-400 font-medium italic">
                        {new Date(room.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-400 font-bold uppercase mb-0.5">
                        Last Modified
                      </p>
                      <p className="text-zinc-600 dark:text-zinc-400 font-medium italic">
                        {new Date(room.updatedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex justify-between gap-3">
            <Button
              variant="destructive"
              size="sm"
              className="h-9 px-4 text-xs font-bold shadow-lg shadow-red-500/10"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isLoading || room?.status === RoomStatus.OCCUPIED}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete Room
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                className="h-9 text-xs font-semibold border-zinc-200"
              >
                Close
              </Button>
              <Link href={`/rooms/${roomId}/edit`}>
                <Button className="h-9 px-6 text-xs font-bold bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/20">
                  <Edit className="mr-1.5 h-3.5 w-3.5" />
                  Edit Room
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {!isLoading && room && (
        <ConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title={`Delete Room ${room.roomNumber}?`}
          description="This action cannot be undone. All data associated with this room will be permanently removed."
          confirmText="Confirm Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          variant="destructive"
          loading={deleteRoom.isPending}
        />
      )}
    </>
  );
}
