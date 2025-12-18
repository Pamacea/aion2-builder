"use client";

import { CreateButton } from "@/components/client/buttons/create-button";
import { BANNER_PATH } from "@/constants/paths";
import { useAuth } from "@/hooks/useAuth";
import { useBuildLike } from "@/hooks/useBuildLike";
import { BuildCardProps, BuildType, LikeType } from "@/types/schema";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ShowBuildButton } from "./show-build-button";


export const BuildCard = ({ build: initialBuild }: BuildCardProps) => {
  const { isAuthenticated, userId } = useAuth();
  const { toggleLikeAsync, isLiking } = useBuildLike(initialBuild.id);
  
  // State local pour mettre à jour immédiatement le like (optimistic update)
  const [localBuild, setLocalBuild] = useState<BuildType>(initialBuild);
  
  // Synchroniser avec les props initiales si elles changent (pour les refetch)
  useEffect(() => {
    setLocalBuild(initialBuild);
  }, [initialBuild]);
  
  // Utiliser le build local
  const build = localBuild;

  // Le bouton Create Build sera caché si l'utilisateur n'est pas connecté
  const isCreateButtonHidden = isAuthenticated === false;

  // Vérifier si l'utilisateur actuel a liké ce build
  const isLiked = userId && build.likes 
    ? build.likes.some((like) => like.userId === userId)
    : false;

  const likesCount = build.likes?.length || 0;

  // Handler de like avec optimistic update immédiat
  const handleLike = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || isLiking || !userId) {
      return;
    }

    // Utiliser la fonction de mise à jour pour avoir accès au state actuel
    setLocalBuild((currentBuild) => {
      // Optimistic update immédiat
      const currentLiked = currentBuild.likes?.some((like) => like.userId === userId) || false;
      const newLikes: LikeType[] = currentLiked
        ? (currentBuild.likes || []).filter((like) => like.userId !== userId)
        : [
            ...(currentBuild.likes || []), 
            { 
              id: 0, 
              buildId: currentBuild.id, 
              userId, 
              createdAt: new Date() 
            }
          ];

      return {
        ...currentBuild,
        likes: newLikes,
      };
    });

    try {
      await toggleLikeAsync();
      // TanStack Query invalidera et refetchera les données, mais on garde l'update optimiste
    } catch (error) {
      console.error("Error toggling like:", error);
      // Rollback en cas d'erreur
      setLocalBuild(initialBuild);
    }
  }, [isAuthenticated, isLiking, userId, initialBuild, toggleLikeAsync]);

  // Calculer les valeurs une seule fois par render (pas besoin de useMemo pour des calculs simples)
  const bannerUrl = build.class?.bannerUrl || "default-banner.webp";
  const displayBannerPath = bannerUrl.startsWith("BA_") 
    ? `${BANNER_PATH}${bannerUrl}`
    : `${BANNER_PATH}BA_${build.class?.name.charAt(0).toUpperCase() + build.class?.name.slice(1)}.webp`;

  return (
    <div className="relative group overflow-hidden  border-y-2 border-foreground/30 hover:border-primary transition-all hover:scale-110">
      {/* Like Button - Top Right */}
      <button
        onClick={handleLike}
        disabled={!isAuthenticated || isLiking}
        className={`absolute top-1.5 sm:top-2 right-1.5 sm:right-2 z-10 flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-background/80 backdrop-blur-sm transition-colors ${
          isLiked
            ? "text-red-500 hover:text-red-600"
            : "text-foreground/50 hover:text-foreground/70"
        } ${!isAuthenticated ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        title={isAuthenticated ? (isLiked ? "Unlike" : "Like") : "Connectez-vous pour liker"}
      >
        <Heart className={`size-3 sm:size-4 ${isLiked ? "fill-current" : ""}`} />
        <span className="text-xs font-semibold">{likesCount}</span>
      </button>

      {/* Banner Background */}
      <div className="relative h-40 sm:h-48 w-full">
        <Image
          src={displayBannerPath}
          alt={`${build.class?.name} banner`}
          fill
          className="object-cover scale-125 opacity-60 group-hover:opacity-80 transition-opacity"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 backdrop-blur-sm">
        <Link href={`/build/${build.id}/profile`} prefetch={true}>
          <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5 sm:mb-2 truncate hover:text-primary transition-colors cursor-pointer">
            {build.name}
          </h3>
        </Link>
        <div className="flex flex-row justify-between items-center mb-2 sm:mb-3">
          <p className="text-xs sm:text-sm text-foreground/70">{build.class?.name ? build.class.name.charAt(0).toUpperCase() + build.class.name.slice(1) : ''}</p>
          {build.user?.name && (
            <p className="text-xs text-foreground/70 truncate ml-2">by {build.user.name}</p>
          )}
          {!build.user?.name && <div />}
        </div>
        <div className="flex gap-1.5 sm:gap-2">
          <div className={isCreateButtonHidden ? "w-full" : "flex-1"} onClick={(e) => e.stopPropagation()}>
            <ShowBuildButton buildId={build.id} />
          </div>
          {!isCreateButtonHidden && (
            <div className="flex-1" onClick={(e) => e.stopPropagation()}>
              <CreateButton
                buildId={build.id}
                text="Fork Build"
                hideWhenUnauthenticated
                className="w-full bg-background/60 text-foreground border-y-2 border-foreground/50 hover:bg-background/80 hover:border-foreground/70 font-bold uppercase text-xs py-1.5 sm:py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

BuildCard.displayName = "BuildCard";
