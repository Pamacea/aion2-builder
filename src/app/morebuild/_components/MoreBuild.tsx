"use client";

import { BuildType, ClassType } from "@/types/schema";
import { useMemo, useState } from "react";
import { BuildCard } from "../_client/build-card";
import { FilterByClass } from "../_client/filter-by-class";
import { FilterByName } from "../_client/filter-by-name";
import { MoreBuildHead } from "../_client/more-build-head";

type MoreBuildProps = {
  builds: BuildType[];
  classes: ClassType[];
};

export const MoreBuild = ({ builds, classes }: MoreBuildProps) => {
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBuilds = useMemo(() => {
    return builds.filter((build) => {
      // Filter by class
      if (selectedClassId !== null && build.classId !== selectedClassId) {
        return false;
      }

      // Filter by name
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return build.name.toLowerCase().includes(query);
      }

      return true;
    });
  }, [builds, selectedClassId, searchQuery]);

  return (
    <div className="w-full flex flex-col gap-6">
      <MoreBuildHead />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 pb-4 border-b-2 border-background/20">
        <FilterByClass
          classes={classes}
          selectedClassId={selectedClassId}
          onClassChange={setSelectedClassId}
        />
        <div className="flex-1 w-full sm:w-auto">
          <FilterByName
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      </div>

      {/* Builds Grid */}
      {filteredBuilds.length === 0 ? (
        <div className="text-center py-12 text-foreground/50">
          <p>No builds found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBuilds.map((build) => (
            <BuildCard key={build.id} build={build} />
          ))}
        </div>
      )}
    </div>
  );
};
