"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roomSchema, RoomFormData } from "@/lib/validations/room.schema";
import { RoomStatus } from "@/lib/api/types";
import { useCreateRoom } from "@/lib/hooks/useRooms";
import { formatFacilityKey } from "@/lib/utils/roomUtils";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddRoomDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddRoomDialog({ children, open, onOpenChange }: AddRoomDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  const [facilityKey, setFacilityKey] = useState("");
  const [facilityValue, setFacilityValue] = useState("");

  const createRoom = useCreateRoom();

  const form = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomNumber: "",
      rentalPrice: 0,
      facilities: {},
      status: RoomStatus.AVAILABLE,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = form;

  const facilities = watch("facilities") || {};
  const status = watch("status");

  const handleClose = () => {
    setIsOpen?.(false);
    reset();
    setFacilityKey("");
    setFacilityValue("");
  };

  const onSubmit = async (data: RoomFormData) => {
    try {
      await createRoom.mutateAsync(data);
      toast.success("Room created successfully");
      handleClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const addFacility = () => {
    if (!facilityKey.trim() || !facilityValue.trim()) return;

    setValue("facilities", {
      ...facilities,
      [facilityKey.trim()]: facilityValue.trim(),
    });
    setFacilityKey("");
    setFacilityValue("");
  };

  const removeFacility = (key: string) => {
    const newFacilities = { ...facilities };
    delete newFacilities[key];
    setValue("facilities", newFacilities);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFacility();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-hidden flex flex-col gap-0 p-0 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#1baa56]/10 flex items-center justify-center text-[#1baa56]">
              <Plus className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Add New Room</DialogTitle>
              <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
                Enter room details below to create a new listing.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 overflow-y-auto">
          <form id="add-room-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
            {/* Room Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roomNumber" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Room Number <span className="text-red-500">*</span></Label>
                <Input
                  id="roomNumber"
                  {...register("roomNumber")}
                  placeholder="e.g. 101, A1"
                  className="focus-visible:ring-[#1baa56] border-zinc-200"
                />
                {errors.roomNumber && (
                  <p className="text-xs text-red-500 font-medium">{errors.roomNumber.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rentalPrice" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Price (Rp) <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-zinc-500 text-xs">Rp</span>
                    <Input
                      id="rentalPrice"
                      type="number"
                      {...register("rentalPrice", {
                        setValueAs: (v) => parseFloat(v),
                      })}
                      placeholder="0"
                      className="pl-8 focus-visible:ring-[#1baa56] border-zinc-200"
                    />
                  </div>
                  {errors.rentalPrice && (
                    <p className="text-xs text-red-500 font-medium">{errors.rentalPrice.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Status <span className="text-red-500">*</span></Label>
                  <Select
                    value={status}
                    onValueChange={(val) => setValue("status", val as RoomStatus)}
                  >
                    <SelectTrigger className="focus:ring-[#1baa56] border-zinc-200 bg-white dark:bg-zinc-900 shadow-sm transition-all hover:border-zinc-300">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl p-1">
                      <SelectItem 
                        value={RoomStatus.AVAILABLE} 
                        className="text-green-600 font-medium focus:bg-green-50 focus:text-green-700 rounded-lg py-2.5 transition-colors cursor-pointer"
                      >
                        Available
                      </SelectItem>
                      <SelectItem 
                        value={RoomStatus.OCCUPIED} 
                        className="text-blue-600 font-medium focus:bg-blue-50 focus:text-blue-700 rounded-lg py-2.5 transition-colors cursor-pointer"
                      >
                        Occupied
                      </SelectItem>
                      <SelectItem 
                        value={RoomStatus.MAINTENANCE} 
                        className="text-yellow-600 font-medium focus:bg-yellow-50 focus:text-yellow-700 rounded-lg py-2.5 transition-colors cursor-pointer"
                      >
                        Maintenance
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-xs text-red-500 font-medium">{errors.status.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Facilities Section */}
            <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Room Facilities</Label>
                <span className="text-xs text-zinc-500">{Object.keys(facilities).length} items added</span>
              </div>
              
              {/* Add Facility Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Facility Name (e.g. AC)"
                  value={facilityKey}
                  onChange={(e) => setFacilityKey(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 focus-visible:ring-[#1baa56] border-zinc-200"
                />
                <Input
                  placeholder="Details (e.g. 1 PK)"
                  value={facilityValue}
                  onChange={(e) => setFacilityValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 focus-visible:ring-[#1baa56] border-zinc-200"
                />
                <Button
                  type="button"
                  size="icon"
                  className="bg-zinc-900 text-white hover:bg-zinc-800 shrink-0"
                  onClick={addFacility}
                  disabled={!facilityKey.trim() || !facilityValue.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Facility List */}
              {Object.keys(facilities).length > 0 ? (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {Object.entries(facilities).map(([key, value]) => (
                    <div
                      key={key}
                      className="group flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all hover:border-[#1baa56]/30"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate">{formatFacilityKey(key)}</p>
                        <p className="text-[10px] text-zinc-500 truncate">{String(value)}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFacility(key)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
                  <p className="text-xs text-zinc-400">No facilities added yet.</p>
                </div>
              )}
            </div>
          </form>
        </ScrollArea>

        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={handleClose} className="border-zinc-200 text-zinc-600 hover:bg-white hover:text-zinc-900">
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="add-room-form" 
            disabled={createRoom.isPending}
            className="bg-[#1baa56] hover:bg-[#158f46] text-white shadow-lg shadow-[#1baa56]/20 px-6 font-medium"
          >
            {createRoom.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Room"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
