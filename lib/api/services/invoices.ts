/**
 * Invoices API Service
 * Handles invoice CRUD operations
 */

import apiClient from '../client';
import { Invoice } from '../types';

export interface InvoiceQueryParams {
  paymentStatus?: string;
}

export interface UpdatePaymentStatusDto {
  paymentStatus: string;
}

export const invoicesApi = {
  /**
   * Generate invoice for resident
   * @param residentId - Resident ID
   * @returns Generated invoice
   */
  generate: async (residentId: string): Promise<Invoice> => {
    const response = await apiClient.post<Invoice>(`/invoices/generate/${residentId}`);
    return response.data;
  },

  /**
   * Get invoices by resident
   * @param residentId - Resident ID
   * @param params - Query parameters
   * @returns Array of invoices
   */
  getByResident: async (
    residentId: string,
    params?: InvoiceQueryParams
  ): Promise<Invoice[]> => {
    const response = await apiClient.get<Invoice[]>(
      `/invoices/resident/${residentId}`,
      { params }
    );
    return response.data;
  },

  /**
   * Get all invoices (for list page)
   * @param params - Query parameters
   * @returns Array of invoices
   */
  getAll: async (params?: InvoiceQueryParams): Promise<Invoice[]> => {
    const response = await apiClient.get<Invoice[]>('/invoices', { params });
    return response.data;
  },

  /**
   * Get invoice by ID
   * @param id - Invoice ID
   * @returns Invoice details
   */
  getById: async (id: string): Promise<Invoice> => {
    const response = await apiClient.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },

  /**
   * Update payment status
   * @param id - Invoice ID
   * @param data - Payment status data
   * @returns Updated invoice
   */
  updatePayment: async (
    id: string,
    data: UpdatePaymentStatusDto
  ): Promise<Invoice> => {
    const response = await apiClient.patch<Invoice>(
      `/invoices/${id}/payment`,
      data
    );
    return response.data;
  },
};
