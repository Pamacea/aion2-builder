"use client";

import { ClassType } from "@/types/schema";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queries";

/**
 * Hook pour récupérer les données d'une classe avec TanStack Query
 */
export function useClassData(className: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: className ? queryKeys.classes.detail(className) : ["class", null],
    queryFn: async (): Promise<ClassType> => {
      if (!className) throw new Error("Class name is required");
      
      const response = await fetch(`/api/classes/${className}`);
      if (!response.ok) {
        throw new Error("Failed to fetch class");
      }
      return response.json();
    },
    enabled: enabled && className !== null,
    staleTime: 10 * 60 * 1000, // 10 minutes (les classes changent rarement)
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });
}
