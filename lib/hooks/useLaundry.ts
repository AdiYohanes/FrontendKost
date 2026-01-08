/**
 * Laundry Hooks
 * Custom hooks for laundry data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  laundryApi,
  CreateLaundryDto,
  UpdateLaundryStatusDto,
  UpdateLaundryPaymentDto,
  LaundryQueryParams,
} from '../api/services/laundry';
import { queryKeys } from '../query/queryKeys';
import { LaundryTransaction } from '../api/types';

/**
 * Hook to fetch all laundry transactions
 */
export function useLaundry(params?: LaundryQueryParams) {
  return useQuery({
    queryKey: queryKeys.laundry.all(params),
    queryFn: () => laundryApi.getAll(params),
  });
}

/**
 * Hook to fetch laundry transactions by resident
 */
export function useLaundryByResident(residentId: string) {
  return useQuery({
    queryKey: queryKeys.laundry.byResident(residentId),
    queryFn: () => laundryApi.getByResident(residentId),
    enabled: !!residentId,
  });
}

/**
 * Hook to create laundry transaction
 */
export function useCreateLaundry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLaundryDto) => laundryApi.create(data),
    onMutate: async (newLaundry) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['laundry'] });

      // Snapshot previous value
      const previousLaundry = queryClient.getQueryData<LaundryTransaction[]>(
        queryKeys.laundry.all()
      );

      // Optimistically update to the new value
      if (previousLaundry) {
        queryClient.setQueryData<LaundryTransaction[]>(
          queryKeys.laundry.all(),
          (old) => [
            ...(old || []),
            {
              ...newLaundry,
              id: 'temp-' + Date.now(),
              status: 'PENDING',
              paymentStatus: 'UNPAID',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            } as LaundryTransaction,
          ]
        );
      }

      return { previousLaundry };
    },
    onError: (err, newLaundry, context) => {
      // Rollback on error
      if (context?.previousLaundry) {
        queryClient.setQueryData(queryKeys.laundry.all(), context.previousLaundry);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['laundry'] });
    },
  });
}

/**
 * Hook to update laundry status
 */
export function useUpdateLaundryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLaundryStatusDto }) =>
      laundryApi.updateStatus(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['laundry'] });

      // Snapshot previous values
      const previousLaundry = queryClient.getQueryData<LaundryTransaction[]>(
        queryKeys.laundry.all()
      );

      // Optimistically update laundry list
      if (previousLaundry) {
        queryClient.setQueryData<LaundryTransaction[]>(
          queryKeys.laundry.all(),
          (old) =>
            (old || []).map((laundry) =>
              laundry.id === id ? { ...laundry, ...data } : laundry
            )
        );
      }

      return { previousLaundry };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousLaundry) {
        queryClient.setQueryData(queryKeys.laundry.all(), context.previousLaundry);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['laundry'] });
    },
  });
}

/**
 * Hook to update laundry payment status
 */
export function useUpdateLaundryPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLaundryPaymentDto }) =>
      laundryApi.updatePayment(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['laundry'] });

      // Snapshot previous values
      const previousLaundry = queryClient.getQueryData<LaundryTransaction[]>(
        queryKeys.laundry.all()
      );

      // Optimistically update laundry list
      if (previousLaundry) {
        queryClient.setQueryData<LaundryTransaction[]>(
          queryKeys.laundry.all(),
          (old) =>
            (old || []).map((laundry) =>
              laundry.id === id ? { ...laundry, ...data } : laundry
            )
        );
      }

      return { previousLaundry };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousLaundry) {
        queryClient.setQueryData(queryKeys.laundry.all(), context.previousLaundry);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['laundry'] });
    },
  });
}
