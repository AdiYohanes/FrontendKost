import { QueryClient, DefaultOptions } from "@tanstack/react-query";

const queryConfig: DefaultOptions = {
  queries: {
    // Refetch on window focus (only if data is stale)
    refetchOnWindowFocus: "always",
    // Refetch on reconnect
    refetchOnReconnect: true,
    // Retry failed requests
    retry: 1,
    // Stale time: 5 minutes (data is considered fresh for 5 minutes)
    staleTime: 5 * 60 * 1000,
    // Cache time: 30 minutes (keep unused data in cache for 30 minutes)
    gcTime: 30 * 60 * 1000,
    // Refetch interval: disabled by default (enable per-query if needed)
    refetchInterval: false,
    // Network mode: online-first with offline fallback
    networkMode: "online",
  },
  mutations: {
    // Retry failed mutations once
    retry: 1,
    // Network mode: online-first
    networkMode: "online",
  },
};

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});
