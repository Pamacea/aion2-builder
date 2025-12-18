import { DaevanionPath, DaevanionRune } from "@/types/daevanion.type";

// ======================================
// FONCTIONS DE CRÉATION DE RUNES
// ======================================

/**
 * Fonction pour déterminer les prérequis d'une rune
 * Les runes adjacentes au start peuvent être activées directement
 * Les autres runes nécessitent qu'au moins une rune adjacente soit activée
 */
export const getPrerequisites = (
  row: number,
  col: number,
  gridSize: number = 11,
  startRow: number = 5,
  startCol: number = 5
): number[] | undefined => {
  // Le nœud central (start) n'a pas de prérequis - c'est le point de départ
  if (row === startRow && col === startCol) return undefined;
  
  // Les runes directement adjacentes au start (haut, bas, gauche, droite) n'ont pas de prérequis
  // Elles peuvent être activées directement depuis le start
  if (
    (row === startRow - 1 && col === startCol) || // Haut du start
    (row === startRow + 1 && col === startCol) || // Bas du start
    (row === startRow && col === startCol - 1) || // Gauche du start
    (row === startRow && col === startCol + 1)    // Droite du start
  ) {
    return undefined; // Pas de prérequis, peut être activée directement
  }
  
  // Pour les autres runes, elles nécessitent qu'au moins une rune adjacente soit activée
  const prereqs: number[] = [];
  
  // Les runes adjacentes (haut, bas, gauche, droite) sont des prérequis possibles
  if (row > 0) prereqs.push((row - 1) * gridSize + col + 1); // Haut
  if (row < gridSize - 1) prereqs.push((row + 1) * gridSize + col + 1); // Bas
  if (col > 0) prereqs.push(row * gridSize + (col - 1) + 1); // Gauche
  if (col < gridSize - 1) prereqs.push(row * gridSize + (col + 1) + 1); // Droite
  
  // Si c'est une rune au bord, elle peut avoir moins de prérequis
  return prereqs.length > 0 ? prereqs : undefined;
};

/**
 * Fonction helper pour créer une rune
 */
export const createRune = (
  row: number,
  col: number,
  path: DaevanionPath,
  rarity: "common" | "rare" | "legend" | "unique" | "start",
  statsOrId?: DaevanionRune["stats"] | number,
  abilityId?: number,
  gridSize: number = 11
): DaevanionRune => {
  const slotId = row * gridSize + col + 1;
  
  // Déterminer si c'est une rare (passiveId) ou legend (abilityId)
  let stats: DaevanionRune["stats"] = {};
  let passiveId: number | undefined;
  let finalAbilityId: number | undefined;
  
  if (rarity === "rare" && typeof statsOrId === "number") {
    // Pour les nodes rare, statsOrId est le passiveId
    passiveId = statsOrId;
  } else if (rarity === "legend" && typeof statsOrId === "number") {
    // Pour les nodes legend, statsOrId est l'abilityId
    finalAbilityId = statsOrId;
  } else if (statsOrId && typeof statsOrId === "object") {
    // Pour les nodes common/unique, statsOrId est l'objet stats
    stats = statsOrId;
  } else if (rarity === "legend" && abilityId !== undefined) {
    // Format alternatif : statsOrId peut être undefined et abilityId est passé séparément
    finalAbilityId = abilityId;
  }
  
  // Déterminer la position du start node selon le path
  const startRow = path === "nezekan" ? 5 : path === "zikel" ? 5 : path === "vaizel" ? 5 : path === "triniel" ? 6 : 0;
  const startCol = path === "nezekan" ? 5 : path === "zikel" ? 5 : path === "vaizel" ? 5 : path === "triniel" ? 6 : 0;
  
  return {
    id: slotId,
    slotId,
    path,
    rarity: rarity === "start" ? "common" : rarity, // Start est traité comme common pour le type
    name: `${path.charAt(0).toUpperCase() + path.slice(1)} Rune ${slotId}`,
    description: `Rune ${slotId} du chemin ${path} (${rarity})`,
    stats,
    passiveId,
    abilityId: finalAbilityId,
    position: { x: col, y: row },
    prerequisites: getPrerequisites(row, col, gridSize, startRow, startCol),
  };
};

