import { z } from 'zod';
import { ExpenseCategory } from '../api/types';

/**
 * Expense Schema
 * Validates expense creation and update
 */
export const expenseSchema = z.object({
  category: z.nativeEnum(ExpenseCategory),
  amount: z
    .number()
    .min(0, 'Amount must be at least 0')
    .positive('Amount must be positive'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be at most 500 characters'),
  date: z.string().min(1, 'Date is required'),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

/**
 * Expense Filter Schema
 * Validates expense list filters
 */
export const expenseFilterSchema = z.object({
  category: z.nativeEnum(ExpenseCategory).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
  search: z.string().optional(),
});

export type ExpenseFilterData = z.infer<typeof expenseFilterSchema>;
