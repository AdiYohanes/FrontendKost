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
      <div className="mt-8">
        {isLoading ? (
          <div className="grid gap-4">
             {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 w-full bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-3xl" />
             ))}
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 mt-4">
             <Wrench className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
             <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">
               No complaints found
             </h3>
             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300 mt-2 px-1">
                {searchQuery || statusFilter !== "all"
                  ? "Adjust filters to see more results"
                  : "Submit a complaint if you need help"}
             </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredComplaints.map((complaint, index) => {
              const statusBadge = getStatusBadge(complaint.status);

              return (
                <div
                  key={complaint.id}
                  className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/50 transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                  onClick={() => router.push(`/complaints/${complaint.id}`)}
                >
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#1baa56]/10 group-hover:border-[#1baa56]/20 transition-colors">
                      <Wrench className="h-7 w-7 text-zinc-400 group-hover:text-[#1baa56] transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#1baa56] bg-[#1baa56]/10 px-2 py-0.5 rounded-md">
                          #{String(index + 1).padStart(3, "0")}
                        </span>
                        <h3 className="font-black text-lg text-zinc-900 dark:text-zinc-100 truncate">
                          {complaint.title}
                        </h3>
                      </div>
                      <p className="text-xs font-bold text-zinc-400 truncate max-w-md">
                        {complaint.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 sm:gap-8 ml-1 sm:ml-0">
                    <div className="text-right sm:min-w-[120px]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Submitted</p>
                      <p className="font-black text-sm text-zinc-900 dark:text-zinc-100">
                        {complaint.createdAt ? format(new Date(complaint.createdAt), "dd MMM yyyy") : "N/A"}
                      </p>
                    </div>

                    <div className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border text-center min-w-[100px] ${statusBadge.className.split(' ').filter(c => !c.includes('bg')).join(' ')}`}>
                       {statusBadge.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
