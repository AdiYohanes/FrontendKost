/**
 * Fridge API Service
 * Handles fridge item CRUD operations
 */

import apiClient from '../client';
import { FridgeItem } from '../types';

export interface CreateFridgeItemDto {
  itemName: string;
  quantity: number;
}

export interface UpdateFridgeItemDto {
  itemName?: string;
  quantity?: number;
}

export const fridgeApi = {
  /**
   * Get all fridge items
   * @returns Array of fridge items
   */
  getAll: async (): Promise<FridgeItem[]> => {
    const response = await apiClient.get<FridgeItem[]>('/fridge');
    return response.data;
  },

  /**
   * Create new fridge item
   * @param data - Fridge item data
   * @returns Created fridge item
   */
  create: async (data: CreateFridgeItemDto): Promise<FridgeItem> => {
    const response = await apiClient.post<FridgeItem>('/fridge', data);
    return response.data;
  },

  /**
   * Update fridge item
   * @param id - Fridge item ID
   * @param data - Updated fridge item data
   * @returns Updated fridge item
   */
  update: async (id: string, data: UpdateFridgeItemDto): Promise<FridgeItem> => {
    const response = await apiClient.patch<FridgeItem>(`/fridge/${id}`, data);
    return response.data;
  },

  /**
   * Delete fridge item
   * @param id - Fridge item ID
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/fridge/${id}`);
  },
};
