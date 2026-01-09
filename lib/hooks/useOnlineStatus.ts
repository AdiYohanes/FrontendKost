"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect online/offline status
 * @returns {boolean} isOnline - true if online, false if offline
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => {
    // Check if we're in the browser
    if (typeof window === "undefined") return true;
    return navigator.onLine;
  });

  useEffect(() => {
    // Handler for when connection is restored
    const handleOnline = () => {
      setIsOnline(true);
    };

    // Handler for when connection is lost
    const handleOffline = () => {
      setIsOnline(false);
    };

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
