"use client";

import { Input } from "@/components/ui/input";
import { FilterByNameProps } from "@/types/build.type";



export const FilterByName = ({ searchQuery, onSearchChange }: FilterByNameProps) => {
  return (
    <div className="flex items-end gap-1.5 sm:gap-2 w-full">
      <span className="text-xs sm:text-sm font-bold text-foreground/70 uppercase whitespace-nowrap">search</span>
      <Input
        type="text"
        placeholder="By build name..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 w-full px-2 sm:px-3 text-xs sm:text-sm border-background/40 hover:border-foreground focus:border-foreground transition-colors"
      />
    </div>
  );
};

