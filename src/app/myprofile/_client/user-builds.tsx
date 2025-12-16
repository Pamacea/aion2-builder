"use client";

import { BuildGrid } from "@/app/morebuild/_components/buildGrid";
import { BuildType } from "@/types/schema";

type UserBuildsProps = {
  builds: BuildType[];
};

export const UserBuilds = ({ builds }: UserBuildsProps) => {
  if (builds.length === 0) {
    return (
      <div className="text-center py-12 text-foreground/50">
        <p className="text-lg">Vous n&apos;avez pas encore créé de build.</p>
        <p className="text-sm mt-2">Créez votre premier build depuis la page des classes !</p>
      </div>
    );
  }

  return <BuildGrid builds={builds} />;
};