// ======================================
// FONCTIONS DE CHARGEMENT DES RUNES
// ======================================

/**
 * Charge toutes les runes d'un chemin Daevanion
 */
export const getRunesForPath = async (path: DaevanionPath): Promise<(DaevanionRune | null)[]> => {
  if (path === "nezekan") {
    const { nezekanRunes } = await import("@/data/daevanion/nezekan");
    return nezekanRunes;
  }
  if (path === "zikel") {
    const { zikelRunes } = await import("@/data/daevanion/zikel");
    return zikelRunes;
  }
  if (path === "vaizel") {
    const { vaizelRunes } = await import("@/data/daevanion/vaizel");
    return vaizelRunes;
  }
  if (path === "triniel") {
    const { trinielRunes } = await import("@/data/daevanion/triniel");
    return trinielRunes;
  }
  // Pour les autres chemins, retourner un tableau vide pour l'instant
  return [];
};

/**
 * Charge les données d'une rune spécifique
 */
export const getRuneData = async (path: DaevanionPath, slotId: number): Promise<DaevanionRune | null> => {
  const allRunes = await getRunesForPath(path);
  // Trouver la rune avec le slotId correspondant (ignorer les null)
  const rune = allRunes.find((r) => r !== null && r.slotId === slotId);
  return rune || null;
};

// ======================================
// FONCTIONS DE CALCUL DES COÛTS
// ======================================

/**
 * Obtenir le coût d'une rune selon sa rareté
 */
export const getRuneCost = (rarity: string): number => {
  switch (rarity.toLowerCase()) {
    case "common":
      return 1;
    case "rare":
      return 2;
    case "legend":
      return 3;
    case "unique":
      return 4;
    default:
      return 0;
  }
};

/**
 * Obtenir le type de points selon le chemin
 */
export const getPointsType = (path: DaevanionPath): string => {
  switch (path) {
    case "nezekan":
    case "zikel":
    case "vaizel":
    case "triniel":
      return "Daevanion_Common_Points";
    case "ariel":
      return "Daevanion_PvE_Points";
    case "azphel":
      return "Daevanion_Pvp_Points";
    default:
      return "Daevanion_Common_Points";
  }
};

/**
 * Obtenir le label du type de points
 */
export const getPointsTypeLabel = (pointsType: string): string => {
  if (pointsType === "Daevanion_Common_Points") return "Common Points";
  if (pointsType === "Daevanion_PvE_Points") return "PvE Points";
  if (pointsType === "Daevanion_Pvp_Points") return "PvP Points";
  return pointsType;
};

// ======================================
// FONCTIONS D'AFFICHAGE DES RUNES
// ======================================

/**
 * Formate les stats d'une rune pour l'affichage
 */
