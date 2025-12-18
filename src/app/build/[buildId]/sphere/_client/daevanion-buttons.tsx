"use client";

import { Button } from "@/components/ui/button";
import { DaevanionButtonsProps } from "@/types/daevanion.type";

export function DaevanionButtons({
  activePath,
  onResetPath,
  onResetAll,
  onActivateAll,
  isOwner,
}: DaevanionButtonsProps) {
  const pathName = activePath.charAt(0).toUpperCase() + activePath.slice(1);

  // Si l'utilisateur n'est pas propriétaire, ne pas afficher les boutons
  if (!isOwner) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
        {/* Bouton Reset Planner Actuel */}
        <Button
          onClick={onResetPath}
          className="uppercase font-bold h-auto py-3 justify-start items-start bg-background/30 text-foreground flex px-6 hover:border-b-2 hover:border-b-foreground border-b-2 border-b-foreground/30"
        >
          Reset {pathName}
        </Button>

        {/* Bouton Reset Tous les Planners */}
        <Button
          onClick={onResetAll}
          className="uppercase font-bold h-auto py-3 justify-start items-center bg-red-600/30 text-red-400 flex px-6 hover:border-b-2 hover:border-b-foreground border-b-2 border-b-foreground/30"
        >
          Reset All Planners
        </Button>

        {/* Bouton Activer Toutes les Runes */}
        <Button
          onClick={onActivateAll}
          className="uppercase font-bold h-auto py-3 justify-start items-center bg-blue-600/30 text-blue-400 flex px-6 hover:border-b-2 hover:border-b-foreground border-b-2 border-b-foreground/30"
        >
          Activate All {pathName} Runes
        </Button>
      </div>
  );
}
