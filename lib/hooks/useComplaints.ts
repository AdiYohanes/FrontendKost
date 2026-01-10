/**
 * Complaints Hooks
 * React Query hooks for complaint management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintsApi } from '../api/services/complaints';
import { queryKeys } from '../query/queryKeys';
import type {
  CreateComplaintDto,
  UpdateComplaintStatusDto,
} from '../api/services/complaints';

/**
 * Hook to fetch all complaints
 */
export function useComplaints(params?: { status?: string; enabled?: boolean }) {
  const { enabled, ...queryParams } = params || {};
  return useQuery({
    queryKey: queryKeys.complaints.all(queryParams),
    queryFn: () => complaintsApi.getAll(queryParams),
    enabled: enabled !== false,
  });
}

/**
 * Hook to fetch complaint by ID
 */
export function useComplaint(id: string) {
  return useQuery({
    queryKey: queryKeys.complaints.detail(id),
    queryFn: () => complaintsApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new complaint
 */
export function useCreateComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateComplaintDto) => complaintsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all() });
    },
  });
}

/**
 * Hook to update complaint status
 */
export function useUpdateComplaintStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateComplaintStatusDto;
    }) => complaintsApi.updateStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.complaints.detail(variables.id),
      });
    },
  });
}
