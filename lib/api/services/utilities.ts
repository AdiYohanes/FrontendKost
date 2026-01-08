/**
 * Utilities API Service
 * Handles utility meter recording and history
 */

import apiClient from '../client';
import { UtilityRecord, UtilityType } from '../types';

export interface CreateUtilityDto {
  residentId: string;
  utilityType: UtilityType;
  previousMeter: number;
  currentMeter: number;
  ratePerUnit: number;
  readingDate: string;
}

export interface UtilityQueryParams {
  utilityType?: UtilityType;
  isBilled?: boolean;
}

export const utilitiesApi = {
  /**
   * Create utility record
   * @param data - Utility record data
   * @returns Created utility record
   */
  create: async (data: CreateUtilityDto): Promise<UtilityRecord> => {
    const response = await apiClient.post<UtilityRecord>('/utilities', data);
    return response.data;
  },

  /**
   * Get utility records by resident
   * @param residentId - Resident ID
   * @param params - Query parameters
   * @returns Array of utility records
   */
  getByResident: async (
    residentId: string,
    params?: UtilityQueryParams
  ): Promise<UtilityRecord[]> => {
    const response = await apiClient.get<UtilityRecord[]>(
      `/utilities/resident/${residentId}`,
      { params }
    );
    return response.data;
  },
};
