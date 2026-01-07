"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Users, FileText, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Sample metrics - will be replaced with real data later
  const metrics = [
    {
      title: "Total Rooms",
      value: "24",
      description: "18 occupied, 6 available",
      icon: Building2,
      trend: "+2 this month",
    },
    {
      title: "Active Residents",
      value: "18",
      description: "75% occupancy rate",
      icon: Users,
      trend: "+3 this month",
    },
    {
      title: "Pending Invoices",
      value: "5",
      description: "Total: Rp 12,500,000",
      icon: FileText,
      trend: "2 overdue",
    },
    {
      title: "Monthly Revenue",
      value: "Rp 45M",
      description: "January 2026",
      icon: TrendingUp,
      trend: "+12% from last month",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your boarding house today.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you can perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Quick action buttons will be added in future tasks
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Activity feed will be added in future tasks
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
