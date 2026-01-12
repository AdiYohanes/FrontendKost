/**
 * Users Hooks
 * Custom hooks for user data fetching
 */

import { useQuery } from '@tanstack/react-query';
import { usersApi, UserQueryParams } from '../api/services/users';

/**
 * Hook to fetch users list (can filter by role)
 */
export function useUsers(params?: UserQueryParams) {
  return useQuery({
    queryKey: ['users', 'list', params],
    queryFn: () => usersApi.list(params),
  });
}

/**
 * Hook to fetch available PENGHUNI (not yet residents)
 */
export function useAvailablePenghuni() {
  return useQuery({
    queryKey: ['users', 'available-penghuni'],
    queryFn: () => usersApi.getAvailablePenghuni(),
  });
}

/**
 * Hook to fetch user by ID
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', 'detail', id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
}
