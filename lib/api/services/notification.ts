/**
 * Notification API Service
 * Handles notification preferences, FCM tokens, and test notifications
 */

import apiClient from '../client';

export interface NotificationPreference {
  id: string;
  userId: string;
  whatsappEnabled: boolean;
  pushEnabled: boolean;
  invoiceNotification: boolean;
  paymentReminder: boolean;
  complaintUpdate: boolean;
  announcementNotification: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateNotificationPreferenceDto {
  whatsappEnabled?: boolean;
  pushEnabled?: boolean;
  invoiceNotification?: boolean;
  paymentReminder?: boolean;
  complaintUpdate?: boolean;
  announcementNotification?: boolean;
}

export interface RegisterFcmTokenDto {
  token: string;
  deviceId?: string;
  platform?: 'ios' | 'android' | 'web';
}

export interface RemoveFcmTokenDto {
  token: string;
}

export interface TestWhatsAppDto {
  phoneNumber: string;
  message: string;
}

export interface TestPushDto {
  userId: string;
  title: string;
  message: string;
}

export const notificationApi = {
  /**
   * Get user notification preferences
   * @returns Notification preferences
   */
  getPreferences: async (): Promise<NotificationPreference> => {
    const response = await apiClient.get<NotificationPreference>(
      '/notifications/preferences'
    );
    return response.data;
  },

  /**
   * Update user notification preferences
   * @param preferences - Preferences to update
   * @returns Updated preferences
   */
  updatePreferences: async (
    preferences: UpdateNotificationPreferenceDto
  ): Promise<NotificationPreference> => {
    const response = await apiClient.patch<NotificationPreference>(
      '/notifications/preferences',
      preferences
    );
    return response.data;
  },

  /**
   * Register FCM token for push notifications
   * @param data - FCM token data
   * @returns Success message
   */
  registerFcmToken: async (data: RegisterFcmTokenDto): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      '/notifications/fcm-token',
      data
    );
    return response.data;
  },

  /**
   * Remove FCM token
   * @param data - Token to remove
   * @returns Success message
   */
  removeFcmToken: async (data: RemoveFcmTokenDto): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      '/notifications/fcm-token/remove',
      data
    );
    return response.data;
  },

  /**
   * Test WhatsApp notification
   * @param data - Test data
   * @returns Success message
   */
  testWhatsApp: async (data: TestWhatsAppDto): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      '/notifications/test/whatsapp',
      data
    );
    return response.data;
  },

  /**
   * Test push notification
   * @param data - Test data
   * @returns Success message
   */
  testPush: async (data: TestPushDto): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      '/notifications/test/push',
      data
    );
    return response.data;
  },
};
