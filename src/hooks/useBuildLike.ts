"use client";

import { toggleLikeBuildAction } from "@/actions/buildActions";
import { BuildType } from "@/types/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queries";

type LikeResponse = {
  likesCount: number;
  liked: boolean;
};

/**
 * Hook pour gérer les likes de builds avec TanStack Query
 * Utilise directement une Server Action au lieu d'une route API
 */
export function useBuildLike(buildId: number) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (): Promise<LikeResponse> => {
      // Appel direct de la Server Action
      return await toggleLikeBuildAction(buildId);
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
    // Mise à jour du cache après succès
    onSuccess: () => {
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
