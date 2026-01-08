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
      color: "bg-[#1baa56]/10 text-[#1baa56]",
    },
    {
      icon: AlertCircle,
      label: "Open Complaints",
      value: "3",
      subtext: "Need attention",
      color: "bg-[#1baa56]/10 text-[#1baa56]",
    },
    {
      icon: Shirt,
      label: "Laundry Orders",
      value: "7",
      subtext: "In progress",
      color: "bg-[#1baa56]/10 text-[#1baa56]",
    },
    {
      icon: ClipboardList,
      label: "Pending Tasks",
      value: "12",
      subtext: "Today's tasks",
      color: "bg-[#1baa56]/10 text-[#1baa56]",
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
      color: "bg-[#1baa56]",
    },
    {
      id: 2,
      title: "Record Electricity Meter",
      description: "Room 101, 102, 103 - Monthly reading",
      priority: "high",
      dueTime: "Today, 2:00 PM",
      icon: Zap,
      color: "bg-[#1baa56]",
    },
    {
      id: 3,
      title: "Process Laundry",
      description: "3 orders ready for pickup",
      priority: "medium",
      dueTime: "Today, 4:00 PM",
      icon: Shirt,
      color: "bg-[#1baa56]",
    },
    {
      id: 4,
      title: "Check Room 205",
      description: "AC maintenance scheduled",
      priority: "medium",
      dueTime: "Tomorrow, 10:00 AM",
      icon: Home,
      color: "bg-[#1baa56]",
    },
    {
      id: 5,
      title: "Update Invoice Status",
      description: "5 payments received today",
      priority: "low",
      dueTime: "Today, 5:00 PM",
      icon: CheckCircle,
      color: "bg-gray-500",
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
    },
    {
      label: "Add Laundry Order",
      icon: Shirt,
      href: "/dashboard/laundry/new",
    },
    {
      label: "Onboard Resident",
      icon: Users,
      href: "/dashboard/residents/new",
    },
    {
      label: "View Complaints",
      icon: AlertCircle,
      href: "/dashboard/complaints",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-[#1baa56]/10 text-orange-700 dark:bg-[#148041]/30 dark:text-[#1baa56]";
      case "medium":
        return "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400";
      case "low":
        return "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-[#1baa56]/10 text-orange-700 dark:bg-[#148041]/30 dark:text-[#1baa56]";
      case "IN_PROGRESS":
        return "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400";
      case "RESOLVED":
        return "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Staff Dashboard
        </h1>
        <p className="text-gray-500 dark:text-slate-400 text-lg mt-2">
          Manage daily operations and resident services
        </p>
      </div>

      {/* Operational Metrics Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-backwards">
        {operationalMetrics.map((metric, index) => {
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
          <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-backwards">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Pending Tasks
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {pendingTasks.map((task) => {
                  const Icon = task.icon;
                  return (
                    <div
                      key={task.id}
                      className="flex items-start gap-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                    >
                      <div
                        className={`rounded-2xl p-2 ${task.color} text-white`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                            {task.title}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={getPriorityColor(task.priority)}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          {task.description}
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
                          <Clock className="h-3 w-3" />
                          <span>{task.dueTime}</span>
                        </div>
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

          {/* Recent Complaints */}
          <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Recent Complaints
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
                {recentComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="flex items-start gap-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="rounded-2xl bg-[#1baa56]/10 dark:bg-[#148041]/30 p-2 text-[#1baa56] dark:text-[#1baa56]">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                          {complaint.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(complaint.status)}
                        >
                          {complaint.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        Room {complaint.room} - {complaint.resident}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                        {complaint.time}
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
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions & Info */}
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

          {/* Today's Summary */}
          <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards">
            <CardContent className="p-6">
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Today&apos;s Summary
              </h2>
              <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-3 lg:space-y-3 lg:grid-cols-1">
                <div className="flex items-center justify-between rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 cursor-pointer hover:shadow-md transition-all">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#1baa56] dark:text-[#1baa56]" />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      Completed Tasks
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-[#1baa56]/10 text-[#1baa56] dark:bg-[#148041]/30 dark:text-[#1baa56]"
                  >
                    8
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 cursor-pointer hover:shadow-md transition-all">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#1baa56] dark:text-[#1baa56]" />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      Pending Tasks
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-[#1baa56]/10 text-[#1baa56] dark:bg-[#148041]/30 dark:text-[#1baa56]"
                  >
                    12
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 cursor-pointer hover:shadow-md transition-all">
                  <div className="flex items-center gap-2">
                    <Shirt className="h-5 w-5 text-[#1baa56] dark:text-[#1baa56]" />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      Laundry Orders
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-[#1baa56]/10 text-[#1baa56] dark:bg-[#148041]/30 dark:text-[#1baa56]"
                  >
                    7
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 cursor-pointer hover:shadow-md transition-all">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-[#1baa56] dark:text-[#1baa56]" />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      New Complaints
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-[#1baa56]/10 text-[#1baa56] dark:bg-[#148041]/30 dark:text-[#1baa56]"
                  >
                    3
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Utility Readings Due */}
          <Card className="rounded-3xl border-gray-200 dark:border-slate-800 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 fill-mode-backwards">
            <CardContent className="p-6">
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Utility Readings Due
              </h2>
              <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-3 lg:space-y-3 lg:grid-cols-1">
                <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 p-4">
                  <div className="mb-2 flex items-center gap-2 text-[#1baa56] dark:text-[#1baa56]">
                    <Droplet className="h-5 w-5" />
                    <span className="font-bold text-sm">Water Meters</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">
                    6 rooms need reading
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-full border-[#1baa56]/20 dark:border-[#148041] text-[#1baa56] dark:text-[#1baa56] hover:bg-[#1baa56]/5 dark:hover:bg-[#148041]/30 cursor-pointer"
                  >
                    Record Now
                  </Button>
                </div>
                <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 p-4">
                  <div className="mb-2 flex items-center gap-2 text-[#1baa56] dark:text-[#1baa56]">
                    <Zap className="h-5 w-5" />
                    <span className="font-bold text-sm">
                      Electricity Meters
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">
                    6 rooms need reading
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-full border-[#1baa56]/20 dark:border-[#148041] text-[#1baa56] dark:text-[#1baa56] hover:bg-[#1baa56]/5 dark:hover:bg-[#148041]/30 cursor-pointer"
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

