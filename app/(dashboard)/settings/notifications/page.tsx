'use client';

import { NotificationSettings } from '@/components/settings/notification-settings';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notification Settings</h1>
        <p className="text-muted-foreground mt-2">
          Kelola preferensi notifikasi Anda
        </p>
      </div>

      <NotificationSettings />
    </div>
  );
}
