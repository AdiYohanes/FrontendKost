import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Auth Middleware
 * Protects dashboard routes and handles authentication
 * Requirements: 1.3, 1.5
 */

// Public routes that don't require authentication
const publicRoutes = ['/login'];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login'];

/**
 * Decode JWT token to check expiration
 * Returns null if token is invalid or expired
 */
function decodeToken(token: string): { exp: number } | null {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = JSON.parse(
      Buffer.from(payload, 'base64').toString('utf-8')
    );

    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

/**
 * Check if token is expired
 */
function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  
  if (!decoded || !decoded.exp) {
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookie or check if it exists in the request
  // Note: The token is stored in localStorage on client side,
  // but we need to check authentication state
  const token = request.cookies.get('token')?.value;
  
  // For client-side routing, we'll check if user has auth-storage in cookies
  // This is set by Zustand persist middleware
  const authStorage = request.cookies.get('auth-storage')?.value;
  
  let isAuthenticated = false;
  let tokenFromStorage: string | null = null;

  // Try to get token from auth-storage cookie (Zustand persist)
  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage);
      tokenFromStorage = parsed.state?.token || null;
      isAuthenticated = parsed.state?.isAuthenticated || false;
    } catch (error) {
      console.error('Error parsing auth storage:', error);
    }
  }

  // Use token from cookie or from storage
  const userToken = token || tokenFromStorage;

  // Check if token exists and is not expired
  if (userToken) {
    if (isTokenExpired(userToken)) {
      // Token is expired, clear authentication
      isAuthenticated = false;
    } else {
      isAuthenticated = true;
    }
  }

  // Check if current route is public
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If user is authenticated and trying to access auth routes (like login)
  // Redirect to dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is not authenticated and trying to access protected routes
  // Redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    
    // Add redirect parameter to return to original page after login
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    
    return NextResponse.redirect(loginUrl);
  }

  // If token is expired, redirect to login with session expired message
  if (userToken && isTokenExpired(userToken) && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('session', 'expired');
    
    // Clear the expired token cookie if it exists
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('token');
    
    return response;
  }

  // Allow the request to proceed
  return NextResponse.next();
}

/**
 * Middleware configuration
 * Specify which routes should be processed by this middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api routes (if any)
     */
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|workbox-.*\\.js|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)',
  ],
};
