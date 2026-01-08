"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  Wallet,
  TrendingUp,
  ArrowRight,
  Home,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

export function OwnerDashboard() {
  // Sample data - will be replaced with real API data
  const keyMetrics = [
    {
      icon: Building2,
      label: "Total Rooms",
      value: "24",
      subtext: "18 occupied, 6 available",
      color: "bg-[#1baa56]/10 text-[#1baa56]",
      trend: "+2 this month",
      trendUp: true,
    },
    {
      icon: Users,
      label: "Active Residents",
      value: "18",
      subtext: "75% occupancy rate",
      color: "bg-[#1baa56]/10 text-[#1baa56]",
      trend: "+3 this month",
      trendUp: true,
    },
    {
      icon: Wallet,
      label: "Monthly Revenue",
      value: "Rp 45M",
      subtext: "From rent & services",
      color: "bg-[#1baa56]/10 text-[#1baa56]",
      trend: "+12% vs last month",
      trendUp: true,
    },
    {
      icon: TrendingUp,
      label: "Net Profit",
      value: "Rp 32M",
      subtext: "After expenses",
      color: "bg-[#1baa56]/10 text-[#1baa56]",
      trend: "+8% vs last month",
      trendUp: true,
    },
  ];

  const occupancyOverview = {
    total: 24,
    occupied: 18,
    available: 6,
    maintenance: 0,
    occupancyRate: 75,
  };

  const recentActivities = [
    {
      id: 1,
      type: "check-in",
      title: "New Resident Check-in",
      description: "John Doe moved into Room 101",
      time: "2 hours ago",
      icon: Users,
      color: "bg-[#1baa56]",
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Received",
      description: "Invoice #INV-2024-001 - Rp 2,500,000",
      time: "5 hours ago",
      icon: DollarSign,
      color: "bg-[#1baa56]",
    },
    {
      id: 3,
      type: "complaint",
      title: "New Complaint",
      description: "AC repair needed in Room 205",
      time: "1 day ago",
      icon: AlertCircle,
      color: "bg-[#1baa56]",
    },
    {
      id: 4,
      type: "expense",
      title: "Expense Added",
      description: "Maintenance supplies - Rp 500,000",
      time: "1 day ago",
      icon: Wallet,
      color: "bg-[#1baa56]",
    },
    {
      id: 5,
      type: "check-out",
      title: "Resident Check-out",
      description: "Jane Smith moved out from Room 203",
      time: "2 days ago",
      icon: Users,
      color: "bg-gray-500",
    },
  ];

  const quickActions = [
    {
      label: "Add Room",
      icon: Building2,
      href: "/dashboard/rooms/new",
    },
    {
      label: "Onboard Resident",
      icon: Users,
      href: "/dashboard/residents/new",
    },
    {
      label: "Generate Invoice",
      icon: Wallet,
      href: "/dashboard/invoices",
    },
    {
      label: "Add Expense",
      icon: DollarSign,
      href: "/dashboard/expenses/new",
    },
  ];

  return (
    <div className="space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Owner Dashboard
        </h1>
        <p className="text-gray-500 dark:text-slate-400 text-lg mt-2">
          Complete overview of your boarding house operations
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-backwards">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card
              key={index}
              className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`rounded-2xl p-3 ${metric.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    {metric.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {metric.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {metric.subtext}
                  </p>
                  <div className="flex items-center gap-1 text-xs pt-2">
                    <TrendingUp
                      className={`h-3 w-3 ${metric.trendUp ? "text-[#1baa56]" : "text-red-600"}`}
                    />
                    <span
                      className={
                        metric.trendUp
                          ? "text-[#1baa56] font-medium"
                          : "text-red-600 font-medium"
                      }
                    >
                      {metric.trend}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Occupancy Overview */}
          <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-backwards">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Occupancy Overview
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  View All Rooms
                </Button>
              </div>

              {/* Occupancy Stats */}
              <div className="mb-6 grid gap-4 grid-cols-2 md:grid-cols-4">
                <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                    <Home className="h-4 w-4" />
                    <span>Total</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {occupancyOverview.total}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#1baa56]/20 dark:border-[#148041] bg-[#1baa56]/5 dark:bg-[#148041]/30 p-4">
                  <div className="flex items-center gap-2 text-sm text-[#1baa56] dark:text-[#1baa56]">
                    <CheckCircle className="h-4 w-4" />
                    <span>Occupied</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[#1baa56] dark:text-[#1baa56]">
                    {occupancyOverview.occupied}
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>Available</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {occupancyOverview.available}
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                    <AlertCircle className="h-4 w-4" />
                    <span>Maintenance</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {occupancyOverview.maintenance}
                  </p>
                </div>
              </div>

              {/* Occupancy Rate Bar */}
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-slate-400">
                    Occupancy Rate
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {occupancyOverview.occupancyRate}%
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800">
                  <div
                    className="h-full bg-[#1baa56] transition-all duration-500 shadow-lg shadow-[#1baa56]/30"
                    style={{ width: `${occupancyOverview.occupancyRate}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Recent Activities
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-[#1baa56] cursor-pointer"
                >
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                    >
                      <div
                        className={`rounded-2xl p-2 ${activity.color} text-white`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          {activity.description}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                          {activity.time}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-[#1baa56]/5 dark:hover:bg-[#148041]/30 cursor-pointer"
                      >
                        <ArrowRight className="h-4 w-4 text-gray-500 dark:text-slate-400" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-backwards">
            <CardContent className="p-6">
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Quick Actions
              </h2>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      className="h-auto justify-start gap-3 rounded-full bg-[#1baa56] p-4 text-white shadow-lg shadow-[#1baa56]/30 hover:bg-[#1baa56] hover:shadow-[#1baa56]/50 hover:-translate-y-1 active:scale-95 transition-all duration-300 cursor-pointer"
                      asChild
                    >
                      <a href={action.href}>
                        <Icon className="h-5 w-5" />
                        <span className="font-bold">{action.label}</span>
                        <ArrowRight className="ml-auto h-4 w-4" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Financial Summary
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  View Report
                </Button>
              </div>
              <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4 lg:space-y-4 lg:grid-cols-1">
                <div className="flex items-center justify-between rounded-2xl bg-[#1baa56]/5 dark:bg-[#148041]/30 p-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Total Revenue
                    </p>
                    <p className="text-xl font-bold text-[#1baa56] dark:text-[#1baa56]">
                      Rp 45,000,000
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-[#1baa56] dark:text-[#1baa56]" />
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-gray-50 dark:bg-slate-900 p-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Total Expenses
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      Rp 13,000,000
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-gray-500 dark:text-slate-400" />
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[#1baa56]/5 dark:bg-[#148041]/30 p-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Net Profit
                    </p>
                    <p className="text-xl font-bold text-[#1baa56] dark:text-[#1baa56]">
                      Rp 32,000,000
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-[#1baa56] dark:text-[#1baa56]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 fill-mode-backwards">
            <CardContent className="p-6">
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Pending Tasks
              </h2>
              <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-3 lg:space-y-3 lg:grid-cols-1">
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 cursor-pointer hover:shadow-md transition-all">
                  <Clock className="h-5 w-5 text-[#1baa56]" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      Unpaid Invoices
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      5 invoices pending
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-[#1baa56]/10 text-[#1baa56] dark:bg-[#148041]/30 dark:text-[#1baa56]"
                  >
                    5
                  </Badge>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 cursor-pointer hover:shadow-md transition-all">
                  <AlertCircle className="h-5 w-5 text-[#1baa56]" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      Open Complaints
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      3 need attention
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-[#1baa56]/10 text-[#1baa56] dark:bg-[#148041]/30 dark:text-[#1baa56]"
                  >
                    3
                  </Badge>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 cursor-pointer hover:shadow-md transition-all">
                  <Home className="h-5 w-5 text-[#1baa56]" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      Maintenance
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      2 rooms in maintenance
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-[#1baa56]/10 text-[#1baa56] dark:bg-[#148041]/30 dark:text-[#1baa56]"
                  >
                    2
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
