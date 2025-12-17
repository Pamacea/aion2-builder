"use client";

import { useBuildStore } from "@/store/useBuildEditor";
import { DaevanionPath } from "@/types/daevanion.type";
import { useEffect, useMemo, useState } from "react";
import { RuneGrid } from "./RuneGrid";
import { StatsSidebar } from "./StatsSidebar";
import { useDaevanionStore } from "./useDaevanionStore";

const DAEVANION_PATHS: { id: DaevanionPath; name: string }[] = [
  { id: "nezekan", name: "Nezekan" },
  { id: "zikel", name: "Zikel" },
  { id: "vaizel", name: "Vaizel" },
  { id: "triniel", name: "Triniel" },
  { id: "ariel", name: "Ariel" },
  { id: "azphel", name: "Azphel" },
];

// Points maximums par type de points
const MAX_POINTS_BY_TYPE: Record<string, number> = {
  Daevanion_Common_Points: 500, // Partagé entre Nezekan, Zikel, Vaizel, Triniel
  Daevanion_PvE_Points: 500, // Pour Ariel
  Daevanion_Pvp_Points: 500, // Pour Azphel
};

export function DaevanionPlanner() {
  const [activePath, setActivePath] = useState<DaevanionPath>("nezekan");
  const { build } = useBuildStore();
  const { daevanionBuild, toggleRune, getTotalStats, getPointsUsed, getPointsType, loadFromBuild } = useDaevanionStore();

  // Charger les données daevanion depuis le build au chargement
  useEffect(() => {
    if (build) {
      if (build.daevanion) {
        loadFromBuild({
          nezekan: build.daevanion.nezekan || [],
          zikel: build.daevanion.zikel || [],
          vaizel: build.daevanion.vaizel || [],
          triniel: build.daevanion.triniel || [],
          ariel: build.daevanion.ariel || [],
          azphel: build.daevanion.azphel || [],
        });
      } else {
        // Si le build n'a pas de daevanion, initialiser avec le start node
        loadFromBuild(null);
      }
    }
  }, [build, loadFromBuild]);

  const activeRunes = useMemo(() => {
    return daevanionBuild[activePath] || [];
  }, [daevanionBuild, activePath]);

  const [totalStats, setTotalStats] = useState<ReturnType<typeof getTotalStats> extends Promise<infer T> ? T : never>({
    attack: 0,
    criticalHit: 0,
    criticalHitResist: 0,
    mp: 0,
    maxHP: 0,
    defense: 0,
    cooldownReduction: 0,
    combatSpeed: 0,
    damageBoost: 0,
    damageTolerance: 0,
    criticalDamageTolerance: 0,
    criticalDamageBoost: 0,
    multiHitResist: 0,
    multiHitChance: 0,
    pveDamageTolerance: 0,
    pveDamageBoost: 0,
    pvpDamageBoost: 0,
    pvpDamageTolerance: 0,
    passiveLevelBoost: 0,
    activeSkillLevelBoost: 0,
  });

  const [pointsUsed, setPointsUsed] = useState(0);
  const pointsType = getPointsType(activePath);
  const maxPoints = MAX_POINTS_BY_TYPE[pointsType] || 500;

  useEffect(() => {
    getTotalStats(activePath).then(setTotalStats);
    getPointsUsed(activePath).then(setPointsUsed);
  }, [getTotalStats, getPointsUsed, activePath, daevanionBuild]);

  return (
    <div className="w-full h-full flex flex-row gap-4">
      {/* Zone principale avec onglets et grille */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Onglets */}
        <div className="flex gap-2 border-b border-border">
          {DAEVANION_PATHS.map((path) => {
            const pathRunes = daevanionBuild[path.id] || [];
            const pathRuneCount = pathRunes.length;
            const isActive = activePath === path.id;

            return (
              <button
                key={path.id}
                onClick={() => setActivePath(path.id)}
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

        {/* Grille de runes */}
        <div className="flex-1 overflow-auto">
          <RuneGrid
            path={activePath}
            activeRunes={activeRunes}
            onToggleRune={(slotId: number) => toggleRune(activePath, slotId)}
          />
        </div>
      </div>

      {/* Barre latérale des stats */}
      <div className="w-80 border-l border-border pl-4">
        <StatsSidebar 
          stats={totalStats} 
          pointsUsed={pointsUsed}
          pointsType={pointsType}
          maxPoints={maxPoints}
        />
      </div>
    </div>
  );
}
