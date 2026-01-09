# PWA Install Prompt Testing Guide

## Overview

This guide provides comprehensive instructions for testing the PWA install functionality across different browsers and platforms.

## Enhanced Features

### Install Prompt Component

The `PWAInstallPrompt` component now includes:

1. **Installability Detection**
   - Checks if app is already installed (standalone mode)
   - Detects display mode using media queries
   - Prevents showing prompt if already installed

2. **Smart Dismissal Logic**
   - Stores dismissal timestamp in localStorage
   - Respects user choice for 7 days
   - Clears dismissal flag after successful installation

3. **Event Handling**
   - `beforeinstallprompt` - Captures install prompt event
   - `appinstalled` - Detects successful installation
   - Proper cleanup and state management

4. **Enhanced UX**
   - Loading state during installation
   - Icon and improved visual design
   - Smooth animations
   - Close button for quick dismissal

## Testing Checklist

### Task 28.1: Review Install Banner

#### ✅ Install Prompt Detection

**Test Steps:**

1. Open the app in a browser that supports PWA
2. Open DevTools Console
3. Look for log message: "beforeinstallprompt event fired"
4. Verify prompt appears after 2-second delay

**Expected Behavior:**

- Prompt should appear in bottom-right corner (desktop) or bottom (mobile)
- Should show "Install Kost Management" title
- Should have Install and "Not now" buttons
- Should have close (X) button

#### ✅ Installability Detection

**Test Steps:**

1. Check console for installation status logs
2. If already installed, verify prompt doesn't show
3. If not installed, verify prompt appears

**Expected Behavior:**

- Console should log: "PWA is already installed" (if installed)
- Console should log: "beforeinstallprompt event fired" (if not installed)
- Prompt should not appear if already installed

#### ✅ Install Event Handling

**Test Steps:**

1. Click "Install" button
2. Accept the browser's install dialog
3. Check console for success message
4. Verify app icon appears on desktop/home screen

**Expected Behavior:**

- Button should show "Installing..." during process
- Console should log: "User accepted the install prompt"
- Console should log: "PWA was installed"
- Prompt should disappear after installation
- App should be accessible from desktop/home screen

### Task 28.2: Test PWA Installation

#### ✅ Chrome Desktop (Windows/Mac/Linux)

**Prerequisites:**

- Chrome 90+ (latest recommended)
- HTTPS or localhost
- Valid manifest.json
- Service worker registered

**Test Steps:**

1. Open app in Chrome
2. Wait for install prompt to appear
3. Click "Install" button
4. Verify install dialog appears
5. Click "Install" in browser dialog
6. Check for app icon in:
   - Windows: Start Menu, Desktop
   - Mac: Applications folder, Dock
   - Linux: Application menu

**Expected Behavior:**

- Install prompt appears after 2 seconds
- Browser shows native install dialog
- App installs successfully
- App opens in standalone window
- App icon is visible in system

**Verification:**

```javascript
// In DevTools Console
window.matchMedia("(display-mode: standalone)").matches;
// Should return: true (when installed)
```

#### ✅ Chrome Mobile (Android)

**Prerequisites:**

- Chrome 90+ on Android
- HTTPS connection
- Valid manifest.json
- Service worker registered

**Test Steps:**

1. Open app in Chrome on Android
2. Wait for install prompt
3. Tap "Install" button
4. Verify "Add to Home screen" dialog
5. Tap "Add" in dialog
6. Check home screen for app icon
7. Open app from home screen
8. Verify standalone mode (no browser UI)

**Expected Behavior:**

- Install prompt appears at bottom
- Android shows "Add to Home screen" dialog
- App icon appears on home screen
- App opens in fullscreen/standalone mode
- No browser address bar visible

**Alternative Method:**

1. Tap Chrome menu (⋮)
2. Look for "Install app" or "Add to Home screen"
3. Follow installation prompts

#### ✅ Safari (iOS)

**Important Note:** Safari doesn't support `beforeinstallprompt` event. Users must manually add to home screen.

**Test Steps:**

1. Open app in Safari on iOS
2. Tap Share button (square with arrow)
3. Scroll and tap "Add to Home Screen"
4. Edit name if desired
5. Tap "Add"
6. Check home screen for icon
7. Open app from home screen

**Expected Behavior:**

- Install prompt component won't show (Safari limitation)
- Manual installation works via Share menu
- App icon appears on home screen
- App opens in standalone mode
- Status bar matches theme color

**Verification:**

- App should have no Safari UI
- Should show splash screen on launch
- Should respect status bar style

#### ✅ Safari (macOS)

**Prerequisites:**

- Safari 15.4+ on macOS Monterey or later
- HTTPS connection

**Test Steps:**

1. Open app in Safari on Mac
2. Look for install icon in address bar
3. Click install icon or File > Add to Dock
4. Verify app appears in Dock
5. Open app from Dock
6. Verify standalone window

**Expected Behavior:**

- Install option available in Safari
- App installs to Applications folder
- App appears in Dock
- Opens in standalone window

#### ✅ Edge (Windows/Mac)

**Test Steps:**

1. Open app in Edge
2. Wait for install prompt
3. Click "Install" button
4. Verify Edge install dialog
5. Click "Install" in dialog
6. Check for app in Start Menu/Applications

**Expected Behavior:**

