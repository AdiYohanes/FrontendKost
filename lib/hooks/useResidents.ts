/**
 * Residents Hooks
 * Custom hooks for resident data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  residentsApi,
  CreateResidentDto,
  UpdateResidentDto,
  ResidentQueryParams,
} from '../api/services/residents';
import { queryKeys } from '../query/queryKeys';
import { Resident } from '../api/types';

/**
 * Hook to fetch all residents
 */
export function useResidents(params?: ResidentQueryParams & { enabled?: boolean }) {
  const { enabled, ...queryParams } = params || {};
  return useQuery({
    queryKey: queryKeys.residents.all(queryParams),
    queryFn: () => residentsApi.getAll(queryParams),
    enabled: enabled !== false,
  });
}

/**
 * Hook to fetch resident by ID
 */
export function useResident(id: string) {
  return useQuery({
    queryKey: queryKeys.residents.detail(id),
    queryFn: () => residentsApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create resident (onboard)
 */
export function useCreateResident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResidentDto) => residentsApi.create(data),
    onMutate: async (newResident) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['residents'] });

      // Snapshot previous value
      const previousResidents = queryClient.getQueryData<Resident[]>(
        queryKeys.residents.all()
      );

      // Optimistically update to the new value
      if (previousResidents) {
        queryClient.setQueryData<Resident[]>(queryKeys.residents.all(), (old) => [
          ...(old || []),
          {
            ...newResident,
            id: 'temp-' + Date.now(),
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as Resident,
        ]);
      }

      return { previousResidents };
    },
    onError: (err, newResident, context) => {
      // Rollback on error
      if (context?.previousResidents) {
        queryClient.setQueryData(
          queryKeys.residents.all(),
          context.previousResidents
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
  });
}

/**
 * Hook to update resident
 */
export function useUpdateResident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateResidentDto }) =>
      residentsApi.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['residents'] });
      await queryClient.cancelQueries({
        queryKey: queryKeys.residents.detail(id),
      });

      // Snapshot previous values
      const previousResidents = queryClient.getQueryData<Resident[]>(
        queryKeys.residents.all()
      );
      const previousResident = queryClient.getQueryData<Resident>(
        queryKeys.residents.detail(id)
      );

      // Optimistically update resident list
      if (previousResidents) {
        queryClient.setQueryData<Resident[]>(queryKeys.residents.all(), (old) =>
          (old || []).map((resident) =>
            resident.id === id ? { ...resident, ...data } : resident
          )
        );
      }

      // Optimistically update resident detail
      if (previousResident) {
        queryClient.setQueryData<Resident>(queryKeys.residents.detail(id), {
          ...previousResident,
          ...data,
        });
      }

      return { previousResidents, previousResident };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousResidents) {
        queryClient.setQueryData(
          queryKeys.residents.all(),
          context.previousResidents
        );
      }
      if (context?.previousResident) {
        queryClient.setQueryData(
          queryKeys.residents.detail(id),
          context.previousResident
        );
      }
    },
    onSettled: (_, __, { id }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['residents'] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.residents.detail(id),
      });
    },
  });
}

/**
 * Hook to process resident move-out
 */
export function useMoveOutResident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => residentsApi.moveOut(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['residents'] });
      await queryClient.cancelQueries({
        queryKey: queryKeys.residents.detail(id),
      });

      // Snapshot previous values
      const previousResidents = queryClient.getQueryData<Resident[]>(
        queryKeys.residents.all()
      );
      const previousResident = queryClient.getQueryData<Resident>(
        queryKeys.residents.detail(id)
      );

      // Optimistically update resident
      if (previousResidents) {
        queryClient.setQueryData<Resident[]>(queryKeys.residents.all(), (old) =>
          (old || []).map((resident) =>
            resident.id === id
              ? { ...resident, isActive: false, exitDate: new Date().toISOString() }
              : resident
          )
        );
      }

      if (previousResident) {
        queryClient.setQueryData<Resident>(queryKeys.residents.detail(id), {
          ...previousResident,
          isActive: false,
          exitDate: new Date().toISOString(),
        });
      }

      return { previousResidents, previousResident };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousResidents) {
        queryClient.setQueryData(
          queryKeys.residents.all(),
          context.previousResidents
        );
      }
      if (context?.previousResident) {
        queryClient.setQueryData(
          queryKeys.residents.detail(id),
          context.previousResident
        );
      }
    },
    onSettled: (_, __, id) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['residents'] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.residents.detail(id),
      });
    },
  });
}
