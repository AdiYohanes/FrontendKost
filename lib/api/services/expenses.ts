/**
 * Expenses API Service
 * Handles expense CRUD operations
 */

import apiClient from '../client';
import { Expense, ExpenseCategory } from '../types';

export interface CreateExpenseDto {
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: string; // YYYY-MM-DD format
}

export interface ExpenseQueryParams {
  category?: ExpenseCategory;
  startDate?: string; // YYYY-MM-DD format
  endDate?: string; // YYYY-MM-DD format
}

export const expensesApi = {
  /**
   * Get all expenses with optional filters
   * @param params - Query parameters for filtering
   * @returns Array of expenses
   */
  getAll: async (params?: ExpenseQueryParams): Promise<Expense[]> => {
    const response = await apiClient.get<Expense[]>('/expenses', { params });
    return response.data;
  },

  /**
   * Get expense by ID
   * @param id - Expense ID
   * @returns Expense details
   */
  getById: async (id: string): Promise<Expense> => {
    const response = await apiClient.get<Expense>(`/expenses/${id}`);
    return response.data;
  },

  /**
   * Create new expense
   * @param data - Expense data
   * @returns Created expense
   */
  create: async (data: CreateExpenseDto): Promise<Expense> => {
    const response = await apiClient.post<Expense>('/expenses', data);
    return response.data;
  },
};
