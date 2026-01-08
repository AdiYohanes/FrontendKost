"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  Package,
  Truck,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useLaundryByResident } from "@/lib/hooks/useLaundry";
import { useAuthStore } from "@/lib/stores/authStore";
import { LaundryStatus, LaundryPaymentStatus, UserRole } from "@/lib/api/types";

export default function MyLaundryPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect if not a tenant
  useEffect(() => {
    if (user && user.role !== UserRole.PENGHUNI) {
      router.push("/laundry");
    }
  }, [user, router]);

  // Get resident ID from user
  // In a real app, you'd fetch this from an API endpoint
  // For now, we'll use user.id as placeholder
  const residentId = user?.role === UserRole.PENGHUNI ? user.id : null;

  // Fetch laundry transactions for the logged-in tenant
  const {
    data: laundryTransactions,
    isLoading,
    error,
  } = useLaundryByResident(residentId || "");

  // Filter transactions by search query
  const filteredTransactions = useMemo(() => {
    if (!laundryTransactions) return [];

    return laundryTransactions.filter((transaction) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        transaction.serviceType.toLowerCase().includes(searchLower) ||
        transaction.status.toLowerCase().includes(searchLower)
      );
    });
  }, [laundryTransactions, searchQuery]);

  // Get status badge variant
  const getStatusBadge = (status: LaundryStatus) => {
    const variants: Record<
      LaundryStatus,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
        icon: React.ReactNode;
      }
    > = {
      PENDING: {
        variant: "secondary",
        label: "Pending",
        icon: <Clock className="h-4 w-4" />,
      },
      ON_PROCESS: {
        variant: "default",
        label: "On Process",
        icon: <Package className="h-4 w-4" />,
      },
      READY_TO_PICKUP: {
        variant: "outline",
        label: "Ready to Pickup",
        icon: <Truck className="h-4 w-4" />,
      },
      COMPLETED: {
        variant: "default",
        label: "Completed",
        icon: <CheckCircle2 className="h-4 w-4" />,
      },
      CANCELLED: {
        variant: "destructive",
        label: "Cancelled",
        icon: <AlertCircle className="h-4 w-4" />,
      },
    };
    return variants[status];
  };

  // Get payment badge variant
  const getPaymentBadge = (paymentStatus: LaundryPaymentStatus) => {
    return paymentStatus === "PAID"
      ? { variant: "default" as const, label: "Paid", color: "bg-green-500" }
      : {
          variant: "destructive" as const,
          label: "Unpaid",
          color: "bg-red-500",
        };
  };

  // Get status tracking steps
  const getStatusSteps = (currentStatus: LaundryStatus) => {
    const steps = [
      {
        status: LaundryStatus.PENDING,
        label: "Order Placed",
        icon: <Clock className="h-5 w-5" />,
      },
      {
        status: LaundryStatus.ON_PROCESS,
        label: "Processing",
        icon: <Package className="h-5 w-5" />,
      },
      {
        status: LaundryStatus.READY_TO_PICKUP,
        label: "Ready",
        icon: <Truck className="h-5 w-5" />,
      },
      {
        status: LaundryStatus.COMPLETED,
        label: "Completed",
        icon: <CheckCircle2 className="h-5 w-5" />,
      },
    ];

    const currentIndex = steps.findIndex(
      (step) => step.status === currentStatus
    );

    return steps.map((step, index) => ({
      ...step,
      isActive: index <= currentIndex,
      isCurrent: index === currentIndex,
    }));
  };

  // Get payment instructions based on payment status
  const getPaymentInstructions = (paymentStatus: LaundryPaymentStatus) => {
    if (paymentStatus === "PAID") {
      return {
        title: "Payment Completed",
        description: "Your payment has been received. Thank you!",
        variant: "default" as const,
      };
    }

    return {
      title: "Payment Required",
      description:
        "Please complete the payment to proceed with your laundry service. Contact the staff for payment methods.",
      variant: "destructive" as const,
    };
  };

  if (!user || user.role !== UserRole.PENGHUNI) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/laundry">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">My Laundry</h1>
            <p className="text-muted-foreground">
              Track your laundry service transactions
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
          <CardDescription>Find your laundry transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by service type or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load your laundry transactions. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredTransactions.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No laundry transactions found
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Contact staff to create a new laundry transaction"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions List */}
      {!isLoading && !error && filteredTransactions.length > 0 && (
        <div className="space-y-6">
          {filteredTransactions.map((transaction) => {
            const statusBadge = getStatusBadge(transaction.status);
            const paymentBadge = getPaymentBadge(transaction.paymentStatus);
            const statusSteps = getStatusSteps(transaction.status);
            const paymentInstructions = getPaymentInstructions(
              transaction.paymentStatus
            );

            return (
              <Card key={transaction.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {statusBadge.icon}
                        {transaction.serviceType}
                      </CardTitle>
                      <CardDescription>
                        Order Date:{" "}
                        {format(
                          new Date(transaction.orderDate),
                          "dd MMM yyyy, HH:mm"
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={statusBadge.variant}>
                        {statusBadge.label}
                      </Badge>
                      <Badge variant={paymentBadge.variant}>
                        {paymentBadge.label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  {/* Transaction Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Weight</p>
                      <p className="text-lg font-semibold">
                        {transaction.weight} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-lg font-semibold">
                        Rp {transaction.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="text-lg font-semibold">
                        {statusBadge.label}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment</p>
                      <p className="text-lg font-semibold">
                        {paymentBadge.label}
                      </p>
                    </div>
                  </div>

                  {/* Status Tracking Timeline */}
                  <div>
                    <h3 className="text-sm font-semibold mb-4">
                      Status Tracking
                    </h3>
                    <div className="relative">
                      {/* Progress Line */}
                      <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{
                            width: `${(statusSteps.filter((s) => s.isActive).length - 1) * (100 / (statusSteps.length - 1))}%`,
                          }}
                        />
                      </div>

                      {/* Status Steps */}
                      <div className="relative flex justify-between">
                        {statusSteps.map((step, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center gap-2 z-10"
                          >
                            <div
                              className={`
                                w-10 h-10 rounded-full flex items-center justify-center
                                transition-all duration-300
                                ${
                                  step.isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                }
                                ${step.isCurrent ? "ring-4 ring-primary/20 scale-110" : ""}
                              `}
                            >
                              {step.icon}
                            </div>
                            <p
                              className={`
                                text-xs font-medium text-center max-w-[80px]
                                ${step.isActive ? "text-foreground" : "text-muted-foreground"}
                              `}
                            >
                              {step.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Payment Instructions */}
                  <Alert variant={paymentInstructions.variant}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{paymentInstructions.title}</AlertTitle>
                    <AlertDescription>
                      {paymentInstructions.description}
                    </AlertDescription>
                  </Alert>

                  {/* Completion Date */}
                  {transaction.completedDate && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Completed on:{" "}
                        {format(
                          new Date(transaction.completedDate),
                          "dd MMM yyyy, HH:mm"
                        )}
                      </p>
                    </div>
                  )}

                  {/* View Details Button */}
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/laundry/${transaction.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {!isLoading && !error && filteredTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Transactions
                </p>
                <p className="text-2xl font-bold">
                  {filteredTransactions.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {
                    filteredTransactions.filter(
                      (t) => t.status === LaundryStatus.PENDING
                    ).length
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">
                  {
                    filteredTransactions.filter(
                      (t) =>
                        t.status === LaundryStatus.ON_PROCESS ||
                        t.status === LaundryStatus.READY_TO_PICKUP
                    ).length
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">
                  {
                    filteredTransactions.filter(
                      (t) => t.status === LaundryStatus.COMPLETED
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
