"use client";

import { BuildType } from "@/types/schema";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queries";

/**
 * Hook pour récupérer un build par ID avec TanStack Query
 */
export function useBuildData(buildId: number | null, enabled: boolean = true) {
  return useQuery({
    queryKey: buildId ? queryKeys.builds.detail(buildId) : ["build", null],
    queryFn: async (): Promise<BuildType> => {
      if (!buildId) throw new Error("Build ID is required");
      
      const response = await fetch(`/api/builds/${buildId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch build");
      }
      return response.json();
    },
    enabled: enabled && buildId !== null,
    staleTime: 1 * 60 * 1000, // 1 minute (les builds peuvent changer)
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
