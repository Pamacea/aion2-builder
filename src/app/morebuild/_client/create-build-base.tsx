"use client";

import { createBuildFromBuild } from "@/actions/buildActions";
import { Button } from "@/components/ui/button";
import { CreateBuildBaseProps } from "@/types/build.type";
import { useRouter } from "next/navigation";
import { useState } from "react";


export const CreateBuildBase = ({ buildId }: CreateBuildBaseProps) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      const newBuild = await createBuildFromBuild(buildId);
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
    <Button
      onClick={handleCreate}
      disabled={isCreating}
      className="w-full bg-primary/20 text-primary border-y-2 border-primary hover:bg-primary/30 font-bold uppercase text-xs py-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isCreating ? "Creating..." : "Create Build"}
    </Button>
  );
};

