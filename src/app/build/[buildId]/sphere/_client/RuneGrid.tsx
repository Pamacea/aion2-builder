"use client";

import { useBuildStore } from "@/store/useBuildEditor";
import { DaevanionPath, DaevanionRune } from "@/types/daevanion.type";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

// Helper pour formater les stats pour l'affichage
const formatStats = (stats: DaevanionRune["stats"]): string[] => {
  if (!stats || Object.keys(stats).length === 0) return [];
  
  const statLabels: Record<string, string> = {
    attack: "Attack Bonus",
    criticalHit: "Critical Hit",
    criticalHitResist: "Critical Hit Resist",
    mp: "MP",
    maxHP: "Max HP",
    defense: "Defense",
    cooldownReduction: "Cooldown Reduction",
    combatSpeed: "Combat Speed",
    damageBoost: "Damage Boost",
    damageTolerance: "Damage Tolerance",
    criticalDamageTolerance: "Critical Damage Tolerance",
    criticalDamageBoost: "Critical Damage Boost",
    multiHitResist: "Multi Hit Resist",
    multiHitChance: "Multi Hit Chance",
    pveDamageTolerance: "PvE Damage Tolerance",
    pveDamageBoost: "PvE Damage Boost",
    pvpDamageBoost: "PvP Damage Boost",
    pvpDamageTolerance: "PvP Damage Tolerance",
    passiveLevelBoost: "Passive Level Boost",
    activeSkillLevelBoost: "Active Skill Level Boost",
  };
  
  return Object.entries(stats)
    .filter(([, value]) => value !== undefined && value !== 0)
    .map(([key, value]) => `${statLabels[key] || key}: +${value}`);
};

// Helper pour obtenir le label de rareté
const getRarityLabel = (rarity: string, isStartNode: boolean = false): string => {
  if (isStartNode) {
    return "Node Start";
  }
  const labels: Record<string, string> = {
    common: "Node Common",
    rare: "Node Rare",
    legend: "Node Legend",
    unique: "Node Unique",
  };
  return labels[rarity.toLowerCase()] || `Node ${rarity}`;
};

// Helper pour obtenir la couleur selon la rareté
const getRarityColor = (rarity: string, isStartNode: boolean = false): string => {
  if (isStartNode) {
    return "text-white";
  }
  const colors: Record<string, string> = {
    common: "text-gray-400",
    rare: "text-green-500",
    legend: "text-blue-500",
    unique: "text-orange-500",
  };
  return colors[rarity.toLowerCase()] || "text-foreground";
};

interface RuneGridProps {
  path: DaevanionPath;
  activeRunes: number[]; // Array de slotIds
  onToggleRune: (slotId: number) => void;
}

// Charger les données de runes depuis les fichiers de données
const getRunesForPath = async (path: DaevanionPath): Promise<(DaevanionRune | null)[]> => {
  // Pour l'instant, on a seulement Nezekan
  if (path === "nezekan") {
    // Dynamic import pour éviter les problèmes de bundle
    const { nezekanRunes } = await import("@/data/daevanion/nezekan");
    return nezekanRunes; // Peut contenir des null pour les slots vides
  }
  
  // Pour les autres chemins, générer des données de test temporaires
  // TODO: Créer les fichiers de données pour les autres chemins
  const runes: (DaevanionRune | null)[] = [];
  for (let i = 0; i < 64; i++) {
    const row = Math.floor(i / 8);
    const col = i % 8;
    const slotId = i + 1;
    runes.push({
      id: slotId,
      slotId,
      path,
      rarity: "common",
      name: `${path} Rune ${slotId}`,
      description: `Rune ${slotId} du chemin ${path}`,
      stats: {
        mp: 50,
        maxHP: 100,
        criticalHit: 10,
        defense: 50,
        criticalHitResist: 5,
        attack: 5,
      },
      position: { x: col, y: row },
    });
  }
  return runes;
};

const getRuneImage = (rune: DaevanionRune, isActive: boolean): string => {
  // Vérifier si c'est le nœud central (Start)
  const isStartNode = rune.slotId === 61 && rune.path === "nezekan"; // Slot 61 = centre (5,5) en 11x11
  
  if (isStartNode) {
    return `/runes/RU_Daevanion_Node_Start.webp`;
  }
  
  if (isActive) {
    // Note: Le fichier Rare a une double extension .webp.webp, on gère ça
    if (rune.rarity === "rare") {
      return `/runes/RU_Daevanion_Node_Rare_Sprite.webp.webp`;
    }
    // Pour Legend, utiliser le fichier Legend
    if (rune.rarity === "legend") {
      return `/runes/RU_Daevanion_Node_Legend_Sprite.webp`;
    }
    const rarityCapitalized = rune.rarity.charAt(0).toUpperCase() + rune.rarity.slice(1);
    return `/runes/RU_Daevanion_Node_${rarityCapitalized}_Sprite.webp`;
  }
  // Images désactivées
  if (rune.rarity === "rare") {
    return `/runes/RU_Daevanion_Node_Rare_Disabled.webp`;
  }
  if (rune.rarity === "legend") {
    return `/runes/RU_Daevanion_Node_Legend_Desactivatedwebp.webp`;
  }
  const rarityCapitalized = rune.rarity.charAt(0).toUpperCase() + rune.rarity.slice(1);
  return `/runes/RU_Daevanion_Node_${rarityCapitalized}_Disabled.webp`;
};

