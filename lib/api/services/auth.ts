/**
 * Authentication API Service
 * Handles login, logout, refresh token, and token management
 */

import apiClient from '../client';
import { AuthResponse } from '../types';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  /**
   * Login user with credentials
   * @param credentials - Username and password
   * @returns Auth response with tokens and user data
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    // Backend returns { accessToken, refreshToken, user }
    return response.data;
  },

  /**
   * Refresh access token using refresh token
   * @param refreshToken - Current refresh token
   * @returns New access token and refresh token
   */
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data;
  },

  /**
   * Logout user and revoke refresh token
   * @param refreshToken - Current refresh token to revoke
   */
  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/auth/logout', { refreshToken });
    
    // Clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
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
   * @returns True if access token exists
   */
  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('accessToken');
    }
    return false;
  },
};
