"use client";

import { useBuildStore } from "@/store/useBuildEditor";
import { DaevanionPath } from "@/types/daevanion.type";
import { useEffect, useMemo, useRef, useState } from "react";
import { RuneGrid } from "../_client/RuneGrid";
import { useDaevanionStore } from "../_store/useDaevanionStore";
import { DaevanionManager } from "./DaevanionManager";
import { StatsSidebar } from "./StatsSidebar";

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
  const { daevanionBuild, toggleRune, getTotalStats, getPointsUsed, getPointsType, loadFromBuild, resetPath, resetAll, activateAllRunes } = useDaevanionStore();
  const hasLoadedRef = useRef(false);
  const lastBuildIdRef = useRef<number | null>(null);

  // Charger les données daevanion depuis le build au chargement
  // Ne charger qu'une seule fois au montage ou si le buildId change
  useEffect(() => {
    if (!build) return;
    
    const currentBuildId = build.id;
    
    // Ne charger que si c'est la première fois ou si le buildId a changé
    if (!hasLoadedRef.current || lastBuildIdRef.current !== currentBuildId) {
      hasLoadedRef.current = true;
      lastBuildIdRef.current = currentBuildId;
      
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

  // Calculer les stats de manière optimisée
  useEffect(() => {
    const updateStats = async () => {
      const [stats, points] = await Promise.all([
        getTotalStats(activePath),
        getPointsUsed(activePath)
      ]);
      setTotalStats(stats);
      setPointsUsed(points);
    };
    
    // Calculer immédiatement sans délai pour une meilleure réactivité
    updateStats();
  }, [getTotalStats, getPointsUsed, activePath, daevanionBuild]);

  return (
    <div className="w-full h-full flex flex-col ">
      {/* Onglets en pleine largeur, centrés */}
      <div className="w-full flex justify-center border-b border-background/30">
        <div className="flex gap-2">
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
      </div>

      {/* Zone principale avec manager à gauche, planner centré et stats à droite */}
      <div className="flex-1 flex flex-row gap-4">
        {/* Daevanion Manager à gauche */}
        <div className="w-80 border-r border-border pr-4">
          <DaevanionManager
            activePath={activePath}
            onResetPath={() => resetPath(activePath)}
            onResetAll={() => resetAll()}
            onActivateAll={() => activateAllRunes(activePath)}
          />
        </div>

        {/* Planner centré */}
        <div className="flex-1 flex justify-center items-center overflow-auto py-8">
          <div className="w-full h-full flex justify-center items-center">
            <RuneGrid
              path={activePath}
              activeRunes={activeRunes}
              onToggleRune={(slotId: number) => toggleRune(activePath, slotId)}
            />
          </div>
        </div>

        {/* Barre latérale des stats à droite */}
        <div className="w-80 border-l border-border pl-4">
          <StatsSidebar 
            stats={totalStats} 
            pointsUsed={pointsUsed}
            pointsType={pointsType}
            maxPoints={maxPoints}
          />
        </div>
      </div>
    </div>
  );
}
