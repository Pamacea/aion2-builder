"use client";

import { createBuildFromStarter } from "@/actions/buildActions";
import { useAuth } from "@/hooks/useAuth";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateYourBuildButton({ starterBuildId }: { starterBuildId: number | null }) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  const handleCreate = async () => {
    if (!starterBuildId || isCreating) return;

    // Si non authentifié, rediriger vers la connexion
    if (isAuthenticated === false) {
      await signIn("discord");
      return;
    }
    
    setIsCreating(true);
    try {
      const newBuild = await createBuildFromStarter(starterBuildId);
      if (newBuild) {
        router.push(`/build/${newBuild.id}/profile`);
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

  // Afficher un bouton pour se connecter si non authentifié
  if (isAuthenticated === false) {
    return (
      <button
        onClick={() => signIn("discord")}
        className="w-full h-full py-3 flex justify-center items-center text-md uppercase bg-background/60 text-foreground font-bold hover:bg-background/90 transition border-y-2 border-foreground/50 hover:border-primary"
      >
        Se connecter pour créer un build
      </button>
    );
  }

  return (
    <button
      onClick={handleCreate}
      disabled={!starterBuildId || isCreating || isLoading}
      className="w-full h-full py-3 flex justify-center items-center text-md uppercase bg-background/60 text-foreground font-bold hover:bg-background/90 transition border-y-2 border-foreground/50 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isCreating ? "Creating..." : isLoading ? "Vérification..." : "create your build"}
    </button>
  );
}