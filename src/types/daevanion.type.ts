// Types pour le planificateur Daevanion

export type DaevanionPath = "nezekan" | "zikel" | "vaizel" | "triniel" | "ariel" | "azphel";

export type RuneRarity = "common" | "rare" | "legend" | "unique";

export interface DaevanionRune {
  id: number;
  slotId: number; // Position dans la grille (crée le schéma)
  path: DaevanionPath;
  rarity: RuneRarity;
  name: string;
  description?: string;
  // Bonus de statistiques
  stats: {
    // Stats de base (Common - gris)
    attack?: number;
    criticalHit?: number;
    criticalHitResist?: number;
    mp?: number;
    maxHP?: number;
    defense?: number;
    
    // Stats spéciales (Unique - orange)
    cooldownReduction?: number;
    combatSpeed?: number;
    damageBoost?: number;
    damageTolerance?: number;
    criticalDamageTolerance?: number;
    criticalDamageBoost?: number;
    multiHitResist?: number;
    multiHitChance?: number;

    // Stats spéciales Ariel/Asphel (Unique)
    pveDamageTolerance?: number;
    pveDamageBoost?: number;
    pvpDamageBoost?: number;
    pvpDamageTolerance?: number;
    
    // Stats spéciales Ariel (Legend - bleu)
    bossDamageTolerance?: number;
    bossDamageBoost?: number;
    
    // Stats spéciales Ariel (Rare - vert)
    pveAccuracy?: number;
    pveEvasion?: number;
    bossAttack?: number;
    bossDefense?: number;
    pveAttack?: number;
    pveDefense?: number;
    
    // Stats spéciales Azphel (Legend - bleu)
    statusEffectChance?: number;
    statusEffectResist?: number;
    
    // Stats spéciales Azphel (Rare - vert)
    pvpCriticalHit?: number;
    pvpCriticalHitResist?: number;
    pvpAccuracy?: number;
    pvpEvasion?: number;
    pvpAttack?: number;
    pvpDefense?: number;
    
    // Augmentations de niveau (Rare - vert, Legend - bleu)
    passiveLevelBoost?: number; // Rare - boost générique (déprécié, utiliser passiveId)
    activeSkillLevelBoost?: number; // Legend - boost générique (déprécié, utiliser abilityId)
  };
  // IDs pour les boosts spécifiques (Rare et Legend)
  passiveId?: number; // Pour les nodes Rare : ID du passif à augmenter
  abilityId?: number; // Pour les nodes Legend : ID de l'ability à augmenter
  // Position dans la grille (pour le layout)
  position?: {
    x: number;
    y: number;
  };
  // Prérequis (slots qui doivent être activés avant)
  prerequisites?: number[]; // Array de slotIds
}

export interface DaevanionBuild {
  nezekan: number[]; // Array de slotIds activés
  zikel: number[];
  vaizel: number[];
  triniel: number[];
  ariel: number[];
  azphel: number[];
}

export interface DaevanionSkillLevelUp {
  name: string;
  type: "ability" | "passive";
  id: number; // abilityId ou passiveId
}

export interface DaevanionStats {
  // Stats de base
  attack: number;
  criticalHit: number;
  criticalHitResist: number;
  mp: number;
  maxHP: number;
  defense: number;
  
  // Stats spéciales
  cooldownReduction: number;
  combatSpeed: number;
  damageBoost: number;
  damageTolerance: number;
  criticalDamageTolerance: number;
  criticalDamageBoost: number;
  multiHitResist: number;
  multiHitChance: number;
  pveDamageTolerance: number;
  pveDamageBoost: number;
  pvpDamageBoost: number;
  pvpDamageTolerance: number;
  
  // Stats spéciales Ariel (Legend)
  bossDamageTolerance: number;
  bossDamageBoost: number;
  
  // Stats spéciales Ariel (Rare)
  pveAccuracy: number;
  pveEvasion: number;
  bossAttack: number;
  bossDefense: number;
  pveAttack: number;
  pveDefense: number;
  
  // Stats spéciales Azphel (Legend)
  statusEffectChance: number;
  statusEffectResist: number;
  
  // Stats spéciales Azphel (Rare)
  pvpCriticalHit: number;
  pvpCriticalHitResist: number;
  pvpAccuracy: number;
  pvpEvasion: number;
  pvpAttack: number;
  pvpDefense: number;
  
  // Augmentations de niveau
  passiveLevelBoost: number;
  activeSkillLevelBoost: number;
  
  // Liste des skills/passives augmentés
  skillLevelUps: DaevanionSkillLevelUp[];
}

// Types pour les composants
export interface DaevanionTabProps {
  activePath: DaevanionPath;
  onPathChange: (path: DaevanionPath) => void;
}

export interface DaevanionButtonsProps {
  activePath: DaevanionPath;
  onResetPath: () => void;
  onResetAll: () => void;
  onActivateAll: () => void;
  isOwner: boolean;
}

export interface DaevanionPointsProps {
  pointsUsed: number;
  pointsType: string;
  maxPoints: number;
}

export interface StatsSidebarProps {
  stats: DaevanionStats;
}

export interface RuneGridProps {
  path: DaevanionPath;
  activeRunes: number[];
  onToggleRune: (slotId: number) => void;
  isOwner: boolean;
}

export interface DaevanionStore {
  daevanionBuild: DaevanionBuild;
  toggleRune: (path: DaevanionPath, slotId: number) => Promise<void>;
  getTotalStats: (path: DaevanionPath) => Promise<DaevanionStats>;
  getPointsUsed: (path: DaevanionPath) => Promise<number>;
  getPointsType: (path: DaevanionPath) => string;
  getDaevanionBoostForSkill: (skillId: number, type: "ability" | "passive") => Promise<number>;
  resetPath: (path: DaevanionPath) => Promise<void>;
  resetAll: () => Promise<void>;
  activateAllRunes: (path: DaevanionPath) => Promise<void>;
  loadFromBuild: (daevanion: DaevanionBuild | null | undefined) => void;
  findShortestPath: (path: DaevanionPath, targetSlotId: number) => Promise<number[]>;
  activatePath: (path: DaevanionPath, slotIds: number[]) => Promise<void>;
}
