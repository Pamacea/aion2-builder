"use client";

import { useDaevanionRunes } from "@/hooks/useDaevanionData";
import { formatStats, getRarityColor, getRarityLabel, getRequiredLevel, getRuneCost, getRuneImage } from "@/lib/daevanionUtils";
import { useBuildStore } from "@/store/useBuildEditor";
import { DaevanionRune, RuneGridProps } from "@/types/daevanion.type";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

export function RuneGrid({ path, activeRunes, onToggleRune, isOwner }: RuneGridProps) {
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

    // EXCEPTION: Pour Ariel et Azphel, les rare/legend donnent des stats, pas des IDs
    const isArielOrAzphel = rune.path === "ariel" || rune.path === "azphel";
    if (isArielOrAzphel) return null;

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

  // Helper pour déterminer si une rune est un start node
  const isStartNode = useCallback((rune: DaevanionRune): boolean => {
    const startNodeSlotIds: Record<string, number> = {
      nezekan: 61,  // row 5, col 5 - grille 11x11
      zikel: 61,    // row 5, col 5 - grille 11x11
      vaizel: 61,   // row 5, col 5 - grille 11x11
      triniel: 85,  // row 6, col 6 - grille 13x13
      ariel: 113,   // row 7, col 7 - grille 15x15
      azphel: 113,  // row 7, col 7 - grille 15x15
    };
    return rune.slotId === startNodeSlotIds[rune.path];
  }, []);

  const handleRuneClick = useCallback(async (rune: DaevanionRune, event?: React.MouseEvent) => {
    // Si l'utilisateur n'est pas propriétaire, ne pas permettre les interactions
    if (!isOwner) {
      return;
    }
    // Le start node ne peut pas être désactivé
    if (isStartNode(rune)) {
      return; // Ne peut pas cliquer sur le start node
    }

    // Si la rune est déjà active, comportement normal (toggle/désactivation)
    if (activeRunes.includes(rune.slotId)) {
      await onToggleRune(rune.slotId);
      return;
    }

    // Pour une rune inactive, toujours créer le chemin automatique (clic gauche ou droit)
    event?.preventDefault();
    
    // Utiliser le store pour trouver le chemin le plus court
    const { useDaevanionStore } = await import("../_store/useDaevanionStore");
    const store = useDaevanionStore.getState();
    const shortestPath = await store.findShortestPath(path, rune.slotId);
    
    console.log(`[Daevanion] Clic sur rune ${rune.slotId}, chemin trouvé:`, shortestPath);
    
    if (shortestPath.length > 0) {
      // Activer toutes les runes du chemin (incluant la rune cible)
      console.log(`[Daevanion] Activation du chemin avec ${shortestPath.length} runes`);
      await store.activatePath(path, shortestPath);
    } else {
      console.warn(`[Daevanion] Aucun chemin trouvé pour la rune ${rune.slotId}, tentative d'activation directe`);
      // Si aucun chemin trouvé, essayer d'activer directement si possible
      if (canActivate(rune)) {
        await onToggleRune(rune.slotId);
      }
    }
  }, [canActivate, activeRunes, onToggleRune, isStartNode, isOwner, path]);

  // Calculer la taille des runes selon la taille de la grille
  const runeSize = useMemo(() => {
    if (path === "ariel" || path === "azphel") {
      // Grille 15x15 : réduire à ~52px pour mieux tenir dans l'écran
      return { size: "w-[52px] h-[52px]", gap: "gap-1", imageSize: 52 };
    } else if (path === "triniel") {
      // Grille 13x13 : réduire à ~56px
      return { size: "w-[56px] h-[56px]", gap: "gap-2", imageSize: 56 };
    } else {
      // Grille 11x11 : taille normale 64px (w-16 h-16)
      return { size: "w-16 h-16", gap: "gap-2", imageSize: 64 };
    }
  }, [path]);

  // Organiser les runes en grille basée sur leurs positions
  const gridRunes = useMemo(() => {
    const grid: (DaevanionRune | null)[][] = [];
    // Grille 11x11 pour Nezekan, Zikel et Vaizel, 13x13 pour Triniel, 15x15 pour Ariel et Azphel
    const gridSize = path === "triniel" ? 13 : path === "ariel" || path === "azphel" ? 15 : 11; // Largeur (colonnes)
    const gridHeight = path === "nezekan" || path === "zikel" || path === "vaizel" ? 11 : path === "triniel" ? 13 : path === "ariel" || path === "azphel" ? 15 : 9; // Hauteur (lignes)

    // Initialiser la grille
    for (let y = 0; y < gridHeight; y++) {
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
        if (x >= 0 && x < gridSize && y >= 0 && y < gridHeight) {
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
      const isStartNodeRune = isStartNode(rune);

      // Calculer les styles
      let opacityClass = "opacity-100";
      let borderClass = "";
      
      if (isStartNodeRune) {
        opacityClass = "opacity-100";
        borderClass = isActive ? "border-2 border-blue-500/50" : "";
      } else if (isActive) {
        opacityClass = "opacity-100";
        borderClass = "border-2 border-blue-500/50";
      } else if (canActivateRune) {
        opacityClass = "opacity-100";
        borderClass = "border-2 border-gray-400/50";
      } else {
        opacityClass = "opacity-40";
        borderClass = "";
      }

      // Calculer les infos
      const statsList = formatStats(rune.stats);
      const rarityLabel = getRarityLabel(rune.rarity, isStartNodeRune);
      const rarityColor = getRarityColor(rune.rarity, isStartNodeRune);
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
  }, [runes, activeRunes, canActivate, getSkillLevelUpInfo, isStartNode]);

  return (
    <div className="w-full h-full flex justify-center items-start p-2">
      <div className="inline-block border-2 border-foreground/50 rounded-md p-4 bg-background/80 ">
        {gridRunes.map((row, rowIndex) => (
          <div key={rowIndex} className={`flex ${runeSize.gap}`}>
            {row.map((rune, colIndex) => {
              if (!rune) {
                return <div key={`${rowIndex}-${colIndex}`} className={runeSize.size} />;
              }

              const isActive = activeRunes.includes(rune.slotId);
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
                    onClick={(e) => handleRuneClick(rune, e)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleRuneClick(rune, e);
                    }}
                    disabled={!isOwner}
                    className={`
                      relative ${runeSize.size} transition-all
                      ${runeStyles.opacityClass}
                      ${isOwner ? "cursor-pointer hover:scale-110" : "cursor-not-allowed"}
                      ${!isOwner ? "opacity-60" : ""}
                      ${runeStyles.borderClass}
                    `}
                    title={isOwner ? (isActive ? "Cliquer pour désactiver" : "Cliquer pour activer le chemin automatique") : ""}
                  >
                    <Image
                      src={runeData.imageSrc}
                      alt={rune.name}
                      width={runeSize.imageSize}
                      height={runeSize.imageSize}
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
                      
                      {/* Informations de coût et niveau requis */}
                      <div className="mb-2 pb-2 border-b border-primary/30 space-y-1">
                        <div className="text-sm text-foreground">
                          <span className="font-semibold">Price:</span> {isStartNode(rune) ? 0 : getRuneCost(rune.rarity)}
                        </div>
                        <div className="text-sm text-foreground">
                          <span className="font-semibold">Reset cost:</span> 500
                        </div>
                        <div className="text-sm text-foreground">
                          <span className="font-semibold">Required Level:</span> {getRequiredLevel(rune.path)}
                        </div>
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
