/**
 * Fridge Hooks
 * Custom hooks for fridge item data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fridgeApi, CreateFridgeItemDto, UpdateFridgeItemDto } from '../api/services/fridge';
import { queryKeys } from '../query/queryKeys';
import { FridgeItem } from '../api/types';

/**
 * Hook to fetch all fridge items
 */
export function useFridgeItems(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.fridge.all,
    queryFn: () => fridgeApi.getAll(),
    enabled: options?.enabled !== false,
  });
}

/**
 * Hook to create fridge item
 */
export function useCreateFridgeItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFridgeItemDto) => fridgeApi.create(data),
    onMutate: async (newItem) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.fridge.all });

      // Snapshot previous value
      const previousItems = queryClient.getQueryData<FridgeItem[]>(
        queryKeys.fridge.all
      );

      // Optimistically update to the new value
      if (previousItems) {
        queryClient.setQueryData<FridgeItem[]>(queryKeys.fridge.all, (old) => [
          ...(old || []),
          {
            ...newItem,
            id: 'temp-' + Date.now(),
            ownerId: 'temp-owner',
            dateIn: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as FridgeItem,
        ]);
      }

      return { previousItems };
    },
    onError: (err, newItem, context) => {
      // Rollback on error
      if (context?.previousItems) {
        queryClient.setQueryData(queryKeys.fridge.all, context.previousItems);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.fridge.all });
    },
  });
}

/**
 * Hook to update fridge item
 */
export function useUpdateFridgeItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFridgeItemDto }) =>
      fridgeApi.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.fridge.all });

      // Snapshot previous value
      const previousItems = queryClient.getQueryData<FridgeItem[]>(
        queryKeys.fridge.all
      );

      // Optimistically update item in list
      if (previousItems) {
        queryClient.setQueryData<FridgeItem[]>(queryKeys.fridge.all, (old) =>
          (old || []).map((item) =>
            item.id === id ? { ...item, ...data } : item
          )
        );
      }

      return { previousItems };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousItems) {
        queryClient.setQueryData(queryKeys.fridge.all, context.previousItems);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.fridge.all });
    },
  });
}

/**
 * Hook to delete fridge item
 */
export function useDeleteFridgeItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fridgeApi.delete(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.fridge.all });

      // Snapshot previous value
      const previousItems = queryClient.getQueryData<FridgeItem[]>(
        queryKeys.fridge.all
      );

      // Optimistically remove from list
      if (previousItems) {
        queryClient.setQueryData<FridgeItem[]>(queryKeys.fridge.all, (old) =>
          (old || []).filter((item) => item.id !== id)
        );
      }

      return { previousItems };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousItems) {
        queryClient.setQueryData(queryKeys.fridge.all, context.previousItems);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.fridge.all });
    },
  });
}
