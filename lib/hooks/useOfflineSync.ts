"use client";

import { useEffect, useRef } from "react";
import { useOnlineStatus } from "./useOnlineStatus";
import { useOfflineStore } from "../stores/offlineStore";
import apiClient from "../api/client";
import { toast } from "sonner";

/**
 * Maximum number of retry attempts for a pending action
 */
const MAX_RETRY_ATTEMPTS = 3;

/**
 * Hook to automatically sync pending actions when connection is restored
 * 
 * This hook:
 * 1. Monitors online/offline status
 * 2. When connection is restored, attempts to sync all pending actions
 * 3. Removes successfully synced actions from the queue
 * 4. Retries failed actions up to MAX_RETRY_ATTEMPTS times
 * 5. Shows toast notifications for sync results
 */
export function useOfflineSync() {
  const isOnline = useOnlineStatus();
  const pendingActions = useOfflineStore((state) => state.pendingActions);
  const removePendingAction = useOfflineStore((state) => state.removePendingAction);
  const incrementRetryCount = useOfflineStore((state) => state.incrementRetryCount);
  const isSyncing = useRef(false);

  useEffect(() => {
    // Only sync when online and there are pending actions
    if (!isOnline || pendingActions.length === 0 || isSyncing.current) {
      return;
    }

    // Start syncing
    isSyncing.current = true;

    const syncPendingActions = async () => {
      let successCount = 0;
      let failureCount = 0;

      for (const action of pendingActions) {
        try {
          // Check if we've exceeded max retry attempts
          if (action.retryCount >= MAX_RETRY_ATTEMPTS) {
            console.warn(`Action ${action.id} exceeded max retry attempts, removing from queue`);
            removePendingAction(action.id);
            failureCount++;
            continue;
          }

          // Attempt to execute the pending action
          await apiClient.request({
            method: action.method,
            url: action.endpoint,
            data: action.data,
          });

          // Success - remove from queue
          removePendingAction(action.id);
          successCount++;
        } catch (error) {
          // Failed - increment retry count
          incrementRetryCount(action.id);
          failureCount++;
          console.error(`Failed to sync action ${action.id}:`, error);
        }
      }

      // Show summary toast
      if (successCount > 0) {
        toast.success(`Successfully synced ${successCount} ${successCount === 1 ? "action" : "actions"}`);
      }

      if (failureCount > 0) {
        toast.error(`Failed to sync ${failureCount} ${failureCount === 1 ? "action" : "actions"}. Will retry later.`);
      }

      // Done syncing
      isSyncing.current = false;
    };

    // Delay sync slightly to allow connection to stabilize
    const syncTimer = setTimeout(() => {
      syncPendingActions();
    }, 1000);

    return () => {
      clearTimeout(syncTimer);
    };
  }, [isOnline, pendingActions, removePendingAction, incrementRetryCount]);
}