export function RuneGrid({ path, activeRunes, onToggleRune }: RuneGridProps) {
  const [runes, setRunes] = useState<(DaevanionRune | null)[]>([]);
  const [hoveredRune, setHoveredRune] = useState<DaevanionRune | null>(null);
  const { build } = useBuildStore();
  
  useEffect(() => {
    getRunesForPath(path).then(setRunes);
  }, [path]);

  // Helper pour obtenir le nom du skill/passive boosté par une rune
  const getSkillLevelUpInfo = (rune: DaevanionRune): { name: string; type: "ability" | "passive" } | null => {
    if (!build) return null;

    // Récupérer les abilities et passives triés par ID pour l'indexation
    const sortedAbilities = build.class?.abilities
      ? [...build.class.abilities].sort((a, b) => a.id - b.id)
      : [];
    const sortedPassives = build.class?.passives
      ? [...build.class.passives].sort((a, b) => a.id - b.id)
      : [];

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
  };

  const handleMouseEnter = (rune: DaevanionRune) => {
    setHoveredRune(rune);
  };
  
  const handleMouseLeave = () => {
    setHoveredRune(null);
  };

  const canActivate = (rune: DaevanionRune): boolean => {
    if (activeRunes.includes(rune.slotId)) return true; // Déjà activée
    
    // Si pas de prérequis, peut être activée
    if (!rune.prerequisites || rune.prerequisites.length === 0) return true;
    
    // Vérifier qu'au moins UNE rune adjacente (prérequis) est activée
    // Cela permet d'activer les runes adjacentes à celles déjà activées
    return rune.prerequisites.some((prereq) => activeRunes.includes(prereq));
  };

  const handleRuneClick = async (rune: DaevanionRune) => {
    // Le start node (slotId 61) ne peut pas être désactivé
    const isStartNode = rune.slotId === 61 && rune.path === "nezekan";
    if (isStartNode) {
      return; // Ne peut pas cliquer sur le start node
    }
    if (!canActivate(rune) && !activeRunes.includes(rune.slotId)) {
      return; // Ne peut pas activer
    }
    await onToggleRune(rune.slotId);
  };

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
              const isStartNode = rune.slotId === 61 && rune.path === "nezekan";

              // Styles conditionnels
              let opacityClass = "opacity-100";
              let borderClass = "";
              
              if (isStartNode) {
                // Start node toujours visible et avec bordure bleue si actif
                opacityClass = "opacity-100";
                borderClass = isActive ? "border-2 border-blue-500" : "";
              } else if (isActive) {
                // Rune active : bordure bleue
                opacityClass = "opacity-100";
                borderClass = "border-2 border-blue-500";
              } else if (canActivateRune) {
                // Rune activable mais pas active : bordure grise
                opacityClass = "opacity-100";
                borderClass = "border-2 border-gray-400";
              } else {
                // Rune non activable : opacité réduite
                opacityClass = "opacity-40";
                borderClass = "";
              }

              const statsList = formatStats(rune.stats);
              const rarityLabel = getRarityLabel(rune.rarity, isStartNode);
              const rarityColor = getRarityColor(rune.rarity, isStartNode);
              const showTooltip = hoveredRune?.slotId === rune.slotId;
              const skillLevelUp = getSkillLevelUpInfo(rune);
              
              // Déterminer si le tooltip doit s'afficher en dessous (pour les runes du haut)
              // Si la rune est dans les 3 premières lignes, afficher le tooltip en dessous
              const isTopRow = rune.position && rune.position.y < 3;
              const tooltipPositionClass = isTopRow 
                ? "top-full left-1/2 transform -translate-x-1/2 mt-2" 
                : "bottom-full left-1/2 transform -translate-x-1/2 mb-2";

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
                      ${opacityClass}
                      ${canActivateRune || isActive ? "cursor-pointer hover:scale-110" : "cursor-not-allowed"}
                      ${borderClass}
                    `}
                  >
                    <Image
                      src={getRuneImage(rune, isActive)}
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
                      className={`absolute z-100 bg-background border-2 border-primary p-3 rounded-md shadow-lg min-w-[200px] pointer-events-none ${tooltipPositionClass}`}
                    >
                      <div className="border-b-2 border-primary pb-2 mb-2">
                        <div className={`font-bold ${rarityColor}`}>{rarityLabel}</div>
                      </div>
                      
                      {/* Afficher le skill level up pour les nodes rare et legend */}
                      {skillLevelUp && (
                        <div className="mb-2 pb-2 border-b border-primary/30">
                          <div className="text-sm font-semibold text-primary">
                            Skill Level Up - {skillLevelUp.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {skillLevelUp.type === "ability" ? "Ability" : "Passive"} +1 Level
                          </div>
                        </div>
                      )}
                      
                      {statsList.length > 0 ? (
                        <div className="space-y-1">
                          {statsList.map((stat, index) => (
                            <div key={index} className="text-sm text-foreground">
                              {stat}
                            </div>
                          ))}
                        </div>
                      ) : (
                        !skillLevelUp && (
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
