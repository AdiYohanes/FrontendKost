/**
 * Firebase Cloud Messaging Helper Functions
 * Handle FCM token registration and message listening
 */

import { getToken, onMessage, MessagePayload } from 'firebase/messaging';
import { getFirebaseMessaging } from './config';
import { notificationApi } from '@/lib/api/services/notification';
import { toast } from 'sonner';

/**
 * Get device ID from localStorage or generate new one
 * @returns Device ID
 */
export const getDeviceId = (): string => {
  if (typeof window === 'undefined') return '';

  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = `web-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

/**
 * Request notification permission and get FCM token
 * @returns FCM token or null if permission denied
 */
export const requestNotificationPermission = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;

  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return null;
    }

    // Request permission
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    console.log('Notification permission granted');

    // Get messaging instance
    const messaging = await getFirebaseMessaging();
    if (!messaging) {
      console.warn('Firebase Messaging not available');
      return null;
    }

    // Get FCM token
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error('VAPID key not configured');
      return null;
    }

    const token = await getToken(messaging, { vapidKey });
    console.log('FCM Token obtained:', token);

    // Register token with backend
    await registerFcmToken(token);

    return token;
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

/**
 * Register FCM token with backend
 * @param token - FCM token
 */
export const registerFcmToken = async (token: string): Promise<void> => {
  try {
    const deviceId = getDeviceId();
    await notificationApi.registerFcmToken({
      token,
      deviceId,
      platform: 'web',
    });
    console.log('FCM token registered successfully');
  } catch (error) {
    console.error('Failed to register FCM token:', error);
    throw error;
  }
};

/**
 * Remove FCM token from backend
 * @param token - FCM token to remove
 */
export const removeFcmToken = async (token: string): Promise<void> => {
  try {
    await notificationApi.removeFcmToken({ token });
    console.log('FCM token removed successfully');
  } catch (error) {
    console.error('Failed to remove FCM token:', error);
    throw error;
  }
};

/**
 * Setup foreground message listener
 * Shows notification when app is in foreground
 */
export const setupForegroundMessageListener = async (): Promise<void> => {
  if (typeof window === 'undefined') return;

  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return;

    onMessage(messaging, (payload: MessagePayload) => {
      console.log('Foreground message received:', payload);

      const { notification } = payload;
      if (!notification) return;

      const { title, body } = notification;

      // Show browser notification
      if (title && body) {
        new Notification(title, {
          body,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
        });

        // Show toast notification
        toast.info(title, {
          description: body,
        });
      }
    });

    console.log('Foreground message listener setup complete');
  } catch (error) {
    console.error('Error setting up foreground message listener:', error);
  }
};

/**
 * Check if FCM token is already registered
 * @returns True if token exists in localStorage
 */
export const isFcmTokenRegistered = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('fcmToken');
};

/**
 * Save FCM token to localStorage
 * @param token - FCM token
 */
export const saveFcmToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('fcmToken', token);
};

/**
 * Get FCM token from localStorage
 * @returns FCM token or null
 */
export const getSavedFcmToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('fcmToken');
};

/**
 * Clear FCM token from localStorage
 */
export const clearFcmToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('fcmToken');
};
