"use client";

import { useState, useMemo } from "react";
import { useResidents } from "@/lib/hooks/useResidents";
import { useUtilitiesByResident } from "@/lib/hooks/useUtilities";
import { useAuthStore } from "@/lib/stores/authStore";
import { UtilityType, UserRole } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
// Removed Card components for a cleaner borderless look
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Droplets, Zap, Filter, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function UtilitiesPage() {
  const { user } = useAuthStore();
  const [selectedResidentId, setSelectedResidentId] = useState<string>("");
  const [utilityTypeFilter, setUtilityTypeFilter] = useState<
    UtilityType | "ALL"
  >("ALL");
  const [billedFilter, setBilledFilter] = useState<
    "ALL" | "BILLED" | "UNBILLED"
  >("ALL");

  // Fetch residents based on role
  const { data: residents, isLoading: residentsLoading } = useResidents({
    isActive: true,
  });

  // For PENGHUNI role, automatically select their own resident record
  const currentUserResidentId = useMemo(() => {
    if (user?.role === UserRole.PENGHUNI && residents) {
      const userResident = residents.find((r) => r.userId === user.id);
      return userResident?.id || "";
    }
    return "";
  }, [user, residents]);

  // Set the resident ID based on role
  const effectiveResidentId =
    user?.role === UserRole.PENGHUNI
      ? currentUserResidentId
      : selectedResidentId;

  // Fetch utilities for selected resident
  const {
    data: utilities,
    isLoading: utilitiesLoading,
    error: utilitiesError,
  } = useUtilitiesByResident(
    effectiveResidentId,
    {
      type: utilityTypeFilter !== "ALL" ? utilityTypeFilter : undefined,
      status: billedFilter === "BILLED" ? "billed" : billedFilter === "UNBILLED" ? "unbilled" : undefined,
    }
  );

  // Sort utilities by reading date (most recent first)
  const sortedUtilities = useMemo(() => {
    if (!utilities) return [];
    return [...utilities].sort(
      (a, b) =>
        new Date(b.readingDate).getTime() - new Date(a.readingDate).getTime()
    );
  }, [utilities]);

  const canRecordUtility = user?.role === UserRole.PENJAGA;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Utility Management</h1>
          <p className="text-muted-foreground">
            View and manage utility meter readings
          </p>
        </div>
        {canRecordUtility && (
          <Link href="/utilities/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Record Utility
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-transparent space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-[#1baa56]" />
          <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">Filters</h2>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Resident Selection (only for OWNER and PENJAGA) */}
            {user?.role !== UserRole.PENGHUNI && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">
                  Resident Account
                </label>
                <Select value={selectedResidentId} onValueChange={setSelectedResidentId} disabled={residentsLoading}>
                  <SelectTrigger className="h-12 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-5 focus:ring-4 focus:ring-[#1baa56]/10 focus:border-[#1baa56] transition-all font-bold text-zinc-900 dark:text-zinc-100 shadow-sm">
                    <SelectValue placeholder={residentsLoading ? "Scanning..." : "Select Resident"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800 shadow-2xl p-1 bg-white dark:bg-zinc-950 max-h-[300px]">
                    {residents && residents.length > 0 ? (
                      residents.map((resident) => (
                        <SelectItem key={resident.id} value={resident.id} className="rounded-xl py-3 pl-10 pr-4 focus:bg-[#1baa56] focus:text-white transition-all cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <span className="font-black text-sm">{resident.user.name || resident.user.username}</span>
                            <span className="text-[10px] opacity-40 font-bold group-focus:opacity-100">Room {resident.room.roomNumber}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                       <div className="p-8 text-center text-xs font-black text-zinc-400 uppercase tracking-widest">No active residents</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Utility Type Filter */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Utility Category</label>
              <Select value={utilityTypeFilter} onValueChange={(val) => setUtilityTypeFilter(val as UtilityType | "ALL")}>
                <SelectTrigger className="h-14 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-6 focus:ring-4 focus:ring-[#1baa56]/10 focus:border-[#1baa56] transition-all font-bold text-zinc-900 dark:text-zinc-100 shadow-sm leading-none">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-2xl p-2 bg-white dark:bg-zinc-950">
                  <SelectItem value="ALL" className="rounded-2xl py-4 pl-10 focus:bg-[#1baa56] focus:text-white transition-all cursor-pointer group">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 opacity-50 group-focus:opacity-100" />
                        <span className="font-black text-sm">All Types</span>
                      </div>
                  </SelectItem>
                  <SelectItem value={UtilityType.WATER} className="rounded-2xl py-4 pl-10 focus:bg-[#1baa56] focus:text-white transition-all cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-500 group-focus:text-white transition-colors" />
                      <span className="font-black text-sm">Water</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={UtilityType.ELECTRICITY} className="rounded-2xl py-4 pl-10 focus:bg-[#1baa56] focus:text-white transition-all cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500 group-focus:text-white transition-colors" />
                      <span className="font-black text-sm">Electricity</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Billing Status Filter */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Payment Status</label>
              <Select value={billedFilter} onValueChange={(val) => setBilledFilter(val as "ALL" | "BILLED" | "UNBILLED")}>
                 <SelectTrigger className="h-14 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-6 focus:ring-4 focus:ring-[#1baa56]/10 focus:border-[#1baa56] transition-all font-bold text-zinc-900 dark:text-zinc-100 shadow-sm leading-none">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-2xl p-2 bg-white dark:bg-zinc-950">
                  <SelectItem value="ALL" className="rounded-2xl py-4 pl-10 focus:bg-[#1baa56] focus:text-white transition-all cursor-pointer group">
                     <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 opacity-50 group-focus:opacity-100" />
                        <span className="font-black text-sm">All Status</span>
                     </div>
                  </SelectItem>
                  <SelectItem value="BILLED" className="rounded-2xl py-4 pl-10 focus:bg-[#1baa56] focus:text-white transition-all cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 group-focus:text-white transition-colors" />
                      <span className="font-black text-sm">Billed</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="UNBILLED" className="rounded-2xl py-4 pl-10 focus:bg-[#1baa56] focus:text-white transition-all cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500 group-focus:text-white transition-colors" />
                      <span className="font-black text-sm">Unbilled</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Utility Records Table */}
      <div className="bg-transparent">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">Utility Records</h2>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
          {!effectiveResidentId ? (
            <div className="text-center py-12 text-muted-foreground">
              {user?.role === UserRole.PENGHUNI
                ? "No resident record found for your account"
                : "Please select a resident to view utility records"}
            </div>
          ) : utilitiesLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : utilitiesError ? (
            <div className="text-center py-12 text-destructive">
              Error loading utility records
            </div>
          ) : sortedUtilities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No utility records found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Date</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Category</TableHead>
                    <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-zinc-400">Reading</TableHead>
                    <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-zinc-400">Usage</TableHead>
                    <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-zinc-400">Cost</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedUtilities.map((utility) => (
                    <TableRow key={utility.id} className="border-zinc-50 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="font-black text-sm text-zinc-900 dark:text-zinc-100">
                            {format(new Date(utility.readingDate), "dd MMM")}
                          </span>
                          <span className="text-[10px] font-bold text-zinc-400">
                            {format(new Date(utility.readingDate), "yyyy")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-8 w-8 rounded-xl flex items-center justify-center",
                            utility.utilityType === UtilityType.WATER ? "bg-blue-50 text-blue-500" : "bg-yellow-50 text-yellow-500"
                          )}>
                            {utility.utilityType === UtilityType.WATER ? (
                              <Droplets className="h-4 w-4" />
                            ) : (
                              <Zap className="h-4 w-4" />
                            )}
                          </div>
                          <span className="font-bold text-sm">
                            {utility.utilityType === UtilityType.WATER ? "Water" : "Electricity"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-black text-sm text-[#1baa56]">{utility.currentMeter.toFixed(1)}</span>
                          <span className="text-[9px] font-bold text-zinc-400 uppercase">from {utility.previousMeter.toFixed(1)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-black text-sm">{utility.usage.toFixed(1)}</span>
                          <span className="text-[9px] font-black text-zinc-400 uppercase">Units</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                         <div className="flex flex-col items-end">
                          <span className="font-black text-sm text-zinc-900 dark:text-zinc-100">
                            Rp {utility.totalCost.toLocaleString("id-ID")}
                          </span>
                          <span className="text-[9px] font-bold text-zinc-400 uppercase">
                            Rp {utility.ratePerUnit.toLocaleString("id-ID")}/unit
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-tighter border-none",
                            utility.isBilled 
                              ? "bg-[#1baa56]/10 text-[#1baa56] hover:bg-[#1baa56]/20" 
                              : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                          )}
                        >
                          {utility.isBilled ? "Billed" : "Unbilled"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
