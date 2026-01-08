"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roomSchema, RoomFormData } from "@/lib/validations/room.schema";
import { formatFacilityKey } from "@/lib/utils/roomUtils";
import { Room, RoomStatus } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

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
        floor: room.floor ?? undefined,
        rentalPrice: room.rentalPrice,
        facilities: room.facilities || {},
        status: room.status,
      }
    : {
        roomNumber: "",
        floor: undefined,
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
      className="space-y-6"
    >
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomNumber">
              Room Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="roomNumber"
              {...register("roomNumber")}
              placeholder="e.g., 101, A1, etc."
            />
            {errors.roomNumber && (
              <p className="text-sm text-destructive">
                {errors.roomNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="floor">Floor</Label>
            <Input
              id="floor"
              type="number"
              {...register("floor", {
                setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
              })}
              placeholder="e.g., 1, 2, 3"
            />
            {errors.floor && (
              <p className="text-sm text-destructive">{errors.floor.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rentalPrice">
              Rental Price (Rp) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="rentalPrice"
              type="number"
              {...register("rentalPrice", {
                setValueAs: (v) => parseFloat(v),
              })}
              placeholder="e.g., 1000000"
            />
            {errors.rentalPrice && (
              <p className="text-sm text-destructive">
                {errors.rentalPrice.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">
              Status <span className="text-destructive">*</span>
            </Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setValue("status", e.target.value as RoomStatus)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select status</option>
              <option value={RoomStatus.AVAILABLE}>Available</option>
              <option value={RoomStatus.OCCUPIED}>Occupied</option>
              <option value={RoomStatus.MAINTENANCE}>Maintenance</option>
            </select>
            {errors.status && (
              <p className="text-sm text-destructive">
                {errors.status.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Facilities */}
      <Card>
        <CardHeader>
          <CardTitle>Facilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Facilities */}
          {Object.keys(facilities).length > 0 && (
            <div className="space-y-2">
              {Object.entries(facilities).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {formatFacilityKey(key)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {String(value)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFacility(key)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Facility */}
          <div className="space-y-2">
            <Label>Add Facility</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Facility name (e.g., AC, WiFi)"
                value={facilityKey}
                onChange={(e) => setFacilityKey(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Input
                placeholder="Value (e.g., Yes, 2 units)"
                value={facilityValue}
                onChange={(e) => setFacilityValue(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addFacility}
                disabled={!facilityKey.trim() || !facilityValue.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : room ? "Update Room" : "Create Room"}
        </Button>
      </div>
    </form>
  );
}
