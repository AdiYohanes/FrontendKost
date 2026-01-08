"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  utilityRecordSchema,
  UtilityRecordData,
} from "@/lib/validations/utility.schema";
import { useCreateUtility } from "@/lib/hooks/useUtilities";
import { useResidents } from "@/lib/hooks/useResidents";
import { UtilityType } from "@/lib/api/types";
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
// Removed complex Select component - using native select instead
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";
import { useMemo } from "react";

export default function RecordUtilityPage() {
  const router = useRouter();

  const form = useForm<UtilityRecordData>({
    resolver: zodResolver(utilityRecordSchema),
    defaultValues: {
      residentId: "",
      utilityType: UtilityType.WATER,
      previousMeter: 0,
      currentMeter: 0,
      ratePerUnit: 0,
      readingDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const createUtilityMutation = useCreateUtility();

  // Fetch active residents
  const { data: residents, isLoading: residentsLoading } = useResidents({
    isActive: true,
  });

  // Watch form values for auto-calculation
  const previousMeter = form.watch("previousMeter");
  const currentMeter = form.watch("currentMeter");
  const ratePerUnit = form.watch("ratePerUnit");

  // Auto-calculate usage and cost
  const calculatedUsage = useMemo(() => {
    if (currentMeter >= previousMeter) {
      return currentMeter - previousMeter;
    }
    return 0;
  }, [currentMeter, previousMeter]);

  const calculatedCost = useMemo(() => {
    return calculatedUsage * ratePerUnit;
  }, [calculatedUsage, ratePerUnit]);

  const onSubmit = async (data: UtilityRecordData) => {
    try {
      await createUtilityMutation.mutateAsync(data);
      toast.success("Utility record created successfully");
      router.push("/utilities");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to record utility";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/utilities">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Record Utility</h1>
          <p className="text-muted-foreground">
            Record water or electricity meter reading
          </p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Utility Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Resident Selection */}
              <FormField
                control={form.control}
                name="residentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resident</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={residentsLoading}
                      >
                        <option value="">Select a resident</option>
                        {residentsLoading ? (
                          <option disabled>Loading residents...</option>
                        ) : residents && residents.length > 0 ? (
                          residents.map((resident) => (
                            <option key={resident.id} value={resident.id}>
                              {resident.user.name || resident.user.username} -
                              Room {resident.room.roomNumber}
                            </option>
                          ))
                        ) : (
                          <option disabled>No active residents</option>
                        )}
                      </select>
                    </FormControl>
                    <FormDescription>
                      Select the resident for this utility record
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Utility Type */}
              <FormField
                control={form.control}
                name="utilityType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Utility Type</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select utility type</option>
                        <option value={UtilityType.WATER}>💧 Water</option>
                        <option value={UtilityType.ELECTRICITY}>
                          ⚡ Electricity
                        </option>
                      </select>
                    </FormControl>
                    <FormDescription>
                      Select the type of utility to record
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Previous Meter */}
              <FormField
                control={form.control}
                name="previousMeter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Previous Meter Reading</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="Enter previous meter reading"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Previous meter reading value
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Current Meter */}
              <FormField
                control={form.control}
                name="currentMeter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Meter Reading</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="Enter current meter reading"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Current meter reading value (must be ≥ previous)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Rate Per Unit */}
              <FormField
                control={form.control}
                name="ratePerUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate Per Unit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="Enter rate per unit"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Cost per unit of utility (e.g., Rp per kWh or m³)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reading Date */}
              <FormField
                control={form.control}
                name="readingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reading Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      Date when the meter was read
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Auto-calculated values */}
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Usage:</span>
                  <span className="text-sm">
                    {calculatedUsage.toFixed(2)} units
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Cost:</span>
                  <span className="text-sm font-bold">
                    Rp {calculatedCost.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link href="/utilities">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={createUtilityMutation.isPending}>
              {createUtilityMutation.isPending ? (
                "Recording..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Record Utility
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
