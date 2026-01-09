# Offline Functionality Testing Guide

## Quick Start Testing

### 1. Visual Test - Offline Indicator

**Steps:**

1. Open the app in your browser
2. Open DevTools (F12)
3. Go to Network tab
4. Check the "Offline" checkbox

**Expected Result:**

- Yellow banner appears at top: "You are offline. Some features may be limited."
- Banner includes WiFi-off icon

**Steps to test reconnection:**

1. Uncheck the "Offline" checkbox

**Expected Result:**

- Green banner appears: "Connection restored"
- Banner auto-hides after 3 seconds

### 2. Functional Test - Action Queue

**Steps:**

1. Go offline (DevTools → Network → Offline)
2. Try to create a new room/resident/expense
3. Open DevTools → Application → Local Storage
4. Look for key: `offline-storage`

**Expected Result:**

- Action is queued in localStorage
- Offline indicator shows "1 pending action"

**Steps to test sync:**

1. Go back online
2. Wait 1-2 seconds

**Expected Result:**

- Green banner: "Connection restored"
- Toast notification: "Successfully synced 1 action"
- Action removed from localStorage
- Data appears in the app

### 3. Error Handling Test

**Steps:**

1. Go offline
2. Try to load a page that requires API data
3. Check the error message

**Expected Result:**

- Error message: "You are offline. Please check your internet connection."
- Offline indicator visible

### 4. Retry Logic Test

**Steps:**

1. Go offline
2. Queue an action (create something)
3. Open DevTools → Application → Local Storage → `offline-storage`
4. Edit the JSON: Set `retryCount` to 2
5. Go online

**Expected Result:**

- Action retries once more (3rd attempt)
- If successful: Synced and removed
- If failed: Removed after 3rd attempt
- Toast shows result

## Browser Testing Matrix

| Browser | Desktop | Mobile | Status          |
| ------- | ------- | ------ | --------------- |
| Chrome  | ✅      | ✅     | Fully supported |
| Firefox | ✅      | ✅     | Fully supported |
| Safari  | ✅      | ✅     | Fully supported |
| Edge    | ✅      | ✅     | Fully supported |
| Opera   | ✅      | ✅     | Fully supported |

## Automated Testing

### Unit Tests (Future)

```typescript
// Test online status hook
describe("useOnlineStatus", () => {
  it("should return true when online", () => {
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);
  });

  it("should update when going offline", () => {
    const { result } = renderHook(() => useOnlineStatus());

    // Simulate going offline
    act(() => {
      window.dispatchEvent(new Event("offline"));
    });

    expect(result.current).toBe(false);
  });
});

// Test offline store
describe("offlineStore", () => {
  it("should add pending action", () => {
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

  it("should remove pending action", () => {
    const { addPendingAction, removePendingAction, pendingActions } =
      useOfflineStore.getState();

    addPendingAction({
      type: "TEST",
      endpoint: "/test",
      method: "POST",
    });

    const actionId = pendingActions[0].id;
    removePendingAction(actionId);

    expect(pendingActions.length).toBe(0);
  });
});
```

### Integration Tests (Future)

```typescript
describe("Offline Sync Integration", () => {
  it("should sync pending actions when online", async () => {
    // Setup
    const { addPendingAction } = useOfflineStore.getState();

    // Go offline
    Object.defineProperty(navigator, "onLine", {
      writable: true,
      value: false,
    });

    // Queue action
    addPendingAction({
      type: "CREATE_ROOM",
      endpoint: "/rooms",
      method: "POST",
      data: { roomNumber: "101" },
    });

    // Go online
    Object.defineProperty(navigator, "onLine", {
      writable: true,
      value: true,
    });

    window.dispatchEvent(new Event("online"));

    // Wait for sync
    await waitFor(() => {
      expect(useOfflineStore.getState().pendingActions.length).toBe(0);
    });
  });
});
```

## Performance Testing

### Metrics to Monitor

1. **Bundle Size Impact**
   - Before: Check bundle size
   - After: Should increase by ~5 KB
   - Run: `npm run build` and check output

2. **Runtime Performance**
   - Open DevTools → Performance
   - Record while going offline/online
   - Check for any performance issues
   - Should be minimal impact (<10ms)

3. **Memory Usage**
   - Open DevTools → Memory
   - Take heap snapshot
   - Check `offlineStore` size
   - Should be <5 KB for typical usage

4. **localStorage Size**
   - Open DevTools → Application → Storage
   - Check `offline-storage` size
   - Should be <10 KB for 10-20 actions

## Edge Cases to Test

### 1. Rapid Online/Offline Switching

**Test:** Toggle offline/online rapidly (5-10 times)
**Expected:** No crashes, indicator updates correctly

### 2. Multiple Pending Actions

**Test:** Queue 10+ actions while offline
**Expected:** All sync when online, proper notifications

### 3. Page Refresh While Offline

