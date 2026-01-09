# Offline Sync Implementation Guide

## Overview

The Kost Management Frontend now includes comprehensive offline functionality with automatic synchronization when the connection is restored.

## Features

### 1. Online/Offline Detection ✅

- Real-time detection of network status
- Custom hook: `useOnlineStatus()`
- Automatic updates when connection changes

### 2. Offline Indicator ✅

- Visual banner showing offline status
- Displays pending actions count
- Shows "Connection restored" message when back online
- Auto-hides after 3 seconds when reconnected

### 3. Offline Action Queue ✅

- Stores failed mutations in localStorage
- Persists across page refreshes
- Tracks retry attempts
- Maximum 3 retry attempts per action

### 4. Automatic Sync ✅

- Automatically syncs pending actions when online
- Retries failed actions
- Shows toast notifications for sync results
- Removes successfully synced actions

## Architecture

### Components

#### `OfflineIndicator`

Location: `components/ui/offline-indicator.tsx`

Shows a banner at the top of the page when offline:

- Yellow banner when offline
- Green banner when reconnected (3 seconds)
- Displays pending actions count

#### `OfflineSyncManager`

Location: `components/offline-sync-manager.tsx`

Background component that manages automatic syncing:

- Monitors online status
- Triggers sync when connection restored
- Handles retry logic
- Shows toast notifications

### Hooks

#### `useOnlineStatus()`

Location: `lib/hooks/useOnlineStatus.ts`

Returns the current online/offline status:

```typescript
const isOnline = useOnlineStatus();
```

#### `useOfflineSync()`

Location: `lib/hooks/useOfflineSync.ts`

Automatically syncs pending actions when online:

- Monitors pending actions queue
- Executes actions when connection restored
- Handles retry logic
- Shows notifications

### Store

#### `useOfflineStore`

Location: `lib/stores/offlineStore.ts`

Zustand store for managing pending actions:

```typescript
interface OfflineStore {
  pendingActions: PendingAction[];
  addPendingAction: (action) => void;
  removePendingAction: (id) => void;
  incrementRetryCount: (id) => void;
  clearPendingActions: () => void;
  getPendingActionsCount: () => number;
}
```

### Utilities

#### `offlineQueue.ts`

Location: `lib/utils/offlineQueue.ts`

Helper functions for offline handling:

```typescript
// Queue an action
queueOfflineAction("CREATE_ROOM", "/rooms", "POST", roomData);

// Check if offline
if (isOffline()) {
  // Handle offline scenario
}

// Get pending count
const count = getPendingActionsCount();
```

## Usage Examples

### Basic Usage (Automatic)

The offline functionality works automatically. No changes needed to existing code.

When a user goes offline:

1. Offline indicator appears
2. API calls fail gracefully
3. Error messages show "You are offline"

When connection is restored:

1. "Connection restored" message appears
2. Pending actions sync automatically
3. Toast notifications show sync results

### Manual Queue Management (Optional)

For critical operations, you can manually queue actions:

```typescript
import { queueOfflineAction, isOffline } from "@/lib/utils/offlineQueue";
import { toast } from "sonner";

// In a mutation handler
const createRoom = async (data: RoomData) => {
  // Check if offline
  if (isOffline()) {
    // Queue the action
    queueOfflineAction("CREATE_ROOM", "/rooms", "POST", data);

    // Show feedback
    toast.info(
      "You are offline. Action will sync when connection is restored."
    );

    // Optionally update UI optimistically
    return;
  }

  // Normal API call
  const response = await roomsApi.create(data);
  return response.data;
};
```

### Using with React Query

React Query already handles offline scenarios well. The offline sync is complementary:

```typescript
const createRoomMutation = useMutation({
  mutationFn: roomsApi.create,
  onError: (error: AxiosError) => {
    // Check if it's a network error
    if (isNetworkError(error) && isOffline()) {
      // Optionally queue for later
      queueOfflineAction("CREATE_ROOM", "/rooms", "POST", roomData);
      toast.info("Queued for sync when online");
    } else {
      // Handle other errors
      toast.error(handleApiError(error));
    }
  },
});
```

## Configuration

### Retry Settings

Edit `lib/hooks/useOfflineSync.ts`:

```typescript
// Maximum retry attempts
const MAX_RETRY_ATTEMPTS = 3; // Change this value

// Sync delay after connection restored
const syncTimer = setTimeout(() => {
  syncPendingActions();
}, 1000); // Change delay in milliseconds
```

### Storage Settings

The offline store uses Zustand persist middleware with localStorage:

```typescript
// Storage key
name: "offline-storage";

// Persisted data
partialize: (state) => ({ pendingActions: state.pendingActions });
```

To clear all pending actions:

```typescript
import { useOfflineStore } from "@/lib/stores/offlineStore";

// Clear all
useOfflineStore.getState().clearPendingActions();
```

## Testing

### Manual Testing

