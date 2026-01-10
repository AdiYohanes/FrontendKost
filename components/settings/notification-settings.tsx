'use client';

import { useState, useEffect } from 'react';
import { notificationApi, NotificationPreference } from '@/lib/api/services/notification';
import { usePushNotifications } from '@/lib/hooks/usePushNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Bell, Smartphone, MessageSquare, Loader2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { isSupported, permission, requestPermission, isLoading: pushLoading } = usePushNotifications();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const data = await notificationApi.getPreferences();
      setPreferences(data);
    } catch (error) {
      console.error('Failed to load preferences:', error);
      toast.error('Gagal memuat pengaturan notifikasi');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: keyof NotificationPreference, value: boolean) => {
    if (!preferences) return;

    const oldPreferences = { ...preferences };
    const newPreferences = {
      ...preferences,
      [key]: value,
    };

    setPreferences(newPreferences);

    try {
      setSaving(true);
      await notificationApi.updatePreferences({
        [key]: value,
      });
      toast.success('Pengaturan berhasil diperbarui');
    } catch (error: unknown) {
      console.error('Failed to update preferences:', error);
      
      // More specific error messages
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else if (axiosError.response?.status === 403) {
        toast.error('Anda tidak memiliki izin untuk mengubah pengaturan ini.');
      } else {
        toast.error('Gagal memperbarui pengaturan. Silakan coba lagi.');
      }
      
      // Revert on error
      setPreferences(oldPreferences);
    } finally {
      setSaving(false);
    }
  };

  const handleRequestPushPermission = async () => {
    const token = await requestPermission();
    if (token) {
      toast.success('Push notification berhasil diaktifkan');
      // Enable push notifications in preferences
      if (preferences && !preferences.pushEnabled) {
        handleToggle('pushEnabled', true);
      }
    } else {
      toast.error('Gagal mengaktifkan push notification');
    }
  };

  const getPermissionStatus = () => {
    if (!isSupported) {
      return {
        icon: XCircle,
        color: 'text-gray-500',
        text: 'Browser tidak support',
        description: 'Browser Anda tidak mendukung push notifications',
      };
    }

    switch (permission) {
      case 'granted':
        return {
          icon: CheckCircle2,
          color: 'text-green-600',
          text: 'Aktif',
          description: 'Push notification sudah diaktifkan',
        };
      case 'denied':
        return {
          icon: XCircle,
          color: 'text-red-600',
          text: 'Diblokir',
          description: 'Push notification diblokir. Aktifkan di pengaturan browser.',
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          text: 'Belum diaktifkan',
          description: 'Klik tombol di bawah untuk mengaktifkan',
        };
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!preferences) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            Gagal memuat pengaturan notifikasi
          </p>
        </CardContent>
      </Card>
    );
  }

  const permissionStatus = getPermissionStatus();
  const PermissionIcon = permissionStatus.icon;

  return (
    <div className="space-y-6">
      {/* Notification Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Metode Notifikasi
          </CardTitle>
          <CardDescription>
            Pilih cara Anda ingin menerima notifikasi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* WhatsApp Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <div>
                <Label htmlFor="whatsapp" className="text-base">
                  WhatsApp Notification
                </Label>
                <p className="text-sm text-muted-foreground">
                  Terima notifikasi melalui WhatsApp
                </p>
              </div>
            </div>
            <Switch
              id="whatsapp"
              checked={preferences.whatsappEnabled}
              onCheckedChange={(checked) => handleToggle('whatsappEnabled', checked)}
              disabled={saving}
            />
          </div>

          {/* Push Notifications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-blue-600" />
                <div>
                  <Label htmlFor="push" className="text-base">
                    Push Notification
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Terima notifikasi push di browser
                  </p>
                </div>
              </div>
              <Switch
                id="push"
                checked={preferences.pushEnabled}
                onCheckedChange={(checked) => handleToggle('pushEnabled', checked)}
                disabled={saving || permission !== 'granted'}
              />
            </div>

            {/* Permission Status Alert */}
            <Alert className={`${
              permission === 'granted' ? 'border-green-200 bg-green-50' :
              permission === 'denied' ? 'border-red-200 bg-red-50' :
              'border-yellow-200 bg-yellow-50'
            }`}>
              <PermissionIcon className={`h-4 w-4 ${permissionStatus.color}`} />
              <AlertDescription className="ml-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{permissionStatus.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {permissionStatus.description}
                    </p>
                    {permission === 'denied' && (
                      <p className="text-xs text-muted-foreground mt-2">
                        <strong>Cara mengaktifkan:</strong><br />
                        Chrome: Settings → Privacy and security → Site Settings → Notifications<br />
                        Firefox: Settings → Privacy & Security → Permissions → Notifications
                      </p>
                    )}
                  </div>
                  {permission === 'default' && (
                    <Button
                      size="sm"
                      onClick={handleRequestPushPermission}
                      disabled={pushLoading}
                      className="ml-4"
                    >
                      {pushLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Meminta izin...
                        </>
                      ) : (
                        'Aktifkan'
                      )}
                    </Button>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle>Tipe Notifikasi</CardTitle>
          <CardDescription>
            Pilih jenis notifikasi yang ingin Anda terima
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="invoice" className="text-base">
                Invoice Baru
              </Label>
              <p className="text-sm text-muted-foreground">
                Notifikasi saat invoice baru dibuat
              </p>
            </div>
            <Switch
              id="invoice"
              checked={preferences.invoiceNotification}
              onCheckedChange={(checked) => handleToggle('invoiceNotification', checked)}
              disabled={saving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="payment" className="text-base">
                Pengingat Pembayaran
              </Label>
              <p className="text-sm text-muted-foreground">
                Pengingat sebelum dan saat jatuh tempo
              </p>
            </div>
            <Switch
              id="payment"
              checked={preferences.paymentReminder}
              onCheckedChange={(checked) => handleToggle('paymentReminder', checked)}
              disabled={saving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="complaint" className="text-base">
                Update Komplain
              </Label>
              <p className="text-sm text-muted-foreground">
                Notifikasi saat status komplain berubah
              </p>
            </div>
            <Switch
              id="complaint"
              checked={preferences.complaintUpdate}
              onCheckedChange={(checked) => handleToggle('complaintUpdate', checked)}
              disabled={saving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="announcement" className="text-base">
                Pengumuman
              </Label>
              <p className="text-sm text-muted-foreground">
                Notifikasi pengumuman dari pengelola
              </p>
            </div>
            <Switch
              id="announcement"
              checked={preferences.announcementNotification}
              onCheckedChange={(checked) => handleToggle('announcementNotification', checked)}
              disabled={saving}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
