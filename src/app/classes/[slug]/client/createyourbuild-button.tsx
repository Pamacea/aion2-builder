"use client";

import { createBuildFromStarter } from "@/actions/buildActions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateYourBuildButton({ starterBuildId }: { starterBuildId: number | null }) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!starterBuildId || isCreating) return;
    
    setIsCreating(true);
    try {
      const newBuild = await createBuildFromStarter(starterBuildId);
      if (newBuild) {
        router.push(`/build/${newBuild.id}/profile`);
      }
    } catch (error) {
      console.error("Error creating build:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <button
      onClick={handleCreate}
      disabled={!starterBuildId || isCreating}
      className="py-4 flex justify-center text-md uppercase bg-background/60 text-foreground font-bold rounded-md hover:bg-primary transition border-2 border-primary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isCreating ? "Creating..." : "create your build"}
    </button>
  );
}