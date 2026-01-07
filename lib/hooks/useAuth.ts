import { useAuthStore } from '@/lib/stores';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Custom hook for authentication operations
 * Provides convenient methods for login, logout, and auth checks
 */
export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, login, logout, checkAuth } = useAuthStore();

  const handleLogin = useCallback(
    (userData: Parameters<typeof login>[0], authToken: string) => {
      login(userData, authToken);
      // Store token in localStorage for API client
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', authToken);
      }
    },
    [login]
  );

  const handleLogout = useCallback(() => {
    logout();
    router.push('/login');
  }, [logout, router]);

  const requireAuth = useCallback(() => {
    if (!checkAuth()) {
      router.push('/login');
      return false;
    }
    return true;
  }, [checkAuth, router]);

  return {
    user,
    token,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
    checkAuth,
    requireAuth,
  };
}
