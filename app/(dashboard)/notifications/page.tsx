'use client';

import { useState } from 'react';
import { NotificationList } from '@/components/notifications/notification-list';
import { Button } from '@/components/ui/button';

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifikasi</h1>
        <p className="text-muted-foreground mt-2">
          Lihat semua notifikasi dan pengumuman
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        <Button
          variant={filter === 'all' ? 'default' : 'ghost'}
          className={`rounded-b-none ${
            filter === 'all'
              ? 'border-b-2 border-primary'
              : 'border-b-2 border-transparent'
          }`}
          onClick={() => setFilter('all')}
        >
          Semua
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'ghost'}
          className={`rounded-b-none ${
            filter === 'unread'
              ? 'border-b-2 border-primary'
              : 'border-b-2 border-transparent'
          }`}
          onClick={() => setFilter('unread')}
        >
          Belum Dibaca
        </Button>
      </div>

      {/* Notification List */}
      <NotificationList unreadOnly={filter === 'unread'} />
    </div>
  );
}
