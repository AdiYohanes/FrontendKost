"use client";

import { useState, useMemo, useEffect } from "react";
import { useExpenses } from "@/lib/hooks/useExpenses";
import { ExpenseCategory } from "@/lib/api/types";
import { useAuthStore } from "@/lib/stores/authStore";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { ITEMS_PER_PAGE } from "@/lib/constants/pagination";
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
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { FilterPanel } from "@/components/filters/FilterPanel";
import {
  StatCardSkeleton,
  CardSkeleton,
  ListCardSkeleton,
} from "@/components/ui/card-skeleton";
import { Pagination } from "@/components/ui/pagination";
import {
  Plus,
  Search,
  Eye,
  DollarSign,
  Wrench,
  Zap,
  Trash2,
  Package,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Category icons mapping
const categoryIcons = {
  [ExpenseCategory.MAINTENANCE]: Wrench,
  [ExpenseCategory.UTILITIES]: Zap,
  [ExpenseCategory.TRASH_FEE]: Trash2,
  [ExpenseCategory.SUPPLIES]: Package,
  [ExpenseCategory.OTHER]: MoreHorizontal,
};

// Category colors mapping
const categoryColors = {
  [ExpenseCategory.MAINTENANCE]:
    "bg-orange-100 text-orange-700 border-orange-200",
  [ExpenseCategory.UTILITIES]: "bg-blue-100 text-blue-700 border-orange-200",
  [ExpenseCategory.TRASH_FEE]: "bg-green-100 text-green-700 border-green-200",
  [ExpenseCategory.SUPPLIES]: "bg-purple-100 text-purple-700 border-purple-200",
  [ExpenseCategory.OTHER]: "bg-gray-100 text-gray-700 border-gray-200",
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function ExpensesPage() {
  const user = useAuthStore((state) => state.user);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Build query params
  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (categoryFilter !== "all") params.category = categoryFilter;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return params;
  }, [categoryFilter, startDate, endDate]);

  const { data: expenses, isLoading, error } = useExpenses(queryParams);

  // Check if user is OWNER
  useEffect(() => {
    if (user && user.role !== "OWNER") {
      window.location.href = "/dashboard";
    }
  }, [user]);

  // Calculate statistics grouped by category
  const stats = useMemo(() => {
    if (!expenses)
      return {
        total: 0,
        byCategory: {},
        monthlyTrend: 0,
        currentMonthTotal: 0,
        lastMonthTotal: 0,
      };

    const byCategory: Record<string, number> = {};
    let total = 0;
    let currentMonthTotal = 0;
    let lastMonthTotal = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    expenses.forEach((expense) => {
      total += expense.amount;
      byCategory[expense.category] =
        (byCategory[expense.category] || 0) + expense.amount;

      const expenseDate = new Date(expense.date);
      const expenseMonth = expenseDate.getMonth();
      const expenseYear = expenseDate.getFullYear();

      if (expenseMonth === currentMonth && expenseYear === currentYear) {
        currentMonthTotal += expense.amount;
      } else if (expenseMonth === lastMonth && expenseYear === lastMonthYear) {
        lastMonthTotal += expense.amount;
      }
    });

    // Calculate trend percentage
    const monthlyTrend =
      lastMonthTotal > 0
        ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
        : currentMonthTotal > 0
          ? 100
          : 0;

    return {
      total,
      byCategory,
      monthlyTrend,
      currentMonthTotal,
      lastMonthTotal,
    };
  }, [expenses]);

  // Filter expenses by search query
  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];

    return expenses.filter((expense) => {
      const matchesSearch =
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [expenses, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredExpenses, currentPage]);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setCurrentPage(1);
  };

  const handleClearDateRange = () => {
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  if (user?.role !== "OWNER") {
    return (
      <div className="p-6">
        <Card className="p-12">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-destructive">
              Access Denied
            </h3>
            <p className="text-muted-foreground">
              You do not have permission to view this page. Only OWNER can
              access expense management.
            </p>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <p className="text-destructive">
            Error loading expenses: {error.message}
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
          <h1 className="text-3xl font-bold">Expense Management</h1>
          <p className="text-muted-foreground">
            Track and manage operational expenses
          </p>
        </div>
        <Link href="/expenses/new">
          <Button size="lg" className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add New Expense
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCardSkeleton count={4} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.total)}
              </div>
              <p className="text-xs text-muted-foreground">
                {expenses?.length || 0} expense records
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.currentMonthTotal)}
              </div>
              <div className="flex items-center gap-1 text-xs">
                {stats.monthlyTrend > 0 ? (
                  <>
                    <span className="text-red-600">
                      ↑ {stats.monthlyTrend.toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">vs last month</span>
                  </>
                ) : stats.monthlyTrend < 0 ? (
                  <>
                    <span className="text-green-600">
                      ↓ {Math.abs(stats.monthlyTrend).toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">vs last month</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">
                    No change from last month
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {Object.entries(stats.byCategory)
            .slice(0, 2)
            .map(([category, amount]) => {
              const Icon = categoryIcons[category as ExpenseCategory];
              return (
                <Card key={category}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {category}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(amount)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {expenses?.filter((e) => e.category === category)
                        .length || 0}{" "}
                      records
                    </p>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}

      {/* Category Breakdown */}
      {Object.keys(stats.byCategory).length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Expense Breakdown by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(stats.byCategory).map(([category, amount]) => {
              const Icon = categoryIcons[category as ExpenseCategory];
              const percentage = ((amount / stats.total) * 100).toFixed(1);
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{category}</span>
                  </div>
                  <div className="text-lg font-bold">
                    {formatCurrency(amount)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {percentage}% of total
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Filters */}
      <FilterPanel
        onClearAll={handleClearAllFilters}
        showClearButton={
          !!(searchQuery || categoryFilter !== "all" || startDate || endDate)
        }
      >
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search by description or category..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-10 w-full bg-white border-zinc-200 shadow-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-zinc-400"
          />
        </div>
        <div className="w-full md:w-[200px]">
          <Select
            value={categoryFilter}
            onValueChange={handleCategoryFilterChange}
          >
            <SelectTrigger className="w-full h-10 bg-white border-zinc-200 shadow-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="bg-white border-zinc-100 shadow-xl rounded-xl p-1">
              <SelectItem
                value="all"
                className="focus:bg-zinc-50 focus:text-zinc-900 cursor-pointer rounded-lg py-2.5"
              >
                All Categories
              </SelectItem>
              <SelectItem
                value={ExpenseCategory.MAINTENANCE}
                className="focus:bg-orange-50 focus:text-orange-700 cursor-pointer rounded-lg py-2.5"
              >
                Maintenance
              </SelectItem>
              <SelectItem
                value={ExpenseCategory.UTILITIES}
                className="focus:bg-blue-50 focus:text-blue-700 cursor-pointer rounded-lg py-2.5"
              >
                Utilities
              </SelectItem>
              <SelectItem
                value={ExpenseCategory.TRASH_FEE}
                className="focus:bg-green-50 focus:text-green-700 cursor-pointer rounded-lg py-2.5"
              >
                Trash Fee
              </SelectItem>
              <SelectItem
                value={ExpenseCategory.SUPPLIES}
                className="focus:bg-purple-50 focus:text-purple-700 cursor-pointer rounded-lg py-2.5"
              >
                Supplies
              </SelectItem>
              <SelectItem
                value={ExpenseCategory.OTHER}
                className="focus:bg-gray-50 focus:text-gray-700 cursor-pointer rounded-lg py-2.5"
              >
                Other
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
          onClear={handleClearDateRange}
        />
      </FilterPanel>

      {/* Expenses List */}
      {isLoading ? (
        <ListCardSkeleton count={5} />
      ) : paginatedExpenses.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <DollarSign className="h-16 w-16 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">No expenses found</h3>
              <p className="text-muted-foreground">
                {searchQuery || categoryFilter !== "all" || startDate || endDate
                  ? "Try adjusting your filters"
                  : "Get started by adding your first expense"}
              </p>
            </div>
            {(searchQuery ||
              categoryFilter !== "all" ||
              startDate ||
              endDate) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setStartDate("");
                  setEndDate("");
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="divide-y">
            {paginatedExpenses.map((expense) => {
              const Icon = categoryIcons[expense.category];
              return (
                <div
                  key={expense.id}
                  className="p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`h-12 w-12 rounded-lg flex items-center justify-center ${categoryColors[expense.category]}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {expense.description}
                          </h3>
                          <Badge className={categoryColors[expense.category]}>
                            {expense.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(expense.date), "MMM dd, yyyy")}
                          </span>
                          <span>•</span>
                          <span className="font-medium text-foreground">
                            {formatCurrency(expense.amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/expenses/${expense.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredExpenses.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        itemLabel="expenses"
      />
    </div>
  );
}
