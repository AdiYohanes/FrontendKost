"use client";

import { useState, useMemo, useEffect } from "react";
import { useRooms } from "@/lib/hooks/useRooms";
import { RoomStatus } from "@/lib/api/types";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { ITEMS_PER_PAGE } from "@/lib/constants/pagination";
import { getRoomStatusColor, formatCurrency } from "@/lib/utils/roomUtils";
import { usePrefetch } from "@/lib/hooks/usePrefetch";
import { roomsApi } from "@/lib/api/services/rooms";
import { queryKeys } from "@/lib/query/queryKeys";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { EmptyState } from "@/components/ui/empty-state";
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
  Edit,
  Home,
  DoorOpen,
  Wrench,
  LayoutGrid,
  List,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AddRoomDialog } from "@/components/rooms/AddRoomDialog";
import { RoomDetailDialog } from "@/components/rooms/RoomDetailDialog";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function RoomsPage() {
  const { data: rooms, isLoading, error } = useRooms();
  const router = useRouter();
  const { createPrefetchHandlers } = usePrefetch();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Calculate statistics
  const stats = useMemo(() => {
    if (!rooms || !isMounted) return { total: 0, available: 0, occupied: 0, maintenance: 0 };

    return {
      total: rooms.length,
      available: rooms.filter((r) => r.status === RoomStatus.AVAILABLE).length,
      occupied: rooms.filter((r) => r.status === RoomStatus.OCCUPIED).length,
      maintenance: rooms.filter((r) => r.status === RoomStatus.MAINTENANCE)
        .length,
    };
  }, [rooms]);

  // Filter and search rooms
  const filteredRooms = useMemo(() => {
    if (!rooms) return [];

    return rooms.filter((room) => {
      const matchesSearch =
        room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || room.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rooms, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
  const paginatedRooms = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRooms.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRooms, currentPage]);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  // Dialog state
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);

  // Detail state
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleViewDetails = (roomId: string) => {
    setSelectedRoomId(roomId);
    setIsDetailOpen(true);
  };

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <p className="text-destructive">
            Error loading rooms: {error.message}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <AddRoomDialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen} />
      <RoomDetailDialog 
        roomId={selectedRoomId} 
        open={isDetailOpen} 
        onOpenChange={setIsDetailOpen} 
      />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Room Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all boarding house rooms
          </p>
        </div>
        <Button size="lg" className="w-full md:w-auto" onClick={() => setIsAddRoomOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Room
        </Button>
      </div>

      {/* Statistics Cards */}
      {(isLoading || !isMounted) ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCardSkeleton count={4} />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Rooms</p>
              <Home className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.total}</h3>
              <span className="text-[10px] text-zinc-400 font-medium whitespace-nowrap">Units total</span>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Available</p>
              <DoorOpen className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">{stats.available}</h3>
              <span className="text-[10px] text-emerald-600/60 font-medium whitespace-nowrap">Ready to rent</span>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Occupied</p>
              <Home className="h-4 w-4 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-500">{stats.occupied}</h3>
              <span className="text-[10px] text-blue-600/60 font-medium whitespace-nowrap">Active residents</span>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Maintenance</p>
              <Wrench className="h-4 w-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-500">{stats.maintenance}</h3>
              <span className="text-[10px] text-amber-600/60 font-medium whitespace-nowrap">Needs attention</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters and View Toggle */}
      <FilterPanel
        onClearAll={handleClearAllFilters}
        showClearButton={!!(searchQuery || statusFilter !== "all")}
      >
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search rooms..."
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
              All Status
            </SelectItem>
            <SelectItem
              value={RoomStatus.AVAILABLE}
              className="text-green-600 focus:text-green-700 focus:bg-green-50 cursor-pointer rounded-lg py-2.5"
            >
              Available
            </SelectItem>
            <SelectItem
              value={RoomStatus.OCCUPIED}
              className="text-blue-600 focus:text-blue-700 focus:bg-blue-50 cursor-pointer rounded-lg py-2.5"
            >
              Occupied
            </SelectItem>
            <SelectItem
              value={RoomStatus.MAINTENANCE}
              className="text-yellow-600 focus:text-yellow-700 focus:bg-yellow-50 cursor-pointer rounded-lg py-2.5"
            >
              Maintenance
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={cn(
              "h-10 w-10 transition-all duration-300",
              viewMode === "grid" 
                ? "border-[#1baa56] bg-[#1baa56]/10 text-[#1baa56] hover:bg-[#1baa56]/20 hover:text-[#1baa56]" 
                : "border-zinc-200 text-zinc-400 hover:text-zinc-600 dark:border-zinc-800"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("list")}
            className={cn(
              "h-10 w-10 transition-all duration-300",
              viewMode === "list" 
                ? "border-[#1baa56] bg-[#1baa56]/10 text-[#1baa56] hover:bg-[#1baa56]/20 hover:text-[#1baa56]" 
                : "border-zinc-200 text-zinc-400 hover:text-zinc-600 dark:border-zinc-800"
            )}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </FilterPanel>

      {/* Rooms Display */}
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
      ) : paginatedRooms.length === 0 ? (
        <EmptyState
          icon={Home}
          title="No rooms found"
          description={
            searchQuery || statusFilter !== "all"
              ? "Try adjusting your filters to see more results"
              : "Get started by adding your first room to the system"
          }
          action={
            searchQuery || statusFilter !== "all"
              ? {
                  label: "Clear filters",
                  onClick: handleClearAllFilters,
                  variant: "outline",
                }
              : {
                  label: "Add New Room",
                  onClick: () => setIsAddRoomOpen(true),
                }
          }
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedRooms.map((room) => (
            <div
              key={room.id}
              className="group relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-xl hover:border-[#1baa56]/30 transition-all duration-300"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-[#1baa56]/10 flex items-center justify-center text-[#1baa56]">
                      <Home className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">Room {room.roomNumber}</span>
                  </div>
                  <Badge variant="outline" className={cn("capitalize px-2 py-0 h-5 text-[10px] font-semibold border-none rounded-full", getRoomStatusColor(room.status))}>
                    {room.status.toLowerCase()}
                  </Badge>
                </div>

                <div className="flex items-end justify-between pt-1">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">Monthly Rent</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{formatCurrency(room.rentalPrice)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">Facilities</p>
                    <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      {Object.keys(room.facilities || {}).length} Items
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-zinc-50 dark:border-zinc-900">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 text-xs h-8 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-medium"
                    onClick={() => handleViewDetails(room.id)}
                  >
                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                    View
                  </Button>
                  <Link href={`/rooms/${room.id}/edit`} className="flex-1">
                    <Button size="sm" className="w-full text-xs h-8 bg-[#1baa56]/10 text-[#1baa56] hover:bg-[#1baa56] hover:text-white transition-all border-none font-semibold">
                      <Edit className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
          <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {paginatedRooms.map((room) => (
              <div
                key={room.id}
                className="group p-3 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:bg-[#1baa56]/10 group-hover:text-[#1baa56] transition-colors">
                    <Home className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        Room {room.roomNumber}
                      </h3>
                      <Badge variant="outline" className={cn("px-2 py-0 h-4 text-[9px] font-bold border-none rounded-full", getRoomStatusColor(room.status))}>
                        {room.status.toLowerCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-[11px] text-zinc-500 font-medium">
                      <span className="text-zinc-900 dark:text-zinc-300">
                        {formatCurrency(room.rentalPrice)}
                      </span>
                      <span className="text-zinc-300 dark:text-zinc-700">•</span>
                      <span>{Object.keys(room.facilities || {}).length} facilities</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    onClick={() => handleViewDetails(room.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Link href={`/rooms/${room.id}/edit`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-[#1baa56]">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
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
        totalItems={filteredRooms.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        itemLabel="rooms"
      />
    </div>
  );
}
