"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  residentOnboardingSchema,
  ResidentOnboardingData,
} from "@/lib/validations/resident.schema";
import { useCreateResident } from "@/lib/hooks/useResidents";
import { useAvailablePenghuni } from "@/lib/hooks/useUsers";
import { useRooms } from "@/lib/hooks/useRooms";
import { UserRole, RoomStatus } from "@/lib/api/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import { format } from "date-fns";
import { Check, Users, Home, Calendar, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardResidentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEPS = [
  { id: 1, title: "Identity", icon: Users },
  { id: 2, title: "Placement", icon: Home },
  { id: 3, title: "Agreement", icon: Calendar },
];

export function OnboardResidentDialog({
  isOpen,
  onOpenChange,
}: OnboardResidentDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const createResidentMutation = useCreateResident();

  const form = useForm<ResidentOnboardingData>({
    resolver: zodResolver(residentOnboardingSchema),
    defaultValues: {
      userId: "",
      roomId: "",
      billingCycleDate: 1,
      entryDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const { data: users, isLoading: usersLoading } = useAvailablePenghuni();

  const { data: rooms, isLoading: roomsLoading } = useRooms();
  const availableRooms = rooms?.filter(
    (room) => room.status === RoomStatus.AVAILABLE
  );

  const onSubmit = async (data: ResidentOnboardingData) => {
    try {
      await createResidentMutation.mutateAsync(data);
      toast.success("Resident onboarded successfully");
      form.reset();
      setCurrentStep(1);
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 1) isValid = await form.trigger("userId");
    else if (currentStep === 2) isValid = await form.trigger("roomId");
    
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) {
        setTimeout(() => {
          setCurrentStep(1);
          form.reset();
        }, 300);
      }
    }}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-white dark:bg-zinc-950 border-none shadow-2xl rounded-3xl">
        <DialogTitle className="sr-only">Onboard Resident</DialogTitle>
        <DialogDescription className="sr-only">Complete steps to add a new resident</DialogDescription>
        
        <div className="flex flex-col">
          {/* Progress Header */}
          <div className="bg-zinc-50/50 dark:bg-zinc-900/50 p-8 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight mb-6">
              Onboard Resident
            </h2>
            <div className="flex items-center justify-between relative px-2">
              <div className="absolute top-[20px] left-0 w-full h-[2px] bg-zinc-100 dark:bg-zinc-800 -z-10" />
              <div 
                className="absolute top-[20px] left-0 h-[2px] bg-[#1baa56] transition-all duration-500 -z-10" 
                style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              />
              {STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
                    <div className={cn(
                      "h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-500",
                      isActive ? "bg-[#1baa56] text-white shadow-xl shadow-[#1baa56]/20 scale-110" : 
                      isCompleted ? "bg-[#1baa56] text-white" : 
                      "bg-white dark:bg-zinc-800 text-zinc-400 border border-zinc-100 dark:border-zinc-700"
                    )}>
                      {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      (isActive || isCompleted) ? "text-[#1baa56]" : "text-zinc-400"
                    )}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8">
              <div className="min-h-[220px]">
                {/* Step 1: User Identity */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <FormField
                      control={form.control}
                      name="userId"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                            Choose Resident Account
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-14 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-6 focus:ring-4 focus:ring-[#1baa56]/10 focus:border-[#1baa56] transition-all font-bold text-zinc-900 dark:text-zinc-100 shadow-sm leading-none">
                                <SelectValue placeholder="Search users..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-2xl p-2 bg-white dark:bg-zinc-950">
                              {usersLoading ? (
                                <div className="p-8 text-center text-xs font-black text-zinc-400 uppercase tracking-widest animate-pulse">Scanning Database...</div>
                              ) : users && users.length > 0 ? (
                                <div className="space-y-1">
                                  {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id} className="rounded-2xl py-4 pl-10 pr-4 focus:bg-[#1baa56] focus:text-white transition-all cursor-pointer group">
                                      <div className="flex flex-col">
                                        <span className="font-black text-sm">{user.name || user.username}</span>
                                        <span className="text-[10px] opacity-70 font-bold group-focus:opacity-100">@{user.username}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-8 text-center">
                                  <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">No candidates found</p>
                                  <p className="text-[10px] text-zinc-300">Register new penghuni account first</p>
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[10px] font-bold text-red-500 uppercase" />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Room Placement */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <FormField
                      control={form.control}
                      name="roomId"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                            Assign to Room
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-14 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-6 focus:ring-4 focus:ring-[#1baa56]/10 focus:border-[#1baa56] transition-all font-bold text-zinc-900 dark:text-zinc-100 shadow-sm leading-none">
                                <SelectValue placeholder="Select available room..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-2xl p-2 bg-white dark:bg-zinc-950">
                              {roomsLoading ? (
                                <div className="p-8 text-center text-xs font-black text-zinc-400 uppercase tracking-widest animate-pulse">Checking Rooms...</div>
                              ) : availableRooms && availableRooms.length > 0 ? (
                                <div className="space-y-1">
                                  {availableRooms.map((room) => (
                                    <SelectItem key={room.id} value={room.id} className="rounded-2xl py-4 pl-10 pr-4 focus:bg-[#1baa56] focus:text-white transition-all cursor-pointer group">
                                      <div className="flex items-center justify-between w-full gap-8">
                                        <div className="flex flex-col">
                                          <span className="font-black text-sm">Room {room.roomNumber}</span>
                                          <span className="text-[10px] font-bold group-focus:opacity-100">Ready for placement</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                          <span className="text-[11px] font-black bg-zinc-100 dark:bg-zinc-800 group-focus:bg-white/20 px-2 py-0.5 rounded-lg">
                                            Rp {room.rentalPrice.toLocaleString()}
                                          </span>
                                          <span className="text-[9px] opacity-60 uppercase tracking-tighter mt-0.5 group-focus:opacity-100">per month</span>
                                        </div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-8 text-center">
                                  <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Fully Occupied</p>
                                  <p className="text-[10px] text-zinc-300">All rooms are currently taken</p>
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[10px] font-bold text-red-500 uppercase" />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 3: Billing & Entry */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="billingCycleDate"
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <FormLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                              Billing Day
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                max={31}
                                className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none px-6 focus:ring-2 focus:ring-[#1baa56]/20 transition-all font-bold"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold text-red-500 uppercase" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="entryDate"
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <FormLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                              Entry Date
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none px-6 focus:ring-2 focus:ring-[#1baa56]/20 transition-all font-bold"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold text-red-500 uppercase" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-3 pt-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleBack}
                    className="h-14 px-6 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-bold transition-all"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 h-14 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-zinc-900/20 transition-all"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createResidentMutation.isPending}
                    className="flex-1 h-14 rounded-2xl bg-[#1baa56] hover:bg-[#168a46] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-[#1baa56]/20 transition-all"
                  >
                    {createResidentMutation.isPending ? "Syncing..." : "Complete Onboard"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
