/**
 * Notification History Hook
 * React hook for managing notification history
 */

import { useState, useEffect, useCallback } from 'react';
import { notificationHistoryApi, NotificationHistory } from '@/lib/api/services/notification-history';
import { toast } from 'sonner';

export const useNotificationHistory = (limit = 20, unreadOnly = false) => {
  const [notifications, setNotifications] = useState<NotificationHistory[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationHistoryApi.getNotifications(limit, offset, unreadOnly);
      
      if (offset === 0) {
        setNotifications(data.notifications);
      } else {
        setNotifications(prev => [...prev, ...data.notifications]);
      }
      
      setUnreadCount(data.unreadCount);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Gagal memuat notifikasi');
    } finally {
      setLoading(false);
    }
  }, [limit, offset, unreadOnly]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationHistoryApi.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Gagal menandai sebagai dibaca');
    }
  };

  const markAllAsRead = async () => {
    try {
      const result = await notificationHistoryApi.markAllAsRead();
      
      // Update local state
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
      
      toast.success(`${result.count} notifikasi ditandai sebagai dibaca`);
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Gagal menandai semua sebagai dibaca');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationHistoryApi.deleteNotification(notificationId);
      
      // Update local state
      const deletedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setTotal(prev => prev - 1);
      
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast.success('Notifikasi dihapus');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Gagal menghapus notifikasi');
    }
  };

  const loadMore = () => {
    setOffset(prev => prev + limit);
  };

  const refresh = () => {
    setOffset(0);
    fetchNotifications();
  };

  return {
    notifications,
    unreadCount,
    total,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
    loadMore,
    hasMore: offset + limit < total,
  };
};
