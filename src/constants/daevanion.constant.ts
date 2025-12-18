import { DaevanionPath, DaevanionStats } from "@/types/daevanion.type";

// Chemins Daevanion disponibles
export const DAEVANION_PATHS: { id: DaevanionPath; name: string }[] = [
  { id: "nezekan", name: "Nezekan" },
  { id: "zikel", name: "Zikel" },
  { id: "vaizel", name: "Vaizel" },
  { id: "triniel", name: "Triniel" },
  { id: "ariel", name: "Ariel" },
  { id: "azphel", name: "Azphel" },
];

// Points maximums par type de points
export const MAX_POINTS_BY_TYPE: Record<string, number> = {
  Daevanion_Common_Points: 100, // Partagé entre Nezekan, Zikel, Vaizel, Triniel
  Daevanion_PvE_Points: 100, // Pour Ariel
  Daevanion_Pvp_Points: 100, // Pour Azphel
};

// Ordre d'affichage des stats dans la sidebar
export const STAT_DISPLAY_ORDER: Array<{ key: keyof DaevanionStats; label: string }> = [
  // Stats de base
  { key: "attack", label: "Attack Bonus" },
  { key: "criticalHit", label: "Critical Hit" },
  { key: "criticalHitResist", label: "Critical Hit Resist" },
  { key: "mp", label: "MP" },
  { key: "maxHP", label: "Max HP" },
  { key: "defense", label: "Defense" },
  
  // Stats spéciales (Unique)
  { key: "cooldownReduction", label: "Cooldown Reduction" },
  { key: "combatSpeed", label: "Combat Speed" },
  { key: "damageBoost", label: "Damage Boost" },
  { key: "damageTolerance", label: "Damage Tolerance" },
  { key: "criticalDamageTolerance", label: "Critical Damage Tolerance" },
  { key: "criticalDamageBoost", label: "Critical Damage Boost" },
  { key: "multiHitResist", label: "Multi Hit Resist" },
  { key: "multiHitChance", label: "Multi Hit Chance" },
  { key: "pveDamageTolerance", label: "PvE Damage Tolerance" },
  { key: "pveDamageBoost", label: "PvE Damage Boost" },
  { key: "pvpDamageBoost", label: "PvP Damage Boost" },
  { key: "pvpDamageTolerance", label: "PvP Damage Tolerance" },
  
  // Stats spéciales Ariel (Legend)
  { key: "bossDamageTolerance", label: "Boss Damage Tolerance" },
  { key: "bossDamageBoost", label: "Boss Damage Boost" },
  
  // Stats spéciales Ariel (Rare)
  { key: "pveAccuracy", label: "PvE Accuracy" },
  { key: "pveEvasion", label: "PvE Evasion" },
  { key: "bossAttack", label: "Boss Attack" },
  { key: "bossDefense", label: "Boss Defense" },
  { key: "pveAttack", label: "PvE Attack" },
  { key: "pveDefense", label: "PvE Defense" },
  
  // Stats spéciales Azphel (Legend)
  { key: "statusEffectChance", label: "Status Effect Chance" },
  { key: "statusEffectResist", label: "Status Effect Resist" },
  
  // Stats spéciales Azphel (Rare)
  { key: "pvpCriticalHit", label: "PvP Critical Hit" },
  { key: "pvpCriticalHitResist", label: "PvP Critical Hit Resist" },
  { key: "pvpAccuracy", label: "PvP Accuracy" },
  { key: "pvpEvasion", label: "PvP Evasion" },
  { key: "pvpAttack", label: "PvP Attack" },
  { key: "pvpDefense", label: "PvP Defense" },
  
  // Augmentations de niveau
  { key: "passiveLevelBoost", label: "Passive Level Boost" },
  { key: "activeSkillLevelBoost", label: "Active Skill Level Boost" },
];
