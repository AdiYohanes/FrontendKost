/**
 * Rooms API Service
 * Handles room CRUD operations
 */

import apiClient from '../client';
import { Room, RoomStatus } from '../types';

export interface CreateRoomDto {
  roomNumber: string;
  floor?: number;
  rentalPrice: number;
  facilities?: Record<string, unknown>;
  status: RoomStatus;
}

export interface UpdateRoomDto {
  roomNumber?: string;
  floor?: number;
  rentalPrice?: number;
  facilities?: Record<string, unknown>;
  status?: RoomStatus;
}

export const roomsApi = {
  /**
   * Get all rooms
   * @returns Array of rooms
   */
  getAll: async (): Promise<Room[]> => {
    const response = await apiClient.get<Room[]>('/rooms');
    return response.data;
  },

  /**
   * Get room by ID
   * @param id - Room ID
   * @returns Room details
   */
  getById: async (id: string): Promise<Room> => {
    const response = await apiClient.get<Room>(`/rooms/${id}`);
    return response.data;
  },

  /**
   * Create new room
   * @param data - Room data
   * @returns Created room
   */
  create: async (data: CreateRoomDto): Promise<Room> => {
    const response = await apiClient.post<Room>('/rooms', data);
    return response.data;
  },

  /**
   * Update room
   * @param id - Room ID
   * @param data - Updated room data
   * @returns Updated room
   */
  update: async (id: string, data: UpdateRoomDto): Promise<Room> => {
    const response = await apiClient.patch<Room>(`/rooms/${id}`, data);
    return response.data;
  },

  /**
   * Delete room
   * @param id - Room ID
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/rooms/${id}`);
  },
};
