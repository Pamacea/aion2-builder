"use client";

import { useAuth } from "@/hooks/useAuth";
import { useBuildLike } from "@/hooks/useBuildLike";
import { useBuildStore } from "@/store/useBuildEditor";
import { Heart } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { Button } from "../../ui/button";
import { LikeType } from "@/types/build.type";

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
      className={`h-full justify-start items-center flex px-8 hover:border-b-2 hover:border-b-foreground border-b-2 border-b-background/25 gap-2 ${
        !isAuthenticated ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
      title={isAuthenticated ? (isLiked ? "Unlike" : "Like") : "Connectez-vous pour liker"}
    >
      <Heart className={`size-5 ${isLiked ? "fill-current text-red-500" : ""}`} />
      <span className="text-sm font-semibold">{likesCount}</span>
    </Button>
  );
};

