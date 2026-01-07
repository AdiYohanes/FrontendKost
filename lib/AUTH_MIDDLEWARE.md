# Authentication Middleware Documentation

## Overview

The authentication middleware protects dashboard routes and handles user authentication state. It runs on every request to ensure users are properly authenticated before accessing protected resources.

**Requirements Implemented:**

- Requirement 1.3: Token expiration checking
- Requirement 1.5: Redirect unauthenticated users to login

## How It Works

### 1. Token Storage

The authentication system uses multiple storage mechanisms:

- **localStorage**: Stores the JWT token for API requests (client-side)
- **Cookies**: Stores the token for middleware access (server-side)
- **Zustand Store**: Manages authentication state (client-side)

When a user logs in:

```typescript
// Token is stored in localStorage
localStorage.setItem("token", token);

// Token is also set as a cookie for middleware
document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

// Auth state is updated in Zustand store
set({ user, token, isAuthenticated: true });
```

### 2. Middleware Flow

```
Request → Middleware → Check Authentication → Route Decision
```

#### Step-by-Step Process:

1. **Extract Token**: Middleware reads token from cookies
2. **Check Expiration**: Decodes JWT and validates expiration time
3. **Route Protection**: Determines if route requires authentication
4. **Redirect Logic**:
   - Unauthenticated user accessing protected route → Redirect to `/login`
   - Authenticated user accessing login page → Redirect to `/`
   - Expired token → Redirect to `/login?session=expired`

### 3. Protected Routes

All routes are protected by default **except**:

- `/login` - Login page
- Static assets (images, icons, manifest, etc.)
- Next.js internal routes (\_next/\*)

### 4. Token Expiration

The middleware checks token expiration by:

```typescript
function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);

  if (!decoded || !decoded.exp) {
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}
```

If the token is expired:

- User is redirected to login with `?session=expired` parameter
- Login page displays: "Sesi Anda telah berakhir. Silakan masuk kembali."
- Token cookie is cleared

### 5. Redirect After Login

When a user is redirected to login, the original URL is preserved:

```
User tries to access: /rooms/123
↓
Redirected to: /login?redirect=/rooms/123
↓
After successful login: Redirected back to /rooms/123
```

## API Integration

The API client (`lib/api/client.ts`) also handles 401 errors:

```typescript
case 401:
  // Clear all auth data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

  // Redirect with session expired message
  window.location.href = '/login?session=expired';
  break;
```

This ensures that if the API returns 401 (unauthorized), the user is immediately logged out and redirected.

## Logout Flow

When a user logs out:

```typescript
logout: () => {
  // Clear localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Clear token cookie
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

  // Reset auth state
  set({ user: null, token: null, isAuthenticated: false });
};
```

## Security Considerations

1. **JWT Validation**: Token is decoded and expiration is checked on every request
2. **Cookie Security**: Cookies use `SameSite=Lax` to prevent CSRF attacks
3. **Token Cleanup**: Expired tokens are immediately cleared from cookies
4. **Client-Side Protection**: API client also validates and handles 401 errors

## Testing the Middleware

### Manual Testing Steps:

1. **Test Unauthenticated Access**:
   - Clear all cookies and localStorage
   - Try to access `/` or any dashboard route
   - Should redirect to `/login`

2. **Test Login Redirect**:
   - Try to access `/rooms/123` without authentication
   - Should redirect to `/login?redirect=/rooms/123`
   - After login, should return to `/rooms/123`

3. **Test Session Expiration**:
   - Login with a valid token
   - Wait for token to expire (or manually set an expired token)
   - Try to access any protected route
   - Should redirect to `/login?session=expired`
   - Should see "Sesi Anda telah berakhir" message

4. **Test Authenticated Login Access**:
   - Login successfully
   - Try to access `/login` again
   - Should redirect to `/` (dashboard)

## Configuration

The middleware matcher configuration excludes:

- Static files (images, icons, etc.)
- Next.js internal routes
- PWA files (manifest.json, service worker)

```typescript
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|workbox-.*\\.js|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)",
  ],
};
```

## Future Enhancements

- Add role-based route protection (OWNER, PENJAGA, PENGHUNI)
- Implement refresh token mechanism
- Add rate limiting for login attempts
- Add session timeout warning before expiration
