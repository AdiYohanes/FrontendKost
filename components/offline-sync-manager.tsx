"use client";

import { useOfflineSync } from "@/lib/hooks/useOfflineSync";

/**
 * Offline Sync Manager Component
 *
 * This component manages automatic syncing of pending actions
 * when the connection is restored. It doesn't render anything,
 * it just runs the sync logic in the background.
 *
 * Place this component at the root level of your app.
 */
export function OfflineSyncManager() {
  useOfflineSync();
  return null;
}
