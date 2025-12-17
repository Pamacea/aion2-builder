"use client";

import { useDaevanionStore } from "@/app/build/[buildId]/sphere/_store/useDaevanionStore";
import { DaevanionPath, DaevanionRune } from "@/types/daevanion.type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// Helper pour charger les runes d'un chemin
const getRunesForPath = async (path: DaevanionPath): Promise<(DaevanionRune | null)[]> => {
  if (path === "nezekan") {
    const { nezekanRunes } = await import("@/data/daevanion/nezekan");
    return nezekanRunes;
  }
  if (path === "zikel") {
    const { zikelRunes } = await import("@/data/daevanion/zikel");
    return zikelRunes;
  }
  // Pour les autres chemins, retourner un tableau vide pour l'instant
  return [];
};

// Query keys pour TanStack Query
export const daevanionQueryKeys = {
  all: ["daevanion"] as const,
  runes: (path: DaevanionPath) => [...daevanionQueryKeys.all, "runes", path] as const,
  stats: (path: DaevanionPath) => [...daevanionQueryKeys.all, "stats", path] as const,
  points: (path: DaevanionPath) => [...daevanionQueryKeys.all, "points", path] as const,
};

/**
 * Hook pour récupérer les runes d'un chemin avec cache TanStack Query
 */
export function useDaevanionRunes(path: DaevanionPath) {
  return useQuery({
    queryKey: daevanionQueryKeys.runes(path),
    queryFn: () => getRunesForPath(path),
    staleTime: Infinity, // Les runes ne changent jamais, cache permanent
    gcTime: Infinity, // Garder en cache indéfiniment
  });
}

/**
 * Hook pour récupérer les stats totales d'un chemin avec cache
 */
export function useDaevanionStats(path: DaevanionPath, activeRunes: number[]) {
  const { getTotalStats } = useDaevanionStore();
  const queryClient = useQueryClient();

  // Écouter les événements d'invalidation
  useEffect(() => {
    const handleInvalidate = (event: CustomEvent<{ path: DaevanionPath }>) => {
      if (event.detail.path === path) {
        queryClient.invalidateQueries({ queryKey: daevanionQueryKeys.stats(path) });
      }
    };
    const handleInvalidateAll = () => {
      queryClient.invalidateQueries({ queryKey: daevanionQueryKeys.stats(path) });
    };

    window.addEventListener("daevanion-invalidate", handleInvalidate as EventListener);
    window.addEventListener("daevanion-invalidate-all", handleInvalidateAll);

    return () => {
      window.removeEventListener("daevanion-invalidate", handleInvalidate as EventListener);
      window.removeEventListener("daevanion-invalidate-all", handleInvalidateAll);
    };
  }, [path, queryClient]);

  return useQuery({
    queryKey: [...daevanionQueryKeys.stats(path), activeRunes],
    queryFn: () => getTotalStats(path),
    enabled: true,
    staleTime: 0, // Toujours considérer comme stale pour recalculer à chaque changement
  });
}

/**
 * Hook pour récupérer les points utilisés d'un chemin avec cache
 */
export function useDaevanionPoints(path: DaevanionPath, activeRunes: number[]) {
  const { getPointsUsed } = useDaevanionStore();
  const queryClient = useQueryClient();

  // Écouter les événements d'invalidation
  useEffect(() => {
    const handleInvalidate = (event: CustomEvent<{ path: DaevanionPath }>) => {
      if (event.detail.path === path) {
        queryClient.invalidateQueries({ queryKey: daevanionQueryKeys.points(path) });
      }
    };
    const handleInvalidateAll = () => {
      queryClient.invalidateQueries({ queryKey: daevanionQueryKeys.points(path) });
    };

    window.addEventListener("daevanion-invalidate", handleInvalidate as EventListener);
    window.addEventListener("daevanion-invalidate-all", handleInvalidateAll);

    return () => {
      window.removeEventListener("daevanion-invalidate", handleInvalidate as EventListener);
      window.removeEventListener("daevanion-invalidate-all", handleInvalidateAll);
    };
  }, [path, queryClient]);

  return useQuery({
    queryKey: [...daevanionQueryKeys.points(path), activeRunes],
    queryFn: () => getPointsUsed(path),
    enabled: true,
    staleTime: 0, // Toujours considérer comme stale pour recalculer à chaque changement
  });
}

/**
 * Hook utilitaire pour invalider les queries Daevanion
 */
export function useInvalidateDaevanion() {
  const queryClient = useQueryClient();

  return {
    invalidateStats: (path: DaevanionPath) => {
      queryClient.invalidateQueries({ queryKey: daevanionQueryKeys.stats(path) });
    },
    invalidatePoints: (path: DaevanionPath) => {
      queryClient.invalidateQueries({ queryKey: daevanionQueryKeys.points(path) });
    },
    invalidateAll: (path: DaevanionPath) => {
      queryClient.invalidateQueries({ queryKey: daevanionQueryKeys.stats(path) });
      queryClient.invalidateQueries({ queryKey: daevanionQueryKeys.points(path) });
    },
    invalidateAllPaths: () => {
      queryClient.invalidateQueries({ queryKey: daevanionQueryKeys.all });
    },
  };
}
