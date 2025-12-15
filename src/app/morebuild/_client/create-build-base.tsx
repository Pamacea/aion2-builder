"use client";

import { createBuildFromBuild } from "@/actions/buildActions";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { signIn } from "@/lib/auth-client";
import { CreateBuildBaseProps } from "@/types/build.type";
import { useRouter } from "next/navigation";
import { useState } from "react";


export const CreateBuildBase = ({ buildId }: CreateBuildBaseProps) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
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
      const newBuild = await createBuildFromBuild(buildId);
      if (newBuild) {
        router.push(`/build/${newBuild.id}/profile`);
      }
    } catch (error: any) {
      console.error("Error creating build:", error);
      // Si erreur d'authentification, rediriger vers la connexion
      if (error?.message?.includes("connecté")) {
        await signIn("discord");
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Cacher le bouton si non authentifié
  if (isAuthenticated === false) {
    return (
      <Button
        onClick={() => signIn("discord")}
        className="w-full bg-primary/20 text-primary border-y-2 border-primary hover:bg-primary/30 font-bold uppercase text-xs py-2"
      >
        Se connecter pour créer un build
      </Button>
    );
  }

  return (
    <Button
      onClick={handleCreate}
      disabled={isCreating || isLoading}
      className="w-full bg-primary/20 text-primary border-y-2 border-primary hover:bg-primary/30 font-bold uppercase text-xs py-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isCreating ? "Creating..." : isLoading ? "Vérification..." : "Create Build"}
    </Button>
  );
};

