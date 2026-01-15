"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Plus, Search, Wrench } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import { useComplaints } from "@/lib/hooks/useComplaints";
import { useAuthStore } from "@/lib/stores/authStore";
import { ComplaintStatus, UserRole } from "@/lib/api/types";

export default function ComplaintsPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch complaints
  const { data: complaints, isLoading } = useComplaints();

  // Filter and search complaints
  const filteredComplaints = useMemo(() => {
    if (!complaints) return [];

    return complaints.filter((complaint) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        complaint.title?.toLowerCase().includes(searchLower) ||
        complaint.description?.toLowerCase().includes(searchLower) ||
        complaint.id?.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus =
        statusFilter === "all" || complaint.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, searchQuery, statusFilter]);

  // Get status badge variant
  const getStatusBadge = (status: ComplaintStatus) => {
    const variants: Record<
      ComplaintStatus,
      {
        className: string;
        label: string;
      }
    > = {
      OPEN: {
        className:
          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800",
        label: "Open",
      },
      IN_PROGRESS: {
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
        label: "In Progress",
      },
      RESOLVED: {
        className:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800",
        label: "Resolved",
      },
      CLOSED: {
        className:
          "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-800",
        label: "Closed",
      },
    };
    return variants[status];
  };

  // Check if user can create complaints
  const canCreate = user?.role === UserRole.PENGHUNI;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100">
            Complaints
          </h1>
          <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mt-1">
            {user?.role === UserRole.PENGHUNI
              ? "Your Support Tickets"
              : "Resident Issues & Maintenance"}
          </p>
        </div>
        {canCreate && (
          <Link href="/complaints/new">
             <Button size="lg" className="h-12 md:h-14 rounded-2xl bg-[#1baa56] hover:bg-[#168a46] text-white shadow-xl shadow-[#1baa56]/20 hover:shadow-[#1baa56]/30 hover:-translate-y-1 active:scale-95 transition-all duration-300 font-black text-xs uppercase tracking-widest px-8">
              <Plus className="mr-2 h-5 w-5" />
              New Complaint
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mt-8">
        {/* Search */}
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search complaints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm transition-all focus:ring-2 focus:ring-[#1baa56]/20 focus:border-[#1baa56] placeholder:text-zinc-400 rounded-2xl"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full h-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm transition-all focus:ring-2 focus:ring-[#1baa56]/20 focus:border-[#1baa56] rounded-2xl text-xs font-bold uppercase tracking-wide">
              <SelectValue placeholder="STATUS" />
            </SelectTrigger>
            <SelectContent className="bg-white border-zinc-100 shadow-xl rounded-2xl p-1">
              <SelectItem value="all" className="focus:bg-zinc-50 cursor-pointer rounded-xl font-bold text-xs uppercase tracking-wide py-3">All Status</SelectItem>
              <SelectItem value="OPEN" className="text-red-600 focus:bg-red-50 cursor-pointer rounded-xl font-bold text-xs uppercase tracking-wide py-3">Open</SelectItem>
              <SelectItem value="IN_PROGRESS" className="text-yellow-600 focus:bg-yellow-50 cursor-pointer rounded-xl font-bold text-xs uppercase tracking-wide py-3">In Progress</SelectItem>
              <SelectItem value="RESOLVED" className="text-green-600 focus:bg-green-50 cursor-pointer rounded-xl font-bold text-xs uppercase tracking-wide py-3">Resolved</SelectItem>
              <SelectItem value="CLOSED" className="text-zinc-600 focus:bg-zinc-50 cursor-pointer rounded-xl font-bold text-xs uppercase tracking-wide py-3">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Complaints List */}
      {/* Complaints Table */}
      <div className="mt-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/50 dark:bg-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
              <TableHead className="w-[100px] text-xs font-black uppercase tracking-widest text-zinc-400 py-6 pl-6">ID</TableHead>
              <TableHead className="text-xs font-black uppercase tracking-widest text-zinc-400 py-6">Subject</TableHead>
              <TableHead className="w-[150px] text-xs font-black uppercase tracking-widest text-zinc-400 py-6">Date</TableHead>
              <TableHead className="w-[150px] text-xs font-black uppercase tracking-widest text-zinc-400 py-6">Status</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4} className="p-6">
                    <Skeleton className="h-6 w-full rounded-lg" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredComplaints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-96 text-center">
                  <div className="flex flex-col items-center justify-center p-8">
                    <div className="h-20 w-20 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-4">
                      <Wrench className="h-10 w-10 text-zinc-300" />
                    </div>
                    <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 mb-1">
                      No complaints found
                    </h3>
                    <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                      {searchQuery || statusFilter !== "all"
                        ? "We couldn't find any complaints matching your current filters."
                        : "There are no complaints to display at the moment."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredComplaints.map((complaint, index) => {
                const statusBadge = getStatusBadge(complaint.status);
                return (
                  <TableRow 
                    key={complaint.id}
                    className="group cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    onClick={() => router.push(`/complaints/${complaint.id}`)}
                  >
                    <TableCell className="py-6 pl-6">
                      <span className="font-mono text-zinc-500 font-medium">#{String(index + 1).padStart(3, "0")}</span>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="space-y-1">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 block">
                          {complaint.title}
                        </span>
                        <span className="text-xs text-zinc-500 line-clamp-1 block max-w-[300px]">
                          {complaint.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        {complaint.createdAt ? format(new Date(complaint.createdAt), "dd MMM yyyy") : "-"}
                      </span>
                    </TableCell>
                    <TableCell className="py-6">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge.className}`}>
                        {statusBadge.label}
                      </span>
                    </TableCell>

                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
