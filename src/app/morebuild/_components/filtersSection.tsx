"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClassType } from "@/types/schema";
import { memo, useCallback } from "react";
import { FilterByClass } from "../_client/filter-by-class";
import { FilterByName } from "../_client/filter-by-name";

type FiltersSectionProps = {
  classes: ClassType[];
  selectedClassId: number | null;
  searchQuery: string;
  sortBy: "likes" | "newest" | "oldest";
  onClassChange: (classId: number | null) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sortBy: "likes" | "newest" | "oldest") => void;
};

export const FiltersSection = memo(({
  classes,
  selectedClassId,
  searchQuery,
  sortBy,
  onClassChange,
  onSearchChange,
  onSortChange,
}: FiltersSectionProps) => {
  // Mémoriser le handler pour éviter les re-renders
  const handleSortValueChange = useCallback((value: string) => {
    onSortChange(value as "likes" | "newest" | "oldest");
  }, [onSortChange]);
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 pb-4 border-b-2 border-background/20">
      <FilterByClass
        classes={classes}
        selectedClassId={selectedClassId}
        onClassChange={onClassChange}
      />
      <div className="flex-1 w-full sm:w-auto">
        <FilterByName searchQuery={searchQuery} onSearchChange={onSearchChange} />
      </div>
      <div className="flex items-end gap-2">
        <span className="text-sm font-bold text-foreground/70 uppercase whitespace-nowrap">sort</span>
        <Select
          value={sortBy}
          onValueChange={(value) => onSortChange(value as "likes" | "newest" | "oldest")}
        >
          <SelectTrigger className="uppercase w-full text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed pl-4">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="uppercase px-2 z-50">
            <SelectItem value="likes">Most Liked</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});

FiltersSection.displayName = "FiltersSection";

