"use client";

import { useAuth } from "@/hooks/useAuth";
import { useBuildStore } from "@/store/useBuildEditor";
import { Heart } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";

export const LikeButton = () => {
  const params = useParams();
  const buildId = params?.buildId as string;
  const { build } = useBuildStore();
  const { isAuthenticated, userId } = useAuth();

  // État pour les likes
  const [likesCount, setLikesCount] = useState(build?.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Initialiser les likes depuis le build
  useEffect(() => {
    if (build?.likes) {
      setLikesCount(build.likes.length);
      if (userId && build.likes) {
        const userLiked = build.likes.some((like) => like.userId === userId);
        setIsLiked(userLiked);
      }
    }
  }, [build?.likes, userId]);

  const handleLike = async () => {
    if (!isAuthenticated || !buildId || isLiking) {
      return;
    }

    setIsLiking(true);
    try {
      const response = await fetch(`/api/builds/${buildId}/like`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setLikesCount(data.likesCount);
        setIsLiked(data.liked);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
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

