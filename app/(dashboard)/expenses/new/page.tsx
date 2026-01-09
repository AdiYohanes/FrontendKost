"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  expenseSchema,
  ExpenseFormData,
} from "@/lib/validations/expense.schema";
import { useCreateExpense } from "@/lib/hooks/useExpenses";
import { useAuthStore } from "@/lib/stores/authStore";
import { ExpenseCategory } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import { format } from "date-fns";
import { useEffect } from "react";

export default function CreateExpensePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: ExpenseCategory.MAINTENANCE,
      amount: 0,
      description: "",
      date: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const createExpenseMutation = useCreateExpense();

  // Check if user is OWNER
  useEffect(() => {
    if (user && user.role !== "OWNER") {
      toast.error("Access denied. Only OWNER can create expenses.");
      router.push("/dashboard");
    }
  }, [user, router]);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      await createExpenseMutation.mutateAsync(data);
      toast.success("Expense created successfully");
      router.push("/expenses");
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
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
              You do not have permission to create expenses. Only OWNER can
              access this page.
            </p>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/expenses">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Expense</h1>
          <p className="text-muted-foreground">
            Record a new operational expense
          </p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category Selection */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value={ExpenseCategory.MAINTENANCE}>
                          🔧 Maintenance
                        </option>
                        <option value={ExpenseCategory.UTILITIES}>
                          ⚡ Utilities
                        </option>
                        <option value={ExpenseCategory.TRASH_FEE}>
                          🗑️ Trash Fee
                        </option>
                        <option value={ExpenseCategory.SUPPLIES}>
                          📦 Supplies
                        </option>
                        <option value={ExpenseCategory.OTHER}>📋 Other</option>
                      </select>
                    </FormControl>
                    <FormDescription>
                      Select the category of this expense
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (IDR)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="1"
                        placeholder="Enter expense amount"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the expense amount in Indonesian Rupiah (must be
                      positive)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter expense description (max 500 characters)"
                        className="resize-none"
                        rows={4}
                        maxLength={500}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description of the expense (
                      {field.value.length}/500 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      Date when the expense occurred (YYYY-MM-DD)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link href="/expenses">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={createExpenseMutation.isPending}>
              {createExpenseMutation.isPending ? (
                "Creating..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Expense
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
