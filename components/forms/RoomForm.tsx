"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roomSchema, RoomFormData } from "@/lib/validations/room.schema";
import { formatFacilityKey } from "@/lib/utils/roomUtils";
import { Room, RoomStatus } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Loader2, Home, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface RoomFormProps {
  room?: Room;
  onSubmit: (data: RoomFormData) => void;
  isSubmitting?: boolean;
}

export function RoomForm({ room, onSubmit, isSubmitting }: RoomFormProps) {
  const [facilityKey, setFacilityKey] = useState("");
  const [facilityValue, setFacilityValue] = useState("");

  const defaultValues: RoomFormData = room
    ? {
        roomNumber: room.roomNumber,
        rentalPrice: room.rentalPrice,
        facilities: room.facilities || {},
        status: room.status,
      }
    : {
        roomNumber: "",
        rentalPrice: 0,
        facilities: {},
        status: RoomStatus.AVAILABLE,
      };

  const form = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const facilities = watch("facilities") || {};
  const status = watch("status");

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
    <form
      onSubmit={handleSubmit((data) => onSubmit(data))}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500">
            <Home className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">General Information</h3>
            <p className="text-xs text-zinc-500">Essential room identification and pricing</p>
          </div>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="roomNumber" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Room Number</Label>
            <Input
              id="roomNumber"
              {...register("roomNumber")}
              placeholder="e.g. 101, B2"
              className="focus-visible:ring-[#1baa56] border-zinc-200 dark:border-zinc-800"
            />
            {errors.roomNumber && (
              <p className="text-xs text-red-500 font-medium">{errors.roomNumber.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="rentalPrice" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Monthly Rent (Rp)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-400 text-xs">Rp</span>
                <Input
                  id="rentalPrice"
                  type="number"
                  {...register("rentalPrice", {
                    setValueAs: (v) => parseFloat(v),
                  })}
                  placeholder="0"
                  className="pl-8 focus-visible:ring-[#1baa56] border-zinc-200 dark:border-zinc-800 font-semibold"
                />
              </div>
              {errors.rentalPrice && (
                <p className="text-xs text-red-500 font-medium">{errors.rentalPrice.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Room Status</Label>
              <Select
                value={status}
                onValueChange={(val) => setValue("status", val as RoomStatus)}
              >
                <SelectTrigger className="focus:ring-[#1baa56] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl p-1">
                  <SelectItem 
                    value={RoomStatus.AVAILABLE} 
                    className="text-green-600 font-medium focus:bg-green-50 focus:text-green-700 rounded-lg py-2.5 cursor-pointer"
                  >
                    Available
                  </SelectItem>
                  <SelectItem 
                    value={RoomStatus.OCCUPIED} 
                    className="text-blue-600 font-medium focus:bg-blue-50 focus:text-blue-700 rounded-lg py-2.5 cursor-pointer"
                  >
                    Occupied
                  </SelectItem>
                  <SelectItem 
                    value={RoomStatus.MAINTENANCE} 
                    className="text-yellow-600 font-medium focus:bg-yellow-50 focus:text-yellow-700 rounded-lg py-2.5 cursor-pointer"
                  >
                    Maintenance
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Room Facilities</h3>
            <p className="text-xs text-zinc-500">Add or remove amenities available in this room</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.keys(facilities).length > 0 ? (
              Object.entries(facilities).map(([key, value]) => (
                <div
                  key={key}
                  className="group flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 transition-all hover:border-[#1baa56]/30"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{formatFacilityKey(key)}</p>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{String(value)}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 opacity-0 group-hover:opacity-100 transition-all"
                    onClick={() => removeFacility(key)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center bg-zinc-50 dark:bg-zinc-900/30 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-400 font-medium">No facilities listed yet.</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Label className="text-xs font-bold text-zinc-500 uppercase">Add New Amenity</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Name (e.g. WiFi)"
                value={facilityKey}
                onChange={(e) => setFacilityKey(e.target.value)}
                onKeyPress={handleKeyPress}
                className="focus-visible:ring-[#1baa56] border-zinc-200 dark:border-zinc-800 h-10 text-sm"
              />
              <Input
                placeholder="Detail (e.g. 50Mbps)"
                value={facilityValue}
                onChange={(e) => setFacilityValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="focus-visible:ring-[#1baa56] border-zinc-200 dark:border-zinc-800 h-10 text-sm"
              />
              <Button
                type="button"
                className="bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg shadow-zinc-900/10 shrink-0"
                onClick={addFacility}
                disabled={!facilityKey.trim() || !facilityValue.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Link href="/rooms">
          <Button variant="ghost" type="button" className="text-zinc-500 text-xs font-bold hover:text-zinc-900">
            Discards Changes
          </Button>
        </Link>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-[#1baa56] hover:bg-[#158f46] text-white shadow-xl shadow-[#1baa56]/20 px-10 h-12 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Profile...
            </>
          ) : room ? (
            "Save Changes"
          ) : (
            "Create Room Listing"
          )}
        </Button>
      </div>
    </form>
  );
}
