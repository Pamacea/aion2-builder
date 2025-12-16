"use client";

import { BuildType } from "@/types/schema";
import { BuildCard } from "../_client/build-card";

type BuildGridProps = {
  builds: BuildType[];
};

export const BuildGrid = ({ builds }: BuildGridProps) => {
  if (builds.length === 0) {
    return (
      <div className="text-center py-12 text-foreground/50">
        <p>No builds found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {builds.map((build) => (
        <BuildCard key={build.id} build={build} />
      ))}
    </div>
  );
}

BuildGrid.displayName = "BuildGrid";

