"use client";

import { useEffect, useRef } from "react";

interface LiveRegionProps {
  message: string;
  priority?: "polite" | "assertive";
  clearAfter?: number;
}

/**
 * Live Region component for screen reader announcements
 * Used to announce dynamic content changes to screen readers
 */
export function LiveRegion({
  message,
  priority = "polite",
  clearAfter = 1000,
}: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message && clearAfter > 0) {
      const timer = setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = "";
        }
      }, clearAfter);

      return () => clearTimeout(timer);
    }
  }, [message, clearAfter]);

  return (
    <div
      ref={regionRef}
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

/**
 * Hook to create live region announcements
 */
export function useLiveRegion() {
  const announce = (
    message: string,
    priority: "polite" | "assertive" = "polite"
  ) => {
    const announcement = document.createElement("div");
    announcement.setAttribute("role", "status");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announce };
}
