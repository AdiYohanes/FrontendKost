/**
 * Users API Service
 * Handles user list and availability operations
 */

import apiClient from '../client';
import { User, UserRole } from '../types';

export interface UserQueryParams {
  role?: UserRole;
}

export const usersApi = {
  /**
   * Get list of users with optional role filter
   * @param params - Optional query params (role)
   * @returns Array of users
   */
  list: async (params?: UserQueryParams): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/user/list', { params });
    return response.data;
  },

  /**
   * Get list of PENGHUNI users that are not yet residents
   * @returns Array of PENGHUNI users
   */
  getAvailablePenghuni: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/user/available-penghuni');
    return response.data;
  },

  /**
   * Get user by ID
   * @param id - User ID
   * @returns User details
   * Note: This might not be explicitly in the new doc but kept for compatibility
   */
  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/user/${id}`);
    return response.data;
  },
};
