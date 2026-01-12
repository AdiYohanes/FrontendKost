import { z } from 'zod';

/**
 * Basic Profile Schema
 * Validates name, email, phone, and password updates
 */
export const basicProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').optional().or(z.literal('')),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional()
    .or(z.literal('')),
});

/**
 * Detailed Profile Schema
 * Validates ID Card, Address, Emergency Contact
 */
export const detailProfileSchema = z.object({
  idCard: z.string().min(16, 'ID Card (KTP) must be 16 digits').max(16).optional().or(z.literal('')),
  address: z.string().min(5, 'Address is too short').optional().or(z.literal('')),
  emergencyContact: z.string().min(10, 'Phone number must be at least 10 digits').optional().or(z.literal('')),
  emergencyContactName: z.string().min(2, 'Name is too short').optional().or(z.literal('')),
});

export type BasicProfileFormData = z.infer<typeof basicProfileSchema>;
export type DetailProfileFormData = z.infer<typeof detailProfileSchema>;
