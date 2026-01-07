import { z } from 'zod';
import { LaundryStatus, LaundryPaymentStatus } from '../api/types';

/**
 * Laundry Transaction Schema
 * Validates laundry transaction creation
 */
export const laundryTransactionSchema = z.object({
  residentId: z.string().min(1, 'Resident is required'),
  serviceType: z.string().min(1, 'Service type is required'),
  weight: z
    .number()
    .min(0, 'Weight must be at least 0')
    .positive('Weight must be positive'),
  price: z
    .number()
    .min(0, 'Price must be at least 0')
    .positive('Price must be positive'),
  orderDate: z.string().min(1, 'Order date is required'),
});

export type LaundryTransactionData = z.infer<typeof laundryTransactionSchema>;

/**
 * Laundry Status Update Schema
 * Validates laundry status update
 */
export const laundryStatusUpdateSchema = z.object({
  status: z.nativeEnum(LaundryStatus),
  completedDate: z.string().optional(),
});

export type LaundryStatusUpdateData = z.infer<typeof laundryStatusUpdateSchema>;

/**
 * Laundry Payment Update Schema
 * Validates laundry payment status update
 */
export const laundryPaymentUpdateSchema = z.object({
  paymentStatus: z.nativeEnum(LaundryPaymentStatus),
});

export type LaundryPaymentUpdateData = z.infer<
  typeof laundryPaymentUpdateSchema
>;

/**
 * Laundry Filter Schema
 * Validates laundry transaction filters
 */
export const laundryFilterSchema = z.object({
  residentId: z.string().optional(),
  status: z.nativeEnum(LaundryStatus).optional(),
  paymentStatus: z.nativeEnum(LaundryPaymentStatus).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type LaundryFilterData = z.infer<typeof laundryFilterSchema>;
