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
        <p className="text-lg">You have not created any builds yet.</p>
        <p className="text-sm mt-2">Create your first build from the classes page!</p>
      </div>
    );
  }

  return <BuildGrid builds={builds} />;
};

