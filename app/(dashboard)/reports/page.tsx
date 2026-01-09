"use client";

import { useState, useMemo, useEffect } from "react";
import { useFinancialReport } from "@/lib/hooks/useReports";
import { useAuthStore } from "@/lib/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";

// Dynamically import heavy chart components for code splitting
const LineChart = dynamic(
  () =>
    import("@/components/charts/LineChart").then((mod) => ({
      default: mod.LineChart,
    })),
  {
    loading: () => <CardSkeleton />,
    ssr: false,
  }
);

const PieChart = dynamic(
  () =>
    import("@/components/charts/PieChart").then((mod) => ({
      default: mod.PieChart,
    })),
  {
    loading: () => <CardSkeleton />,
    ssr: false,
  }
);
import { StatCardSkeleton, CardSkeleton } from "@/components/ui/card-skeleton";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { toast } from "sonner";

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Category display names
const categoryNames: Record<string, string> = {
  MAINTENANCE: "Maintenance",
  UTILITIES: "Utilities",
  TRASH_FEE: "Trash Fee",
  SUPPLIES: "Supplies",
  OTHER: "Other",
};

// Category colors for pie chart
const categoryColors = [
  "#f97316", // orange - MAINTENANCE
  "#3b82f6", // blue - UTILITIES
  "#10b981", // green - TRASH_FEE
  "#8b5cf6", // purple - SUPPLIES
  "#6b7280", // gray - OTHER
];

