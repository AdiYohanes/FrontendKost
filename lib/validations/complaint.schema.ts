import { z } from 'zod';
import { ComplaintStatus } from '../api/types';

/**
 * Complaint Creation Schema
 * Validates complaint submission
 */
export const complaintSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be at most 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be at most 1000 characters'),
  photos: z.array(z.string()),
});

export type ComplaintFormData = z.infer<typeof complaintSchema>;

/**
 * Complaint Status Update Schema
 * Validates complaint status update
 */
export const complaintStatusUpdateSchema = z.object({
  status: z.nativeEnum(ComplaintStatus),
  resolutionNotes: z.string().optional(),
});

export type ComplaintStatusUpdateData = z.infer<
  typeof complaintStatusUpdateSchema
>;

/**
 * Complaint Filter Schema
 * Validates complaint list filters
 */
export const complaintFilterSchema = z.object({
  residentId: z.string().optional(),
  status: z.nativeEnum(ComplaintStatus).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
});

export type ComplaintFilterData = z.infer<typeof complaintFilterSchema>;
