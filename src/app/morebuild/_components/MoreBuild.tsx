"use client";

import { MoreBuildProps } from "@/types/schema";
import { useMemo, useState } from "react";
import { MoreBuildHead } from "../_client/more-build-head";
import { filterBuilds } from "../_utils/filterBuilds";
import { BuildGrid } from "./buildGrid";
import { FiltersSection } from "./filtersSection";

export const MoreBuild = ({ builds, classes }: MoreBuildProps) => {
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"likes" | "newest" | "oldest">("newest");

  const filteredBuilds = useMemo(
    () => filterBuilds(builds, { selectedClassId, searchQuery, sortBy }),
    [builds, selectedClassId, searchQuery, sortBy]
  );

  return (
    <div className="w-full flex flex-col gap-6">
      <MoreBuildHead />
      <FiltersSection
        classes={classes}
        selectedClassId={selectedClassId}
        searchQuery={searchQuery}
        sortBy={sortBy}
        onClassChange={setSelectedClassId}
        onSearchChange={setSearchQuery}
        onSortChange={setSortBy}
      />
      <BuildGrid builds={filteredBuilds} />
    </div>
  );
};
