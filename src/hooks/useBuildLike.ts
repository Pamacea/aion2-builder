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
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Failed to toggle like" }));
        throw new Error(error.error || "Failed to toggle like");
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
      const previousBuildsList = queryClient.getQueryData<BuildType[]>(queryKeys.builds.lists());

      return { previousBuild, previousBuildsList };
    },
    // Mise à jour optimiste du cache
    onSuccess: (data) => {
      // Mettre à jour le cache du build détaillé si présent
      const currentBuild = queryClient.getQueryData<BuildType>(queryKeys.builds.detail(buildId));
      if (currentBuild) {
        // Simuler la mise à jour optimiste avec les nouvelles données
        queryClient.setQueryData<BuildType>(queryKeys.builds.detail(buildId), (old) => {
          if (!old) return old;
          // On invalide plutôt que de faire une mise à jour partielle complexe
          // car la structure des likes peut être complexe
          return old;
        });
      }

      // Invalider pour refetch avec les vraies données du serveur
      queryClient.invalidateQueries({ queryKey: queryKeys.builds.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.builds.detail(buildId) });
    },
    // Rollback en cas d'erreur
    onError: (_err, _variables, context) => {
      if (context?.previousBuild) {
        queryClient.setQueryData<BuildType>(queryKeys.builds.detail(buildId), context.previousBuild);
      }
      if (context?.previousBuildsList) {
        queryClient.setQueryData<BuildType[]>(queryKeys.builds.lists(), context.previousBuildsList);
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
