import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  role: 'OWNER' | 'PENJAGA' | 'PENGHUNI';
  name?: string;
  email?: string;
  phoneNumber?: string;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => Promise<void>;
  checkAuth: () => boolean;
  setUser: (user: User) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (user: User, accessToken: string, refreshToken: string) => {
        // Store tokens in localStorage for API client
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          
          // Set cookie for middleware (short-lived for access token)
          document.cookie = `token=${accessToken}; path=/; max-age=${60 * 15}; SameSite=Lax`;
        }
        
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      logout: async () => {
        // Call logout API to revoke refresh token
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (refreshToken) {
            try {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
              await fetch(`${apiUrl}/auth/logout`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({ refreshToken }),
              });
            } catch (error) {
              console.error('Logout API call failed:', error);
            }
          }

          // Clear localStorage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          
          // Clear the Zustand persist storage
          localStorage.removeItem('auth-storage');
          
          // Clear the token cookie
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      checkAuth: () => {
        const state = get();
        return state.isAuthenticated && !!state.accessToken;
      },

      setUser: (user: User) => {
        set({ user });
      },

      updateTokens: (accessToken: string, refreshToken: string) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          
          // Update cookie
          document.cookie = `token=${accessToken}; path=/; max-age=${60 * 15}; SameSite=Lax`;
        }
        
        set({ accessToken, refreshToken });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
