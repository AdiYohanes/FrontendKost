'use client';

import React from 'react';
import { useNotificationHistory } from '@/lib/hooks/useNotificationHistory';
import { NotificationItem } from './notification-item';
import { Button } from '@/components/ui/button';
import { Loader2, Inbox } from 'lucide-react';

interface NotificationListProps {
  unreadOnly?: boolean;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  unreadOnly = false,
}) => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
    hasMore,
  } = useNotificationHistory(20, unreadOnly);

  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      {unreadCount > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
              {unreadCount}
            </span>
            <span className="text-sm text-gray-700">notifikasi belum dibaca</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="text-blue-600 border-blue-300 hover:bg-blue-100"
          >
            Tandai Semua Dibaca
          </Button>
        </div>
      )}

      {/* Notification List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Inbox className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              Tidak ada notifikasi
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {unreadOnly
                ? 'Semua notifikasi sudah dibaca'
                : 'Anda belum memiliki notifikasi'}
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memuat...
              </>
            ) : (
              'Muat Lebih Banyak'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
