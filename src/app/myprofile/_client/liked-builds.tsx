"use client";

import { BuildGrid } from "@/app/morebuild/_components/buildGrid";
import { BuildType } from "@/types/schema";

type LikedBuildsProps = {
  builds: BuildType[];
};

export const LikedBuilds = ({ builds }: LikedBuildsProps) => {
  if (builds.length === 0) {
    return (
      <div className="text-center py-12 text-foreground/50">
        <p className="text-lg">Vous n&apos;avez pas encore liké de build.</p>
        <p className="text-sm mt-2">Explorez les builds de la communauté et likez ceux qui vous intéressent !</p>
      </div>
    );
  }

  return <BuildGrid builds={builds} />;
};

