"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRoom, useDeleteRoom } from "@/lib/hooks/useRooms";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import {
  getRoomStatusColor,
  formatCurrency,
  formatFacilityKey,
} from "@/lib/utils/roomUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Home,
  DollarSign,
  Calendar,
  CheckCircle2,
  XCircle,
  User,
} from "lucide-react";
import Link from "next/link";
import { RoomStatus } from "@/lib/api/types";
import { toast } from "sonner";
import { useEffect } from "react";

export default function RoomDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;
  const { data: room, isLoading, error } = useRoom(roomId);
  const deleteRoom = useDeleteRoom();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Update document title with room number
  useEffect(() => {
    if (room) {
      document.title = `Room ${room.roomNumber} - Kost Management`;
    }
  }, [room]);

  const handleDelete = async () => {
    try {
      await deleteRoom.mutateAsync(roomId);
      toast.success("Room deleted successfully");
      router.push("/rooms");
    } catch (error) {
      toast.error(getErrorMessage(error));
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="text-sm text-muted-foreground">Memuat data kamar...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Kamar Tidak Ditemukan
              </h3>
              <p className="text-sm text-muted-foreground">
                {error?.message || "Kamar yang Anda cari tidak ada"}
              </p>
            </div>
            <Link href="/rooms">
              <Button variant="outline" className="mt-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar Kamar
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link href="/rooms">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Room {room.roomNumber}
            </h1>
            <p className="text-sm text-muted-foreground">
              Detail informasi kamar
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/rooms/${room.id}/edit`}>
            <Button size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={room.status === RoomStatus.OCCUPIED}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </Button>
        </div>
      </div>

      {/* Status & Price Card */}
      <Card
        className="border-l-4"
        style={{
          borderLeftColor:
            room.status === RoomStatus.AVAILABLE
              ? "#22c55e"
              : room.status === RoomStatus.OCCUPIED
                ? "#3b82f6"
                : "#eab308",
        }}
      >
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                  room.status === RoomStatus.AVAILABLE
                    ? "bg-green-100"
                    : room.status === RoomStatus.OCCUPIED
                      ? "bg-blue-100"
                      : "bg-yellow-100"
                }`}
              >
                <Home
                  className={`h-6 w-6 ${
                    room.status === RoomStatus.AVAILABLE
                      ? "text-green-600"
                      : room.status === RoomStatus.OCCUPIED
                        ? "text-blue-600"
                        : "text-yellow-600"
                  }`}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Status Kamar
                </p>
                <Badge className={getRoomStatusColor(room.status)}>
                  {room.status}
                </Badge>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-muted-foreground mb-1">
                Harga Sewa / Bulan
              </p>
              <p className="text-2xl md:text-3xl font-bold text-primary">
                {formatCurrency(room.rentalPrice)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Informasi Dasar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">
                  Nomor Kamar
                </p>
                <p className="text-lg font-bold">{room.roomNumber}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Lantai</p>
                <p className="text-lg font-bold">{room.floor ?? "-"}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Harga Sewa</span>
                </div>
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(room.rentalPrice)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Facilities */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Fasilitas Kamar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {room.facilities && Object.keys(room.facilities).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(room.facilities).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <span className="text-sm font-medium capitalize">
                      {formatFacilityKey(key)}
                    </span>
                    {typeof value === "boolean" ? (
                      value ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )
                    ) : (
                      <span className="text-sm font-semibold">
                        {String(value)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <XCircle className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Belum ada fasilitas
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Current Tenant Information */}
      {room.status === RoomStatus.OCCUPIED && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Penghuni Saat Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">Informasi Penghuni</p>
                <p className="text-xs text-muted-foreground">
                  Data penghuni akan ditampilkan di sini
                </p>
              </div>
              <Link href="/residents">
                <Button variant="outline" size="sm">
                  Lihat
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Informasi Record
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Dibuat Pada</p>
              <p className="text-sm font-medium">
                {new Date(room.createdAt).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">
                Terakhir Diupdate
              </p>
              <p className="text-sm font-medium">
                {new Date(room.updatedAt).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Kamar {room.roomNumber}?</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Kamar akan dihapus secara
              permanen dari sistem.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteRoom.isPending}
            >
              {deleteRoom.isPending ? "Menghapus..." : "Hapus Kamar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
