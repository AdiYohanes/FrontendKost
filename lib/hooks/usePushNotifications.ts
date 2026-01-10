/**
 * Push Notifications Hook
 * React hook for managing push notifications
 */

import { useEffect, useState } from 'react';
import {
  requestNotificationPermission,
  setupForegroundMessageListener,
  isFcmTokenRegistered,
  saveFcmToken,
} from '@/lib/firebase/fcm';
import { useAuthStore } from '@/lib/stores/authStore';

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();

  // Check if notifications are supported
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  // Setup foreground message listener
  useEffect(() => {
    if (isAuthenticated && permission === 'granted') {
      setupForegroundMessageListener();
    }
  }, [isAuthenticated, permission]);

  // Request permission and register token
  const requestPermission = async () => {
    if (!isSupported) {
      console.warn('Notifications not supported');
      return null;
    }

    setIsLoading(true);
    try {
      const fcmToken = await requestNotificationPermission();
      if (fcmToken) {
        setToken(fcmToken);
        setPermission('granted');
        saveFcmToken(fcmToken);
      } else {
        setPermission(Notification.permission);
      }
      return fcmToken;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-request permission on mount if authenticated and not already registered
  useEffect(() => {
    if (isAuthenticated && isSupported && permission === 'default' && !isFcmTokenRegistered()) {
      // Don't auto-request, let user trigger it
      // requestPermission();
    }
  }, [isAuthenticated, isSupported, permission]);

  return {
    isSupported,
    permission,
    token,
    isLoading,
    requestPermission,
  };
};
