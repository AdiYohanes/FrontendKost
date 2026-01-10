/**
 * Notification History API Service
 * Handles notification history CRUD operations
 */

import apiClient from '../client';

export interface NotificationHistory {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationHistoryResponse {
  notifications: NotificationHistory[];
  total: number;
  unreadCount: number;
  limit: number;
  offset: number;
}

export const notificationHistoryApi = {
  /**
   * Get notification history
   * @param limit - Number of notifications to fetch
   * @param offset - Offset for pagination
   * @param unreadOnly - Fetch only unread notifications
   * @returns Notification history response
   */
  getNotifications: async (
    limit = 20,
    offset = 0,
    unreadOnly = false
  ): Promise<NotificationHistoryResponse> => {
    const response = await apiClient.get<NotificationHistoryResponse>(
      `/notifications/history?limit=${limit}&offset=${offset}&unreadOnly=${unreadOnly}`
    );
    return response.data;
  },

  /**
   * Mark notification as read
   * @param notificationId - Notification ID
   * @returns Updated notification
   */
  markAsRead: async (notificationId: string): Promise<NotificationHistory> => {
    const response = await apiClient.patch<NotificationHistory>(
      `/notifications/history/${notificationId}/read`
    );
    return response.data;
  },

  /**
   * Mark all notifications as read
   * @returns Success message
   */
  markAllAsRead: async (): Promise<{ message: string; count: number }> => {
    const response = await apiClient.patch<{ message: string; count: number }>(
      '/notifications/history/read-all'
    );
    return response.data;
  },

  /**
   * Delete notification
   * @param notificationId - Notification ID
   * @returns Success message
   */
  deleteNotification: async (notificationId: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(
      `/notifications/history/${notificationId}`
    );
    return response.data;
  },

  /**
   * Get unread count
   * @returns Unread count
   */
  getUnreadCount: async (): Promise<{ count: number }> => {
    try {
      const response = await apiClient.get<{ count: number }>(
        '/notifications/history/unread-count'
      );
      return response.data;
    } catch (error) {
      // Return 0 if endpoint not available (404) or any other error
      // This prevents error logging for optional features
      return { count: 0 };
    }
  },
};
