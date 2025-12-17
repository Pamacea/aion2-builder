"use client";

import { Button } from "@/components/ui/button";
import { DaevanionButtonsProps } from "@/types/daevanion.type";

export function DaevanionButtons({
  activePath,
  onResetPath,
  onResetAll,
  onActivateAll,
}: DaevanionButtonsProps) {
  const pathName = activePath.charAt(0).toUpperCase() + activePath.slice(1);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-bold text-center bg-background/50 py-2 border-y-2 border-y-foreground/30 uppercase">
        Daevanion Manager
      </h2>
      
      <div className="flex flex-col gap-2">
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
    </div>
  );
}
