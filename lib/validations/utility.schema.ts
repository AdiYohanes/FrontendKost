import { z } from 'zod';
import { UtilityType } from '../api/types';

/**
 * Utility Record Schema
 * Validates utility meter recording
 */
export const utilityRecordSchema = z
  .object({
    residentId: z.string().min(1, 'Resident is required'),
    utilityType: z.nativeEnum(UtilityType),
    previousMeter: z
      .number()
      .min(0, 'Previous meter must be at least 0')
      .nonnegative('Previous meter must be non-negative'),
    currentMeter: z
      .number()
      .min(0, 'Current meter must be at least 0')
      .nonnegative('Current meter must be non-negative'),
    ratePerUnit: z
      .number()
      .min(0, 'Rate per unit must be at least 0')
      .positive('Rate per unit must be positive'),
    readingDate: z.string().min(1, 'Reading date is required'),
  })
  .refine((data) => data.currentMeter >= data.previousMeter, {
    message: 'Current meter must be greater than or equal to previous meter',
    path: ['currentMeter'],
  });

export type UtilityRecordData = z.infer<typeof utilityRecordSchema>;

/**
 * Utility Filter Schema
 * Validates utility record filters
 */
export const utilityFilterSchema = z.object({
  residentId: z.string().optional(),
  utilityType: z.nativeEnum(UtilityType).optional(),
  isBilled: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type UtilityFilterData = z.infer<typeof utilityFilterSchema>;
