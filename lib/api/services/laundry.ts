/**
 * Laundry API Service
 * Handles laundry transaction operations
 */

import apiClient from '../client';
import { LaundryTransaction, LaundryStatus, LaundryPaymentStatus } from '../types';

export interface CreateLaundryDto {
  residentId: string;
  serviceType: string;
  weight: number;
  price: number;
  orderDate: string;
}

export interface UpdateLaundryStatusDto {
  status: LaundryStatus;
}

export interface UpdateLaundryPaymentDto {
  paymentStatus: LaundryPaymentStatus;
}

export interface LaundryQueryParams {
  status?: LaundryStatus;
  paymentStatus?: LaundryPaymentStatus;
}

export const laundryApi = {
  /**
   * Create laundry transaction
   * @param data - Laundry transaction data
   * @returns Created laundry transaction
   */
  create: async (data: CreateLaundryDto): Promise<LaundryTransaction> => {
    const response = await apiClient.post<LaundryTransaction>('/laundry', data);
    return response.data;
  },

  /**
   * Get all laundry transactions
   * @param params - Query parameters
   * @returns Array of laundry transactions
   */
  getAll: async (params?: LaundryQueryParams): Promise<LaundryTransaction[]> => {
    const response = await apiClient.get<LaundryTransaction[]>('/laundry', { params });
    return response.data;
  },

  /**
   * Get laundry transactions by resident
   * @param residentId - Resident ID
   * @returns Array of laundry transactions
   */
  getByResident: async (residentId: string): Promise<LaundryTransaction[]> => {
    const response = await apiClient.get<LaundryTransaction[]>(`/laundry/resident/${residentId}`);
    return response.data;
  },

  /**
   * Update laundry status
   * @param id - Laundry transaction ID
   * @param data - Status update data
   * @returns Updated laundry transaction
   */
  updateStatus: async (id: string, data: UpdateLaundryStatusDto): Promise<LaundryTransaction> => {
    const response = await apiClient.patch<LaundryTransaction>(`/laundry/${id}/status`, data);
    return response.data;
  },

  /**
   * Update laundry payment status
   * @param id - Laundry transaction ID
   * @param data - Payment status update data
   * @returns Updated laundry transaction
   */
  updatePayment: async (id: string, data: UpdateLaundryPaymentDto): Promise<LaundryTransaction> => {
    const response = await apiClient.patch<LaundryTransaction>(`/laundry/${id}/payment`, data);
    return response.data;
  },
};
