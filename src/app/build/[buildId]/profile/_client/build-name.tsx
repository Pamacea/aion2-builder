"use client";

import { Input } from "@/components/ui/input";
import { useBuildStore } from "@/store/useBuildEditor";
import { isBuildOwner, isStarterBuild } from "@/utils/buildUtils";
import { memo, useCallback, useMemo } from "react";
import { StarterBuildMessage } from "../_components/starterBuildMessage";

export const BuildName = memo(() => {
  const { build, updateBuild, currentUserId } = useBuildStore();

  // Mémoriser les valeurs calculées
  const isStarter = useMemo(() => build ? isStarterBuild(build) : false, [build]);
  const isOwner = useMemo(() => build ? isBuildOwner(build, currentUserId) : false, [build, currentUserId]);
  const isDisabled = useMemo(() => isStarter || !isOwner, [isStarter, isOwner]);

  // Mémoriser le handler pour éviter les re-renders
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateBuild({ name: e.target.value });
  }, [updateBuild]);

  if (!build) return null;

  return (
    <section className="w-full flex flex-col items-start justify-start gap-4">
      <h2 className="uppercase font-bold text-xl text-ring">BUILD NAME</h2>
      <Input
        type="text"
        value={build.name}
        onChange={handleNameChange}
        disabled={isDisabled}
        className="w-full text-3xl disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {isStarter && <StarterBuildMessage />}
    </section>
  );
});

BuildName.displayName = "BuildName";
