"use client";

import { Input } from "@/components/ui/input";
import { useBuildStore } from "@/store/useBuildEditor";
import { isBuildOwner, isStarterBuild } from "@/utils/buildUtils";
import { StarterBuildMessage } from "../_components/starterBuildMessage";

export const BuildName = () => {
  const { build, updateBuild, currentUserId } = useBuildStore();

  if (!build) return null;

  const isStarter = isStarterBuild(build);
  const isOwner = isBuildOwner(build, currentUserId);
  const isDisabled = isStarter || !isOwner;

  return (
    <section className="w-full flex flex-col items-start justify-start gap-4">
      <h2 className="uppercase font-bold text-xl text-ring">BUILD NAME</h2>
      <Input
        type="text"
        value={build.name}
        onChange={(e) => updateBuild({ name: e.target.value })}
        disabled={isDisabled}
        className="w-full text-3xl disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {isStarter && <StarterBuildMessage />}
    </section>
  );
};
