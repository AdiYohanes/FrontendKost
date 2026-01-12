"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Calendar, 
  CreditCard, 
  UserX,
} from "lucide-react";
import { useResident } from "@/lib/hooks/useResidents";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ResidentDetailDialogProps {
  residentId: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResidentDetailDialog({
  residentId,
  isOpen,
  onOpenChange,
}: ResidentDetailDialogProps) {
  const { data: resident, isLoading, error } = useResident(residentId || "");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden bg-white dark:bg-zinc-950 border-none shadow-2xl rounded-3xl">
        <DialogTitle className="sr-only">Resident Details</DialogTitle>
        <DialogDescription className="sr-only">
          Viewing detailed information for the selected resident.
        </DialogDescription>
        {isLoading ? (
          <div className="h-[300px] flex flex-col items-center justify-center gap-3">
            <LoadingSpinner size="lg" />
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Loading Profile</p>
          </div>
        ) : error || !resident ? (
          <div className="h-[250px] flex flex-col items-center justify-center p-8 text-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-red-50 dark:bg-red-900/10 flex items-center justify-center text-red-500">
              <UserX className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Not Found</h3>
              <p className="text-sm text-zinc-500">Resident data is unavailable.</p>
            </div>
            <Button onClick={() => onOpenChange(false)} variant="secondary" className="rounded-xl px-8 h-10 font-bold">Close</Button>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Header Section */}
            <div className="p-8 pb-0">
              <div className="flex items-start justify-between mb-6">
                <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-zinc-100 font-black text-2xl shadow-inner uppercase">
                  {resident.user?.name?.charAt(0) || "R"}
                </div>
                <Badge className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border-none shadow-sm",
                  resident.isActive 
                    ? "bg-emerald-500 text-white shadow-emerald-500/20 shadow-lg" 
                    : "bg-zinc-400 text-white"
                )}>
                  {resident.isActive ? "Active Resident" : "Inactive"}
                </Badge>
              </div>

              <div className="space-y-1">
                <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
                  {resident.user?.name}
                </h2>
                <p className="text-sm font-bold text-[#1baa56]">
                  @{resident.user?.username || "resident_id"}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="p-8 pt-8 space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Home className="h-3 w-3" /> Assigned Room
                  </span>
                  <p className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                    Room {resident.room?.roomNumber || "N/A"}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <CreditCard className="h-3 w-3" /> Billing Cycle
                  </span>
                  <p className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                    Day {resident.billingCycleDate}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-100 dark:border-zinc-800">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase">Joined Date</p>
                      <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                        {resident.entryDate ? format(new Date(resident.entryDate), "dd MMMM yyyy") : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {resident.exitDate && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 border border-zinc-100 dark:border-zinc-800">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase">Left Date</p>
                        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                          {format(new Date(resident.exitDate), "dd MMMM yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-4">
                <Button 
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white h-12 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-zinc-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => onOpenChange(false)}
                >
                  Close Profile
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
