"use client";

import { useAuth } from "@/hooks/useAuth";
import { useBuildLike } from "@/hooks/useBuildLike";
import { useBuildStore } from "@/store/useBuildEditor";
import { LikeType } from "@/types/build.type";
import { Heart, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { Button } from "../../ui/button";

export const LikeButton = () => {
  const params = useParams();
  const buildId = params?.buildId as string;
  const numericBuildId = useMemo(() => {
    if (!buildId) return null;
    const numId = Number(buildId);
    return !isNaN(numId) ? numId : null;
  }, [buildId]);
  
  const { build, loadBuild } = useBuildStore();
  const { isAuthenticated, userId } = useAuth();
  const { toggleLikeAsync, isLiking } = useBuildLike(numericBuildId || 0);

  // Calculer les likes directement (pas besoin de useMemo pour des calculs simples)
  const likesCount = build?.likes?.length || 0;
  const isLiked = userId && build?.likes 
    ? build.likes.some((like) => like.userId === userId)
    : false;

  const handleLike = async () => {
    if (!isAuthenticated || !numericBuildId || isLiking || !build || !userId) {
      return;
    }

    // Optimistic update immédiat dans le store
    const currentLiked = build.likes?.some((like) => like.userId === userId) || false;
    const newLikes: LikeType[] = currentLiked
      ? (build.likes || []).filter((like) => like.userId !== userId)
      : [
          ...(build.likes || []), 
          { 
            id: 0, 
            buildId: build.id, 
            userId, 
            createdAt: new Date() 
          }
        ];

    // Mettre à jour le store immédiatement
    const { setBuild } = useBuildStore.getState();
    setBuild({
      ...build,
      likes: newLikes,
    });

    try {
      await toggleLikeAsync();
      // Recharger le build pour synchroniser avec les vraies données
      if (numericBuildId && userId) {
        await loadBuild(numericBuildId, userId);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Rollback en cas d'erreur
      if (numericBuildId && userId) {
        await loadBuild(numericBuildId, userId);
      }
    }
  };

  // Ne pas afficher si pas de buildId
  if (!buildId) {
    return null;
  }

  return (
    <Button
      onClick={handleLike}
      disabled={!isAuthenticated || isLiking}
      className={`h-full justify-start items-center flex px-2 sm:px-4 md:px-8 hover:border-b-2 hover:border-b-primary border-b-2 border-b-secondary gap-1 sm:gap-2 ${
        !isAuthenticated ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
      aria-label={isAuthenticated
        ? isLiked
          ? `Unlike build. ${likesCount} likes`
          : `Like build. ${likesCount} likes`
        : "Sign in to like this build"
      }
      aria-pressed={isLiked}
      aria-busy={isLiking}
      title={isAuthenticated ? (isLiked ? "Unlike" : "Like") : "Connectez-vous pour liker"}
    >
      {isLiking ? (
        <Loader2 className="size-4 sm:size-5 animate-spin" aria-hidden="true" />
      ) : (
        <Heart className={`size-4 sm:size-5 ${isLiked ? "fill-current text-red-500" : ""}`} aria-hidden="true" />
      )}
      <span className="text-xs sm:text-sm font-semibold" aria-live="polite" aria-atomic="true">
        {likesCount}
      </span>
    </Button>
  );
};

