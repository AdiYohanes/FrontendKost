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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Complaints</h1>
          <p className="text-muted-foreground">
            {user?.role === UserRole.PENGHUNI
              ? "View and manage your complaints"
              : "Manage resident complaints"}
          </p>
        </div>
        {canCreate && (
          <Link href="/complaints/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Complaint
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter complaints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search by title, description, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 w-full bg-white border-zinc-200 shadow-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-zinc-400"
              />
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full h-10 bg-white border-zinc-200 shadow-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-zinc-100 shadow-xl rounded-xl p-1">
                  <SelectItem
                    value="all"
                    className="focus:bg-zinc-50 focus:text-zinc-900 cursor-pointer rounded-lg py-2.5"
                  >
                    All Status
                  </SelectItem>
                  <SelectItem
                    value="OPEN"
                    className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer rounded-lg py-2.5"
                  >
                    Open
                  </SelectItem>
                  <SelectItem
                    value="IN_PROGRESS"
                    className="text-yellow-600 focus:text-yellow-700 focus:bg-yellow-50 cursor-pointer rounded-lg py-2.5"
                  >
                    In Progress
                  </SelectItem>
                  <SelectItem
                    value="RESOLVED"
                    className="text-green-600 focus:text-green-700 focus:bg-green-50 cursor-pointer rounded-lg py-2.5"
                  >
                    Resolved
                  </SelectItem>
                  <SelectItem
                    value="CLOSED"
                    className="text-gray-600 focus:text-gray-700 focus:bg-gray-50 cursor-pointer rounded-lg py-2.5"
                  >
                    Closed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complaints Table */}
      <Card>
        <CardHeader>
          <CardTitle>Complaints</CardTitle>
          <CardDescription>
            {filteredComplaints.length} complaint(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredComplaints.length === 0 ? (
            <EmptyState
              icon={Wrench}
              title="No complaints found"
              description={
                searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters to see more results"
                  : canCreate
                    ? "Submit your first complaint to get started"
                    : "No complaints have been submitted yet"
              }
              action={
                canCreate
                  ? {
                      label: "Submit Complaint",
                      onClick: () => router.push("/complaints/new"),
                    }
                  : undefined
              }
            />
          ) : (
            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold whitespace-nowrap">
                      ID
                    </TableHead>
                    <TableHead className="font-semibold whitespace-nowrap">
                      Title
                    </TableHead>
                    <TableHead className="font-semibold text-center whitespace-nowrap">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-right whitespace-nowrap">
                      Created
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.map((complaint, index) => {
                    const statusBadge = getStatusBadge(complaint.status);

                    return (
                      <TableRow
                        key={complaint.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() =>
                          router.push(`/complaints/${complaint.id}`)
                        }
                      >
                        {/* ID */}
                        <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                          #{String(index + 1).padStart(3, "0")}
                        </TableCell>

                        {/* Title */}
                        <TableCell className="min-w-[200px]">
                          <div className="flex flex-col">
                            <span className="font-medium line-clamp-1">
                              {complaint.title}
                            </span>
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {complaint.description}
                            </span>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="text-center">
                          <Badge
                            className={`${statusBadge.className} whitespace-nowrap`}
                          >
                            {statusBadge.label}
                          </Badge>
                        </TableCell>

                        {/* Created Date */}
                        <TableCell className="text-right text-sm text-muted-foreground whitespace-nowrap">
                          {complaint.createdAt
                            ? format(
                                new Date(complaint.createdAt),
                                "dd MMM yyyy"
                              )
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
