"use client";

import { MoreBuildProps } from "@/types/schema";
import { useMemo, useState } from "react";
import { MoreBuildHead } from "../_client/more-build-head";
import { BuildGrid } from "./buildGrid";
import { filterBuilds } from "../_utils/filterBuilds";
import { FiltersSection } from "./filtersSection";

export const MoreBuild = ({ builds, classes }: MoreBuildProps) => {
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBuilds = useMemo(
    () => filterBuilds(builds, { selectedClassId, searchQuery }),
    [builds, selectedClassId, searchQuery]
  );

  return (
    <div className="w-full flex flex-col gap-6">
      <MoreBuildHead />
      <FiltersSection
        classes={classes}
        selectedClassId={selectedClassId}
        searchQuery={searchQuery}
        onClassChange={setSelectedClassId}
        onSearchChange={setSearchQuery}
      />
      <BuildGrid builds={filteredBuilds} />
    </div>
  );
};
