/**
 * Complaints API Service
 * Handles complaint management operations
 */

import apiClient from '../client';
import { Complaint, ComplaintStatus } from '../types';

export interface CreateComplaintDto {
  title: string;
  description: string;
  photos?: string[];
}

export interface UpdateComplaintStatusDto {
  status: ComplaintStatus;
  resolutionNotes?: string;
}

export const complaintsApi = {
  /**
   * Create a new complaint
   * @param data - Complaint data
   * @returns Created complaint
   */
  create: async (data: CreateComplaintDto): Promise<Complaint> => {
    const response = await apiClient.post<Complaint>('/complaints', data);
    return response.data;
  },

  /**
   * Get all complaints with optional filters
   * @param params - Filter parameters
   * @returns List of complaints
   */
  getAll: async (params?: { status?: string }): Promise<Complaint[]> => {
    const response = await apiClient.get<Complaint[]>('/complaints', {
      params,
    });
    return response.data;
  },

  /**
   * Get complaint by ID
   * @param id - Complaint ID
   * @returns Complaint details
   */
  getById: async (id: string): Promise<Complaint> => {
    const response = await apiClient.get<Complaint>(`/complaints/${id}`);
    return response.data;
  },

  /**
   * Update complaint status
   * @param id - Complaint ID
   * @param data - Status update data
   * @returns Updated complaint
   */
  updateStatus: async (
    id: string,
    data: UpdateComplaintStatusDto
  ): Promise<Complaint> => {
    const response = await apiClient.patch<Complaint>(
      `/complaints/${id}/status`,
      data
    );
    return response.data;
  },
};
