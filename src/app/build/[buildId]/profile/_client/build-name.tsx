"use client";

import { Input } from "@/components/ui/input";
import { useBuildStore } from "@/store/useBuildEditor";
import { isStarterBuild } from "@/utils/buildUtils";

export const BuildName = () => {
  const { build, updateBuild } = useBuildStore();

  if (!build) return null;

  const isStarter = isStarterBuild(build);

  return (
    <section className="w-full flex flex-col items-start justify-start gap-4">
      <h2 className="uppercase font-bold text-xl text-ring">BUILD NAME</h2>
      <Input
        type="text"
        value={build.name}
        onChange={(e) => updateBuild({ name: e.target.value })}
        disabled={isStarter}
        className="w-full text-3xl disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {isStarter && (
        <p className="text-sm text-muted-foreground">
          Starter builds cannot be modified. Create a new build to customize.
        </p>
      )}
    </section>
  );
};
