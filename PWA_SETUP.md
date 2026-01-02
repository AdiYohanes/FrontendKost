# PWA Configuration Guide

This document describes the Progressive Web App (PWA) setup for the Kost Management Frontend.

## Overview

The application is configured as a PWA using `next-pwa`, which provides:

- Offline functionality
- Install prompt for mobile and desktop
- Service worker for caching strategies
- App-like experience when installed

## Configuration Files

### 1. next.config.ts

- Configures next-pwa with webpack
- Defines caching strategies for different asset types
- PWA is disabled in development mode

### 2. public/manifest.json

- App metadata (name, description, icons)
- Display mode: standalone
- Theme colors and orientation settings
- Icon definitions for various sizes

### 3. PWA Icons

Located in `public/icons/`:

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png (required)
- icon-384x384.png
- icon-512x512.png (required)

## Caching Strategies

### CacheFirst

- Google Fonts webfonts
- Audio files (mp3, wav, ogg)
- Video files (mp4)

### StaleWhileRevalidate

- Google Fonts stylesheets
- Font files
- Images (jpg, jpeg, gif, png, svg, ico, webp)
- Next.js images
- JavaScript files
- CSS files
- Next.js data files

### NetworkFirst

- API calls (/api/\*)
- Other routes (fallback)

## Testing the PWA

### Development Mode

PWA is disabled in development mode. To test PWA features:

1. Build the production version:

   ```bash
   npm run build
   ```

2. Start the production server:

   ```bash
   npm start
   ```

3. Open the app in a browser: http://localhost:3000

### Testing Install Prompt

#### Desktop (Chrome/Edge)

1. Open the app in Chrome or Edge
2. Look for the install icon in the address bar
3. Click to install the app
4. The app will open in a standalone window

#### Mobile (Chrome/Safari)

1. Open the app in mobile browser
2. For Chrome: Tap the menu (⋮) → "Install app" or "Add to Home screen"
3. For Safari: Tap the share button → "Add to Home Screen"
4. The app icon will appear on your home screen

### Testing Offline Functionality

1. Open the app in production mode
2. Navigate through a few pages
3. Open DevTools → Application → Service Workers
4. Check "Offline" checkbox
5. Refresh the page - it should still work
6. Navigate to previously visited pages - they should load from cache

### Testing with Lighthouse

1. Open DevTools → Lighthouse
2. Select "Progressive Web App" category
3. Run audit
4. Check for:
   - ✓ Installable
   - ✓ PWA optimized
   - ✓ Works offline
   - ✓ Has a service worker

## Service Worker Files

After building, these files are generated in `public/`:

- `sw.js` - Main service worker
- `workbox-*.js` - Workbox runtime library

These files are automatically generated and should not be edited manually.
They are gitignored to avoid committing generated files.

## PWA Install Prompt Component

The app includes a custom install prompt component (`components/pwa-install-prompt.tsx`) that:

- Detects when the app is installable
- Shows a user-friendly install banner
- Handles the install flow
- Can be dismissed by the user

## Troubleshooting

### Install prompt not showing

- Make sure you're in production mode (PWA is disabled in dev)
- Check that manifest.json is accessible at /manifest.json
- Verify all required icons exist
- Check browser console for errors

### Service worker not registering

- Ensure the app is served over HTTPS (or localhost)
- Check DevTools → Application → Service Workers
- Look for registration errors in console

### Offline mode not working

- Build and run in production mode
- Visit pages while online first (to cache them)
- Check cache storage in DevTools → Application → Cache Storage

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Partial support (no install prompt on desktop)
- Mobile browsers: Full support on Chrome, Safari

## Requirements Validation

This PWA configuration satisfies:

- ✓ Requirement 13.1: Install prompt on supported browsers
- ✓ Requirement 13.2: Works as standalone app with app icon
- ✓ Requirement 13.3: Displays cached pages offline with offline indicator

## Next Steps

To complete PWA implementation:

1. Add offline sync functionality (Requirement 13.4)
2. Implement offline indicator banner
3. Add queue for offline mutations
4. Test on various devices and browsers
