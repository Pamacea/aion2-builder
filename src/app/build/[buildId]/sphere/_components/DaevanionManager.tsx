"use client";

import { Button } from "@/components/ui/button";
import { DaevanionPath } from "@/types/daevanion.type";

interface DaevanionManagerProps {
  activePath: DaevanionPath;
  onResetPath: () => void;
  onResetAll: () => void;
  onActivateAll: () => void;
  pointsUsed: number;
  pointsType: string;
  maxPoints: number;
}

export function DaevanionManager({
  activePath,
  onResetPath,
  onResetAll,
  onActivateAll,
  pointsUsed,
  pointsType,
  maxPoints,
}: DaevanionManagerProps) {
  const pathName = activePath.charAt(0).toUpperCase() + activePath.slice(1);
  const pointsRemaining = maxPoints - pointsUsed;
  const isOverLimit = pointsUsed > maxPoints;

  return (
    <div className="h-full flex flex-col gap-4 pt-4">
      <h2 className="text-xl font-bold text-center bg-background/50 py-2 border-y-2 border-y-foreground/30 uppercase">Daevanion Manager</h2>
      
      <div className="flex-1 flex flex-col gap-2">
        {/* Bouton Reset Planner Actuel */}
        <Button
          onClick={onResetPath}
          className="h-auto py-3 justify-start items-center flex px-6 hover:border-b-2 hover:border-b-foreground border-b-2 border-b-background/25"
        >
          Reset {pathName}
        </Button>

        {/* Bouton Reset Tous les Planners */}
        <Button
          onClick={onResetAll}
          className="h-auto py-3 justify-start items-center flex px-6 hover:border-b-2 hover:border-b-foreground border-b-2 border-b-background/25"
        >
          Reset All Planners
        </Button>

        {/* Bouton Activer Toutes les Runes */}
        <Button
          onClick={onActivateAll}
          className="h-auto py-3 justify-start items-center flex px-6 hover:border-b-2 hover:border-b-foreground border-b-2 border-b-background/25"
        >
          Activate All {pathName} Runes
        </Button>
      </div>

      {/* Section des points en bas */}
      <div className="border-t border-border pt-4 pb-2 mt-auto">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {pointsType === "Daevanion_Common_Points" ? "Common Points" : pointsType === "Daevanion_PvE_Points" ? "PvE Points" : "PvP Points"}:
            </span>
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
    </div>
  );
}
