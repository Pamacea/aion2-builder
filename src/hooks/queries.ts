"use client";

import { BuildType, ClassType } from "@/types/schema";
import { useQuery } from "@tanstack/react-query";

/**
 * Query keys pour centraliser les clés de cache
 */
export const queryKeys = {
  builds: {
    all: ["builds"] as const,
    lists: () => [...queryKeys.builds.all, "list"] as const,
    list: (filters: string) => [...queryKeys.builds.lists(), { filters }] as const,
    details: () => [...queryKeys.builds.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.builds.details(), id] as const,
  },
  classes: {
    all: ["classes"] as const,
    lists: () => [...queryKeys.classes.all, "list"] as const,
    detail: (name: string) => [...queryKeys.classes.all, name] as const,
  },
  auth: {
    session: ["auth", "session"] as const,
  },
} as const;

/**
 * Hook pour récupérer tous les builds
 */
export function useBuilds() {
  return useQuery({
    queryKey: queryKeys.builds.lists(),
    queryFn: async (): Promise<BuildType[]> => {
      const response = await fetch("/api/builds");
      if (!response.ok) {
        throw new Error("Failed to fetch builds");
      }
      return response.json();
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour récupérer tous les classes
 */
export function useClasses() {
  return useQuery({
    queryKey: queryKeys.classes.lists(),
    queryFn: async (): Promise<ClassType[]> => {
      const response = await fetch("/api/classes");
      if (!response.ok) {
        throw new Error("Failed to fetch classes");
      }
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (les classes changent rarement)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
