"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Building2,
  Users,
  Wallet,
  TrendingUp,
  ArrowRight,
  MoreVertical,
  Home,
  Droplet,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Sample data - will be replaced with real API data
  const stats = [
    { label: "Total Rooms", value: "24", color: "bg-blue-500" },
    { label: "Occupied", value: "18", color: "bg-green-500" },
    { label: "Available", value: "6", color: "bg-purple-500" },
  ];

  const quickStats = [
    {
      icon: Building2,
      label: "Rooms",
      value: "24",
      subtext: "18 occupied",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Users,
      label: "Residents",
      value: "18",
      subtext: "Active tenants",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Wallet,
      label: "Revenue",
      value: "45M",
      subtext: "This month",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "New Resident Check-in",
      description: "John Doe moved into Room 101",
      time: "2 hours ago",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Payment Received",
      description: "Invoice #INV-2024-001 paid",
      time: "5 hours ago",
      icon: Wallet,
      color: "bg-green-500",
    },
    {
      id: 3,
      title: "Maintenance Request",
      description: "AC repair needed in Room 205",
      time: "1 day ago",
      icon: Home,
      color: "bg-orange-500",
    },
  ];

  const utilityUsage = [
    { month: "1-10 Jan", water: 45, electricity: 60 },
    { month: "11-20 Jan", water: 65, electricity: 75 },
    { month: "21-31 Jan", water: 85, electricity: 90 },
  ];

  const recentPayments = [
    {
      name: "John Doe",
      room: "101",
      amount: "Rp 2,500,000",
      status: "Paid",
      date: "2/6/2024",
    },
    {
      name: "Jane Smith",
      room: "102",
      amount: "Rp 2,800,000",
      status: "Pending",
      date: "2/6/2024",
    },
    {
      name: "Bob Wilson",
      room: "103",
      amount: "Rp 2,500,000",
      status: "Paid",
      date: "1/6/2024",
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Section with Gradient */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2 text-white">
              <p className="text-sm font-medium opacity-90">KOST MANAGEMENT</p>
              <h1 className="text-3xl font-bold">
                Manage Your Boarding House
                <br />
                with Professional System
              </h1>
              <Button
                className="mt-4 bg-white text-purple-600 hover:bg-gray-100"
                size="lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="hidden lg:block">
              <div className="h-32 w-32 rounded-full bg-white/20 backdrop-blur-sm" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.subtext}
                    </p>
                  </div>
                  <div className={`rounded-lg p-3 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 w-full justify-start text-xs"
                >
                  View Details
                  <MoreVertical className="ml-auto h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recent Activities */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Activities</h2>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <Card
                      key={activity.id}
                      className="relative overflow-hidden"
                    >
                      <CardContent className="p-4">
                        <div
                          className={`mb-3 inline-flex rounded-lg p-2 ${activity.color} text-white`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="mb-1 font-semibold text-sm">
                          {activity.title}
                        </h3>
                        <p className="mb-2 text-xs text-muted-foreground line-clamp-2">
                          {activity.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {activity.time}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                          >
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Payments Table */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Payments</h2>
                <Button variant="link" size="sm">
                  See all
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">RESIDENT</th>
                      <th className="pb-3 font-medium">ROOM</th>
                      <th className="pb-3 font-medium">AMOUNT</th>
                      <th className="pb-3 font-medium">STATUS</th>
                      <th className="pb-3 font-medium">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.map((payment, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                {payment.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {payment.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {payment.date}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge variant="outline" className="font-mono">
                            {payment.room}
                          </Badge>
                        </td>
                        <td className="py-4 text-sm font-medium">
                          {payment.amount}
                        </td>
                        <td className="py-4">
                          <Badge
                            variant={
                              payment.status === "Paid"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              payment.status === "Paid"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : ""
                            }
                          >
                            {payment.status}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* User Stats Card */}
          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Statistics</h2>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              {/* User Avatar */}
              <div className="mb-6 flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-2xl text-white">
                      {user?.name?.charAt(0) ||
                        user?.username?.charAt(0) ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-bold">
                  {getGreeting()} {user?.name || user?.username}! 🔥
                </h3>
                <p className="text-center text-sm text-muted-foreground">
                  Everything looks good today, keep it up!
                </p>
              </div>

              {/* Chart Placeholder */}
              <div className="mb-4">
                <div className="flex h-32 items-end justify-around gap-2">
                  {utilityUsage.map((data, index) => (
                    <div key={index} className="flex flex-1 flex-col gap-1">
                      <div
                        className="w-full rounded-t-lg bg-purple-500"
                        style={{ height: `${data.water}%` }}
                      />
                      <div
                        className="w-full rounded-t-lg bg-indigo-500"
                        style={{ height: `${data.electricity}%` }}
                      />
                      <span className="mt-1 text-center text-xs text-muted-foreground">
                        {data.month}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <span>Water</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                    <span>Electricity</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Quick Overview</h2>
              <div className="space-y-3">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${stat.color}`} />
                      <span className="text-sm font-medium">{stat.label}</span>
                    </div>
                    <span className="text-lg font-bold">{stat.value}</span>
                  </div>
                ))}
              </div>
              <Button className="mt-4 w-full" variant="outline">
                See All Details
              </Button>
            </CardContent>
          </Card>

          {/* Utility Monitor */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Utility Monitor</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <Droplet className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Water Usage</p>
                    <p className="text-xs text-muted-foreground">
                      1,250 m³ this month
                    </p>
                  </div>
                  <Badge variant="secondary">Normal</Badge>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="rounded-lg bg-yellow-100 p-2 text-yellow-600">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Electricity</p>
                    <p className="text-xs text-muted-foreground">
                      3,450 kWh this month
                    </p>
                  </div>
                  <Badge variant="secondary">Normal</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
