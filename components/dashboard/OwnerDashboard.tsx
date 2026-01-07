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
  Plus,
} from "lucide-react";

export function OwnerDashboard() {
  // Sample data - will be replaced with real API data
  const keyMetrics = [
    {
      icon: Building2,
      label: "Total Rooms",
      value: "24",
      subtext: "18 occupied, 6 available",
      color: "bg-blue-100 text-blue-600",
      trend: "+2 this month",
      trendUp: true,
    },
    {
      icon: Users,
      label: "Active Residents",
      value: "18",
      subtext: "75% occupancy rate",
      color: "bg-green-100 text-green-600",
      trend: "+3 this month",
      trendUp: true,
    },
    {
      icon: Wallet,
      label: "Monthly Revenue",
      value: "Rp 45M",
      subtext: "From rent & services",
      color: "bg-purple-100 text-purple-600",
      trend: "+12% vs last month",
      trendUp: true,
    },
    {
      icon: TrendingUp,
      label: "Net Profit",
      value: "Rp 32M",
      subtext: "After expenses",
      color: "bg-orange-100 text-orange-600",
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
      color: "bg-blue-500",
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Received",
      description: "Invoice #INV-2024-001 - Rp 2,500,000",
      time: "5 hours ago",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      id: 3,
      type: "complaint",
      title: "New Complaint",
      description: "AC repair needed in Room 205",
      time: "1 day ago",
      icon: AlertCircle,
      color: "bg-orange-500",
    },
    {
      id: 4,
      type: "expense",
      title: "Expense Added",
      description: "Maintenance supplies - Rp 500,000",
      time: "1 day ago",
      icon: Wallet,
      color: "bg-red-500",
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
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      label: "Onboard Resident",
      icon: Users,
      href: "/dashboard/residents/new",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      label: "Generate Invoice",
      icon: Wallet,
      href: "/dashboard/invoices",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      label: "Add Expense",
      icon: DollarSign,
      href: "/dashboard/expenses/new",
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Owner Dashboard</h1>
        <p className="text-muted-foreground">
          Complete overview of your boarding house operations
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {metric.subtext}
                    </p>
                    <div className="flex items-center gap-1 text-xs">
                      <TrendingUp
                        className={`h-3 w-3 ${metric.trendUp ? "text-green-600" : "text-red-600"}`}
                      />
                      <span
                        className={
                          metric.trendUp ? "text-green-600" : "text-red-600"
                        }
                      >
                        {metric.trend}
                      </span>
                    </div>
                  </div>
                  <div className={`rounded-lg p-3 ${metric.color}`}>
                    <Icon className="h-6 w-6" />
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
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Occupancy Overview</h2>
                <Button variant="outline" size="sm">
                  View All Rooms
                </Button>
              </div>

              {/* Occupancy Stats */}
              <div className="mb-6 grid gap-4 md:grid-cols-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Home className="h-4 w-4" />
                    <span>Total</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold">
                    {occupancyOverview.total}
                  </p>
                </div>
                <div className="rounded-lg border bg-blue-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Occupied</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-blue-600">
                    {occupancyOverview.occupied}
                  </p>
                </div>
                <div className="rounded-lg border bg-green-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Available</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-green-600">
                    {occupancyOverview.available}
                  </p>
                </div>
                <div className="rounded-lg border bg-yellow-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-yellow-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>Maintenance</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-yellow-600">
                    {occupancyOverview.maintenance}
                  </p>
                </div>
              </div>

              {/* Occupancy Rate Bar */}
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Occupancy Rate</span>
                  <span className="font-semibold">
                    {occupancyOverview.occupancyRate}%
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${occupancyOverview.occupancyRate}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Activities</h2>
                <Button variant="link" size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div
                        className={`rounded-lg p-2 ${activity.color} text-white`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowRight className="h-4 w-4" />
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
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
              <div className="grid gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      className={`h-auto justify-start gap-3 p-4 text-white ${action.color}`}
                      asChild
                    >
                      <a href={action.href}>
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{action.label}</span>
                        <ArrowRight className="ml-auto h-4 w-4" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Financial Summary</h2>
                <Button variant="outline" size="sm">
                  View Report
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Revenue
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      Rp 45,000,000
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Expenses
                    </p>
                    <p className="text-xl font-bold text-red-600">
                      Rp 13,000,000
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-red-600" />
                </div>
                <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Net Profit</p>
                    <p className="text-xl font-bold text-blue-600">
                      Rp 32,000,000
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Pending Tasks</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Unpaid Invoices</p>
                    <p className="text-xs text-muted-foreground">
                      5 invoices pending
                    </p>
                  </div>
                  <Badge variant="secondary">5</Badge>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Open Complaints</p>
                    <p className="text-xs text-muted-foreground">
                      3 need attention
                    </p>
                  </div>
                  <Badge variant="secondary">3</Badge>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Home className="h-5 w-5 text-yellow-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Maintenance</p>
                    <p className="text-xs text-muted-foreground">
                      2 rooms in maintenance
                    </p>
                  </div>
                  <Badge variant="secondary">2</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
