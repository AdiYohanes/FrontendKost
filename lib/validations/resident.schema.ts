import { z } from 'zod';

/**
 * Resident Onboarding Schema
 * Validates resident onboarding wizard
 */
export const residentOnboardingSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  roomId: z.string().min(1, 'Room is required'),
  billingCycleDate: z
    .number()
    .int('Billing cycle date must be an integer')
    .min(1, 'Billing cycle date must be between 1 and 31')
    .max(31, 'Billing cycle date must be between 1 and 31'),
  entryDate: z.string().min(1, 'Entry date is required'),
});

export type ResidentOnboardingData = z.infer<typeof residentOnboardingSchema>;

/**
 * Move-out Schema
 * Validates resident move-out
 */
export const moveOutSchema = z.object({
  exitDate: z.string().min(1, 'Exit date is required'),
});

export type MoveOutData = z.infer<typeof moveOutSchema>;

/**
 * Resident Filter Schema
 * Validates resident list filters
 */
export const residentFilterSchema = z.object({
  isActive: z.boolean().optional(),
  roomId: z.string().optional(),
  search: z.string().optional(),
});

export type ResidentFilterData = z.infer<typeof residentFilterSchema>;
