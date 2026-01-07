import { z } from 'zod';
import { InvoiceStatus } from '../api/types';

/**
 * Invoice Generation Schema
 * Validates invoice generation
 */
export const invoiceGenerationSchema = z.object({
  residentId: z.string().min(1, 'Resident is required'),
  billingDate: z.string().min(1, 'Billing date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
});

export type InvoiceGenerationData = z.infer<typeof invoiceGenerationSchema>;

/**
 * Invoice Payment Status Update Schema
 * Validates payment status update
 */
export const invoicePaymentStatusSchema = z.object({
  paymentStatus: z.nativeEnum(InvoiceStatus),
  paidDate: z.string().optional(),
});

export type InvoicePaymentStatusData = z.infer<
  typeof invoicePaymentStatusSchema
>;

/**
 * Invoice Filter Schema
 * Validates invoice list filters
 */
export const invoiceFilterSchema = z.object({
  residentId: z.string().optional(),
  paymentStatus: z.nativeEnum(InvoiceStatus).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
});

export type InvoiceFilterData = z.infer<typeof invoiceFilterSchema>;
