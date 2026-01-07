/**
 * Authentication API Service
 * Handles login, logout, and token management
 */

import apiClient from '../client';
import { AuthResponse } from '../types';

export interface LoginCredentials {
  username: string;
  password: string;
}

export const authApi = {
  /**
   * Login user with credentials
   * @param credentials - Username and password
   * @returns Auth response with token and user data
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    // Backend returns { accessToken, user } directly without wrapper
    return response.data;
  },

  /**
   * Logout user
   * Clears token from localStorage
   */
  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Get current user from localStorage
   * @returns User object or null
   */
  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  /**
   * Check if user is authenticated
   * @returns True if token exists
   */
  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  },
};
