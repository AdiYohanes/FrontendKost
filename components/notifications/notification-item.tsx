'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { NotificationHistory } from '@/lib/api/services/notification-history';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationItemProps {
  notification: NotificationHistory;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const getIcon = (type: string) => {
  const icons: Record<string, string> = {
    INVOICE: '💰',
    PAYMENT_REMINDER: '⏰',
    COMPLAINT_UPDATE: '🔧',
    ANNOUNCEMENT: '📢',
    MOVE_IN: '🏠',
    MOVE_OUT: '👋',
    GENERAL: '🔔',
  };
  return icons[type] || '🔔';
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      className={`flex gap-4 p-4 bg-white border rounded-lg cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
        !notification.isRead
          ? 'border-l-4 border-l-blue-500 bg-blue-50'
          : 'border-gray-200'
      }`}
      onClick={handleClick}
    >
      {/* Icon */}
      <div className="text-3xl shrink-0">
        {getIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 mb-1">
          {notification.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {notification.message}
        </p>
        <span className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
            locale: id,
          })}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-start gap-2">
        {!notification.isRead && (
          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          title="Hapus"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
