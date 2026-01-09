import { useOfflineStore } from "../stores/offlineStore";

/**
 * Queue an action to be executed when connection is restored
 * 
 * @param type - Action type (e.g., "CREATE_ROOM", "UPDATE_INVOICE")
 * @param endpoint - API endpoint (e.g., "/rooms", "/invoices/123")
 * @param method - HTTP method
 * @param data - Request data
 * 
 * @example
 * ```ts
 * // In a mutation handler
 * if (!navigator.onLine) {
 *   queueOfflineAction("CREATE_ROOM", "/rooms", "POST", roomData);
 *   toast.info("Action queued. Will sync when online.");
 *   return;
 * }
 * ```
 */
export function queueOfflineAction(
  type: string,
  endpoint: string,
  method: "POST" | "PATCH" | "DELETE" | "PUT",
  data?: unknown
) {
  const { addPendingAction } = useOfflineStore.getState();
  
  addPendingAction({
    type,
    endpoint,
    method,
    data,
  });
}

/**
 * Check if the user is currently offline
 * 
 * @returns true if offline, false if online
 */
export function isOffline(): boolean {
  return typeof navigator !== "undefined" && !navigator.onLine;
}

/**
 * Get the count of pending offline actions
 * 
 * @returns number of pending actions
 */
export function getPendingActionsCount(): number {
  const { getPendingActionsCount } = useOfflineStore.getState();
  return getPendingActionsCount();
}
