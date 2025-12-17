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
    pveDamageTolerance?: number;
    pveDamageBoost?: number;
    pvpDamageBoost?: number;
    pvpDamageTolerance?: number;
    
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
  
  // Augmentations de niveau
  passiveLevelBoost: number;
  activeSkillLevelBoost: number;
  
  // Liste des skills/passives augmentés
  skillLevelUps: DaevanionSkillLevelUp[];
}
