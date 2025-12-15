"use client";

import { CreateButton } from "@/components/client/buttons/create-button";
import { CLASS_PATH } from "@/constants/paths";
import { useAuth } from "@/hooks/useAuth";
import { BuildCardProps } from "@/types/schema";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShowBuildButton } from "./show-build-button";


export const BuildCard = ({ build }: BuildCardProps) => {
  const bannerUrl = build.class?.bannerUrl || "default-banner.webp";
  const { isAuthenticated, userId } = useAuth();
  
  // Le bouton Create Build sera caché si l'utilisateur n'est pas connecté
  const isCreateButtonHidden = isAuthenticated === false;

  // État pour les likes
  const [likesCount, setLikesCount] = useState(build.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Vérifier si l'utilisateur actuel a liké ce build
  useEffect(() => {
    if (userId && build.likes) {
      const userLiked = build.likes.some((like) => like.userId === userId);
      setIsLiked(userLiked);
    }
  }, [userId, build.likes]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      return;
    }

    if (isLiking) return;

    setIsLiking(true);
    try {
      const response = await fetch(`/api/builds/${build.id}/like`, {
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

  return (
    <div className="relative group overflow-hidden  border-y-2 border-foreground/30 hover:border-primary transition-all hover:scale-110">
      {/* Like Button - Top Right */}
      <button
        onClick={handleLike}
        disabled={!isAuthenticated || isLiking}
        className={`absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm transition-colors ${
          isLiked
            ? "text-red-500 hover:text-red-600"
            : "text-foreground/50 hover:text-foreground/70"
        } ${!isAuthenticated ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        title={isAuthenticated ? (isLiked ? "Unlike" : "Like") : "Connectez-vous pour liker"}
      >
        <Heart className={`size-4 ${isLiked ? "fill-current" : ""}`} />
        <span className="text-xs font-semibold">{likesCount}</span>
      </button>

      {/* Banner Background */}
      <div className="relative h-48 w-full">
        <Image
          src={`${CLASS_PATH}${bannerUrl.toLowerCase()}`}
          alt={`${build.class?.name} banner`}
          fill
          className="object-cover scale-125 opacity-60 group-hover:opacity-80 transition-opacity"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4  backdrop-blur-sm">
        <Link href={`/build/${build.id}/profile`}>
          <h3 className="text-lg font-bold text-foreground mb-2 truncate hover:text-primary transition-colors cursor-pointer">
            {build.name}
          </h3>
        </Link>
        <div className="flex flex-row justify-between items-center mb-3">
          <p className="text-sm text-foreground/70 uppercase">{build.class?.name}</p>
          {build.user?.name && (
            <p className="text-xs text-foreground/70">by {build.user.name}</p>
          )}
          {!build.user?.name && <div />}
        </div>
        <div className="flex gap-2">
          <div className={isCreateButtonHidden ? "w-full" : "flex-1"} onClick={(e) => e.stopPropagation()}>
            <ShowBuildButton buildId={build.id} />
          </div>
          {!isCreateButtonHidden && (
            <div className="flex-1" onClick={(e) => e.stopPropagation()}>
              <CreateButton
                buildId={build.id}
                text="Fork Build"
                hideWhenUnauthenticated
                className="w-full bg-background/60 text-foreground border-y-2 border-foreground/50 hover:bg-background/80 hover:border-foreground/70 font-bold uppercase text-xs py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
