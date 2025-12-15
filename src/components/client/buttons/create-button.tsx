"use client";

import {
  createBuildFromStarter,
  getRandomStarterBuildId,
} from "@/actions/buildActions";
import { useAuth } from "@/hooks/useAuth";
import { signIn } from "@/lib/auth-client";
import { useBuildStore } from "@/store/useBuildEditor";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const CreateButton = () => {
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
      const randomStarterBuildId = await getRandomStarterBuildId();
      const buildIdToUse = build ? build.id : randomStarterBuildId;

      if (buildIdToUse) {
        const newBuild = await createBuildFromStarter(buildIdToUse);
        if (newBuild) {
          router.push(`/build/${newBuild.id}/profile`);
        }
      }
    } catch (error) {
      console.error("Error creating build:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      // Si erreur d'authentification, rediriger vers la connexion
      if (errorMessage.includes("connecté")) {
        await signIn("discord");
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Cacher le bouton si non authentifié
  if (isAuthenticated === false) {
    return null;
  }

  return (
    <button
      onClick={handleCreate}
      disabled={isCreating || isLoading}
      className="h-full justify-start items-center flex px-8 hover:border-b-2 hover:border-b-foreground border-b-2 border-b-background/25 disabled:opacity-50"
      title={isLoading ? "Vérification..." : "Créer un build"}
      suppressHydrationWarning
    >
      <Image
        src="/icons/create-logo.webp"
        alt="Bahion Logo"
        width={48}
        height={48}
      />
    </button>
  );
};
