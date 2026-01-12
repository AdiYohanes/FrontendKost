"use client";

import { useState, useMemo, useEffect } from "react";
import { useResidents } from "@/lib/hooks/useResidents";
import { ITEMS_PER_PAGE } from "@/lib/constants/pagination";
import { usePrefetch } from "@/lib/hooks/usePrefetch";
import { residentsApi } from "@/lib/api/services/residents";
import { queryKeys } from "@/lib/query/queryKeys";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StatCardSkeleton,
  GridCardSkeleton,
  ListCardSkeleton,
} from "@/components/ui/card-skeleton";
import { Pagination } from "@/components/ui/pagination";
import {
  Plus,
  Search,
  Eye,
  Users,
  UserCheck,
  UserX,
  LayoutGrid,
  List,
  Home,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ResidentDetailDialog } from "@/components/residents/ResidentDetailDialog";
import { OnboardResidentDialog } from "@/components/residents/OnboardResidentDialog";

export default function ResidentsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedResidentId, setSelectedResidentId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isOnboardOpen, setIsOnboardOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [placeholderText, setPlaceholderText] = useState(
    "Search by name, username, or room number..."
  );
  const { createPrefetchHandlers } = usePrefetch();

  // Handle responsive placeholder
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setPlaceholderText("Search residents...");
      } else {
        setPlaceholderText("Search by name, username, or room number...");
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch residents based on status filter
  const isActiveParam =
    statusFilter === "all"
      ? undefined
      : statusFilter === "active"
        ? true
        : false;

  const {
    data: residents,
    isLoading,
    error,
  } = useResidents({
    isActive: isActiveParam,
  });

  // Calculate statistics
  const stats = useMemo(() => {
    if (!residents) return { total: 0, active: 0, inactive: 0 };

    return {
      total: residents.length,
      active: residents.filter((r) => r.isActive).length,
      inactive: residents.filter((r) => !r.isActive).length,
    };
  }, [residents]);

  // Filter and search residents
  const filteredResidents = useMemo(() => {
    if (!residents) return [];

    return residents.filter((resident) => {
      const matchesSearch =
        resident.user?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        resident.user?.username
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        resident.room?.roomNumber
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [residents, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredResidents.length / ITEMS_PER_PAGE);
  const paginatedResidents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResidents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredResidents, currentPage]);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleViewDetails = (id: string) => {
    setSelectedResidentId(id);
    setIsDetailOpen(true);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="p-6 bg-white dark:bg-zinc-950 border border-red-100 dark:border-red-900/30 rounded-xl">
          <p className="text-red-600 font-medium">
            Error loading residents: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <ResidentDetailDialog 
        residentId={selectedResidentId}
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      <OnboardResidentDialog 
        isOpen={isOnboardOpen}
        onOpenChange={setIsOnboardOpen}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Resident Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all boarding house residents
          </p>
        </div>
        <Button 
          size="lg" 
          className="w-full md:w-auto bg-[#1baa56] hover:bg-[#168a46] text-white font-bold rounded-xl shadow-lg shadow-[#1baa56]/10"
          onClick={() => setIsOnboardOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Onboard Resident
        </Button>
      </div>

      {/* Statistics Cards */}
      {(isLoading || !isMounted) ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCardSkeleton count={3} />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Residents</p>
              <Users className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.total}</h3>
              <span className="text-[10px] text-zinc-400 font-medium whitespace-nowrap">People total</span>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Active</p>
              <UserCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">{stats.active}</h3>
              <span className="text-[10px] text-emerald-600/60 font-medium whitespace-nowrap">Current stay</span>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Inactive</p>
              <UserX className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-zinc-500 dark:text-zinc-400">{stats.inactive}</h3>
              <span className="text-[10px] text-zinc-400 font-medium whitespace-nowrap">Moved out</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters and View Toggle */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder={placeholderText}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-10 w-full bg-white border-zinc-200 shadow-sm transition-all focus:ring-2 focus:ring-[#1baa56]/20 focus:border-[#1baa56] placeholder:text-zinc-400 rounded-xl"
          />
        </div>
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-full md:w-[200px] h-10 bg-white border-zinc-200 shadow-sm transition-all focus:ring-2 focus:ring-[#1baa56]/20 focus:border-[#1baa56] rounded-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-white border-zinc-100 shadow-xl rounded-xl p-1">
            <SelectItem value="all" className="focus:bg-zinc-50 cursor-pointer rounded-lg py-2.5">
              All Residents
            </SelectItem>
            <SelectItem value="active" className="text-green-600 focus:bg-green-50 cursor-pointer rounded-lg py-2.5">
              Active
            </SelectItem>
            <SelectItem value="inactive" className="text-gray-600 focus:bg-gray-50 cursor-pointer rounded-lg py-2.5">
              Inactive
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={cn(
              "h-10 w-10 transition-all duration-300 rounded-xl",
              viewMode === "grid" 
                ? "border-[#1baa56] bg-[#1baa56]/10 text-[#1baa56]" 
                : "border-zinc-200 text-zinc-400"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("list")}
            className={cn(
              "h-10 w-10 transition-all duration-300 rounded-xl",
              viewMode === "list" 
                ? "border-[#1baa56] bg-[#1baa56]/10 text-[#1baa56]" 
                : "border-zinc-200 text-zinc-400"
            )}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Residents Display */}
      {(isLoading || !isMounted) ? (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <GridCardSkeleton count={6} />
            </div>
          ) : (
            <ListCardSkeleton count={5} />
          )}
        </>
      ) : paginatedResidents.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <Users className="h-16 w-16 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">No residents found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Get started by onboarding your first resident"}
              </p>
            </div>
            {(searchQuery || statusFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedResidents.map((resident) => (
            <div
              key={resident.id}
              className="group relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-xl hover:border-[#1baa56]/30 transition-all duration-300"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-[#1baa56]/10 flex items-center justify-center text-[#1baa56]">
                      <Users className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{resident.user?.name || "N/A"}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "capitalize px-2 py-0 h-5 text-[10px] font-semibold border-none rounded-full",
                      resident.isActive 
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    )}
                  >
                    {resident.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">Room</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">#{resident.room?.roomNumber || "N/A"}</p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">Entry Date</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {resident.entryDate ? format(new Date(resident.entryDate), "dd MMM yy") : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-zinc-50 dark:border-zinc-900">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 text-xs h-9 text-zinc-600 dark:text-zinc-400 hover:bg-[#1baa56]/10 hover:text-[#1baa56] font-bold rounded-xl transition-all"
                    onClick={() => handleViewDetails(resident.id)}
                  >
                    <Eye className="mr-1.5 h-4 w-4" />
                    Resident Profile
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
          <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {paginatedResidents.map((resident) => (
              <div
                key={resident.id}
                className="group p-3 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:bg-[#1baa56]/10 group-hover:text-[#1baa56] transition-colors">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {resident.user?.name || "N/A"}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "px-2 py-0 h-4 text-[9px] font-bold border-none rounded-full",
                          resident.isActive 
                            ? "bg-emerald-100 text-emerald-700" 
                            : "bg-zinc-100 text-zinc-600"
                        )}
                      >
                        {resident.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-[11px] text-zinc-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Home className="h-3 w-3" />
                        Room {resident.room?.roomNumber || "N/A"}
                      </span>
                      <span className="text-zinc-300 dark:text-zinc-700">•</span>
                      <span>Entry: {resident.entryDate ? format(new Date(resident.entryDate), "dd MMM yyyy") : "N/A"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-9 px-3 text-[11px] font-bold uppercase tracking-wider text-[#1baa56] hover:bg-[#1baa56]/10 rounded-xl"
                    onClick={() => handleViewDetails(resident.id)}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredResidents.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        itemLabel="residents"
      />
    </div>
  );
}
