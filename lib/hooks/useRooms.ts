/**
 * Rooms Hooks
 * Custom hooks for room data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomsApi, CreateRoomDto, UpdateRoomDto } from '../api/services/rooms';
import { queryKeys } from '../query/queryKeys';
import { Room } from '../api/types';

/**
 * Hook to fetch all rooms
 */
export function useRooms() {
  return useQuery({
    queryKey: queryKeys.rooms.all,
    queryFn: () => roomsApi.getAll(),
  });
}

/**
 * Hook to fetch room by ID
 */
export function useRoom(id: string) {
  return useQuery({
    queryKey: queryKeys.rooms.detail(id),
    queryFn: () => roomsApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create room
 */
export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoomDto) => roomsApi.create(data),
    onMutate: async (newRoom) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.rooms.all });

      // Snapshot previous value
      const previousRooms = queryClient.getQueryData<Room[]>(
        queryKeys.rooms.all
      );

      // Optimistically update to the new value
      if (previousRooms) {
        queryClient.setQueryData<Room[]>(queryKeys.rooms.all, (old) => [
          ...(old || []),
          {
            ...newRoom,
            id: 'temp-' + Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as Room,
        ]);
      }

      return { previousRooms };
    },
    onError: (err, newRoom, context) => {
      // Rollback on error
      if (context?.previousRooms) {
        queryClient.setQueryData(queryKeys.rooms.all, context.previousRooms);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
    },
  });
}

/**
 * Hook to update room
 */
export function useUpdateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoomDto }) =>
      roomsApi.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.rooms.all });
      await queryClient.cancelQueries({ queryKey: queryKeys.rooms.detail(id) });

      // Snapshot previous values
      const previousRooms = queryClient.getQueryData<Room[]>(
        queryKeys.rooms.all
      );
      const previousRoom = queryClient.getQueryData<Room>(
        queryKeys.rooms.detail(id)
      );

      // Optimistically update room list
      if (previousRooms) {
        queryClient.setQueryData<Room[]>(queryKeys.rooms.all, (old) =>
          (old || []).map((room) =>
            room.id === id ? { ...room, ...data } : room
          )
        );
      }

      // Optimistically update room detail
      if (previousRoom) {
        queryClient.setQueryData<Room>(queryKeys.rooms.detail(id), {
          ...previousRoom,
          ...data,
        });
      }

      return { previousRooms, previousRoom };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousRooms) {
        queryClient.setQueryData(queryKeys.rooms.all, context.previousRooms);
      }
      if (context?.previousRoom) {
        queryClient.setQueryData(
          queryKeys.rooms.detail(id),
          context.previousRoom
        );
      }
    },
    onSettled: (_, __, { id }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.detail(id) });
    },
  });
}

/**
 * Hook to delete room
 */
export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roomsApi.delete(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.rooms.all });

      // Snapshot previous value
      const previousRooms = queryClient.getQueryData<Room[]>(
        queryKeys.rooms.all
      );

      // Optimistically remove from list
      if (previousRooms) {
        queryClient.setQueryData<Room[]>(queryKeys.rooms.all, (old) =>
          (old || []).filter((room) => room.id !== id)
        );
      }

      return { previousRooms };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousRooms) {
        queryClient.setQueryData(queryKeys.rooms.all, context.previousRooms);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
    },
  });
}
