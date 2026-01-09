"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useExpenseById } from "@/lib/hooks/useExpenses";
import { useAuthStore } from "@/lib/stores/authStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  FileText,
  Tag,
  XCircle,
  Wrench,
  Zap,
  Trash2 as TrashIcon,
  Package,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { ExpenseCategory } from "@/lib/api/types";
import { toast } from "sonner";
import { format } from "date-fns";

// Category icons mapping
const categoryIcons = {
  [ExpenseCategory.MAINTENANCE]: Wrench,
  [ExpenseCategory.UTILITIES]: Zap,
  [ExpenseCategory.TRASH_FEE]: TrashIcon,
  [ExpenseCategory.SUPPLIES]: Package,
  [ExpenseCategory.OTHER]: MoreHorizontal,
};

// Category colors mapping
const categoryColors = {
  [ExpenseCategory.MAINTENANCE]:
    "bg-orange-100 text-orange-700 border-orange-200",
  [ExpenseCategory.UTILITIES]: "bg-blue-100 text-blue-700 border-blue-200",
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

export default function ExpenseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const expenseId = params.id as string;
  const { data: expense, isLoading, error } = useExpenseById(expenseId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Check if user is OWNER
  useEffect(() => {
    if (user && user.role !== "OWNER") {
      toast.error("Access denied. Only OWNER can view expense details.");
      router.push("/dashboard");
    }
  }, [user, router]);

  // Update document title with expense description
  useEffect(() => {
    if (expense) {
      document.title = `${expense.description} - Expense Details`;
    }
  }, [expense]);

  const handleDelete = async () => {
    // Note: Delete functionality would need to be implemented in the API service
    // For now, we'll just show a toast
    toast.info("Delete functionality will be implemented in the API");
    setShowDeleteDialog(false);
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
              access expense details.
            </p>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="text-sm text-muted-foreground">
            Loading expense details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
            <div>
              <h3 className="text-lg font-semibold mb-1">Expense Not Found</h3>
              <p className="text-sm text-muted-foreground">
                {error?.message ||
                  "The expense you're looking for doesn't exist"}
              </p>
            </div>
            <Link href="/expenses">
              <Button variant="outline" className="mt-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Expenses
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[expense.category];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link href="/expenses">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Expense Details</h1>
            <p className="text-sm text-muted-foreground">
              View complete expense information
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info("Edit functionality will be implemented")}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Amount & Category Card */}
      <Card
        className="border-l-4"
        style={{
          borderLeftColor:
            expense.category === ExpenseCategory.MAINTENANCE
              ? "#f97316"
              : expense.category === ExpenseCategory.UTILITIES
                ? "#3b82f6"
                : expense.category === ExpenseCategory.TRASH_FEE
                  ? "#22c55e"
                  : expense.category === ExpenseCategory.SUPPLIES
                    ? "#a855f7"
                    : "#6b7280",
        }}
      >
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`h-12 w-12 rounded-lg flex items-center justify-center ${categoryColors[expense.category]}`}
              >
                <CategoryIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Category</p>
                <Badge className={categoryColors[expense.category]}>
                  {expense.category}
                </Badge>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-muted-foreground mb-1">
                Expense Amount
              </p>
              <p className="text-2xl md:text-3xl font-bold text-primary">
                {formatCurrency(expense.amount)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Category</p>
              <div className="flex items-center gap-2">
                <CategoryIcon className="h-4 w-4" />
                <p className="text-lg font-bold">{expense.category}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Amount</span>
                </div>
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(expense.amount)}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Date</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <p className="text-lg font-bold">
                  {format(new Date(expense.date), "MMMM dd, yyyy")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-muted/50 min-h-[150px]">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {expense.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metadata */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Record Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Created At</p>
              <p className="text-sm font-medium">
                {format(new Date(expense.createdAt), "MMM dd, yyyy 'at' HH:mm")}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
              <p className="text-sm font-medium">
                {format(new Date(expense.updatedAt), "MMM dd, yyyy 'at' HH:mm")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Expense?"
        description="This action cannot be undone. The expense will be permanently deleted from the system."
        confirmText="Delete Expense"
        cancelText="Cancel"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