1. **Test Offline Detection**:
   - Open DevTools → Network tab
   - Check "Offline" checkbox
   - Verify yellow banner appears
   - Uncheck "Offline"
   - Verify green "Connection restored" message

2. **Test Action Queue**:
   - Go offline
   - Try to create/update/delete something
   - Check localStorage → "offline-storage"
   - Verify action is queued
   - Go back online
   - Verify action syncs automatically

3. **Test Retry Logic**:
   - Queue an action
   - Modify localStorage to set retryCount to 2
   - Go online
   - Action should retry once more
   - If it fails, it will be removed after 3rd attempt

### Automated Testing

```typescript
// Test online status hook
import { renderHook } from "@testing-library/react";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";

test("detects online status", () => {
  const { result } = renderHook(() => useOnlineStatus());
  expect(result.current).toBe(true);
});

// Test offline store
import { useOfflineStore } from "@/lib/stores/offlineStore";

test("adds pending action", () => {
  const { addPendingAction, getPendingActionsCount } =
    useOfflineStore.getState();

  addPendingAction({
    type: "TEST",
    endpoint: "/test",
    method: "POST",
    data: { test: true },
  });

  expect(getPendingActionsCount()).toBe(1);
});
```

## Troubleshooting

### Actions Not Syncing

1. Check browser console for errors
2. Verify localStorage has "offline-storage" key
3. Check if actions have exceeded max retry attempts
4. Verify API endpoints are correct

### Indicator Not Showing

1. Check if `OfflineIndicator` is in root layout
2. Verify browser supports `navigator.onLine`
3. Check browser console for React errors

### Actions Syncing Multiple Times

1. Check if `OfflineSyncManager` is only included once
2. Verify `isSyncing` ref is working correctly
3. Check for duplicate event listeners

## Best Practices

### 1. Use Automatic Sync for Most Cases

Let the automatic sync handle most scenarios. Only manually queue critical actions.

### 2. Show User Feedback

Always show toast notifications when queuing actions:

```typescript
toast.info("Action queued. Will sync when online.");
```

### 3. Handle Conflicts

If data might change while offline, implement conflict resolution:

```typescript
// Check if resource still exists before syncing
// Use optimistic locking (version numbers)
// Show conflict resolution UI if needed
```

### 4. Limit Queue Size

Don't queue too many actions. Consider:

- Maximum queue size (e.g., 50 actions)
- Action expiration (e.g., 24 hours)
- Priority queue for critical actions

### 5. Test Offline Scenarios

Always test:

- Going offline mid-operation
- Multiple queued actions
- Sync failures
- Conflict scenarios

## Future Enhancements

### Potential Improvements

1. **IndexedDB Storage**
   - Use IndexedDB instead of localStorage for larger data
   - Better performance for many actions
   - Support for binary data (images, files)

2. **Conflict Resolution**
   - Detect conflicts when syncing
   - Show UI for user to resolve
   - Implement merge strategies

3. **Priority Queue**
   - Mark critical actions as high priority
   - Sync high priority actions first
   - Skip low priority actions if too old

4. **Background Sync API**
   - Use native Background Sync API when available
   - Sync even when app is closed
   - Better reliability

5. **Optimistic UI Updates**
   - Update UI immediately when queuing
   - Revert if sync fails
   - Show pending state in UI

## API Reference

### Hooks

#### `useOnlineStatus()`

```typescript
function useOnlineStatus(): boolean;
```

Returns current online/offline status.

#### `useOfflineSync()`

```typescript
function useOfflineSync(): void;
```

Automatically syncs pending actions. Use in a component.

### Store

#### `useOfflineStore`

```typescript
interface OfflineStore {
  pendingActions: PendingAction[];
  addPendingAction: (
    action: Omit<PendingAction, "id" | "timestamp" | "retryCount">
  ) => void;
  removePendingAction: (id: string) => void;
  incrementRetryCount: (id: string) => void;
  clearPendingActions: () => void;
  getPendingActionsCount: () => number;
}
```

### Utilities

#### `queueOfflineAction()`

```typescript
function queueOfflineAction(
  type: string,
  endpoint: string,
  method: "POST" | "PATCH" | "DELETE" | "PUT",
  data?: unknown
): void;
```

Manually queue an action for later sync.

#### `isOffline()`

```typescript
function isOffline(): boolean;
```

Check if currently offline.

#### `getPendingActionsCount()`

```typescript
function getPendingActionsCount(): number;
```

Get number of pending actions.

## Conclusion

The offline sync implementation provides a robust foundation for handling network interruptions. It works automatically in most cases, with options for manual control when needed.

Key benefits:

- ✅ Automatic detection and sync
- ✅ Persistent queue across refreshes
- ✅ User-friendly notifications
- ✅ Retry logic with limits
- ✅ Easy to use and extend

For questions or issues, check the troubleshooting section or review the source code.
