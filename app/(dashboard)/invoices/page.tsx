"use client";

import { useState, useMemo } from "react";
import { useInvoices } from "@/lib/hooks/useInvoices";
import { ITEMS_PER_PAGE } from "@/lib/constants/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Search,
  Eye,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  User,
  Home,
} from "lucide-react";
import Link from "next/link";
import { format, isPast, parseISO } from "date-fns";
import { InvoiceStatus, Invoice } from "@/lib/api/types";

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch invoices based on status filter
  const paymentStatusParam = statusFilter === "all" ? undefined : statusFilter;

  const {
    data: invoices,
    isLoading,
    error,
  } = useInvoices({
    paymentStatus: paymentStatusParam,
  });

  // Calculate statistics
  const stats = useMemo(() => {
    if (!invoices)
      return {
        total: 0,
        unpaid: 0,
        paid: 0,
        partial: 0,
        overdue: 0,
        totalAmount: 0,
      };

    return {
      total: invoices.length,
      unpaid: invoices.filter((i) => i.paymentStatus === InvoiceStatus.UNPAID)
        .length,
      paid: invoices.filter((i) => i.paymentStatus === InvoiceStatus.PAID)
        .length,
      partial: invoices.filter((i) => i.paymentStatus === InvoiceStatus.PARTIAL)
        .length,
      overdue: invoices.filter(
        (i) =>
          i.paymentStatus === InvoiceStatus.UNPAID &&
          isPast(parseISO(i.dueDate))
      ).length,
      totalAmount: invoices.reduce((sum, i) => sum + i.totalAmount, 0),
    };
  }, [invoices]);

  // Filter and search invoices
  const filteredInvoices = useMemo(() => {
    if (!invoices) return [];

    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.invoiceNumber
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        invoice.resident?.user?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        invoice.resident?.room?.roomNumber
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [invoices, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredInvoices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredInvoices, currentPage]);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Helper function to get status badge
  const getStatusBadge = (invoice: Invoice) => {
    const isOverdue =
      invoice.paymentStatus === InvoiceStatus.UNPAID &&
      isPast(parseISO(invoice.dueDate));

    if (isOverdue) {
      return (
        <Badge className="bg-red-600 hover:bg-red-700 text-white">
          <AlertCircle className="mr-1 h-3 w-3" />
          Overdue
        </Badge>
      );
    }

    switch (invoice.paymentStatus) {
      case InvoiceStatus.PAID:
        return (
          <Badge className="bg-[#1baa56] hover:bg-[#148041] text-white">
            <CheckCircle className="mr-1 h-3 w-3" />
            Paid
          </Badge>
        );
      case InvoiceStatus.PARTIAL:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
            <Clock className="mr-1 h-3 w-3" />
            Partial
          </Badge>
        );
      case InvoiceStatus.UNPAID:
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600 text-white">
            <AlertCircle className="mr-1 h-3 w-3" />
            Unpaid
          </Badge>
        );
      default:
        return null;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <Card className="rounded-3xl border-gray-200 dark:border-slate-800 p-6">
          <p className="text-destructive">
            Error loading invoices: {error.message}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-3 md:gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Invoice Management
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-base md:text-lg mt-1">
            Manage and track all billing invoices
          </p>
        </div>
        <Link href="/invoices/generate" className="w-full md:w-auto">
          <Button
            size="lg"
            className="w-full md:w-auto h-12 md:h-14 rounded-full bg-[#1baa56] hover:bg-[#148041] text-white shadow-lg shadow-[#1baa56]/30 hover:shadow-[#1baa56]/50 hover:-translate-y-1 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Plus className="mr-2 h-5 w-5" />
            Generate Invoice
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-500 dark:text-slate-400">
              Total
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              All invoices
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-500 dark:text-slate-400">
              Unpaid
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-600 dark:text-slate-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {stats.unpaid}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Awaiting
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-500 dark:text-slate-400">
              Paid
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-[#1baa56]" />
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="text-xl md:text-2xl font-bold text-[#1baa56]">
              {stats.paid}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Completed
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-500 dark:text-slate-400">
              Overdue
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="text-xl md:text-2xl font-bold text-red-600">
              {stats.overdue}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Past due
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1 rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-500 dark:text-slate-400">
              Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="text-base md:text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(stats.totalAmount)}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              All invoices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg p-4 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-slate-400" />
            <Input
              placeholder="Search invoice, resident, or room..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 h-12 md:h-14 rounded-2xl bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800 cursor-pointer"
            />
          </div>
          <div className="w-full md:w-[200px]">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="flex h-12 md:h-14 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">All Invoices</option>
              <option value="UNPAID">Unpaid</option>
              <option value="PAID">Paid</option>
              <option value="PARTIAL">Partial</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Invoices List */}
      {isLoading ? (
        <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1baa56] mx-auto"></div>
            <p className="mt-4 text-gray-500 dark:text-slate-400">
              Loading invoices...
            </p>
          </div>
        </Card>
      ) : paginatedInvoices.length === 0 ? (
        <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg p-8 md:p-12">
          <div className="text-center space-y-4">
            <FileText className="h-12 w-12 md:h-16 md:w-16 text-gray-500 dark:text-slate-400 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                No invoices found
              </h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm md:text-base">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Get started by generating your first invoice"}
              </p>
            </div>
            {(searchQuery || statusFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="rounded-full cursor-pointer"
              >
                Clear filters
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid gap-3 md:gap-4">
          {paginatedInvoices.map((invoice) => {
            const isOverdue =
              invoice.paymentStatus === InvoiceStatus.UNPAID &&
              isPast(parseISO(invoice.dueDate));

            return (
              <Card
                key={invoice.id}
                className={`rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                  isOverdue
                    ? "border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20"
                    : ""
                }`}
              >
                <CardContent className="p-4 md:p-6">
                  {/* Mobile & Tablet Layout */}
                  <div className="flex flex-col gap-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-[#1baa56]/10 flex items-center justify-center shrink-0">
                          <FileText className="h-5 w-5 md:h-6 md:w-6 text-[#1baa56]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white truncate">
                            {invoice.invoiceNumber}
                          </h3>
                          <div className="mt-1">{getStatusBadge(invoice)}</div>
                        </div>
                      </div>
                      <Link href={`/invoices/${invoice.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="shrink-0 h-10 w-10 rounded-full hover:bg-[#1baa56]/10 cursor-pointer"
                        >
                          <Eye className="h-4 w-4 text-[#1baa56]" />
                        </Button>
                      </Link>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400">
                        <User className="h-4 w-4 shrink-0" />
                        <span className="font-medium text-gray-900 dark:text-white truncate">
                          {invoice.resident?.user?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400">
                        <Home className="h-4 w-4 shrink-0" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          Room {invoice.resident?.room?.roomNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span>
                          Due:{" "}
                          {format(parseISO(invoice.dueDate), "MMM dd, yyyy")}
                        </span>
                      </div>
                    </div>

                    {/* Amount Section */}
                    <div className="pt-3 border-t border-gray-200 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                            Total Amount
                          </p>
                          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(invoice.totalAmount)}
                          </p>
                        </div>
                        <div className="text-right text-xs text-gray-500 dark:text-slate-400">
                          <p>Rent: {formatCurrency(invoice.rentAmount)}</p>
                          <p>
                            Utility: {formatCurrency(invoice.utilityAmount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500 dark:text-slate-400 text-center md:text-left">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredInvoices.length)} of{" "}
            {filteredInvoices.length} invoices
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-full cursor-pointer"
            >
              Previous
            </Button>
            <div className="hidden md:flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 rounded-full cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-[#1baa56] hover:bg-[#148041]"
                        : ""
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <div className="md:hidden text-sm font-medium text-gray-900 dark:text-white px-3 py-2">
              {currentPage} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
