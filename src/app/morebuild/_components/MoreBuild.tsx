"use client";

import { userPrefs } from "@/lib/cookies";
import { prefetchCommonRoutes } from "@/lib/prefetch";
import { MoreBuildProps } from "@/types/schema";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MoreBuildHead } from "../_client/more-build-head";
import { filterBuilds } from "../_utils/filterBuilds";
import { BuildGrid } from "./buildGrid";
import { FiltersSection } from "./filtersSection";

export const MoreBuild = ({ builds, classes }: MoreBuildProps) => {
  // Charger les préférences depuis les cookies
  const [selectedClassId, setSelectedClassId] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const defaultFilter = userPrefs.getDefaultFilter();
    if (defaultFilter) {
      const classId = classes.find(c => c.name.toLowerCase() === defaultFilter.toLowerCase())?.id;
      return classId || null;
    }
    return null;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"likes" | "newest" | "oldest">(
    () => (userPrefs.getDefaultSort() as "likes" | "newest" | "oldest") || "newest"
  );

  // Prefetch des routes communes au montage
  useEffect(() => {
    prefetchCommonRoutes();
  }, []);

  // Mémoriser les callbacks pour éviter les re-renders inutiles
  const handleClassChange = useCallback((id: number | null) => {
    setSelectedClassId(id);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSortChange = useCallback((sort: "likes" | "newest" | "oldest") => {
    setSortBy(sort);
  }, []);

  // Mémoriser le filtrage des builds
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
        onClassChange={handleClassChange}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
      />
      <BuildGrid builds={filteredBuilds} />
    </div>
  );
};
