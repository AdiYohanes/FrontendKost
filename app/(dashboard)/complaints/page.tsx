"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Plus, Search, AlertCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ComplaintStatus, UserRole, Complaint } from "@/lib/api/types";

export default function ComplaintsPage() {
  const { user } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch complaints
  const { data: complaints, isLoading } = useComplaints();

  // Filter and search complaints
  const filteredComplaints = useMemo(() => {
    if (!complaints) return [];

    return complaints.filter((complaint) => {
      // Role-based filtering: PENGHUNI sees only own complaints
      if (user?.role === UserRole.PENGHUNI) {
        // Check if complaint belongs to current user's resident record
        const userResidentId = complaint.resident?.userId;
        if (userResidentId !== user.id) {
          return false;
        }
      }

      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        complaint.title?.toLowerCase().includes(searchLower) ||
        complaint.description?.toLowerCase().includes(searchLower) ||
        complaint.resident?.user?.name?.toLowerCase().includes(searchLower) ||
        complaint.resident?.user?.username
          ?.toLowerCase()
          .includes(searchLower) ||
        complaint.resident?.room?.roomNumber
          ?.toLowerCase()
          .includes(searchLower);

      // Status filter
      const matchesStatus =
        statusFilter === "all" || complaint.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, searchQuery, statusFilter, user]);

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

  // Get priority indicator (based on status and age)
  const getPriorityIndicator = (complaint: Complaint) => {
    const daysSinceCreated = Math.floor(
      (new Date().getTime() - new Date(complaint.createdAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (complaint.status === "OPEN" && daysSinceCreated > 7) {
      return {
        show: true,
        className: "text-red-500",
        label: "High Priority",
      };
    } else if (complaint.status === "OPEN" && daysSinceCreated > 3) {
      return {
        show: true,
        className: "text-yellow-500",
        label: "Medium Priority",
      };
    }
    return { show: false, className: "", label: "" };
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, description, or resident..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
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
            <div className="text-center py-12">
              <p className="text-muted-foreground">No complaints found</p>
              {canCreate && (
                <Link href="/complaints/new">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Submit First Complaint
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold whitespace-nowrap">
                      ID
                    </TableHead>
                    {user?.role !== UserRole.PENGHUNI && (
                      <TableHead className="font-semibold whitespace-nowrap">
                        Resident
                      </TableHead>
                    )}
                    <TableHead className="font-semibold whitespace-nowrap">
                      Title
                    </TableHead>
                    <TableHead className="font-semibold text-center whitespace-nowrap">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-center whitespace-nowrap">
                      Priority
                    </TableHead>
                    <TableHead className="font-semibold text-right whitespace-nowrap">
                      Created
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.map((complaint, index) => {
                    const statusBadge = getStatusBadge(complaint.status);
                    const priority = getPriorityIndicator(complaint);

                    return (
                      <TableRow
                        key={complaint.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <Link
                          href={`/complaints/${complaint.id}`}
                          className="contents"
                        >
                          {/* ID */}
                          <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                            #{String(index + 1).padStart(3, "0")}
                          </TableCell>

                          {/* Resident Info (only for staff/owner) */}
                          {user?.role !== UserRole.PENGHUNI && (
                            <TableCell className="min-w-[150px]">
                              <div className="flex flex-col">
                                <span className="font-medium whitespace-nowrap">
                                  {complaint.resident?.user?.name ||
                                    complaint.resident?.user?.username ||
                                    "N/A"}
                                </span>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  Room{" "}
                                  {complaint.resident?.room?.roomNumber ||
                                    "N/A"}
                                </span>
                              </div>
                            </TableCell>
                          )}

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

                          {/* Priority */}
                          <TableCell className="text-center">
                            {priority.show && (
                              <div
                                className={`flex items-center justify-center gap-1 ${priority.className}`}
                              >
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-xs font-medium whitespace-nowrap">
                                  {priority.label}
                                </span>
                              </div>
                            )}
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
                        </Link>
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
