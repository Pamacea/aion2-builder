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
        <p className="text-lg">You have not liked any builds yet.</p>
        <p className="text-sm mt-2">Explore the build catalog and like the ones you like!</p>
      </div>
    );
  }

  return <BuildGrid builds={builds} />;
};

