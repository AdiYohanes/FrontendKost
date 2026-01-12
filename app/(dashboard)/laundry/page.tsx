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
      const residentName = transaction.resident 
        ? ("name" in transaction.resident ? transaction.resident.name : (transaction.resident as any)?.user?.name) 
        : "";
      const roomNumber = transaction.resident
        ? ("roomNumber" in transaction.resident ? transaction.resident.roomNumber : (transaction.resident as any)?.room?.roomNumber)
        : "";

      const matchesSearch =
        residentName?.toLowerCase().includes(searchLower) ||
        roomNumber?.toLowerCase().includes(searchLower) ||
        transaction.serviceType?.toLowerCase().includes(searchLower) ||
        transaction.id?.toLowerCase().includes(searchLower);

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
    switch (paymentStatus) {
      case "PAID":
        return {
          className:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800",
          label: "Paid",
        };
      case "PARTIAL":
        return {
          className:
            "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-200 dark:border-orange-800",
          label: "Partial",
        };
      default:
        return {
          className:
            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800",
          label: "Unpaid",
        };
    }
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100">
            Laundry
          </h1>
          <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mt-1">
            Service & Transaction History
          </p>
        </div>
        {canCreate && (
          <Link href="/laundry/new">
            <Button size="lg" className="h-12 md:h-14 rounded-2xl bg-[#1baa56] hover:bg-[#168a46] text-white shadow-xl shadow-[#1baa56]/20 hover:shadow-[#1baa56]/30 hover:-translate-y-1 active:scale-95 transition-all duration-300 font-black text-xs uppercase tracking-widest px-8">
              <Plus className="mr-2 h-5 w-5" />
              New Order
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
            placeholder={placeholderText}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm transition-all focus:ring-2 focus:ring-[#1baa56]/20 focus:border-[#1baa56] placeholder:text-zinc-400 rounded-2xl"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Status Filter */}
          <div className="w-full sm:w-[180px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full h-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm transition-all focus:ring-2 focus:ring-[#1baa56]/20 focus:border-[#1baa56] rounded-2xl text-xs font-bold uppercase tracking-wide">
                <SelectValue placeholder="STATUS" />
              </SelectTrigger>
              <SelectContent className="bg-white border-zinc-100 shadow-xl rounded-2xl p-1">
                <SelectItem value="all" className="focus:bg-zinc-50 cursor-pointer rounded-xl font-bold text-xs uppercase tracking-wide py-3">All Status</SelectItem>
                <SelectItem value="PENDING" className="text-yellow-600 focus:bg-yellow-50 cursor-pointer rounded-xl font-bold text-xs uppercase tracking-wide py-3">Pending</SelectItem>
                <SelectItem value="ON_PROCESS" className="text-blue-600 focus:bg-blue-50 cursor-pointer rounded-xl font-bold text-xs uppercase tracking-wide py-3">On Process</SelectItem>
                <SelectItem value="READY_TO_PICKUP" className="text-purple-600 focus:bg-purple-50 cursor-pointer rounded-xl font-bold text-xs uppercase tracking-wide py-3">Ready</SelectItem>
                <SelectItem value="COMPLETED" className="text-green-600 focus:bg-green-50 cursor-pointer rounded-xl font-bold text-xs uppercase tracking-wide py-3">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Filter */}
          <div className="w-full sm:w-[180px]">
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full h-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm transition-all focus:ring-2 focus:ring-[#1baa56]/20 focus:border-[#1baa56] rounded-2xl text-xs font-bold uppercase tracking-wide">
                <SelectValue placeholder="PAYMENT" />
              </SelectTrigger>
              <SelectContent className="bg-white border-zinc-100 shadow-xl rounded-2xl p-1">
                <SelectItem value="all" className="focus:bg-zinc-50 cursor-pointer rounded-xl font-bold text-xs uppercase tracking-wide py-3">All Payments</SelectItem>
                <SelectItem value="UNPAID" className="text-red-600 focus:bg-red-50 cursor-pointer rounded-xl font-bold text-xs uppercase tracking-wide py-3">Unpaid</SelectItem>
                <SelectItem value="PARTIAL" className="text-orange-600 focus:bg-orange-50 cursor-pointer rounded-xl font-bold text-xs uppercase tracking-wide py-3">Partial</SelectItem>
                <SelectItem value="PAID" className="text-green-600 focus:bg-green-50 cursor-pointer rounded-xl font-bold text-xs uppercase tracking-wide py-3">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="mt-8">
        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 w-full bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 mt-4">
             <Package className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
             <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">
               No transactions found
             </h3>
             <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest mt-2 px-1">
                {searchQuery || statusFilter !== "all" || paymentFilter !== "all"
                  ? "Adjust filters to see more results"
                  : "Create an order to get started"}
             </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTransactions.map((transaction, index) => {
              const statusBadge = getStatusBadge(transaction.status);
              const paymentBadge = getPaymentBadge(transaction.paymentStatus);

              return (
                <div
                  key={transaction.id}
                  className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/50 transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden relative"
                  onClick={() => router.push(`/laundry/${transaction.id}`)}
                >
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#1baa56]/10 group-hover:border-[#1baa56]/20 transition-colors">
                      <Package className="h-7 w-7 text-zinc-400 group-hover:text-[#1baa56] transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#1baa56] bg-[#1baa56]/10 px-2 py-0.5 rounded-md">
                          #{String(index + 1).padStart(3, "0")}
                        </span>
                        <h3 className="font-black text-lg text-zinc-900 dark:text-zinc-100 truncate">
                          {transaction.resident
                            ? ("name" in transaction.resident 
                                ? transaction.resident.name 
                                : (transaction.resident as any)?.user?.name || "Unknown")
                            : "Resident #" + transaction.residentId.slice(0, 5)}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                           <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                           Room {transaction.resident
                              ? ("roomNumber" in transaction.resident 
                                  ? transaction.resident.roomNumber 
                                  : (transaction.resident as any)?.room?.roomNumber || "N/A")
                              : "N/A"}
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                           <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                           {transaction.serviceType}
                        </p>
                         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                           <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                           {format(new Date(transaction.orderDate || transaction.createdAt), "dd MMM yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 ml-1 sm:ml-0">
                    <div className="text-right sm:min-w-[100px]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Total</p>
                      <p className="font-black text-lg text-zinc-900 dark:text-zinc-100">
                        Rp {transaction.price.toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[100px]">
                       <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border text-center ${statusBadge.className.split(' ').filter(c => !c.includes('bg')).join(' ')}`}>
                          {statusBadge.label}
                       </div>
                       <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border text-center ${paymentBadge.className.split(' ').filter(c => !c.includes('bg')).join(' ')}`}>
                          {paymentBadge.label}
                       </div>
                    </div>
                  </div>
                  
                  {/* Subtle bar indicator */}
                  <div 
                    className="absolute bottom-0 left-0 h-1 bg-[#1baa56] transition-all duration-500" 
                    style={{ width: `${getProgressPercentage(transaction.status)}%` }} 
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
