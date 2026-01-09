"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setQueryParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams?.toString() || "");
      
      if (value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;
      
      router.push(url, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const setQueryParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams?.toString() || "");
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;
      
      router.push(url, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const getQueryParam = useCallback(
    (key: string, defaultValue: string = "") => {
      return searchParams?.get(key) || defaultValue;
    },
    [searchParams]
  );

  const clearQueryParams = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    setQueryParam,
    setQueryParams,
    getQueryParam,
    clearQueryParams,
    searchParams,
  };
}
