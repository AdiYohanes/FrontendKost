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
import { Badge } from "@/components/ui/badge";
import { Plus, Droplets, Zap, Filter } from "lucide-react";
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
                <label className="text-sm font-medium">Resident</label>
                <select
                  value={selectedResidentId}
                  onChange={(e) => setSelectedResidentId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={residentsLoading}
                >
                  <option value="">Select a resident</option>
                  {residentsLoading ? (
                    <option disabled>Loading residents...</option>
                  ) : residents && residents.length > 0 ? (
                    residents.map((resident) => (
                      <option key={resident.id} value={resident.id}>
                        {resident.user.name || resident.user.username} - Room{" "}
                        {resident.room.roomNumber}
                      </option>
                    ))
                  ) : (
                    <option disabled>No active residents</option>
                  )}
                </select>
              </div>
            )}

            {/* Utility Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Utility Type</label>
              <select
                value={utilityTypeFilter}
                onChange={(e) =>
                  setUtilityTypeFilter(e.target.value as UtilityType | "ALL")
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="ALL">🔍 All Types</option>
                <option value={UtilityType.WATER}>💧 Water</option>
                <option value={UtilityType.ELECTRICITY}>⚡ Electricity</option>
              </select>
            </div>

            {/* Billing Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Billing Status</label>
              <select
                value={billedFilter}
                onChange={(e) =>
                  setBilledFilter(
                    e.target.value as "ALL" | "BILLED" | "UNBILLED"
                  )
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="ALL">📋 All Status</option>
                <option value="BILLED">✅ Billed</option>
                <option value="UNBILLED">⏳ Unbilled</option>
              </select>
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
