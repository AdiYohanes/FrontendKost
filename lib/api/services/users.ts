/**
 * Users API Service
 * Handles user operations
 */

import apiClient from '../client';
import { User, UserRole } from '../types';

export interface UserQueryParams {
  role?: UserRole;
}

export const usersApi = {
  /**
   * Get all users
   * @param params - Query parameters
   * @returns Array of users
   */
  getAll: async (params?: UserQueryParams): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users', { params });
    return response.data;
  },

  /**
   * Get user by ID
   * @param id - User ID
   * @returns User details
   */
  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },
};