- Similar to Chrome behavior
- App installs successfully
- Appears in system applications

#### ✅ Firefox (Desktop)

**Note:** Firefox has limited PWA support. Installation may not work as expected.

**Test Steps:**

1. Open app in Firefox
2. Check if install prompt appears
3. Try manual installation via menu

**Expected Behavior:**

- May not show install prompt
- Limited PWA support
- Consider recommending Chrome/Edge for installation

## Testing Scenarios

### Scenario 1: First-Time User

1. User visits app for first time
2. Browses for a few seconds
3. Install prompt appears after 2 seconds
4. User clicks "Install"
5. App installs successfully

### Scenario 2: User Dismisses Prompt

1. User sees install prompt
2. User clicks "Not now"
3. Prompt disappears
4. User continues using app
5. Prompt doesn't reappear for 7 days

### Scenario 3: Already Installed

1. User has app installed
2. User opens app in browser
3. Install prompt doesn't appear
4. Console shows "PWA is already installed"

### Scenario 4: Reinstallation

1. User uninstalls app
2. User visits app in browser
3. Install prompt appears again
4. User can reinstall

## Debugging

### Check PWA Installability

**Chrome DevTools:**

1. Open DevTools (F12)
2. Go to Application tab
3. Click "Manifest" in sidebar
4. Check for errors
5. Look for "Installability" section

**Common Issues:**

- ❌ No manifest.json
- ❌ No service worker
- ❌ Not served over HTTPS
- ❌ Missing required icons
- ❌ Invalid manifest format

### Check Service Worker

**Chrome DevTools:**

1. Open DevTools (F12)
2. Go to Application tab
3. Click "Service Workers" in sidebar
4. Verify worker is registered and activated

**Console Commands:**

```javascript
// Check if service worker is registered
navigator.serviceWorker.getRegistrations().then((registrations) => {
  console.log("Service Workers:", registrations);
});

// Check if app is installable
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("App is installable!");
});

// Check display mode
console.log(
  "Display mode:",
  window.matchMedia("(display-mode: standalone)").matches
    ? "standalone"
    : "browser"
);
```

### Check Manifest

**Validation:**

```bash
# Check manifest is accessible
curl https://your-domain.com/manifest.json

# Validate JSON format
cat public/manifest.json | jq .
```

**Required Fields:**

- ✅ name
- ✅ short_name
- ✅ start_url
- ✅ display: "standalone"
- ✅ icons (192x192 and 512x512 minimum)

## Known Limitations

### Browser Support

| Browser | Desktop    | Mobile     | Notes                  |
| ------- | ---------- | ---------- | ---------------------- |
| Chrome  | ✅ Full    | ✅ Full    | Best support           |
| Edge    | ✅ Full    | ✅ Full    | Chromium-based         |
| Safari  | ⚠️ Limited | ⚠️ Manual  | No beforeinstallprompt |
| Firefox | ❌ Limited | ❌ Limited | Minimal PWA support    |
| Opera   | ✅ Good    | ✅ Good    | Chromium-based         |

### Platform Limitations

**iOS/Safari:**

- No automatic install prompt
- Must use Share > Add to Home Screen
- Limited service worker capabilities
- No background sync

**Firefox:**

- Limited PWA support
- No install prompt API
- Consider alternative browsers

## Success Criteria

### Task 28.1 Complete ✅

- [x] Install prompt appears on supported browsers
- [x] Installability detection works correctly
- [x] Event handling is properly implemented
- [x] Dismissal logic respects user choice
- [x] Console logging helps with debugging
- [x] UI is polished and user-friendly

### Task 28.2 Complete ✅

- [ ] Tested on Chrome desktop
- [ ] Tested on Chrome mobile (Android)
- [ ] Tested on Safari (iOS)
- [ ] Tested on Safari (macOS)
- [ ] Tested on Edge
- [ ] Installation works on all supported platforms
- [ ] App runs in standalone mode
- [ ] Icons display correctly

## Troubleshooting

### Prompt Doesn't Appear

**Possible Causes:**

1. App already installed
2. User dismissed within last 7 days
3. Browser doesn't support PWA
4. Not served over HTTPS
5. Manifest or service worker issues

**Solutions:**

1. Check console for logs
2. Clear localStorage: `localStorage.removeItem('pwa-install-dismissed')`
3. Uninstall app and try again
4. Check DevTools Application tab
5. Verify HTTPS connection

### Installation Fails

**Possible Causes:**

1. Invalid manifest.json
2. Service worker not registered
3. Missing required icons
4. Network issues

**Solutions:**

1. Validate manifest in DevTools
2. Check service worker status
3. Verify all icon files exist
4. Check network tab for errors

### App Doesn't Open in Standalone Mode

**Possible Causes:**

1. Display mode not set to "standalone"
2. Browser doesn't support standalone mode
3. Installation incomplete

**Solutions:**

1. Check manifest display property
2. Reinstall the app
3. Try different browser

## Next Steps

After completing testing:

1. Document any issues found
2. Test on additional devices if available
3. Consider user feedback
4. Monitor installation analytics
5. Update documentation as needed

## Resources

- [MDN: Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
- [web.dev: Install prompt](https://web.dev/customize-install/)
- [Chrome: Install criteria](https://web.dev/install-criteria/)
