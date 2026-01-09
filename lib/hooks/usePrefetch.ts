/**
 * Prefetch Hook
 * Provides utilities for prefetching data on hover/focus
 */

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function usePrefetch() {
  const queryClient = useQueryClient();

  /**
   * Prefetch data on hover/focus
   * @param queryKey - The query key to prefetch
   * @param queryFn - The query function to execute
   */
  const prefetchQuery = useCallback(
    async (queryKey: readonly unknown[], queryFn: () => Promise<unknown>) => {
      await queryClient.prefetchQuery({
        queryKey: queryKey as unknown[],
        queryFn,
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    },
    [queryClient]
  );

  /**
   * Create prefetch handlers for a link
   * @param queryKey - The query key to prefetch
   * @param queryFn - The query function to execute
   * @returns Object with onMouseEnter and onFocus handlers
   */
  const createPrefetchHandlers = useCallback(
    (queryKey: readonly unknown[], queryFn: () => Promise<unknown>) => {
      const handlePrefetch = () => {
        prefetchQuery(queryKey, queryFn);
      };

      return {
        onMouseEnter: handlePrefetch,
        onFocus: handlePrefetch,
      };
    },
    [prefetchQuery]
  );

  return {
    prefetchQuery,
    createPrefetchHandlers,
  };
}
