"use client";

import { getPointsTypeLabel } from "@/lib/daevanionUtils";
import { DaevanionPointsProps } from "@/types/daevanion.type";
import { useMemo } from "react";

export function DaevanionPoints({
  pointsUsed,
  pointsType,
  maxPoints,
}: DaevanionPointsProps) {
  const pointsRemaining = maxPoints - pointsUsed;
  const isOverLimit = pointsUsed > maxPoints;

  const pointsTypeLabel = useMemo(() => getPointsTypeLabel(pointsType), [pointsType]);

  return (
    <div className="border-t border-border pt-4 pb-2">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{pointsTypeLabel}:</span>
          <span className={`text-sm font-bold ${isOverLimit ? "text-destructive" : "text-primary"}`}>
            {pointsUsed} / {maxPoints}
          </span>
        </div>
        {isOverLimit && (
          <div className="text-xs text-destructive">
            ⚠️ Limite dépassée de {Math.abs(pointsRemaining)} points
          </div>
        )}
        {!isOverLimit && pointsRemaining > 0 && (
          <div className="text-xs text-muted-foreground">
            {pointsRemaining} points restants
          </div>
        )}
        {!isOverLimit && pointsRemaining === 0 && (
          <div className="text-xs text-muted-foreground">
            Tous les points utilisés
          </div>
        )}
      </div>
    </div>
  );
}