export const formatStats = (stats: DaevanionRune["stats"]): string[] => {
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

/**
 * Obtenir le label de rareté d'une rune
 */
export const getRarityLabel = (rarity: string, isStartNode: boolean = false): string => {
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

/**
 * Obtenir la couleur selon la rareté d'une rune
 */
export const getRarityColor = (rarity: string, isStartNode: boolean = false): string => {
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

/**
 * Obtenir le chemin de l'image d'une rune selon son état
 */
export const getRuneImage = (rune: DaevanionRune, isActive: boolean): string => {
  // Vérifier si c'est le nœud central (Start) pour tous les paths
  const startNodeSlotIds: Record<string, number> = {
    nezekan: 61, // row 5, col 5 - grille 11x11
    zikel: 61,   // row 5, col 5 - grille 11x11
    vaizel: 61,  // row 5, col 5 - grille 11x11
    triniel: 85, // row 6, col 6 - grille 13x13
  };
  const isStartNode = rune.slotId === startNodeSlotIds[rune.path];
  
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

// ======================================
// FONCTIONS D'INVALIDATION
// ======================================

/**
 * Invalide les queries TanStack Query pour un chemin Daevanion
 */
export const invalidateDaevanionQueries = (path: DaevanionPath): void => {
  try {
    // On invalide via un événement personnalisé que les composants écouteront
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("daevanion-invalidate", { detail: { path } }));
    }
  } catch {
    // Ignorer les erreurs si le QueryClient n'est pas disponible
  }
};

// ======================================
// FONCTION DE MISE À JOUR DES NIVEAUX DE SKILLS
// ======================================

/**
 * Met à jour les niveaux de skills/passifs basés sur les runes activées
 * Cette fonction recalcule tous les boosts et ajuste les niveaux en conséquence
 */
export const updateSkillLevelsFromRunes = async (
  path: DaevanionPath,
  activeRunes: number[],
  previousActiveRunes: number[] = [],
  getBuildStore: () => {
    build: {
      class?: {
        abilities?: Array<{ id: number; maxLevel?: number }>;
        passives?: Array<{ id: number; maxLevel?: number }>;
      };
      abilities?: Array<{ abilityId: number; level: number; maxLevel: number }>;
      passives?: Array<{ passiveId: number; level: number; maxLevel: number }>;
    } | null;
    updateAbilityLevel: (abilityId: number, level: number) => void;
    addAbility: (abilityId: number, level: number) => void;
    updatePassiveLevel: (passiveId: number, level: number) => void;
    addPassive: (passiveId: number, level: number) => void;
  }
): Promise<void> => {
  const buildStore = getBuildStore();
  const build = buildStore.build;
  if (!build) return;

  // Récupérer toutes les runes du chemin
  const allRunes = await getRunesForPath(path);
  
  // Les abilities et passives de la classe ne changent pas, on peut les récupérer une fois
  const sortedAbilities = build.class?.abilities
    ? [...build.class.abilities].sort((a, b) => a.id - b.id)
    : [];
  const sortedPassives = build.class?.passives
    ? [...build.class.passives].sort((a, b) => a.id - b.id)
    : [];

  // Compter les boosts actuels
  const currentAbilityBoosts = new Map<number, number>();
  const currentPassiveBoosts = new Map<number, number>();

  activeRunes.forEach((slotId) => {
    const rune = allRunes.find((r) => r?.slotId === slotId);
    if (!rune) return;

    // Ignorer le start node
    if (rune.slotId === 61 && rune.path === "nezekan") return;

    // Traiter les nodes rare (passiveId)
    if (rune.rarity === "rare" && rune.passiveId) {
      const passiveIndex = rune.passiveId - 1;
      if (passiveIndex >= 0 && passiveIndex < sortedPassives.length) {
        const passive = sortedPassives[passiveIndex];
        currentPassiveBoosts.set(passive.id, (currentPassiveBoosts.get(passive.id) || 0) + 1);
      }
    }

    // Traiter les nodes legend (abilityId)
    if (rune.rarity === "legend" && rune.abilityId) {
      const abilityIndex = rune.abilityId - 1;
      if (abilityIndex >= 0 && abilityIndex < sortedAbilities.length) {
        const ability = sortedAbilities[abilityIndex];
        currentAbilityBoosts.set(ability.id, (currentAbilityBoosts.get(ability.id) || 0) + 1);
      }
    }
  });

  // Compter les boosts précédents
  const previousAbilityBoosts = new Map<number, number>();
  const previousPassiveBoosts = new Map<number, number>();

  previousActiveRunes.forEach((slotId) => {
    const rune = allRunes.find((r) => r?.slotId === slotId);
    if (!rune) return;

    // Ignorer le start node
    if (rune.slotId === 61 && rune.path === "nezekan") return;

    // Traiter les nodes rare (passiveId)
    if (rune.rarity === "rare" && rune.passiveId) {
      const passiveIndex = rune.passiveId - 1;
      if (passiveIndex >= 0 && passiveIndex < sortedPassives.length) {
        const passive = sortedPassives[passiveIndex];
        previousPassiveBoosts.set(passive.id, (previousPassiveBoosts.get(passive.id) || 0) + 1);
      }
    }

    // Traiter les nodes legend (abilityId)
    if (rune.rarity === "legend" && rune.abilityId) {
      const abilityIndex = rune.abilityId - 1;
      if (abilityIndex >= 0 && abilityIndex < sortedAbilities.length) {
        const ability = sortedAbilities[abilityIndex];
        previousAbilityBoosts.set(ability.id, (previousAbilityBoosts.get(ability.id) || 0) + 1);
      }
    }
  });

  // Pour chaque ability, calculer le niveau de base (sans les boosts Daevanion) et ajouter les boosts actuels
  const allAbilityIds = new Set([...currentAbilityBoosts.keys(), ...previousAbilityBoosts.keys()]);
  for (const abilityId of allAbilityIds) {
    const currentBoost = currentAbilityBoosts.get(abilityId) || 0;
    const previousBoost = previousAbilityBoosts.get(abilityId) || 0;
    const boostDiff = currentBoost - previousBoost;

    if (boostDiff === 0) continue; // Pas de changement

    // Récupérer le build à jour
    const currentBuild = buildStore.build;
    if (!currentBuild) continue;

    const buildAbility = currentBuild.abilities?.find((a) => a.abilityId === abilityId);
    
    if (buildAbility) {
      // Calculer le niveau de base en soustrayant les boosts précédents
      const baseLevel = buildAbility.level - previousBoost;
      // Le nouveau niveau = niveau de base + boosts actuels
      const newLevel = Math.max(0, Math.min(baseLevel + currentBoost, buildAbility.maxLevel));
      
      if (newLevel !== buildAbility.level) {
        buildStore.updateAbilityLevel(abilityId, newLevel);
      }
    } else if (currentBoost > 0) {
      // L'ability n'existe pas mais on a un boost positif, l'ajouter
      const classAbility = sortedAbilities.find((a) => a.id === abilityId);
      if (classAbility) {
        buildStore.addAbility(abilityId, Math.min(currentBoost, classAbility.maxLevel || 20));
      }
    }
  }

  // Pour chaque passive, calculer le niveau de base (sans les boosts Daevanion) et ajouter les boosts actuels
  const allPassiveIds = new Set([...currentPassiveBoosts.keys(), ...previousPassiveBoosts.keys()]);
  for (const passiveId of allPassiveIds) {
    const currentBoost = currentPassiveBoosts.get(passiveId) || 0;
    const previousBoost = previousPassiveBoosts.get(passiveId) || 0;
    const boostDiff = currentBoost - previousBoost;

    if (boostDiff === 0) continue; // Pas de changement

    // Récupérer le build à jour
    const currentBuild = buildStore.build;
    if (!currentBuild) continue;

    const buildPassive = currentBuild.passives?.find((p) => p.passiveId === passiveId);
    
    if (buildPassive) {
      // Calculer le niveau de base en soustrayant les boosts précédents
      const baseLevel = buildPassive.level - previousBoost;
      // Le nouveau niveau = niveau de base + boosts actuels
      const newLevel = Math.max(0, Math.min(baseLevel + currentBoost, buildPassive.maxLevel));
      
      if (newLevel !== buildPassive.level) {
        buildStore.updatePassiveLevel(passiveId, newLevel);
      }
    } else if (currentBoost > 0) {
      // Le passive n'existe pas mais on a un boost positif, l'ajouter
      const classPassive = sortedPassives.find((p) => p.id === passiveId);
      if (classPassive) {
        buildStore.addPassive(passiveId, Math.min(currentBoost, classPassive.maxLevel || 10));
      }
    }
  }
};