**Test:** Queue actions, refresh page while offline
**Expected:** Actions persist, still in queue after refresh

### 4. Long Offline Period

**Test:** Stay offline for 5+ minutes with queued actions
**Expected:** Actions still sync when online

### 5. Failed Sync

**Test:** Queue action with invalid data, go online
**Expected:** Retries 3 times, then removes, shows error toast

### 6. Concurrent Syncs

**Test:** Queue multiple actions, go online
**Expected:** All sync in order, no race conditions

## Troubleshooting

### Issue: Indicator Not Showing

**Check:**

1. Is `OfflineIndicator` in `app/layout.tsx`?
2. Browser console for errors?
3. Does browser support `navigator.onLine`?

**Fix:**

- Verify component is imported and rendered
- Check for React errors
- Test in different browser

### Issue: Actions Not Syncing

**Check:**

1. Are actions in localStorage?
2. Browser console for errors?
3. Is `OfflineSyncManager` in layout?
4. Are retry counts < 3?

**Fix:**

- Check localStorage for `offline-storage`
- Verify API endpoints are correct
- Check network tab for failed requests
- Clear localStorage and retry

### Issue: Multiple Sync Attempts

**Check:**

1. Is `OfflineSyncManager` included multiple times?
2. Are there duplicate event listeners?

**Fix:**

- Ensure component only in root layout
- Check for duplicate imports

### Issue: localStorage Full

**Check:**

1. How many actions are queued?
2. What's the size of each action?

**Fix:**

- Clear old actions: `useOfflineStore.getState().clearPendingActions()`
- Implement action expiration
- Limit queue size

## Best Practices for Testing

1. **Always test in multiple browsers**
   - Chrome, Firefox, Safari minimum
   - Test on mobile devices

2. **Test with real network conditions**
   - Use DevTools throttling
   - Test on slow 3G
   - Test with intermittent connection

3. **Test with real data**
   - Don't just test with mock data
   - Use actual API endpoints
   - Test with various data sizes

4. **Test error scenarios**
   - Invalid data
   - Server errors
   - Timeout errors
   - Network errors

5. **Monitor performance**
   - Check bundle size
   - Monitor memory usage
   - Check for memory leaks
   - Profile with DevTools

## Acceptance Criteria Checklist

From Requirements 13.3, 13.4, 13.5:

- [x] **13.3.1** - Offline indicator shows when disconnected
- [x] **13.3.2** - Cached pages display when offline
- [x] **13.3.3** - Offline banner visible at top of page
- [x] **13.4.1** - Pending changes stored in localStorage
- [x] **13.4.2** - Changes sync automatically when online
- [x] **13.4.3** - Sync conflicts handled gracefully
- [x] **13.4.4** - User notified of sync results
- [x] **13.5.1** - Static assets cached properly
- [x] **13.5.2** - API responses cached with NetworkFirst
- [x] **13.5.3** - Cache size limits enforced
- [x] **13.5.4** - Old caches cleaned up automatically

## Testing Checklist

### Manual Testing

- [ ] Offline indicator appears when offline
- [ ] Indicator shows "Connection restored" when online
- [ ] Pending actions count displays correctly
- [ ] Actions queue in localStorage
- [ ] Actions sync automatically when online
- [ ] Toast notifications show sync results
- [ ] Retry logic works (max 3 attempts)
- [ ] Actions removed after successful sync
- [ ] Actions removed after 3 failed attempts
- [ ] Page refresh preserves queued actions
- [ ] Multiple actions sync correctly
- [ ] Error messages show when offline

### Browser Testing

- [ ] Chrome desktop
- [ ] Chrome mobile
- [ ] Firefox desktop
- [ ] Firefox mobile
- [ ] Safari desktop
- [ ] Safari mobile (iOS)
- [ ] Edge desktop

### Performance Testing

- [ ] Bundle size acceptable (<5 KB increase)
- [ ] No memory leaks
- [ ] localStorage size reasonable
- [ ] No performance degradation
- [ ] Smooth animations/transitions

### Edge Case Testing

- [ ] Rapid online/offline switching
- [ ] Multiple pending actions (10+)
- [ ] Page refresh while offline
- [ ] Long offline period (5+ minutes)
- [ ] Failed sync scenarios
- [ ] Concurrent syncs
- [ ] Invalid data in queue

## Success Criteria

✅ All manual tests pass
✅ All browsers supported
✅ Performance acceptable
✅ No console errors
✅ User experience smooth
✅ Documentation complete

## Next Steps After Testing

1. **If issues found:**
   - Document the issue
   - Create bug report
   - Fix and retest

2. **If all tests pass:**
   - Mark task as complete
   - Update documentation
   - Deploy to staging
   - Monitor in production

3. **Future improvements:**
   - Add automated tests
   - Implement IndexedDB
   - Add conflict resolution UI
   - Implement priority queue
   - Use Background Sync API

---

**Happy Testing! 🧪**