export default function ReportsPage() {
  const user = useAuthStore((state) => state.user);

  // Default to current month
  const [startDate, setStartDate] = useState(
    format(startOfMonth(new Date()), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(
    format(endOfMonth(new Date()), "yyyy-MM-dd")
  );
  const [isExporting, setIsExporting] = useState(false);

  const {
    data: report,
    isLoading,
    error,
  } = useFinancialReport({ startDate, endDate });

  // Check if user is OWNER
  useEffect(() => {
    if (user && user.role !== "OWNER") {
      window.location.href = "/dashboard";
    }
  }, [user]);

  // Handle PDF export
  const handleExportPDF = async () => {
    if (!report) {
      toast.error("No report data to export");
      return;
    }

    setIsExporting(true);
    try {
      // Dynamically import PDF export function
      const { generatePDFReport } = await import("@/lib/utils/pdfExport");
      await generatePDFReport(report, startDate, endDate);
      toast.success("Report exported successfully");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export report");
    } finally {
      setIsExporting(false);
    }
  };

  // Handle PDF export with charts
  const handleExportPDFWithCharts = async () => {
    if (!report) {
      toast.error("No report data to export");
      return;
    }

    setIsExporting(true);
    try {
      // Dynamically import PDF export function
      const { generatePDFReportWithCharts } =
        await import("@/lib/utils/pdfExport");
      await generatePDFReportWithCharts(
        "report-content",
        report,
        startDate,
        endDate
      );
      toast.success("Report with charts exported successfully");
    } catch (error) {
      console.error("Error exporting PDF with charts:", error);
      toast.error("Failed to export report with charts");
    } finally {
      setIsExporting(false);
    }
  };

  // Prepare revenue trend data (mock monthly data for demonstration)
  const revenueTrendData = useMemo(() => {
    if (!report) return [];

    // For now, create a simple data point for the selected period
    // In a real scenario, you'd want to fetch monthly breakdown from API
    return [
      {
        month: format(new Date(startDate), "MMM yyyy"),
        rent: report.rentRevenue,
        laundry: report.laundryRevenue,
        total: report.totalRevenue,
      },
    ];
  }, [report, startDate]);

  // Prepare expense breakdown data for pie chart
  const expenseBreakdownData = useMemo(() => {
    if (!report || !report.expensesByCategory) return [];

    return Object.entries(report.expensesByCategory)
      .filter(([, value]) => value > 0)
      .map(([key, value]) => ({
        name: categoryNames[key] || key,
        value: value,
      }));
  }, [report]);

  // Calculate profit margin
  const profitMargin = useMemo(() => {
    if (!report || report.totalRevenue === 0) return 0;
    return (report.netProfit / report.totalRevenue) * 100;
  }, [report]);

  // Quick date range presets
  const setDateRange = (preset: string) => {
    const now = new Date();
    switch (preset) {
      case "this-month":
        setStartDate(format(startOfMonth(now), "yyyy-MM-dd"));
        setEndDate(format(endOfMonth(now), "yyyy-MM-dd"));
        break;
      case "last-month":
        const lastMonth = subMonths(now, 1);
        setStartDate(format(startOfMonth(lastMonth), "yyyy-MM-dd"));
        setEndDate(format(endOfMonth(lastMonth), "yyyy-MM-dd"));
        break;
      case "last-3-months":
        setStartDate(format(subMonths(now, 3), "yyyy-MM-dd"));
        setEndDate(format(now, "yyyy-MM-dd"));
        break;
      case "last-6-months":
        setStartDate(format(subMonths(now, 6), "yyyy-MM-dd"));
        setEndDate(format(now, "yyyy-MM-dd"));
        break;
    }
  };

  if (user?.role !== "OWNER") {
    return (
      <div className="p-3 sm:p-4 md:p-6">
        <Card className="p-6 sm:p-8 md:p-12">
          <div className="text-center space-y-3 sm:space-y-4">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-destructive">
              Access Denied
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
              You do not have permission to view this page. Only OWNER can
              access financial reports.
            </p>
            <Link href="/dashboard">
              <Button className="w-full sm:w-auto text-xs sm:text-sm h-9">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 sm:p-4 md:p-6">
        <Card className="p-3 sm:p-4 md:p-6">
          <p className="text-xs sm:text-sm md:text-base text-destructive">
            Error loading report: {error.message}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            Financial Reports
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
            Comprehensive financial analysis and insights
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            size="sm"
            variant="outline"
            className="w-full sm:w-auto text-xs sm:text-sm h-9"
            onClick={handleExportPDF}
            disabled={!report || isExporting}
          >
            <FileText className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {isExporting ? "Exporting..." : "Export (Text)"}
          </Button>
          <Button
            size="sm"
            className="w-full sm:w-auto text-xs sm:text-sm h-9"
            onClick={handleExportPDFWithCharts}
            disabled={!report || isExporting}
          >
            <Download className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {isExporting ? "Exporting..." : "Export (With Charts)"}
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDateRange("this-month")}
              className="w-full text-xs h-9"
            >
              This Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDateRange("last-month")}
              className="w-full text-xs h-9"
            >
              Last Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDateRange("last-3-months")}
              className="w-full text-xs h-9"
            >
              Last 3 Months
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDateRange("last-6-months")}
              className="w-full text-xs h-9"
            >
              Last 6 Months
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-9 text-sm bg-white border-zinc-200"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-9 text-sm bg-white border-zinc-200"
              />
            </div>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <StatCardSkeleton count={4} />
          </div>
          <CardSkeleton contentLines={8} className="h-96" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <CardSkeleton contentLines={6} className="h-80" />
            <CardSkeleton contentLines={6} className="h-80" />
          </div>
        </>
      ) : !report ? (
        <Card className="p-6 sm:p-8 md:p-12">
          <div className="text-center space-y-3 sm:space-y-4">
            <Receipt className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold">
                No data available
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
                Select a date range to view financial report
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div id="report-content">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {/* Total Revenue */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 wrap-break-word">
                  {formatCurrency(report.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {report.breakdown?.paidInvoices || 0} invoices +{" "}
                  {report.breakdown?.paidLaundryTransactions || 0} laundry
                </p>
              </CardContent>
            </Card>

            {/* Total Expenses */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Total Expenses
                </CardTitle>
                <Receipt className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-600 wrap-break-word">
                  {formatCurrency(report.totalExpenses)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {report.breakdown?.expenseRecords || 0} expense records
                </p>
              </CardContent>
            </Card>

            {/* Net Profit */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Net Profit
                </CardTitle>
                {report.netProfit >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div
                  className={`text-lg sm:text-xl md:text-2xl font-bold wrap-break-word ${
                    report.netProfit >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(report.netProfit)}
                </div>
                <div className="flex items-center gap-1 text-xs mt-1">
                  {report.netProfit >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600" />
                  )}
                  <span className="text-muted-foreground">
                    Revenue - Expenses
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Profit Margin */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Profit Margin
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-0">
                <div
                  className={`text-lg sm:text-xl md:text-2xl font-bold ${
                    profitMargin >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {profitMargin.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {profitMargin >= 0 ? "Profitable" : "Loss"} period
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trend */}
          <Card className="p-4 md:p-6">
            <h3 className="font-semibold mb-4 text-sm sm:text-base md:text-lg">
              Revenue Trend
            </h3>
            <div className="w-full overflow-x-auto">
              <LineChart
                data={revenueTrendData}
                xKey="month"
                lines={[
                  {
                    dataKey: "rent",
                    stroke: "#3b82f6",
                    name: "Rent",
                  },
                  {
                    dataKey: "laundry",
                    stroke: "#8b5cf6",
                    name: "Laundry",
                  },
                  {
                    dataKey: "total",
                    stroke: "#10b981",
                    name: "Total",
                  },
                ]}
                height={300}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Period: {format(new Date(startDate), "MMM dd, yyyy")} -{" "}
              {format(new Date(endDate), "MMM dd, yyyy")}
            </p>
          </Card>

          {/* Expense Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Expense Pie Chart */}
            <Card className="p-4 md:p-6">
              <h3 className="font-semibold mb-4 text-sm sm:text-base md:text-lg">
                Expense Categories
              </h3>
              {expenseBreakdownData.length > 0 ? (
                <div className="w-full overflow-x-auto">
                  <PieChart
                    data={expenseBreakdownData}
                    colors={categoryColors}
                    height={280}
                  />
                </div>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
                  No expense data available
                </div>
              )}
            </Card>

            {/* Expense Details */}
            <Card className="p-4 md:p-6">
              <h3 className="font-semibold mb-4 text-sm sm:text-base md:text-lg">
                Expense Details
              </h3>
              <div className="space-y-3">
                {report.expensesByCategory &&
                Object.keys(report.expensesByCategory).length > 0 ? (
                  Object.entries(report.expensesByCategory).map(
                    ([category, amount]) => {
                      const percentage =
                        report.totalExpenses > 0
                          ? ((amount / report.totalExpenses) * 100).toFixed(1)
                          : "0.0";
                      return (
                        <div
                          key={category}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <p className="font-medium text-sm md:text-base truncate">
                              {categoryNames[category] || category}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {percentage}% of total expenses
                            </p>
                          </div>
                          <span className="font-semibold text-sm md:text-base shrink-0">
                            {formatCurrency(amount)}
                          </span>
                        </div>
                      );
                    }
                  )
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No expense data available
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Summary */}
          <Card className="p-4 md:p-6">
            <h3 className="font-semibold mb-4 text-sm sm:text-base md:text-lg">
              Period Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Period</p>
                <p className="font-medium text-sm md:text-base">
                  {format(new Date(startDate), "MMM dd, yyyy")} -{" "}
                  {format(new Date(endDate), "MMM dd, yyyy")}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Total Transactions
                </p>
                <p className="font-medium text-sm md:text-base">
                  {(report.breakdown?.paidInvoices || 0) +
                    (report.breakdown?.paidLaundryTransactions || 0) +
                    (report.breakdown?.expenseRecords || 0)}{" "}
                  records
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Status</p>
                <p
                  className={`font-medium text-sm md:text-base ${
                    report.netProfit >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {report.netProfit >= 0 ? "Profitable" : "Loss"} Period
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
