"use client";

import { useAuth } from "@/hooks/useAuth";
import { useBuildLike } from "@/hooks/useBuildLike";
import { useBuildStore } from "@/store/useBuildEditor";
import { Heart } from "lucide-react";
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
  
  const { build } = useBuildStore();
  const { isAuthenticated, userId } = useAuth();
  const { toggleLikeAsync, isLiking } = useBuildLike(numericBuildId || 0);

  // Calculer les likes depuis le build avec useMemo
  const likesCount = useMemo(() => build?.likes?.length || 0, [build?.likes?.length]);
  const isLiked = useMemo(() => {
    if (!userId || !build?.likes) return false;
    return build.likes.some((like) => like.userId === userId);
  }, [userId, build?.likes]);

  const handleLike = async () => {
    if (!isAuthenticated || !numericBuildId || isLiking) {
      return;
    }

    try {
      await toggleLikeAsync();
      // Le cache sera automatiquement invalidé et mis à jour par TanStack Query
    } catch (error) {
      console.error("Error toggling like:", error);
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

