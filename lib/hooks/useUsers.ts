/**
 * Users Hooks
 * Custom hooks for user data fetching
 */

import { useQuery } from '@tanstack/react-query';
import { usersApi, UserQueryParams } from '../api/services/users';

/**
 * Hook to fetch all users
 */
export function useUsers(params?: UserQueryParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getAll(params),
  });
}

/**
 * Hook to fetch user by ID
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
}
