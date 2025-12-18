"use client";

import { Input } from "@/components/ui/input";
import { STAT_DISPLAY_ORDER } from "@/constants/daevanion.constant";
import { StatsSidebarProps } from "@/types/daevanion.type";
import { useMemo, useState } from "react";

export function StatsSidebar({ stats }: StatsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Mémoriser les stats filtrées
  const filteredStats = useMemo(() => {
    return STAT_DISPLAY_ORDER.filter((stat) => {
      if (!searchQuery) return true;
      return stat.label.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  // Mémoriser le calcul de hasStats
  const hasStats = useMemo(() => {
    return Object.entries(stats).some(([key, value]) => {
      // Exclure skillLevelUps du calcul
      if (key === "skillLevelUps") return false;
      return typeof value === "number" && value > 0;
    }) || stats.skillLevelUps.length > 0;
  }, [stats]);

  return (
    <div className="h-full flex flex-col gap-4 pt-4 overflow-hidden">
      <h2 className="text-xl font-bold text-center bg-background/50 py-2 border-y-2 border-y-foreground/30 uppercase">Bonus</h2>
      
      {/* Barre de recherche */}
      <Input
        type="text"
        placeholder="Search for stats.."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-3 py-2 border-b-2 border-b-background/30 flex-shrink-0"
      />

      {/* Liste des stats */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {!hasStats && stats.skillLevelUps.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            None Selected
          </div>
        ) : (
          <div className="space-y-2">
            {/* Afficher les skill level ups en premier */}
            {stats.skillLevelUps.map((skillLevelUp, index) => (
              <div
                key={`${skillLevelUp.type}-${skillLevelUp.id}-${index}`}
                className="flex justify-between items-center p-2 rounded-md bg-muted/50"
              >
                <span className="text-sm font-medium">
                  Skill Level Up - {skillLevelUp.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {skillLevelUp.type === "ability" ? "Ability" : "Passive"}
                </span>
              </div>
            ))}
            
            {/* Afficher les stats normales */}
            {filteredStats.map((stat) => {
              const value = stats[stat.key];
              // Vérifier que la valeur est un nombre (exclure skillLevelUps qui est un tableau)
              if (typeof value !== "number" || value === 0) return null;
              
              // TypeScript assertion: on sait que value est un nombre ici
              const numericValue = value as number;

              return (
                <div
                  key={stat.key}
                  className="flex justify-between items-center p-2 rounded-md bg-muted/50"
                >
                  <span className="text-sm font-medium">{stat.label}:</span>
                  <span className="text-sm font-bold text-primary">{numericValue}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
