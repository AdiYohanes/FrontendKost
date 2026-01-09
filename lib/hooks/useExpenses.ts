/**
 * Expenses Hooks
 * Custom hooks for expense data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expensesApi, CreateExpenseDto, ExpenseQueryParams } from '../api/services/expenses';
import { queryKeys } from '../query/queryKeys';
import { Expense } from '../api/types';

/**
 * Hook to fetch all expenses with optional filters
 */
export function useExpenses(params?: ExpenseQueryParams) {
  return useQuery({
    queryKey: queryKeys.expenses.all(params),
    queryFn: () => expensesApi.getAll(params),
  });
}

/**
 * Hook to fetch expense by ID
 */
export function useExpenseById(id: string) {
  return useQuery({
    queryKey: queryKeys.expenses.detail(id),
    queryFn: () => expensesApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create expense
 */
export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseDto) => expensesApi.create(data),
    onMutate: async (newExpense) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['expenses'] });

      // Snapshot previous value
      const previousExpenses = queryClient.getQueryData<Expense[]>(
        queryKeys.expenses.all()
      );

      // Optimistically update to the new value
      if (previousExpenses) {
        queryClient.setQueryData<Expense[]>(queryKeys.expenses.all(), (old) => [
          ...(old || []),
          {
            ...newExpense,
            id: 'temp-' + Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as Expense,
        ]);
      }

      return { previousExpenses };
    },
    onError: (err, newExpense, context) => {
      // Rollback on error
      if (context?.previousExpenses) {
        queryClient.setQueryData(queryKeys.expenses.all(), context.previousExpenses);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}
