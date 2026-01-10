'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotificationHistory } from '@/lib/hooks/useNotificationHistory';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const NOTIFICATION_ICONS: Record<string, string> = {
  INVOICE: '💰',
  PAYMENT: '⏰',
  COMPLAINT: '🔧',
  ANNOUNCEMENT: '📢',
  MOVE_IN: '🏠',
  MOVE_OUT: '👋',
};

interface NotificationDropdownProps {
  collapsed?: boolean;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ collapsed = false }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  
  // Fetch only unread notifications, limit to 5 for dropdown
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  } = useNotificationHistory(5, true);

  const handleNotificationClick = async (notificationId: string) => {
    await markAsRead(notificationId);
    setOpen(false);
  };

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await markAllAsRead();
  };

  const handleViewAll = () => {
    setOpen(false);
    router.push('/notifications');
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          className={cn(
            "relative",
            collapsed ? "w-full h-10" : "w-full justify-start gap-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          )}
          title={collapsed ? "Notifikasi" : undefined}
          aria-label="Notifikasi"
        >
          <div className="relative">
            <Bell className="h-5 w-5 shrink-0" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-[16px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          {!collapsed && <span>Notifikasi</span>}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        align={collapsed ? "end" : "start"}
        side={collapsed ? "right" : "bottom"}
        className="w-80 p-0 bg-white border-gray-200 shadow-lg"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-gray-900">Notifikasi</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                {unreadCount} baru
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              Tandai semua
            </Button>
          )}
        </div>

        {/* Notification List */}
        <ScrollArea className="max-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <Bell className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500 text-center">
                Tidak ada notifikasi baru
              </p>
            </div>
          ) : (
            <div className="py-1">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-0"
                >
                  {/* Icon */}
                  <div className="shrink-0 text-2xl mt-0.5">
                    {NOTIFICATION_ICONS[notification.type] || '📬'}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <div className="shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: idLocale,
                      })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-gray-200 p-2">
            <Button
              variant="ghost"
              onClick={handleViewAll}
              className="w-full text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              Lihat semua notifikasi
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
