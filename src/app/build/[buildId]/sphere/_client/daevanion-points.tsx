"use client";

import { getPointsTypeLabel } from "@/lib/daevanionUtils";
import { DaevanionPointsProps } from "@/types/daevanion.type";
import { useMemo } from "react";

export function DaevanionPoints({
  pointsUsed,
  pointsType,
  maxPoints,
}: DaevanionPointsProps) {
  const isOverLimit = pointsUsed > maxPoints;

  const pointsTypeLabel = useMemo(() => getPointsTypeLabel(pointsType), [pointsType]);

  return (
      <div className="border-b-2 lg:border-b-2 border-background/30 py-2 sm:py-2.5 lg:py-3 px-3 sm:px-4 lg:px-6 hover:border-foreground transition-all">
        <div className="flex justify-between items-center gap-2">
          <span className="text-xs sm:text-sm font-medium uppercase">{pointsTypeLabel}</span>
          <span className={`text-xs sm:text-sm font-bold ${isOverLimit ? "text-destructive" : "text-foreground/80"}`}>
            {pointsUsed} / {maxPoints}
          </span>
        </div>

      </div>
  );
}
