"use client";

import { useState, useMemo } from "react";
import { useResidents } from "@/lib/hooks/useResidents";
import { useUtilitiesByResident } from "@/lib/hooks/useUtilities";
import { useAuthStore } from "@/lib/stores/authStore";
import { UtilityType, UserRole } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Removed complex Select component - using native select instead
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    utilityTypeFilter !== "ALL"
      ? {
          utilityType: utilityTypeFilter,
          isBilled:
            billedFilter === "BILLED"
              ? true
              : billedFilter === "UNBILLED"
                ? false
                : undefined,
        }
      : {
          isBilled:
            billedFilter === "BILLED"
              ? true
              : billedFilter === "UNBILLED"
                ? false
                : undefined,
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Resident Selection (only for OWNER and PENJAGA) */}
            {user?.role !== UserRole.PENGHUNI && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Resident</label>
                <Select value={selectedResidentId} onValueChange={setSelectedResidentId} disabled={residentsLoading}>
                  <SelectTrigger className="w-full h-10 bg-white border-zinc-200 shadow-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <SelectValue placeholder={residentsLoading ? "Loading residents..." : "Select a resident"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-zinc-100 shadow-xl rounded-xl p-1 max-h-[200px]">
                    <SelectItem value="ALL_RESIDENTS" className="text-zinc-500 focus:text-zinc-700 focus:bg-zinc-50 cursor-pointer rounded-lg py-2.5">
                      Select a resident
                    </SelectItem>
                    {residents && residents.length > 0 ? (
                      residents.map((resident) => (
                        <SelectItem key={resident.id} value={resident.id} className="focus:bg-zinc-50 cursor-pointer rounded-lg py-2.5">
                          {resident.user.name || resident.user.username} - Room {resident.room.roomNumber}
                        </SelectItem>
                      ))
                    ) : (
                       <SelectItem value="NO_RESIDENTS" disabled className="text-zinc-400">No active residents</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Utility Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Utility Type</label>
              <Select value={utilityTypeFilter} onValueChange={(val) => setUtilityTypeFilter(val as UtilityType | "ALL")}>
                <SelectTrigger className="w-full h-10 bg-white border-zinc-200 shadow-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="bg-white border-zinc-100 shadow-xl rounded-xl p-1">
                  <SelectItem value="ALL" className="focus:bg-zinc-50 cursor-pointer rounded-lg py-2.5">
                     <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-zinc-500" />
                        <span>All Types</span>
                     </div>
                  </SelectItem>
                  <SelectItem value={UtilityType.WATER} className="focus:bg-blue-50 cursor-pointer rounded-lg py-2.5">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span>Water</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={UtilityType.ELECTRICITY} className="focus:bg-yellow-50 cursor-pointer rounded-lg py-2.5">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span>Electricity</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Billing Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Billing Status</label>
              <Select value={billedFilter} onValueChange={(val) => setBilledFilter(val as "ALL" | "BILLED" | "UNBILLED")}>
                 <SelectTrigger className="w-full h-10 bg-white border-zinc-200 shadow-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-zinc-100 shadow-xl rounded-xl p-1">
                  <SelectItem value="ALL" className="focus:bg-zinc-50 cursor-pointer rounded-lg py-2.5">
                     <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-zinc-500" />
                        <span>All Status</span>
                     </div>
                  </SelectItem>
                  <SelectItem value="BILLED" className="focus:bg-green-50 cursor-pointer rounded-lg py-2.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Billed</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="UNBILLED" className="focus:bg-orange-50 cursor-pointer rounded-lg py-2.5">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>Unbilled</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Utility Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Utility Records</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Previous</TableHead>
                    <TableHead className="text-right">Current</TableHead>
                    <TableHead className="text-right">Usage</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Total Cost</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedUtilities.map((utility) => (
                    <TableRow key={utility.id}>
                      <TableCell>
                        {format(new Date(utility.readingDate), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {utility.utilityType === UtilityType.WATER ? (
                            <Droplets className="h-4 w-4 text-blue-500" />
                          ) : (
                            <Zap className="h-4 w-4 text-yellow-500" />
                          )}
                          <span>
                            {utility.utilityType === UtilityType.WATER
                              ? "Water"
                              : "Electricity"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {utility.previousMeter.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {utility.currentMeter.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {utility.usage.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        Rp {utility.ratePerUnit.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        Rp {utility.totalCost.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={utility.isBilled ? "default" : "secondary"}
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
        </CardContent>
      </Card>
    </div>
  );
}
