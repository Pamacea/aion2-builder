"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queries";

type Session = {
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
};

/**
 * Hook pour récupérer la session avec TanStack Query
 * Remplace le fetch dans AuthContext
 */
export function useAuthSession() {
  return useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: async (): Promise<Session> => {
      const response = await fetch("/api/auth/session");
      if (!response.ok) {
        throw new Error("Failed to fetch session");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    // Ne pas refetch automatiquement
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
