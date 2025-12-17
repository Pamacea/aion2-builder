"use client";

import { useDaevanionRunes } from "@/hooks/useDaevanionData";
import { formatStats, getRarityColor, getRarityLabel, getRuneImage } from "@/lib/daevanionUtils";
import { useBuildStore } from "@/store/useBuildEditor";
import { DaevanionRune, RuneGridProps } from "@/types/daevanion.type";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

export function RuneGrid({ path, activeRunes, onToggleRune }: RuneGridProps) {
  const [hoveredRune, setHoveredRune] = useState<DaevanionRune | null>(null);
  const { build } = useBuildStore();
  
  // Utiliser TanStack Query pour charger les runes avec cache
  const { data: runes = [] } = useDaevanionRunes(path);

  // Mémoriser les abilities et passives triés pour éviter les recalculs
  const sortedAbilities = useMemo(() => {
    return build?.class?.abilities
      ? [...build.class.abilities].sort((a, b) => a.id - b.id)
      : [];
  }, [build]);

  const sortedPassives = useMemo(() => {
    return build?.class?.passives
      ? [...build.class.passives].sort((a, b) => a.id - b.id)
      : [];
  }, [build]);

  // Helper pour obtenir le nom du skill/passive boosté par une rune (mémorisé)
  const getSkillLevelUpInfo = useCallback((rune: DaevanionRune): { name: string; type: "ability" | "passive" } | null => {
    if (!build) return null;

    // Traiter les nodes rare (passiveId)
    if (rune.rarity === "rare" && rune.passiveId) {
      const passiveIndex = rune.passiveId - 1;
      if (passiveIndex >= 0 && passiveIndex < sortedPassives.length) {
        const passive = sortedPassives[passiveIndex];
        return { name: passive.name, type: "passive" };
      }
    }

    // Traiter les nodes legend (abilityId)
    if (rune.rarity === "legend" && rune.abilityId) {
      const abilityIndex = rune.abilityId - 1;
      if (abilityIndex >= 0 && abilityIndex < sortedAbilities.length) {
        const ability = sortedAbilities[abilityIndex];
        return { name: ability.name, type: "ability" };
      }
    }

    return null;
  }, [build, sortedAbilities, sortedPassives]);

  const handleMouseEnter = useCallback((rune: DaevanionRune) => {
    setHoveredRune(rune);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setHoveredRune(null);
  }, []);

  // Mémoriser la fonction canActivate avec useMemo pour éviter les recalculs
  const canActivateMap = useMemo(() => {
    const map = new Map<number, boolean>();
    runes.forEach((rune) => {
      if (!rune) return;
      if (activeRunes.includes(rune.slotId)) {
        map.set(rune.slotId, true);
        return;
      }
      if (!rune.prerequisites || rune.prerequisites.length === 0) {
        map.set(rune.slotId, true);
        return;
      }
      map.set(rune.slotId, rune.prerequisites.some((prereq) => activeRunes.includes(prereq)));
    });
    return map;
  }, [runes, activeRunes]);

  const canActivate = useCallback((rune: DaevanionRune): boolean => {
    return canActivateMap.get(rune.slotId) ?? false;
  }, [canActivateMap]);

  const handleRuneClick = useCallback(async (rune: DaevanionRune) => {
    // Le start node (slotId 61) ne peut pas être désactivé
    const isStartNode = rune.slotId === 61 && rune.path === "nezekan";
    if (isStartNode) {
      return; // Ne peut pas cliquer sur le start node
    }
    if (!canActivate(rune) && !activeRunes.includes(rune.slotId)) {
      return; // Ne peut pas activer
    }
    await onToggleRune(rune.slotId);
  }, [canActivate, activeRunes, onToggleRune]);

  // Organiser les runes en grille basée sur leurs positions (11x11 pour Nezekan)
  const gridRunes = useMemo(() => {
    const grid: (DaevanionRune | null)[][] = [];
    // Grille 11x11 pour Nezekan, 8x8 pour les autres chemins (à ajuster plus tard)
    const gridSize = path === "nezekan" ? 11 : 8;

    // Initialiser la grille
    for (let y = 0; y < gridSize; y++) {
      grid[y] = [];
      for (let x = 0; x < gridSize; x++) {
        grid[y][x] = null;
      }
    }

    // Placer les runes dans la grille selon leur position
    // Les runes peuvent être null (slots vides)
    runes.forEach((rune) => {
      if (rune && rune.position) {
        const x = rune.position.x;
        const y = rune.position.y;
        // Vérifier que la position est dans les limites
        if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
          grid[y][x] = rune;
        }
      }
    });

    return grid;
  }, [runes, path]);

  // Mémoriser les informations de toutes les runes pour éviter les recalculs
  const runesInfo = useMemo(() => {
    const infoMap = new Map<number, {
      styles: { opacityClass: string; borderClass: string };
      info: { statsList: string[]; rarityLabel: string; rarityColor: string; skillLevelUp: ReturnType<typeof getSkillLevelUpInfo>; tooltipPositionClass: string };
      imageSrc: string;
    }>();

    runes.forEach((rune) => {
      if (!rune) return;

      const isActive = activeRunes.includes(rune.slotId);
      const canActivateRune = canActivate(rune);
      const isStartNode = rune.slotId === 61 && rune.path === "nezekan";

      // Calculer les styles
      let opacityClass = "opacity-100";
      let borderClass = "";
      
      if (isStartNode) {
        opacityClass = "opacity-100";
        borderClass = isActive ? "border-2 border-blue-500" : "";
      } else if (isActive) {
        opacityClass = "opacity-100";
        borderClass = "border-2 border-blue-500";
      } else if (canActivateRune) {
        opacityClass = "opacity-100";
        borderClass = "border-2 border-gray-400";
      } else {
        opacityClass = "opacity-40";
        borderClass = "";
      }

      // Calculer les infos
      const statsList = formatStats(rune.stats);
      const rarityLabel = getRarityLabel(rune.rarity, isStartNode);
      const rarityColor = getRarityColor(rune.rarity, isStartNode);
      const skillLevelUp = getSkillLevelUpInfo(rune);
      const isTopRow = rune.position && rune.position.y < 3;
      const tooltipPositionClass = isTopRow 
        ? "top-full left-1/2 transform -translate-x-1/2 mt-2" 
        : "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
      
      // Calculer l'image
      const imageSrc = getRuneImage(rune, isActive);

      infoMap.set(rune.slotId, {
        styles: { opacityClass, borderClass },
        info: { statsList, rarityLabel, rarityColor, skillLevelUp, tooltipPositionClass },
        imageSrc,
      });
    });

    return infoMap;
  }, [runes, activeRunes, canActivate, getSkillLevelUpInfo]);

  return (
    <div className="w-full h-full p-4 overflow-auto flex justify-center items-start">
      <div className="inline-block">
        {gridRunes.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((rune, colIndex) => {
              if (!rune) {
                return <div key={`${rowIndex}-${colIndex}`} className="w-16 h-16" />;
              }

              const isActive = activeRunes.includes(rune.slotId);
              const canActivateRune = canActivate(rune);
              const showTooltip = hoveredRune?.slotId === rune.slotId;
              const runeData = runesInfo.get(rune.slotId);
              
              if (!runeData) {
                return null;
              }

              const { styles: runeStyles, info: runeInfo } = runeData;

              return (
                <div 
                  key={rune.slotId} 
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter(rune)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => handleRuneClick(rune)}
                    disabled={!canActivateRune && !isActive}
                    className={`
                      relative w-16 h-16 transition-all
                      ${runeStyles.opacityClass}
                      ${canActivateRune || isActive ? "cursor-pointer hover:scale-110" : "cursor-not-allowed"}
                      ${runeStyles.borderClass}
                    `}
                  >
                    <Image
                      src={runeData.imageSrc}
                      alt={rune.name}
                      width={64}
                      height={64}
                      className="w-full h-full"
                      unoptimized
                    />
                  </button>
                  
                  {/* Tooltip */}
                  {showTooltip && (
                    <div
                      className={`absolute z-100 bg-background border-2 border-primary p-3 rounded-md shadow-lg min-w-[200px] pointer-events-none ${runeInfo.tooltipPositionClass}`}
                    >
                      <div className="border-b-2 border-primary pb-2 mb-2">
                        <div className={`font-bold ${runeInfo.rarityColor}`}>{runeInfo.rarityLabel}</div>
                      </div>
                      
                      {/* Afficher le skill level up pour les nodes rare et legend */}
                      {runeInfo.skillLevelUp && (
                        <div className="mb-2 pb-2 border-b border-primary/30">
                          <div className="text-sm font-semibold text-primary">
                            Skill Level Up - {runeInfo.skillLevelUp.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {runeInfo.skillLevelUp.type === "ability" ? "Ability" : "Passive"} +1 Level
                          </div>
                        </div>
                      )}
                      
                      {runeInfo.statsList.length > 0 ? (
                        <div className="space-y-1">
                          {runeInfo.statsList.map((stat, index) => (
                            <div key={index} className="text-sm text-foreground">
                              {stat}
                            </div>
                          ))}
                        </div>
                      ) : (
                        !runeInfo.skillLevelUp && (
                          <div className="text-sm text-muted-foreground">Aucune stats</div>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
