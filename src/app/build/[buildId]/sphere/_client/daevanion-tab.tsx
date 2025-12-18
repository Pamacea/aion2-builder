"use client";

import { DAEVANION_PATHS } from "@/constants/daevanion.constant";
import { DaevanionPath, DaevanionTabProps } from "@/types/daevanion.type";
import { useMemo } from "react";
import { useDaevanionStore } from "../_store/useDaevanionStore";

export function DaevanionTab({ activePath, onPathChange }: DaevanionTabProps) {
  const { daevanionBuild } = useDaevanionStore();

  // Mémoriser les compteurs de runes pour éviter les recalculs
  const pathRuneCounts = useMemo(() => {
    const counts = new Map<DaevanionPath, number>();
    DAEVANION_PATHS.forEach((path) => {
      counts.set(path.id, (daevanionBuild[path.id] || []).length);
    });
    return counts;
  }, [daevanionBuild]);

  return (
    <div className="w-full flex justify-center overflow-x-auto">
      <div className="flex min-w-max">
        {DAEVANION_PATHS.map((path) => {
          const pathRuneCount = pathRuneCounts.get(path.id) || 0;
          const isActive = activePath === path.id;

          return (
            <button
              key={path.id}
              onClick={() => onPathChange(path.id)}
              className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap ${
                isActive
                  ? "border-b-2 border-foreground text-foreground"
                  : "text-foreground/60 hover:text-foreground border-b-2 border-background/20"
              }`}
            >
              {path.name} ({pathRuneCount})
            </button>
          );
        })}
      </div>
    </div>
  );
}
