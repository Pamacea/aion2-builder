"use client";

import { BuildType } from "@/types/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queries";

type LikeResponse = {
  likesCount: number;
  liked: boolean;
};

/**
 * Hook pour gérer les likes de builds avec TanStack Query
 */
export function useBuildLike(buildId: number) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (): Promise<LikeResponse> => {
      const response = await fetch(`/api/builds/${buildId}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to toggle like");
      }

      return response.json();
    },
    // Optimistic update pour une meilleure UX
    onMutate: async () => {
      // Annuler les requêtes en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey: queryKeys.builds.detail(buildId) });
      await queryClient.cancelQueries({ queryKey: queryKeys.builds.lists() });

      // Snapshot des valeurs précédentes
      const previousBuild = queryClient.getQueryData<BuildType>(queryKeys.builds.detail(buildId));

      return { previousBuild };
    },
    // Mise à jour optimiste du cache
    onSuccess: () => {
      // Invalider pour refetch avec les vraies données
      queryClient.invalidateQueries({ queryKey: queryKeys.builds.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.builds.detail(buildId) });
    },
    // Rollback en cas d'erreur
    onError: (_err, _variables, context) => {
      if (context?.previousBuild) {
        queryClient.setQueryData<BuildType>(queryKeys.builds.detail(buildId), context.previousBuild);
      }
    },
  });

  return {
    toggleLike: mutation.mutate,
    toggleLikeAsync: mutation.mutateAsync,
    isLiking: mutation.isPending,
    error: mutation.error,
  };
}
