import { z } from 'zod';
import { RoomStatus } from '../api/types';

/**
 * Room Form Schema
 * Validates room creation and update
 */
export const roomSchema = z.object({
  roomNumber: z
    .string()
    .min(1, 'Room number is required')
    .max(10, 'Room number must be at most 10 characters'),
  rentalPrice: z
    .number()
    .min(0, 'Rental price must be at least 0')
    .positive('Rental price must be positive'),
  facilities: z.record(z.string(), z.unknown()),
  status: z.nativeEnum(RoomStatus),
});

export type RoomFormData = z.infer<typeof roomSchema>;

/**
 * Room Filter Schema
 * Validates room list filters
 */
export const roomFilterSchema = z.object({
  status: z.nativeEnum(RoomStatus).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  search: z.string().optional(),
});

export type RoomFilterData = z.infer<typeof roomFilterSchema>;
