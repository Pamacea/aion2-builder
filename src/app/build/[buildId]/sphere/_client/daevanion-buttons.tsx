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
    <div className="flex flex-col sm:flex-row lg:flex-col gap-1.5 sm:gap-2">
        {/* Bouton Reset Planner Actuel */}
        <Button
          onClick={onResetPath}
          className="uppercase font-bold h-auto py-2 sm:py-2.5 lg:py-3 justify-start items-start bg-secondary/30 text-foreground flex px-3 sm:px-4 lg:px-6 text-xs sm:text-sm hover:border-b-2 hover:border-b-primary border-b-2 border-secondary"
        >
          Reset {pathName}
        </Button>

        {/* Bouton Reset Tous les Planners */}
        <Button
          onClick={onResetAll}
          className="uppercase font-bold h-auto py-2 sm:py-2.5 lg:py-3 justify-start items-center bg-red-600/30 text-red-400 flex px-3 sm:px-4 lg:px-6 text-xs sm:text-sm hover:border-b-2 hover:border-b-primary border-b-2 border-secondary"
        >
          Reset All Planners
        </Button>

        {/* Bouton Activer Toutes les Runes */}
        <Button
          onClick={onActivateAll}
          className="uppercase font-bold h-auto py-2 sm:py-2.5 lg:py-3 justify-start items-center bg-blue-600/30 text-blue-400 flex px-3 sm:px-4 lg:px-6 text-xs sm:text-sm hover:border-b-2 hover:border-b-primary border-b-2 border-secondary"
        >
          <span className="hidden sm:inline">Activate All {pathName} Runes</span>
          <span className="sm:hidden">Activate All</span>
        </Button>
      </div>
  );
}
