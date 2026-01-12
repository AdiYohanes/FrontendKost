"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useExpenses } from "@/lib/hooks/useExpenses";
import { ExpenseCategory, Expense } from "@/lib/api/types";
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
  const router = useRouter();
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100">
            Expenses
          </h1>
          <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mt-1">
            Operational Cost Management
          </p>
        </div>
        <Link href="/expenses/new">
          <Button size="lg" className="h-12 md:h-14 rounded-2xl bg-[#1baa56] hover:bg-[#168a46] text-white shadow-xl shadow-[#1baa56]/20 hover:shadow-[#1baa56]/30 hover:-translate-y-1 active:scale-95 transition-all duration-300 font-black text-xs uppercase tracking-widest px-8">
            <Plus className="mr-2 h-5 w-5" />
            Add Expense
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
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
           <div className="flex items-center justify-between mb-4">
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Expenses</span>
             <DollarSign className="h-4 w-4 text-[#1baa56]" />
           </div>
           <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              {formatCurrency(stats.total)}
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest text-[#1baa56] mt-2">
              {expenses?.length || 0} Records
           </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
           <div className="flex items-center justify-between mb-4">
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">This Month</span>
             <Calendar className="h-4 w-4 text-[#1baa56]" />
           </div>
           <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              {formatCurrency(stats.currentMonthTotal)}
           </div>
           <div className="flex items-center gap-1 mt-2">
              {stats.monthlyTrend > 0 ? (
                <span className="text-[10px] font-black uppercase tracking-widest text-red-600">
                  ↑ {stats.monthlyTrend.toFixed(1)}% vs last
                </span>
              ) : stats.monthlyTrend < 0 ? (
                <span className="text-[10px] font-black uppercase tracking-widest text-green-600">
                  ↓ {Math.abs(stats.monthlyTrend).toFixed(1)}% vs last
                </span>
              ) : (
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  No Change
                </span>
              )}
           </div>
        </div>

        {Object.entries(stats.byCategory)
          .slice(0, 2)
          .map(([category, amount]) => {
            const Icon = categoryIcons[category as ExpenseCategory];
            return (
              <div key={category} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                 <div className="flex items-center justify-between mb-4">
                   <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 truncate pr-2">{category}</span>
                   <Icon className="h-4 w-4 text-zinc-400" />
                 </div>
                 <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                    {formatCurrency(amount)}
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-2">
                    {expenses?.filter((e) => e.category === category).length || 0} records
                 </p>
              </div>
            );
          })}
      </div>
      )}

      {/* Category Breakdown */}
      {Object.keys(stats.byCategory).length > 0 && (
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">Expense Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {Object.entries(stats.byCategory).map(([category, amount]) => {
              const Icon = categoryIcons[category as ExpenseCategory];
              const percentage = ((amount / stats.total) * 100).toFixed(1);
              return (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
                       <Icon className="h-4 w-4 text-zinc-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 truncate">{category}</span>
                  </div>
                  <div className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                    {formatCurrency(amount)}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#1baa56]">
                    {percentage}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mt-8">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-12 w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm transition-all focus:ring-2 focus:ring-[#1baa56]/20 focus:border-[#1baa56] placeholder:text-zinc-400 rounded-2xl"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-[200px]">
            <Select
              value={categoryFilter}
              onValueChange={handleCategoryFilterChange}
            >
              <SelectTrigger className="w-full h-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm transition-all focus:ring-2 focus:ring-[#1baa56]/20 focus:border-[#1baa56] rounded-2xl text-xs font-bold uppercase tracking-wide">
                <SelectValue placeholder="CATEGORY" />
              </SelectTrigger>
              <SelectContent className="bg-white border-zinc-100 shadow-xl rounded-2xl p-1">
                <SelectItem value="all" className="focus:bg-zinc-50 cursor-pointer rounded-xl font-bold text-xs uppercase tracking-wide py-3">All Categories</SelectItem>
                <SelectItem value={ExpenseCategory.MAINTENANCE} className="text-orange-600 focus:bg-orange-50 cursor-pointer rounded-xl font-bold text-xs uppercase tracking-wide py-3">Maintenance</SelectItem>
                <SelectItem value={ExpenseCategory.UTILITIES} className="text-blue-600 focus:bg-blue-50 cursor-pointer rounded-xl font-bold text-xs uppercase tracking-wide py-3">Utilities</SelectItem>
                <SelectItem value={ExpenseCategory.TRASH_FEE} className="text-green-600 focus:bg-green-50 cursor-pointer rounded-xl font-bold text-xs uppercase tracking-wide py-3">Trash Fee</SelectItem>
                <SelectItem value={ExpenseCategory.SUPPLIES} className="text-purple-600 focus:bg-purple-50 cursor-pointer rounded-xl font-bold text-xs uppercase tracking-wide py-3">Supplies</SelectItem>
                <SelectItem value={ExpenseCategory.OTHER} className="text-zinc-600 focus:bg-zinc-50 cursor-pointer rounded-xl font-bold text-xs uppercase tracking-wide py-3">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={handleDateRangeChange}
            onClear={handleClearDateRange}
          />
        </div>
      </div>

      {/* Expenses List */}
      <div className="mt-8">
        {isLoading ? (
          <div className="grid gap-4">
             {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 w-full bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-3xl" />
             ))}
          </div>
        ) : paginatedExpenses.length === 0 ? (
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800">
             <DollarSign className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
             <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">
               No expenses found
             </h3>
             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300 mt-2 px-1">
                {searchQuery || categoryFilter !== "all" || startDate || endDate
                  ? "Adjust filters to see more results"
                  : "Add an expense to get started"}
             </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {paginatedExpenses.map((expense: Expense) => {
              const Icon = categoryIcons[expense.category];
              return (
                <div
                  key={expense.id}
                  className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/50 transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                  onClick={() => router.push(`/expenses/${expense.id}`)}
                >
                  <div className="flex items-center gap-5">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${categoryColors[expense.category].replace('bg-', 'border-').replace('text-', 'text-')}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <h3 className="font-black text-lg text-zinc-900 dark:text-zinc-100 truncate mb-1">
                          {expense.description}
                       </h3>
                       <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <p className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${categoryColors[expense.category]}`}>
                             {expense.category}
                          </p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                             <Calendar className="h-3 w-3" />
                             {expense.date ? format(new Date(expense.date), "dd MMM yyyy") : "N/A"}
                          </p>
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 ml-1 sm:ml-0">
                    <div className="text-right sm:min-w-[150px]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Amount</p>
                      <p className="font-black text-xl text-[#1baa56]">
                        {formatCurrency(expense.amount)}
                      </p>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full hover:bg-zinc-50 shrink-0">
                      <Eye className="h-4 w-4 text-zinc-400" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
