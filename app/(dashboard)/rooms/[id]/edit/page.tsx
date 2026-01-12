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
      await updateRoom.mutateAsync({ id: roomId, data });
      toast.success("Room updated successfully");
      router.push("/rooms");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 border-4 border-[#1baa56]/20 border-t-[#1baa56] rounded-full animate-spin" />
        <p className="text-zinc-500 font-medium animate-pulse">Loading room details...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center text-red-500">
          <ArrowLeft className="h-10 w-10 opacity-20" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Room Not Found</h2>
          <p className="text-zinc-500 max-w-xs mx-auto">
            {error?.message || "We couldn't find the room you're looking for. It might have been deleted."}
          </p>
        </div>
        <Link href="/rooms">
          <Button variant="outline" className="border-zinc-200">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Directory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-10 min-h-[calc(100vh-64px)] bg-zinc-50/30">
      {/* Header Section */}
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/rooms">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-white border border-zinc-200 shadow-sm hover:bg-zinc-50">
              <ArrowLeft className="h-5 w-5 text-zinc-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight leading-none mb-1">
              Edit Room <span className="text-[#1baa56]">{room.roomNumber}</span>
            </h1>
            <p className="text-sm text-zinc-500 font-medium">Configure room availability, assets, and pricing</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="pb-20">
        <RoomForm
          room={room}
          onSubmit={handleSubmit}
          isSubmitting={updateRoom.isPending}
        />
      </div>
    </div>
  );
}
