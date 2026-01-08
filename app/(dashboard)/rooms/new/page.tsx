"use client";

import { useRouter } from "next/navigation";
import { useCreateRoom } from "@/lib/hooks/useRooms";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import { RoomForm } from "@/components/forms/RoomForm";
import { RoomFormData } from "@/lib/validations/room.schema";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewRoomPage() {
  const router = useRouter();
  const createRoom = useCreateRoom();

  const handleSubmit = async (data: RoomFormData) => {
    try {
      await createRoom.mutateAsync(data);
      toast.success("Room created successfully");
      router.push("/rooms");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href="/rooms">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create New Room</h1>
          <p className="text-muted-foreground">
            Add a new room to the boarding house
          </p>
        </div>
      </div>

      {/* Form */}
      <RoomForm onSubmit={handleSubmit} isSubmitting={createRoom.isPending} />
    </div>
  );
}
