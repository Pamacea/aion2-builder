"use client";

import { createBuildFromStarter, getRandomStarterBuildId } from "@/actions/buildActions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const CreateButton = () => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (isCreating) return;
    
    setIsCreating(true);
    try {
      const randomStarterBuildId = await getRandomStarterBuildId();
      if (randomStarterBuildId) {
        const newBuild = await createBuildFromStarter(randomStarterBuildId);
        if (newBuild) {
          router.push(`/build/${newBuild.id}/profile`);
        }
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
      disabled={isCreating}
      className="h-full justify-start items-center flex px-8 hover:border-b-2 hover:border-b-foreground border-b-2 border-b-background/25"
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
