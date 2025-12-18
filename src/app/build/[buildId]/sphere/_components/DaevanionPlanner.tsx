"use client";

import { MAX_POINTS_BY_TYPE } from "@/constants/daevanion.constant";
import { useDaevanionPoints, useDaevanionStats } from "@/hooks/useDaevanionData";
import { useBuildStore } from "@/store/useBuildEditor";
import { DaevanionPath, DaevanionStats } from "@/types/daevanion.type";
import { isBuildOwner } from "@/utils/buildUtils";
import { useCallback, useMemo, useState } from "react";
import { useDaevanionInitializer } from "../../_utils/useDaevanionInitializer";
import { DaevanionButtons } from "../_client/daevanion-buttons";
import { DaevanionPoints } from "../_client/daevanion-points";
import { DaevanionTab } from "../_client/daevanion-tab";
import { useDaevanionStore } from "../_store/useDaevanionStore";
import { RuneGrid } from "./RuneGrid";
import { StatsSidebar } from "./StatsSidebar";

export function DaevanionPlanner() {
  const [activePath, setActivePath] = useState<DaevanionPath>("nezekan");
  const { build, currentUserId } = useBuildStore();
  const { daevanionBuild, toggleRune, getPointsType, resetPath, resetAll, activateAllRunes } = useDaevanionStore();
  
  // Initialiser le store Daevanion avec les données du build
  useDaevanionInitializer();
  
  // Vérifier si l'utilisateur est propriétaire du build
  const isOwner = build ? isBuildOwner(build, currentUserId) : false;

  // Mémoriser les runes actives pour éviter les recalculs
  const activeRunes = useMemo(() => {
    return daevanionBuild[activePath] || [];
  }, [daevanionBuild, activePath]);

  // Objet par défaut pour les stats
  const defaultStats: DaevanionStats = {
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
    // Stats spéciales Ariel (Legend)
    bossDamageTolerance: 0,
    bossDamageBoost: 0,
    // Stats spéciales Ariel (Rare)
    pveAccuracy: 0,
    pveEvasion: 0,
    bossAttack: 0,
    bossDefense: 0,
    pveAttack: 0,
    pveDefense: 0,
    // Stats spéciales Azphel (Legend)
    statusEffectChance: 0,
    statusEffectResist: 0,
    // Stats spéciales Azphel (Rare)
    pvpCriticalHit: 0,
    pvpCriticalHitResist: 0,
    pvpAccuracy: 0,
    pvpEvasion: 0,
    pvpAttack: 0,
    pvpDefense: 0,
    // Augmentations de niveau
    passiveLevelBoost: 0,
    activeSkillLevelBoost: 0,
    skillLevelUps: [],
  };

  // Utiliser TanStack Query pour les stats et points avec cache
  const { data: totalStats = defaultStats } = useDaevanionStats(activePath, activeRunes);

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

  const handleResetPath = useCallback(async () => {
    await resetPath(activePath);
  }, [activePath, resetPath]);

  const handleResetAll = useCallback(async () => {
    await resetAll();
  }, [resetAll]);

  const handleActivateAll = useCallback(async () => {
    await activateAllRunes(activePath);
  }, [activePath, activateAllRunes]);

  return (
    <div className="w-full h-auto lg:h-full max-h-screen flex flex-col lg:flex-row overflow-hidden gap-2 sm:gap-4">
      {/* Colonne gauche - Boutons et Points */}
      <div className="w-full lg:w-1/5 shrink-0 flex flex-col gap-2 sm:gap-4 h-auto lg:h-full order-3 lg:order-1">
        {/* Section des points en bas */}
        <div className="shrink-0 bg-secondary/30 border-b-2 border-secondary">
          <DaevanionPoints
            pointsUsed={pointsUsed}
            pointsType={pointsType}
            maxPoints={maxPoints}
          />
        </div>

        {/* Boutons en haut */}
        <div className="shrink-0">
          <DaevanionButtons
            activePath={activePath}
            onResetPath={handleResetPath}
            onResetAll={handleResetAll}
            onActivateAll={handleActivateAll}
            isOwner={isOwner}
          />
        </div>
        
        {/* Espace flexible qui pousse les points vers le bas */}
        <div className="hidden lg:block flex-1"></div>
        
      </div>

      {/* Colonne du milieu - Tabs et Rune Grid */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden gap-2 sm:gap-4 lg:gap-6 order-1 lg:order-2">
        {/* Onglets */}
        <div className="shrink-0">
          <DaevanionTab
            activePath={activePath}
            onPathChange={handlePathChange}
          />
        </div>
        
        {/* Rune Grid */}
        <div className="flex-1 flex justify-center items-start lg:items-center overflow-auto min-h-0 min-w-0">
          <RuneGrid
            path={activePath}
            activeRunes={activeRunes}
            onToggleRune={handleToggleRune}
            isOwner={isOwner}
          />
        </div>
      </div>

      {/* Colonne droite - Stats */}
      <div className="w-full lg:w-1/5 shrink-0 h-[40vh] sm:h-[50vh] lg:h-full overflow-hidden order-2 lg:order-3 pt-2 lg:pt-0 lg:pl-2">
        <StatsSidebar stats={totalStats} />
      </div>
    </div>
  );
}
