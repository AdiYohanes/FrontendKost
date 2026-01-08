"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Home,
  Wallet,
  Droplet,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
  FileText,
  Shirt,
  Plus,
} from "lucide-react";

export function TenantDashboard() {
  // Sample data - will be replaced with real API data
  const personalInfo = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+62 812-3456-7890",
    roomNumber: "101",
    entryDate: "2024-01-15",
    billingCycleDate: 15,
  };

  const paymentStatus = {
    currentMonth: {
      invoiceNumber: "INV-2024-002",
      amount: "Rp 2,500,000",
      dueDate: "2024-02-15",
      status: "UNPAID",
      breakdown: {
        rent: "Rp 2,000,000",
        water: "Rp 150,000",
        electricity: "Rp 350,000",
      },
    },
    lastPayment: {
      date: "2024-01-15",
      amount: "Rp 2,500,000",
      status: "PAID",
    },
  };

  const utilityUsage = {
    water: {
      previousMeter: 1250,
      currentMeter: 1280,
      usage: 30,
      cost: "Rp 150,000",
      readingDate: "2024-02-01",
    },
    electricity: {
      previousMeter: 3450,
      currentMeter: 3520,
      usage: 70,
      cost: "Rp 350,000",
      readingDate: "2024-02-01",
    },
  };

  const complaints = [
    {
      id: 1,
      title: "AC Not Working",
      description: "Air conditioner stopped cooling",
      status: "IN_PROGRESS",
      createdAt: "2024-02-05",
      resolvedAt: null,
    },
    {
      id: 2,
      title: "Light Bulb Replacement",
      description: "Bathroom light bulb needs replacement",
      status: "RESOLVED",
      createdAt: "2024-01-28",
      resolvedAt: "2024-01-29",
    },
  ];

  const laundryOrders = [
    {
      id: 1,
      serviceType: "Wash & Iron",
      weight: 5,
      price: "Rp 50,000",
      status: "READY_TO_PICKUP",
      createdAt: "2024-02-05",
    },
    {
      id: 2,
      serviceType: "Wash Only",
      weight: 3,
      price: "Rp 30,000",
      status: "ON_PROCESS",
      createdAt: "2024-02-06",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";
      case "UNPAID":
        return "bg-red-100 text-red-700";
      case "PARTIAL":
        return "bg-yellow-100 text-yellow-700";
      case "OPEN":
        return "bg-red-100 text-red-700";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-700";
      case "RESOLVED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-gray-100 text-gray-700";
      case "ON_PROCESS":
        return "bg-blue-100 text-blue-700";
      case "READY_TO_PICKUP":
        return "bg-green-100 text-green-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue(paymentStatus.currentMonth.dueDate);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tenant Dashboard</h1>
        <p className="text-muted-foreground">
          Your personal information and services
        </p>
      </div>

      {/* Payment Alert */}
      {paymentStatus.currentMonth.status === "UNPAID" && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-red-100 p-2 text-red-600">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold">Payment Due</h3>
                <p className="text-sm text-muted-foreground">
                  Your invoice for {paymentStatus.currentMonth.amount} is due in{" "}
                  {daysUntilDue} days ({paymentStatus.currentMonth.dueDate})
                </p>
                <Button className="mt-3 bg-red-600 hover:bg-red-700" size="sm">
                  View Invoice
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Personal Information */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Personal Information</h2>
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
              </div>

              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-500 text-2xl text-white">
                    {personalInfo.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Full Name
                        </p>
                        <p className="font-medium">{personalInfo.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-green-100 p-2 text-green-600">
                        <Home className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Room Number
                        </p>
                        <p className="font-medium">{personalInfo.roomNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium">{personalInfo.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-[#1baa56]/10 p-2 text-[#1baa56]">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium">{personalInfo.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-pink-100 p-2 text-pink-600">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Entry Date
                        </p>
                        <p className="font-medium">{personalInfo.entryDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Billing Date
                        </p>
                        <p className="font-medium">
                          Day {personalInfo.billingCycleDate} of month
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Status */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Payment Status</h2>
                <Button variant="link" size="sm">
                  View All Invoices
                </Button>
              </div>

              {/* Current Invoice */}
              <div className="mb-4 rounded-lg border-2 border-red-200 bg-red-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Current Invoice
                    </p>
                    <p className="font-mono text-sm font-medium">
                      {paymentStatus.currentMonth.invoiceNumber}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(
                      paymentStatus.currentMonth.status
                    )}
                  >
                    {paymentStatus.currentMonth.status}
                  </Badge>
                </div>

                <div className="mb-3 space-y-2 rounded-lg bg-white p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rent</span>
                    <span className="font-medium">
                      {paymentStatus.currentMonth.breakdown.rent}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Water</span>
                    <span className="font-medium">
                      {paymentStatus.currentMonth.breakdown.water}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Electricity</span>
                    <span className="font-medium">
                      {paymentStatus.currentMonth.breakdown.electricity}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-lg">
                        {paymentStatus.currentMonth.amount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-3 flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-red-600" />
                  <span className="text-muted-foreground">
                    Due date: {paymentStatus.currentMonth.dueDate} (
                    {daysUntilDue} days remaining)
                  </span>
                </div>

                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Wallet className="mr-2 h-4 w-4" />
                  Pay Now
                </Button>
              </div>

              {/* Last Payment */}
              <div className="rounded-lg border bg-green-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Last Payment
                    </p>
                    <p className="font-semibold">
                      {paymentStatus.lastPayment.amount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {paymentStatus.lastPayment.date}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Utility Usage */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Utility Usage</h2>
                <Button variant="link" size="sm">
                  View History
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Water Usage */}
                <div className="rounded-lg border bg-blue-50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                      <Droplet className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Water Usage</p>
                      <p className="text-xs text-muted-foreground">
                        Reading: {utilityUsage.water.readingDate}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Previous Meter
                      </span>
                      <span className="font-medium">
                        {utilityUsage.water.previousMeter} m³
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Current Meter
                      </span>
                      <span className="font-medium">
                        {utilityUsage.water.currentMeter} m³
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">Usage</span>
                        <span className="font-bold text-blue-600">
                          {utilityUsage.water.usage} m³
                        </span>
                      </div>
                      <div className="mt-1 flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Cost
                        </span>
                        <span className="font-semibold">
                          {utilityUsage.water.cost}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Electricity Usage */}
                <div className="rounded-lg border bg-yellow-50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="rounded-lg bg-yellow-100 p-2 text-yellow-600">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Electricity Usage</p>
                      <p className="text-xs text-muted-foreground">
                        Reading: {utilityUsage.electricity.readingDate}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Previous Meter
                      </span>
                      <span className="font-medium">
                        {utilityUsage.electricity.previousMeter} kWh
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Current Meter
                      </span>
                      <span className="font-medium">
                        {utilityUsage.electricity.currentMeter} kWh
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">Usage</span>
                        <span className="font-bold text-yellow-600">
                          {utilityUsage.electricity.usage} kWh
                        </span>
                      </div>
                      <div className="mt-1 flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Cost
                        </span>
                        <span className="font-semibold">
                          {utilityUsage.electricity.cost}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Complaints & Services */}
        <div className="space-y-6">
          {/* Complaint Status */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">My Complaints</h2>
                <Button variant="outline" size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  New
                </Button>
              </div>

              <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-3 lg:space-y-3 lg:grid-cols-1">
                {complaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="mb-2 flex items-center justify-between">
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
                    <p className="mb-2 text-xs text-muted-foreground">
                      {complaint.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Created: {complaint.createdAt}</span>
                      {complaint.resolvedAt && (
                        <span className="text-green-600">
                          Resolved: {complaint.resolvedAt}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="link" size="sm" className="mt-3 w-full">
                View All Complaints
              </Button>
            </CardContent>
          </Card>

          {/* Laundry Orders */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Laundry Orders</h2>
                <Button variant="outline" size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  New
                </Button>
              </div>

              <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-3 lg:space-y-3 lg:grid-cols-1">
                {laundryOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shirt className="h-4 w-4 text-purple-600" />
                        <h3 className="font-semibold text-sm">
                          {order.serviceType}
                        </h3>
                      </div>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(order.status)}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {order.weight} kg
                      </span>
                      <span className="font-semibold">{order.price}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {order.createdAt}
                    </p>
                  </div>
                ))}
              </div>

              <Button variant="link" size="sm" className="mt-3 w-full">
                View All Orders
              </Button>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Quick Links</h2>
              <div className="space-y-2 md:space-y-0 md:grid md:grid-cols-2 md:gap-3 lg:space-y-2 lg:grid-cols-1">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a href="/dashboard/invoices">
                    <FileText className="mr-2 h-4 w-4" />
                    View All Invoices
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a href="/dashboard/utilities">
                    <Droplet className="mr-2 h-4 w-4" />
                    Utility History
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a href="/dashboard/complaints">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    My Complaints
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a href="/dashboard/laundry">
                    <Shirt className="mr-2 h-4 w-4" />
                    Laundry Orders
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
