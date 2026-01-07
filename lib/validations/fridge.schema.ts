import { z } from 'zod';

/**
 * Fridge Item Schema
 * Validates fridge item creation and update
 */
export const fridgeItemSchema = z.object({
  itemName: z
    .string()
    .min(1, 'Item name is required')
    .max(50, 'Item name must be at most 50 characters'),
  quantity: z
    .number()
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1')
    .positive('Quantity must be positive'),
  dateIn: z.string().min(1, 'Date is required'),
});

export type FridgeItemFormData = z.infer<typeof fridgeItemSchema>;

/**
 * Fridge Item Update Schema
 * Validates fridge item quantity update
 */
export const fridgeItemUpdateSchema = z.object({
  quantity: z
    .number()
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1')
    .positive('Quantity must be positive'),
});

export type FridgeItemUpdateData = z.infer<typeof fridgeItemUpdateSchema>;
