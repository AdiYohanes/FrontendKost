"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Droplet,
  Zap,
  Shirt,
  ClipboardList,
  Home,
} from "lucide-react";

export function StaffDashboard() {
  // Sample data - will be replaced with real API data
  const operationalMetrics = [
    {
      icon: Users,
      label: "Active Residents",
      value: "18",
      subtext: "All residents",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: AlertCircle,
      label: "Open Complaints",
      value: "3",
      subtext: "Need attention",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Shirt,
      label: "Laundry Orders",
      value: "7",
      subtext: "In progress",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: ClipboardList,
      label: "Pending Tasks",
      value: "12",
      subtext: "Today's tasks",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const pendingTasks = [
    {
      id: 1,
      title: "Record Water Meter",
      description: "Room 101, 102, 103 - Monthly reading",
      priority: "high",
      dueTime: "Today, 2:00 PM",
      icon: Droplet,
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Record Electricity Meter",
      description: "Room 101, 102, 103 - Monthly reading",
      priority: "high",
      dueTime: "Today, 2:00 PM",
      icon: Zap,
      color: "bg-yellow-500",
    },
    {
      id: 3,
      title: "Process Laundry",
      description: "3 orders ready for pickup",
      priority: "medium",
      dueTime: "Today, 4:00 PM",
      icon: Shirt,
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "Check Room 205",
      description: "AC maintenance scheduled",
      priority: "medium",
      dueTime: "Tomorrow, 10:00 AM",
      icon: Home,
      color: "bg-orange-500",
    },
    {
      id: 5,
      title: "Update Invoice Status",
      description: "5 payments received today",
      priority: "low",
      dueTime: "Today, 5:00 PM",
      icon: CheckCircle,
      color: "bg-green-500",
    },
  ];

  const recentComplaints = [
    {
      id: 1,
      title: "AC Not Working",
      room: "205",
      resident: "John Doe",
      status: "OPEN",
      time: "2 hours ago",
      priority: "high",
    },
    {
      id: 2,
      title: "Water Leak",
      room: "103",
      resident: "Jane Smith",
      status: "IN_PROGRESS",
      time: "5 hours ago",
      priority: "high",
    },
    {
      id: 3,
      title: "Light Bulb Replacement",
      room: "201",
      resident: "Bob Wilson",
      status: "OPEN",
      time: "1 day ago",
      priority: "low",
    },
  ];

  const quickActions = [
    {
      label: "Record Utility",
      icon: Droplet,
      href: "/dashboard/utilities/new",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      label: "Add Laundry Order",
      icon: Shirt,
      href: "/dashboard/laundry/new",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      label: "Onboard Resident",
      icon: Users,
      href: "/dashboard/residents/new",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      label: "View Complaints",
      icon: AlertCircle,
      href: "/dashboard/complaints",
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-red-100 text-red-700";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-700";
      case "RESOLVED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Staff Dashboard</h1>
        <p className="text-muted-foreground">
          Manage daily operations and resident services
        </p>
      </div>

      {/* Operational Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {operationalMetrics.map((metric, index) => {
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
          {/* Pending Tasks */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Pending Tasks</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {pendingTasks.map((task) => {
                  const Icon = task.icon;
                  return (
                    <div
                      key={task.id}
                      className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div
                        className={`rounded-lg p-2 ${task.color} text-white`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <h3 className="font-semibold text-sm">
                            {task.title}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={getPriorityColor(task.priority)}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {task.description}
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{task.dueTime}</span>
                        </div>
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

          {/* Recent Complaints */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Complaints</h2>
                <Button variant="link" size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {recentComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="rounded-lg bg-red-100 p-2 text-red-600">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-semibold text-sm">
                          {complaint.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(complaint.status)}
                        >
                          {complaint.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Room {complaint.room} - {complaint.resident}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {complaint.time}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions & Info */}
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

          {/* Today&apos;s Summary */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">
                Today&apos;s Summary
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Completed Tasks</span>
                  </div>
                  <Badge variant="secondary">8</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium">Pending Tasks</span>
                  </div>
                  <Badge variant="secondary">12</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Shirt className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium">Laundry Orders</span>
                  </div>
                  <Badge variant="secondary">7</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium">New Complaints</span>
                  </div>
                  <Badge variant="secondary">3</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Utility Readings Due */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">
                Utility Readings Due
              </h2>
              <div className="space-y-3">
                <div className="rounded-lg border bg-blue-50 p-3">
                  <div className="mb-2 flex items-center gap-2 text-blue-600">
                    <Droplet className="h-5 w-5" />
                    <span className="font-medium text-sm">Water Meters</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    6 rooms need reading
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full border-blue-200 text-blue-600 hover:bg-blue-100"
                  >
                    Record Now
                  </Button>
                </div>
                <div className="rounded-lg border bg-yellow-50 p-3">
                  <div className="mb-2 flex items-center gap-2 text-yellow-600">
                    <Zap className="h-5 w-5" />
                    <span className="font-medium text-sm">
                      Electricity Meters
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    6 rooms need reading
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full border-yellow-200 text-yellow-600 hover:bg-yellow-100"
                  >
                    Record Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
