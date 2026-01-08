/**
 * Residents API Service
 * Handles resident CRUD operations
 */

import apiClient from '../client';
import { Resident } from '../types';

export interface CreateResidentDto {
  userId: string;
  roomId: string;
  billingCycleDate: number;
  entryDate: string;
}

export interface UpdateResidentDto {
  billingCycleDate?: number;
  exitDate?: string;
}

export interface ResidentQueryParams {
  isActive?: boolean;
}

export const residentsApi = {
  /**
   * Get all residents
   * @param params - Query parameters
   * @returns Array of residents
   */
  getAll: async (params?: ResidentQueryParams): Promise<Resident[]> => {
    const response = await apiClient.get<Resident[]>('/residents', { params });
    return response.data;
  },

  /**
   * Get resident by ID
   * @param id - Resident ID
   * @returns Resident details
   */
  getById: async (id: string): Promise<Resident> => {
    const response = await apiClient.get<Resident>(`/residents/${id}`);
    return response.data;
  },

  /**
   * Create new resident (onboard)
   * @param data - Resident data
   * @returns Created resident
   */
  create: async (data: CreateResidentDto): Promise<Resident> => {
    const response = await apiClient.post<Resident>('/residents', data);
    return response.data;
  },

  /**
   * Update resident
   * @param id - Resident ID
   * @param data - Updated resident data
   * @returns Updated resident
   */
  update: async (id: string, data: UpdateResidentDto): Promise<Resident> => {
    const response = await apiClient.patch<Resident>(`/residents/${id}`, data);
    return response.data;
  },

  /**
   * Process resident move-out
   * @param id - Resident ID
   * @returns Updated resident
   */
  moveOut: async (id: string): Promise<Resident> => {
    const response = await apiClient.patch<Resident>(`/residents/${id}/move-out`);
    return response.data;
  },
};
