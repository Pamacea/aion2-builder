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
    <div className="w-full flex justify-center border-b border-background/30">
      <div className="flex gap-2">
        {DAEVANION_PATHS.map((path) => {
          const pathRuneCount = pathRuneCounts.get(path.id) || 0;
          const isActive = activePath === path.id;

          return (
            <button
              key={path.id}
              onClick={() => onPathChange(path.id)}
              className={`px-4 py-2 font-semibold transition-colors ${
                isActive
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
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
