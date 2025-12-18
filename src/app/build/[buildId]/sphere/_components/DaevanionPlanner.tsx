"use client";

import { MAX_POINTS_BY_TYPE } from "@/constants/daevanion.constant";
import { useDaevanionPoints, useDaevanionStats } from "@/hooks/useDaevanionData";
import { useBuildStore } from "@/store/useBuildEditor";
import { DaevanionPath } from "@/types/daevanion.type";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DaevanionButtons } from "../_client/daevanion-buttons";
import { DaevanionPoints } from "../_client/daevanion-points";
import { DaevanionTab } from "../_client/daevanion-tab";
import { useDaevanionStore } from "../_store/useDaevanionStore";
import { RuneGrid } from "./RuneGrid";
import { StatsSidebar } from "./StatsSidebar";

export function DaevanionPlanner() {
  const [activePath, setActivePath] = useState<DaevanionPath>("nezekan");
  const { build } = useBuildStore();
  const { daevanionBuild, toggleRune, getPointsType, loadFromBuild, resetPath, resetAll, activateAllRunes } = useDaevanionStore();
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

  // Mémoriser les runes actives pour éviter les recalculs
  const activeRunes = useMemo(() => {
    return daevanionBuild[activePath] || [];
  }, [daevanionBuild, activePath]);

  // Utiliser TanStack Query pour les stats et points avec cache
  const { data: totalStats = {
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
    skillLevelUps: [],
  } } = useDaevanionStats(activePath, activeRunes);

  const { data: pointsUsed = 0 } = useDaevanionPoints(activePath, activeRunes);

  // Calculer les valeurs (pas besoin de useMemo pour une fonction simple)
  const pointsType = getPointsType(activePath);
  const maxPoints = MAX_POINTS_BY_TYPE[pointsType] || 500;

  // Callbacks mémorisés pour éviter les re-renders
  const handlePathChange = useCallback((path: DaevanionPath) => {
    setActivePath(path);
  }, []);

  const handleToggleRune = useCallback((slotId: number) => {
    toggleRune(activePath, slotId);
  }, [activePath, toggleRune]);

  const handleResetPath = useCallback(() => {
    resetPath(activePath);
  }, [activePath, resetPath]);

  const handleResetAll = useCallback(() => {
    resetAll();
  }, [resetAll]);

  const handleActivateAll = useCallback(() => {
    activateAllRunes(activePath);
  }, [activePath, activateAllRunes]);

  return (
    <div className="w-full h-full max-h-screen flex flex-col overflow-hidden">
      {/* Onglets en pleine largeur, centrés */}
      <DaevanionTab
        activePath={activePath}
        onPathChange={handlePathChange}
      />

      {/* Zone principale avec manager à gauche, planner centré et stats à droite */}
      <div className="flex-1 flex flex-row gap-4 min-h-0">
        {/* Daevanion Manager à gauche */}
        <div className="w-80 border-r-2 border-background/30 pr-4 flex flex-col">
          <div className="flex-1">
            <DaevanionButtons
              activePath={activePath}
              onResetPath={handleResetPath}
              onResetAll={handleResetAll}
              onActivateAll={handleActivateAll}
            />
          </div>
          
          {/* Section des points en bas */}
          <div className="mt-auto">
            <DaevanionPoints
              pointsUsed={pointsUsed}
              pointsType={pointsType}
              maxPoints={maxPoints}
            />
          </div>
        </div>

        {/* Planner centré */}
        <div className="flex-1 flex justify-center items-center overflow-auto py-8">
          <div className="w-full h-full flex justify-center items-center">
            <RuneGrid
              path={activePath}
              activeRunes={activeRunes}
              onToggleRune={handleToggleRune}
            />
          </div>
        </div>

        {/* Barre latérale des stats à droite */}
        <div className="w-80 border-l-2 border-background/30 pl-4">
          <StatsSidebar stats={totalStats} />
        </div>
      </div>
    </div>
  );
}
