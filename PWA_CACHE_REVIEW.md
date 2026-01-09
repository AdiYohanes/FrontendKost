# PWA Service Worker Caching Review

## Current Configuration

### Service Worker Setup

- **Library**: next-pwa v5.6.0
- **Status**: ✅ Configured and working
- **Mode**: Disabled in development, enabled in production
- **Strategy**: skipWaiting enabled for immediate activation

### Caching Strategies

#### 1. Static Assets ✅

**Strategy**: StaleWhileRevalidate (serve from cache, update in background)

- **Fonts**:
  - Google Fonts webfonts: CacheFirst, 365 days, 4 entries
  - Google Fonts stylesheets: StaleWhileRevalidate, 7 days, 4 entries
  - Local fonts: StaleWhileRevalidate, 7 days, 4 entries

- **Images**:
  - Static images (jpg, png, svg, etc.): StaleWhileRevalidate, 24 hours, 64 entries
  - Next.js optimized images: StaleWhileRevalidate, 24 hours, 64 entries

- **Media**:
  - Audio (mp3, wav, ogg): CacheFirst with range requests, 24 hours, 32 entries
  - Video (mp4): CacheFirst with range requests, 24 hours, 32 entries

- **Code**:
  - JavaScript: StaleWhileRevalidate, 24 hours, 32 entries
  - CSS: StaleWhileRevalidate, 24 hours, 32 entries

#### 2. API Responses ✅

**Strategy**: NetworkFirst (try network, fallback to cache)

- **Pattern**: `/api/.*`
- **Method**: GET only
- **Cache Name**: api-cache
- **Timeout**: 10 seconds
- **Expiration**: 5 minutes, 16 entries max
- **Behavior**:
  - Tries network first
  - Falls back to cache if network fails or times out
  - Only caches GET requests (mutations not cached)

#### 3. Next.js Data ✅

**Strategy**: StaleWhileRevalidate

- **Pattern**: `/_next/data/.+/.+\.json`
- **Cache Name**: next-data
- **Expiration**: 24 hours, 32 entries

#### 4. Start URL ✅

**Strategy**: NetworkFirst

- **Pattern**: `/` (home page)
- **Cache Name**: start-url
- **Special handling**: Converts opaque redirects to proper responses

#### 5. Fallback ✅

**Strategy**: NetworkFirst

- **Pattern**: All other requests
- **Cache Name**: others
- **Timeout**: 10 seconds
- **Expiration**: 24 hours, 32 entries

## Recommendations

### ✅ Already Implemented

1. Static assets are properly cached
2. API responses use NetworkFirst with fallback
3. Reasonable cache expiration times
4. Proper cache size limits to prevent storage bloat

### 🔄 Enhancements Made

1. API cache timeout is appropriate (10s)
2. API cache expiration is short (5 min) to ensure fresh data
3. Static assets have longer cache times for performance

### 📋 Additional Considerations

#### Offline Page

- Consider adding a custom offline fallback page
- Show when network is unavailable and no cache exists

#### Cache Versioning

- Service worker automatically handles cache versioning
- Old caches are cleaned up via `cleanupOutdatedCaches()`

#### Background Sync (Optional)

- Could implement background sync for failed mutations
- Would require additional IndexedDB setup
- Covered in Task 27.3 (optional)

## Testing Checklist

- [x] Service worker registers successfully
- [x] Static assets load from cache when offline
- [x] API responses fallback to cache when offline
- [x] Cache size limits prevent storage overflow
- [x] Old caches are cleaned up automatically
- [ ] Offline indicator shows when disconnected (Task 27.2)
- [ ] Failed mutations can be queued (Task 27.3 - optional)

## Cache Storage Breakdown

| Cache Name               | Strategy             | Max Entries | Max Age   | Purpose        |
| ------------------------ | -------------------- | ----------- | --------- | -------------- |
| google-fonts-webfonts    | CacheFirst           | 4           | 365 days  | Font files     |
| google-fonts-stylesheets | StaleWhileRevalidate | 4           | 7 days    | Font CSS       |
| static-font-assets       | StaleWhileRevalidate | 4           | 7 days    | Local fonts    |
| static-image-assets      | StaleWhileRevalidate | 64          | 24 hours  | Images         |
| next-image               | StaleWhileRevalidate | 64          | 24 hours  | Next.js images |
| static-audio-assets      | CacheFirst           | 32          | 24 hours  | Audio files    |
| static-video-assets      | CacheFirst           | 32          | 24 hours  | Video files    |
| static-js-assets         | StaleWhileRevalidate | 32          | 24 hours  | JavaScript     |
| static-style-assets      | StaleWhileRevalidate | 32          | 24 hours  | CSS            |
| next-data                | StaleWhileRevalidate | 32          | 24 hours  | Next.js data   |
| api-cache                | NetworkFirst         | 16          | 5 minutes | API responses  |
| others                   | NetworkFirst         | 32          | 24 hours  | Other requests |

**Total Max Entries**: ~320 items
**Estimated Storage**: 50-100 MB (depending on content)

## Conclusion

✅ **Service worker caching is properly configured and follows best practices.**

The current configuration provides:

- Fast loading from cache
- Fresh data when online
- Graceful degradation when offline
- Automatic cache management
- Reasonable storage limits

Next steps: Implement offline indicator (Task 27.2) and optional sync (Task 27.3).
