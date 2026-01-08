"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useResident, useMoveOutResident } from "@/lib/hooks/useResidents";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import { formatCurrency } from "@/lib/utils/roomUtils";
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
  LogOut,
  User,
  Home,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ResidentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const residentId = params.id as string;
  const { data: resident, isLoading, error } = useResident(residentId);
  const moveOutMutation = useMoveOutResident();
  const [showMoveOutDialog, setShowMoveOutDialog] = useState(false);

  // Update document title with resident name
  useEffect(() => {
    if (resident) {
      document.title = `${resident.user?.name || resident.user?.username} - Kost Management`;
    }
  }, [resident]);

  const handleMoveOut = async () => {
    try {
      await moveOutMutation.mutateAsync(residentId);
      toast.success("Resident moved out successfully");
      router.push("/residents");
    } catch (error) {
      toast.error(getErrorMessage(error));
      setShowMoveOutDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="text-sm text-muted-foreground">
            Memuat data penghuni...
          </p>
        </div>
      </div>
    );
  }

  if (error || !resident) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Penghuni Tidak Ditemukan
              </h3>
              <p className="text-sm text-muted-foreground">
                {error?.message || "Penghuni yang Anda cari tidak ada"}
              </p>
            </div>
            <Link href="/residents">
              <Button variant="outline" className="mt-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar Penghuni
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
          <Link href="/residents">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {resident.user?.name || resident.user?.username}
            </h1>
            <p className="text-sm text-muted-foreground">
              Detail informasi penghuni
            </p>
          </div>
        </div>
        {resident.isActive && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setShowMoveOutDialog(true)}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Move Out
          </Button>
        )}
      </div>

      {/* Status Card */}
      <Card
        className="border-l-4"
        style={{
          borderLeftColor: resident.isActive ? "#22c55e" : "#6b7280",
        }}
      >
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                  resident.isActive ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                <User
                  className={`h-6 w-6 ${
                    resident.isActive ? "text-green-600" : "text-gray-600"
                  }`}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Status Penghuni
                </p>
                <Badge
                  className={
                    resident.isActive
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-500 hover:bg-gray-600"
                  }
                >
                  {resident.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-muted-foreground mb-1">
                Tanggal Masuk
              </p>
              <p className="text-lg md:text-xl font-bold">
                {new Date(resident.entryDate).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Informasi Pribadi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Nama Lengkap</p>
              <p className="text-sm font-semibold">
                {resident.user?.name || "-"}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Username</p>
              <p className="text-sm font-semibold">
                {resident.user?.username || "-"}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Email</p>
              </div>
              <p className="text-sm font-semibold break-all">
                {resident.user?.email || "-"}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Nomor Telepon</p>
              </div>
              <p className="text-sm font-semibold">
                {resident.user?.phoneNumber || "-"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Room Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Informasi Kamar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">
                  Nomor Kamar
                </p>
                <p className="text-lg font-bold">
                  {resident.room?.roomNumber || "-"}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Lantai</p>
                <p className="text-lg font-bold">
                  {resident.room?.floor ?? "-"}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Harga Sewa</span>
                </div>
                <span className="text-lg font-bold text-primary">
                  {resident.room?.rentalPrice
                    ? formatCurrency(resident.room.rentalPrice)
                    : "-"}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Status Kamar</p>
              <Badge>{resident.room?.status || "-"}</Badge>
            </div>

            <Link href={`/rooms/${resident.roomId}`}>
              <Button variant="outline" size="sm" className="w-full">
                Lihat Detail Kamar
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Residency Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Informasi Sewa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">
                Tanggal Masuk
              </p>
              <p className="text-sm font-semibold">
                {new Date(resident.entryDate).toLocaleDateString("id-ID", {
                  dateStyle: "long",
                })}
              </p>
            </div>
            {resident.exitDate && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-xs text-red-600 mb-1">Tanggal Keluar</p>
                <p className="text-sm font-semibold text-red-900">
                  {new Date(resident.exitDate).toLocaleDateString("id-ID", {
                    dateStyle: "long",
                  })}
                </p>
              </div>
            )}
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">
                Tanggal Tagihan
              </p>
              <p className="text-sm font-semibold">
                Setiap tanggal {resident.billingCycleDate}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Billing History Placeholder */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Riwayat Tagihan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <DollarSign className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Riwayat tagihan akan ditampilkan di sini
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

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
                {new Date(resident.createdAt).toLocaleString("id-ID", {
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
                {new Date(resident.updatedAt).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Move Out Confirmation Dialog */}
      <Dialog open={showMoveOutDialog} onOpenChange={setShowMoveOutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Move Out {resident.user?.name || resident.user?.username}?
            </DialogTitle>
            <DialogDescription>
              Tindakan ini akan:
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Mengubah status penghuni menjadi inactive</li>
                <li>Mengatur tanggal keluar ke hari ini</li>
                <li>Mengubah status kamar menjadi AVAILABLE</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowMoveOutDialog(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleMoveOut}
              disabled={moveOutMutation.isPending}
            >
              {moveOutMutation.isPending
                ? "Memproses..."
                : "Konfirmasi Move Out"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
