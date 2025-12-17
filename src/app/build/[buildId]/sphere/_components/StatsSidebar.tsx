"use client";

import { Input } from "@/components/ui/input";
import { DaevanionStats } from "@/types/daevanion.type";
import { useState } from "react";

interface StatsSidebarProps {
  stats: DaevanionStats;
  pointsUsed: number;
  pointsType: string;
  maxPoints: number;
}

const STAT_DISPLAY_ORDER: Array<{ key: keyof DaevanionStats; label: string }> = [
  // Stats de base
  { key: "attack", label: "Attack Bonus" },
  { key: "criticalHit", label: "Critical Hit" },
  { key: "criticalHitResist", label: "Critical Hit Resist" },
  { key: "mp", label: "MP" },
  { key: "maxHP", label: "Max HP" },
  { key: "defense", label: "Defense" },
  
  // Stats spéciales (Unique)
  { key: "cooldownReduction", label: "Cooldown Reduction" },
  { key: "combatSpeed", label: "Combat Speed" },
  { key: "damageBoost", label: "Damage Boost" },
  { key: "damageTolerance", label: "Damage Tolerance" },
  { key: "criticalDamageTolerance", label: "Critical Damage Tolerance" },
  { key: "criticalDamageBoost", label: "Critical Damage Boost" },
  { key: "multiHitResist", label: "Multi Hit Resist" },
  { key: "multiHitChance", label: "Multi Hit Chance" },
  { key: "pveDamageTolerance", label: "PvE Damage Tolerance" },
  { key: "pveDamageBoost", label: "PvE Damage Boost" },
  { key: "pvpDamageBoost", label: "PvP Damage Boost" },
  { key: "pvpDamageTolerance", label: "PvP Damage Tolerance" },
  
  // Augmentations de niveau
  { key: "passiveLevelBoost", label: "Passive Level Boost" },
  { key: "activeSkillLevelBoost", label: "Active Skill Level Boost" },
];

export function StatsSidebar({ stats, pointsUsed, pointsType, maxPoints }: StatsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStats = STAT_DISPLAY_ORDER.filter((stat) => {
    if (!searchQuery) return true;
    return stat.label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const hasStats = Object.values(stats).some((value) => value > 0);
  const pointsRemaining = maxPoints - pointsUsed;
  const isOverLimit = pointsUsed > maxPoints;

  return (
    <div className="h-full flex flex-col gap-4 pt-4">
      <h2 className="text-xl font-bold text-center bg-background/50 py-2 border-y-2 border-y-foreground/30 uppercase">Bonus</h2>
      
      {/* Barre de recherche */}
      <Input
        type="text"
        placeholder="Search for stats.."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-3 py-2 border-b-2 border-b-background/30"
      />

      {/* Liste des stats */}
      <div className="flex-1 overflow-y-auto">
        {!hasStats ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            None Selected
          </div>
        ) : (
          <div className="space-y-2">
            {filteredStats.map((stat) => {
              const value = stats[stat.key] || 0;
              if (value === 0) return null;

              return (
                <div
                  key={stat.key}
                  className="flex justify-between items-center p-2 rounded-md bg-muted/50"
                >
                  <span className="text-sm font-medium">{stat.label}:</span>
                  <span className="text-sm font-bold text-primary">{value}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section des points en bas */}
      <div className="border-t border-border pt-4 pb-2 mt-auto">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium"> {pointsType === "Daevanion_Common_Points" ? "Common Points" : pointsType === "Daevanion_PvE_Points" ? "PvE Points" : "PvP Points"}:</span>
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
