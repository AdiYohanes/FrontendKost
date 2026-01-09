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

export default function ResidentsPage() {
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

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <p className="text-destructive">
            Error loading residents: {error.message}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Resident Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all boarding house residents
          </p>
        </div>
        <Link href="/residents/new">
          <Button size="lg" className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Onboard Resident
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCardSkeleton count={3} />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Residents
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                All residents in the system
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Residents
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.active}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently living here
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inactive Residents
              </CardTitle>
              <UserX className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {stats.inactive}
              </div>
              <p className="text-xs text-muted-foreground">Moved out</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and View Toggle */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder={placeholderText}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 h-10 w-full bg-white border-zinc-200 shadow-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-zinc-400"
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-full md:w-[200px] h-10 bg-white border-zinc-200 shadow-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-zinc-100 shadow-xl rounded-xl p-1">
              <SelectItem
                value="all"
                className="focus:bg-zinc-50 focus:text-zinc-900 cursor-pointer rounded-lg py-2.5"
              >
                All Residents
              </SelectItem>
              <SelectItem
                value="active"
                className="text-green-600 focus:text-green-700 focus:bg-green-50 cursor-pointer rounded-lg py-2.5"
              >
                Active
              </SelectItem>
              <SelectItem
                value="inactive"
                className="text-gray-600 focus:text-gray-700 focus:bg-gray-50 cursor-pointer rounded-lg py-2.5"
              >
                Inactive
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Residents Display */}
      {isLoading ? (
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
            <Card
              key={resident.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {resident.user?.name || "N/A"}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        @{resident.user?.username || "N/A"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      resident.isActive
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-500 hover:bg-gray-600"
                    }
                  >
                    {resident.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Room:</span>
                    <span className="font-medium">
                      {resident.room?.roomNumber || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Entry:</span>
                    <span className="font-medium">
                      {resident.entryDate
                        ? format(new Date(resident.entryDate), "MMM dd, yyyy")
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Billing:</span>
                    <span className="font-medium">
                      Day {resident.billingCycleDate}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/residents/${resident.id}`}
                  className="block pt-2"
                  {...createPrefetchHandlers(
                    queryKeys.residents.detail(resident.id),
                    () => residentsApi.getById(resident.id)
                  )}
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="divide-y">
            {paginatedResidents.map((resident) => (
              <div
                key={resident.id}
                className="p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold truncate">
                          {resident.user?.name || "N/A"}
                        </h3>
                        <Badge
                          className={
                            resident.isActive
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-gray-500 hover:bg-gray-600"
                          }
                        >
                          {resident.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Home className="h-3 w-3" />
                          Room {resident.room?.roomNumber || "N/A"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {resident.entryDate
                            ? format(
                                new Date(resident.entryDate),
                                "MMM dd, yyyy"
                              )
                            : "N/A"}
                        </span>
                        <span>•</span>
                        <span>Billing: Day {resident.billingCycleDate}</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/residents/${resident.id}`}
                    {...createPrefetchHandlers(
                      queryKeys.residents.detail(resident.id),
                      () => residentsApi.getById(resident.id)
                    )}
                  >
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
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
