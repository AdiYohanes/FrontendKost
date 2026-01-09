"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Plus, Search, Filter, Loader2, Package } from "lucide-react";
import Link from "next/link";

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

import { useLaundry } from "@/lib/hooks/useLaundry";
import { useAuthStore } from "@/lib/stores/authStore";
import { LaundryStatus, LaundryPaymentStatus, UserRole } from "@/lib/api/types";

export default function LaundryPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [placeholderText, setPlaceholderText] = useState(
    "Search by resident, room, or service..."
  );

  // Handle responsive placeholder
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setPlaceholderText("Search laundry...");
      } else {
        setPlaceholderText("Search by resident, room, or service...");
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch laundry transactions
  const { data: laundryTransactions, isLoading } = useLaundry();

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    if (!laundryTransactions) return [];

    return laundryTransactions.filter((transaction) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        transaction.resident?.user?.name?.toLowerCase().includes(searchLower) ||
        transaction.resident?.user?.username
          ?.toLowerCase()
          .includes(searchLower) ||
        transaction.resident?.room?.roomNumber
          ?.toLowerCase()
          .includes(searchLower) ||
        transaction.serviceType?.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;

      // Payment filter
      const matchesPayment =
        paymentFilter === "all" || transaction.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [laundryTransactions, searchQuery, statusFilter, paymentFilter]);

  // Get status badge variant
  const getStatusBadge = (status: LaundryStatus) => {
    const variants: Record<
      LaundryStatus,
      {
        className: string;
        label: string;
      }
    > = {
      PENDING: {
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
        label: "Pending",
      },
      ON_PROCESS: {
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800",
        label: "In Progress",
      },
      READY_TO_PICKUP: {
        className:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800",
        label: "Ready",
      },
      COMPLETED: {
        className:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800",
        label: "Completed",
      },
      CANCELLED: {
        className:
          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800",
        label: "Cancelled",
      },
    };
    return variants[status];
  };

  // Get payment badge variant
  const getPaymentBadge = (paymentStatus: LaundryPaymentStatus) => {
    return paymentStatus === "PAID"
      ? {
          className:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800",
          label: "Paid",
        }
      : {
          className:
            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800",
          label: "Unpaid",
        };
  };

  // Get progress percentage
  const getProgressPercentage = (status: LaundryStatus) => {
    const progress: Record<LaundryStatus, number> = {
      PENDING: 25,
      ON_PROCESS: 50,
      READY_TO_PICKUP: 75,
      COMPLETED: 100,
      CANCELLED: 0,
    };
    return progress[status];
  };

  // Check if user can create transactions
  const canCreate =
    user?.role === UserRole.PENJAGA || user?.role === UserRole.PENGHUNI;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Laundry Management</h1>
          <p className="text-muted-foreground">
            Manage laundry service transactions
          </p>
        </div>
        {canCreate && (
          <Link href="/laundry/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Transaction
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Search and filter laundry transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder={placeholderText}
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
                    value="PENDING"
                    className="text-yellow-600 focus:text-yellow-700 focus:bg-yellow-50 cursor-pointer rounded-lg py-2.5"
                  >
                    Pending
                  </SelectItem>
                  <SelectItem
                    value="ON_PROCESS"
                    className="text-blue-600 focus:text-blue-700 focus:bg-blue-50 cursor-pointer rounded-lg py-2.5"
                  >
                    On Process
                  </SelectItem>
                  <SelectItem
                    value="READY_TO_PICKUP"
                    className="text-purple-600 focus:text-purple-700 focus:bg-purple-50 cursor-pointer rounded-lg py-2.5"
                  >
                    Ready
                  </SelectItem>
                  <SelectItem
                    value="COMPLETED"
                    className="text-green-600 focus:text-green-700 focus:bg-green-50 cursor-pointer rounded-lg py-2.5"
                  >
                    Completed
                  </SelectItem>
                  <SelectItem
                    value="CANCELLED"
                    className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer rounded-lg py-2.5"
                  >
                    Cancelled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Filter */}
            <div className="w-full md:w-[200px]">
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-full h-10 bg-white border-zinc-200 shadow-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <SelectValue placeholder="All Payments" />
                </SelectTrigger>
                <SelectContent className="bg-white border-zinc-100 shadow-xl rounded-xl p-1">
                  <SelectItem
                    value="all"
                    className="focus:bg-zinc-50 focus:text-zinc-900 cursor-pointer rounded-lg py-2.5"
                  >
                    All Payments
                  </SelectItem>
                  <SelectItem
                    value="UNPAID"
                    className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer rounded-lg py-2.5"
                  >
                    Unpaid
                  </SelectItem>
                  <SelectItem
                    value="PAID"
                    className="text-green-600 focus:text-green-700 focus:bg-green-50 cursor-pointer rounded-lg py-2.5"
                  >
                    Paid
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transaction(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No laundry transactions found"
              description={
                searchQuery || statusFilter !== "all" || paymentFilter !== "all"
                  ? "Try adjusting your filters to see more results"
                  : canCreate
                    ? "Create your first laundry transaction to get started"
                    : "No laundry transactions have been created yet"
              }
              action={
                canCreate
                  ? {
                      label: "Create Transaction",
                      onClick: () => router.push("/laundry/new"),
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
                      Resident
                    </TableHead>
                    <TableHead className="font-semibold whitespace-nowrap">
                      Service
                    </TableHead>
                    <TableHead className="font-semibold text-right whitespace-nowrap">
                      Amount
                    </TableHead>
                    <TableHead className="font-semibold text-center whitespace-nowrap">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-center whitespace-nowrap">
                      Payment
                    </TableHead>
                    <TableHead className="font-semibold text-right whitespace-nowrap">
                      Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction, index) => {
                    const statusBadge = getStatusBadge(transaction.status);
                    const paymentBadge = getPaymentBadge(
                      transaction.paymentStatus
                    );

                    return (
                      <TableRow
                        key={transaction.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() =>
                          router.push(`/laundry/${transaction.id}`)
                        }
                      >
                        {/* ID */}
                        <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                          #{String(index + 1).padStart(3, "0")}
                        </TableCell>

                        {/* Resident Info */}
                        <TableCell className="min-w-[150px]">
                          <div className="flex flex-col">
                            <span className="font-medium whitespace-nowrap">
                              {transaction.resident?.user?.name ||
                                transaction.resident?.user?.username ||
                                "N/A"}
                            </span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              Room{" "}
                              {transaction.resident?.room?.roomNumber || "N/A"}
                            </span>
                          </div>
                        </TableCell>

                        {/* Service Details */}
                        <TableCell className="min-w-[120px]">
                          <div className="flex flex-col">
                            <span className="font-medium text-sm whitespace-nowrap">
                              {transaction.serviceType}
                            </span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {transaction.weight} kg
                            </span>
                          </div>
                        </TableCell>

                        {/* Amount */}
                        <TableCell className="text-right font-semibold whitespace-nowrap">
                          Rp {transaction.price.toLocaleString("id-ID")}
                        </TableCell>

                        {/* Status */}
                        <TableCell className="text-center">
                          <Badge
                            className={`${statusBadge.className} whitespace-nowrap`}
                          >
                            {statusBadge.label}
                          </Badge>
                        </TableCell>

                        {/* Payment Status */}
                        <TableCell className="text-center">
                          <Badge
                            className={`${paymentBadge.className} whitespace-nowrap`}
                          >
                            {paymentBadge.label}
                          </Badge>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="text-right text-sm text-muted-foreground whitespace-nowrap">
                          {transaction.orderDate
                            ? format(
                                new Date(transaction.orderDate),
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
