/**
 * Utilities Hooks
 * Custom hooks for utility data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  utilitiesApi,
  CreateUtilityDto,
  UtilityQueryParams,
} from '../api/services/utilities';
import { queryKeys } from '../query/queryKeys';
import { UtilityRecord } from '../api/types';

/**
 * Hook to fetch utility records by resident
 */
export function useUtilitiesByResident(
  residentId: string,
  params?: UtilityQueryParams
) {
  return useQuery({
    queryKey: queryKeys.utilities.byResident(residentId, params),
    queryFn: () => utilitiesApi.getByResident(residentId, params),
    enabled: !!residentId,
  });
}

/**
 * Hook to create utility record
 */
export function useCreateUtility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUtilityDto) => utilitiesApi.create(data),
    onMutate: async (newUtility) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['utilities'] });

      // Snapshot previous value
      const previousUtilities = queryClient.getQueryData<UtilityRecord[]>(
        queryKeys.utilities.byResident(newUtility.residentId)
      );

      // Optimistically update to the new value
      if (previousUtilities) {
        const optimisticUtility: UtilityRecord = {
          ...newUtility,
          id: 'temp-' + Date.now(),
          usage: newUtility.currentMeter - newUtility.previousMeter,
          totalCost:
            (newUtility.currentMeter - newUtility.previousMeter) *
            newUtility.ratePerUnit,
          isBilled: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as UtilityRecord;

        queryClient.setQueryData<UtilityRecord[]>(
          queryKeys.utilities.byResident(newUtility.residentId),
          (old) => [...(old || []), optimisticUtility]
        );
      }

      return { previousUtilities };
    },
    onError: (err, newUtility, context) => {
      // Rollback on error
      if (context?.previousUtilities) {
        queryClient.setQueryData(
          queryKeys.utilities.byResident(newUtility.residentId),
          context.previousUtilities
        );
      }
    },
    onSettled: (_, __, newUtility) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['utilities'] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.utilities.byResident(newUtility.residentId),
      });
    },
  });
}
