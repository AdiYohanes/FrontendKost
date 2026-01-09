"use client";

import { useEffect, useCallback } from "react";

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  callback: () => void;
  description: string;
}

/**
 * Hook to register keyboard shortcuts
 * @param shortcuts Array of keyboard shortcuts to register
 * @param enabled Whether shortcuts are enabled (default: true)
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  enabled: boolean = true
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Allow Escape key even in input fields
        if (event.key !== "Escape") {
          return;
        }
      }

      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatches = shortcut.alt ? event.altKey : !event.altKey;
        const metaMatches = shortcut.meta ? event.metaKey : !event.metaKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, enabled]);
}

/**
 * Common keyboard shortcuts
 */
export const COMMON_SHORTCUTS = {
  SEARCH: { key: "k", ctrl: true, description: "Open search" },
  ESCAPE: { key: "Escape", description: "Close dialog/modal" },
  SAVE: { key: "s", ctrl: true, description: "Save" },
  NEW: { key: "n", ctrl: true, description: "Create new" },
  REFRESH: { key: "r", ctrl: true, description: "Refresh" },
  HELP: { key: "?", shift: true, description: "Show help" },
} as const;

/**
 * Format keyboard shortcut for display
 */
export function formatShortcut(shortcut: Partial<KeyboardShortcut>): string {
  const parts: string[] = [];
  
  if (shortcut.ctrl || shortcut.meta) {
    parts.push(navigator.platform.includes("Mac") ? "⌘" : "Ctrl");
  }
  if (shortcut.shift) parts.push("Shift");
  if (shortcut.alt) parts.push("Alt");
  if (shortcut.key) {
    parts.push(shortcut.key.length === 1 ? shortcut.key.toUpperCase() : shortcut.key);
  }
  
  return parts.join(" + ");
}
