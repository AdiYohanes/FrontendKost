"use client";

import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useRoom, useUpdateRoom } from "@/lib/hooks/useRooms";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import { RoomFormData } from "@/lib/validations/room.schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { FormSkeleton } from "@/components/ui/form-skeleton";

// Dynamically import RoomForm for code splitting
const RoomForm = dynamic(
  () =>
    import("@/components/forms/RoomForm").then((mod) => ({
      default: mod.RoomForm,
    })),
  {
    loading: () => <FormSkeleton />,
    ssr: false,
  }
);

export default function EditRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;
  const { data: room, isLoading, error } = useRoom(roomId);
  const updateRoom = useUpdateRoom();

  const handleSubmit = async (data: RoomFormData) => {
    try {
      // Convert null to undefined for floor
      const submitData = {
        ...data,
        floor: data.floor ?? undefined,
      };
      await updateRoom.mutateAsync({ id: roomId, data: submitData });
      toast.success("Room updated successfully");
      router.push(`/rooms/${roomId}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <p>Loading room details...</p>
        </Card>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <p className="text-destructive">
            Error loading room: {error?.message || "Room not found"}
          </p>
          <Link href="/rooms">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Rooms
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href={`/rooms/${roomId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Room {room.roomNumber}</h1>
          <p className="text-muted-foreground">Update room information</p>
        </div>
      </div>

      {/* Form */}
      <RoomForm
        room={room}
        onSubmit={handleSubmit}
        isSubmitting={updateRoom.isPending}
      />
    </div>
  );
}
