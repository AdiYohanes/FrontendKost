"use client";

import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import { useOfflineStore } from "@/lib/stores/offlineStore";
import { WifiOff, Wifi, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Offline Indicator Component
 * Shows a banner when the user is offline
 * Displays pending actions count
 * Automatically hides when connection is restored
 */
export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const pendingActionsCount = useOfflineStore((state) =>
    state.getPendingActionsCount()
  );
  const [showReconnected, setShowReconnected] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    // Track when we transition from offline to online
    if (!isOnline) {
      wasOffline.current = true;
      setShowReconnected(false);
    } else if (wasOffline.current) {
      // Just came back online - defer state update
      wasOffline.current = false;

      const showTimer = setTimeout(() => {
        setShowReconnected(true);
      }, 0);

      const hideTimer = setTimeout(() => {
        setShowReconnected(false);
      }, 3000); // Show for 3 seconds

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [isOnline]);

  // Don't render anything if online and not showing reconnected message
  if (isOnline && !showReconnected) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isOnline ? "bg-green-500 text-white" : "bg-yellow-500 text-yellow-950"
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4" aria-hidden="true" />
            <span>Connection restored</span>
            {pendingActionsCount > 0 && (
              <span className="ml-2 flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden="true" />
                Syncing {pendingActionsCount} pending{" "}
                {pendingActionsCount === 1 ? "action" : "actions"}...
              </span>
            )}
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" aria-hidden="true" />
            <span>You are offline. Some features may be limited.</span>
            {pendingActionsCount > 0 && (
              <span className="ml-2 flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {pendingActionsCount} pending{" "}
                {pendingActionsCount === 1 ? "action" : "actions"}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
