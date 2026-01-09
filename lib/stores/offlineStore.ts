import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Pending Action Type
 * Represents an action that failed due to offline status
 */
export interface PendingAction {
  id: string;
  type: string;
  endpoint: string;
  method: "POST" | "PATCH" | "DELETE" | "PUT";
  data?: unknown;
  timestamp: number;
  retryCount: number;
}

/**
 * Offline Store State
 */
interface OfflineStore {
  pendingActions: PendingAction[];
  addPendingAction: (action: Omit<PendingAction, "id" | "timestamp" | "retryCount">) => void;
  removePendingAction: (id: string) => void;
  incrementRetryCount: (id: string) => void;
  clearPendingActions: () => void;
  getPendingActionsCount: () => number;
}

/**
 * Offline Store
 * Manages pending actions when offline
 * Actions are persisted to localStorage
 */
export const useOfflineStore = create<OfflineStore>()(
  persist(
    (set, get) => ({
      pendingActions: [],

      addPendingAction: (action) => {
        const newAction: PendingAction = {
          ...action,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          retryCount: 0,
        };

        set((state) => ({
          pendingActions: [...state.pendingActions, newAction],
        }));
      },

      removePendingAction: (id) => {
        set((state) => ({
          pendingActions: state.pendingActions.filter((action) => action.id !== id),
        }));
      },

      incrementRetryCount: (id) => {
        set((state) => ({
          pendingActions: state.pendingActions.map((action) =>
            action.id === id
              ? { ...action, retryCount: action.retryCount + 1 }
              : action
          ),
        }));
      },

      clearPendingActions: () => {
        set({ pendingActions: [] });
      },

      getPendingActionsCount: () => {
        return get().pendingActions.length;
      },
    }),
    {
      name: "offline-storage",
      // Only persist pendingActions
      partialize: (state) => ({ pendingActions: state.pendingActions }),
    }
  )
);
