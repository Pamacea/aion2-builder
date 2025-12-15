"use client";

import {
  createBuildFromBuild,
  createBuildFromStarter,
  getRandomStarterBuildId,
} from "@/actions/buildActions";
import { DiscordIcon } from "@/constants/discord.icon";
import { useAuth } from "@/hooks/useAuth";
import { signIn } from "@/lib/auth-client";
import { useBuildStore } from "@/store/useBuildEditor";
import { CreateButtonProps } from "@/types/create-button.type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const CreateButton = ({
  variant = "icon",
  buildId,
  starterBuildId,
  text = "create your build",
  hideWhenUnauthenticated = variant === "icon", // Cache par défaut pour variant="icon"
  showDiscordWhenUnauthenticated = false,
  className,
}: CreateButtonProps) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const { build } = useBuildStore();
  const { isAuthenticated, isLoading } = useAuth();

  const handleCreate = async () => {
    if (isCreating) return;

    // Si non authentifié, rediriger vers la connexion
    if (isAuthenticated === false) {
      await signIn("discord");
      return;
    }

    setIsCreating(true);
    try {
      let newBuild = null;

      // Déterminer le type de création
      if (buildId) {
        // Créer à partir d'un build existant
        newBuild = await createBuildFromBuild(buildId);
      } else if (starterBuildId) {
        // Créer à partir d'un starter build spécifique
        newBuild = await createBuildFromStarter(starterBuildId);
      } else {
        // Créer à partir d'un starter build aléatoire ou du build actuel
        const randomStarterBuildId = await getRandomStarterBuildId();
        const buildIdToUse = build ? build.id : randomStarterBuildId;
        if (buildIdToUse) {
          newBuild = await createBuildFromStarter(buildIdToUse);
        }
      }

      if (newBuild) {
        router.push(`/build/${newBuild.id}/profile`);
      }
    } catch (error) {
      console.error("Error creating build:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      // Si erreur d'authentification, rediriger vers la connexion
      if (errorMessage.includes("connecté")) {
        await signIn("discord");
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Cacher le bouton si non authentifié
  if (isAuthenticated === false && hideWhenUnauthenticated) {
    return null;
  }

  // Afficher le bouton Discord si non authentifié
  if (isAuthenticated === false && showDiscordWhenUnauthenticated) {
    const buttonClassName =
      variant === "icon"
        ? "w-full bg-primary/20 text-primary border-y-2 border-primary hover:bg-primary/30 font-bold uppercase text-xs py-2 flex justify-center items-center"
        : "w-full py-3 flex justify-center items-center text-md uppercase bg-background/60 text-foreground font-bold hover:bg-background/90 transition border-y-2 border-foreground/50 hover:border-primary";

    return (
      <button
        onClick={() => signIn("discord")}
        className={buttonClassName}
        suppressHydrationWarning
      >
        <DiscordIcon />
      </button>
    );
  }

  // Styles selon la variante
  const iconClassName =
    "h-full justify-start items-center flex px-8 hover:border-b-2 hover:border-b-foreground border-b-2 border-b-background/25 disabled:opacity-50";
  const defaultTextClassName =
    "w-full py-3 flex justify-center items-center text-md uppercase bg-background/60 text-foreground font-bold hover:bg-background/90 transition border-y-2 border-foreground/50 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed";
  const textClassName = className || defaultTextClassName;

  const isDisabled =
    isCreating ||
    isLoading ||
    (starterBuildId === null && !buildId) ||
    (buildId === undefined && starterBuildId === null && !build);

  if (variant === "icon") {
    return (
      <button
        onClick={handleCreate}
        disabled={isDisabled}
        className={iconClassName}
        title={isLoading ? "Vérification..." : "Créer un build"}
        suppressHydrationWarning
      >
        <Image
          src="/icons/create-logo.webp"
          alt="Create Build"
          width={48}
          height={48}
        />
      </button>
    );
  }

  return (
    <button
      onClick={handleCreate}
      disabled={isDisabled}
      className={textClassName}
      suppressHydrationWarning
    >
      {isCreating ? "Creating..." : isLoading ? "Vérification..." : text}
    </button>
  );
};
