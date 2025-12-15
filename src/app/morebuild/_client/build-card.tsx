"use client";

import { CreateButton } from "@/components/client/buttons/create-button";
import { CLASS_PATH } from "@/constants/paths";
import { useAuth } from "@/hooks/useAuth";
import { BuildCardProps } from "@/types/schema";
import Image from "next/image";
import Link from "next/link";
import { ShowBuildButton } from "./show-build-button";


export const BuildCard = ({ build }: BuildCardProps) => {
  const bannerUrl = build.class?.bannerUrl || "default-banner.webp";
  const { isAuthenticated } = useAuth();
  
  // Le bouton Create Build sera caché si l'utilisateur n'est pas connecté
  const isCreateButtonHidden = isAuthenticated === false;

  return (
    <div className="relative group overflow-hidden  border-y-2 border-foreground/30 hover:border-primary transition-all hover:scale-110">
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
