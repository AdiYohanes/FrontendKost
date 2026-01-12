/**
 * User Profile API Service
 * Handles user profile management (get, update basic info, update details)
 */

import apiClient from '../client';
import { User } from '../types';

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
}

export interface UpdateProfileDetailsRequest {
  idCard?: string;
  address?: string;
  emergencyContact?: string;
  emergencyContactName?: string;
}

export const profileApi = {
  /**
   * Get current user profile
   * @returns User profile data
   */
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/user/profile');
    return response.data;
  },

  /**
   * Update basic profile info (name, email, phone, password)
   * @param data - Data to update
   * @returns Updated user data
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.patch<User>('/user/profile', data);
    return response.data;
  },

  /**
   * Update advanced profile details (idCard, address, emergency contact)
   * @param data - Details to update
   * @returns Updated user data
   */
  updateProfileDetails: async (data: UpdateProfileDetailsRequest): Promise<User> => {
    const response = await apiClient.patch<User>('/user/profile/details', data);
    return response.data;
  },
};
