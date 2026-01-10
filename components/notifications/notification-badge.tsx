'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { notificationHistoryApi } from '@/lib/api/services/notification-history';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationBadgeProps {
  onClick?: () => void;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ onClick }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await notificationHistoryApi.getUnreadCount();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchUnreadCount();

    // Poll every 30 seconds
    const interval = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={onClick}
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Button>
  );
};
