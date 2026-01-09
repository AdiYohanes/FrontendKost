"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  residentOnboardingSchema,
  ResidentOnboardingData,
} from "@/lib/validations/resident.schema";
import { useCreateResident } from "@/lib/hooks/useResidents";
import { useUsers } from "@/lib/hooks/useUsers";
import { useRooms } from "@/lib/hooks/useRooms";
import { UserRole, RoomStatus } from "@/lib/api/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import { format } from "date-fns";

const STEPS = [
  { id: 1, title: "Select User", description: "Choose the user to onboard" },
  { id: 2, title: "Select Room", description: "Choose an available room" },
  {
    id: 3,
    title: "Set Details",
    description: "Set billing cycle and entry date",
  },
];

export default function ResidentOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<ResidentOnboardingData>({
    resolver: zodResolver(residentOnboardingSchema),
    defaultValues: {
      userId: "",
      roomId: "",
      billingCycleDate: 1,
      entryDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const createResidentMutation = useCreateResident();

  // Fetch users with PENGHUNI role
  const { data: users, isLoading: usersLoading } = useUsers({
    role: UserRole.PENGHUNI,
  });

  // Fetch available rooms
  const { data: rooms, isLoading: roomsLoading } = useRooms();
  const availableRooms = rooms?.filter(
    (room) => room.status === RoomStatus.AVAILABLE
  );

  const onSubmit = async (data: ResidentOnboardingData) => {
    try {
      await createResidentMutation.mutateAsync(data);
      toast.success("Resident onboarded successfully");
      router.push("/residents");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof ResidentOnboardingData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["userId"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["roomId"];
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/residents">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Onboard Resident</h1>
          <p className="text-muted-foreground">
            Follow the steps to onboard a new resident
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep > step.id
                      ? "bg-green-500 text-white"
                      : currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-4 ${
                    currentStep > step.id ? "bg-green-500" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Select User */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Select User</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a user" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {usersLoading ? (
                            <SelectItem value="loading" disabled>
                              Loading users...
                            </SelectItem>
                          ) : users && users.length > 0 ? (
                            users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name || user.username} ({user.username})
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-users" disabled>
                              No users available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the user to onboard as a resident
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 2: Select Room */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Room</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="roomId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a room" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roomsLoading ? (
                            <SelectItem value="loading" disabled>
                              Loading rooms...
                            </SelectItem>
                          ) : availableRooms && availableRooms.length > 0 ? (
                            availableRooms.map((room) => (
                              <SelectItem key={room.id} value={room.id}>
                                Room {room.roomNumber} - Floor{" "}
                                {room.floor ?? "N/A"} - Rp{" "}
                                {room.rentalPrice.toLocaleString()}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-rooms" disabled>
                              No available rooms
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select an available room for the resident
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 3: Set Details */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Set Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="billingCycleDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Cycle Date</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={31}
                          placeholder="Enter billing cycle date (1-31)"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Day of the month when billing occurs (1-31)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="entryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entry Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        Date when the resident moves in
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {currentStep < STEPS.length ? (
              <Button type="button" onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={createResidentMutation.isPending}>
                {createResidentMutation.isPending ? (
                  "Onboarding..."
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Complete Onboarding
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
