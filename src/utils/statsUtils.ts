import { STAT_DISPLAY_ORDER } from "@/constants/daevanion.constant";
import { DaevanionSkillLevelUp, DaevanionStats } from "@/types/daevanion.type";
import type { SkillLevel } from "@/data/classes/types";

// Base : la valeur de base au niveau 1
// Modifier : la valeur qu'on ajoute à la base à chaque niveau (fixe)
// Modifiers : tableau de modifiers par niveau [modifierNiveau2, modifierNiveau3, ...]
// Level : le niveau de l'élément
export function calculateStat(
  base: number | null | undefined,
  modifier: number | null | undefined,
  level: number,
  modifiers?: number[] | null | undefined
): number {
  const finalBase = base ?? 0;

  if (level <= 1) return finalBase;

  // Si un tableau de modifiers est fourni, utiliser celui-ci
  if (modifiers && modifiers.length > 0) {
    // Le tableau commence à l'index 0 pour le niveau 2
    // Donc pour le niveau N, on utilise l'index (N - 2)
    const modifierIndex = level - 2;
    if (modifierIndex >= 0 && modifierIndex < modifiers.length) {
      // Calculer la somme cumulative des modifiers jusqu'au niveau actuel
      let totalModifier = 0;
      for (let i = 0; i <= modifierIndex; i++) {
        totalModifier += modifiers[i] ?? 0;
      }
      return finalBase + totalModifier;
    }
    // Si le niveau dépasse le tableau, utiliser le dernier modifier pour les niveaux restants
    const lastModifier = modifiers[modifiers.length - 1] ?? 0;
    let totalModifier = modifiers.reduce((sum, mod) => sum + (mod ?? 0), 0);
    totalModifier += lastModifier * (level - 2 - modifiers.length + 1);
    return finalBase + totalModifier;
  }

  // Sinon, utiliser le modifier fixe
  const finalModifier = modifier ?? 0;
  return finalBase + finalModifier * (level - 1);
}

/**
 * Calcule une stat en utilisant les données de niveaux Questlog si disponibles
 * @param levels - Données de niveaux depuis Questlog
 * @param level - Niveau actuel du skill
 * @param valueKey - Clé à utiliser ('minValue' ou 'maxValue')
 * @returns La valeur calculée ou null si non disponible
 */
export function calculateStatFromLevels(
  levels: SkillLevel[] | undefined,
  level: number,
  valueKey: 'minValue' | 'maxValue'
): number | null {
  if (!levels || levels.length === 0) {
    return null;
  }

  // Chercher le niveau exact
  const levelData = levels.find(l => l.level === level);
  if (!levelData) {
    return null;
  }

  const value = levelData[valueKey];

  // Gérer les valeurs spéciales
  if (value === null || value === undefined || value === 'FALSE') {
    return null;
  }

  // Convertir en nombre
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  return isNaN(numValue) ? null : numValue;
}

/**
 * Version améliorée de calculateStat qui utilise les données Questlog si disponibles
 * @param base - Valeur de base (niveau 1)
 * @param modifier - Modifier fixe par niveau
 * @param level - Niveau actuel
 * @param modifiers - Tableau de modifiers (ancien système)
 * @param questlogLevels - Données de niveaux Questlog
 * @param valueKey - Clé à utiliser ('minValue' ou 'maxValue')
 * @returns La valeur calculée
 */
export function calculateStatWithQuestlogData(
  base: number | null | undefined,
  modifier: number | null | undefined,
  level: number,
  modifiers: number[] | null | undefined,
  questlogLevels: SkillLevel[] | undefined,
  valueKey: 'minValue' | 'maxValue'
): number {
  // Essayer d'abord les données Questlog
  const questlogValue = calculateStatFromLevels(questlogLevels, level, valueKey);
  if (questlogValue !== null) {
    return questlogValue;
  }

  // Fallback sur l'ancien système
  return calculateStat(base, modifier, level, modifiers);
}

// Types pour les groupes de stats
export type StatGroupType = 
  | "abilities" 
  | "passives" 
  | "critical" 
  | "general"
  | "other";

export interface StatGroup {
  id: StatGroupType;
  label: string;
  statKeys: Array<keyof DaevanionStats>;
}

// Définition des groupes de stats
export const STAT_GROUPS: StatGroup[] = [
  {
    id: "general",
    label: "General",
    statKeys: [
      "attack",
      "defense",
      "combatSpeed",
      "mp",
      "maxHP",
      "pveAccuracy",
      "pveEvasion",
      "pvpAccuracy",
      "pvpEvasion",
      "damageBoost",
      "damageTolerance",
      "bossAttack",
      "bossDefense",
      "pveAttack",
      "pveDefense",
      "pvpAttack",
      "pvpDefense",
    ],
  },
  {
    id: "abilities",
    label: "Abilities",
    statKeys: [], // Sera rempli avec les skillLevelUps de type "ability"
  },
  {
    id: "passives",
    label: "Passives",
    statKeys: [], // Sera rempli avec les skillLevelUps de type "passive"
  },
  {
    id: "critical",
    label: "Critical",
    statKeys: [
      "criticalHit",
      "criticalHitResist",
      "criticalDamageBoost",
      "criticalDamageTolerance",
      "pvpCriticalHit",
      "pvpCriticalHitResist",
    ],
  },
  {
    id: "other",
    label: "Other",
    statKeys: [], // Toutes les autres stats
  },
];

// Fonction pour obtenir toutes les clés de stats qui ne sont pas dans les autres groupes
function getOtherStatKeys(): Array<keyof DaevanionStats> {
  const groupedKeys = new Set<keyof DaevanionStats>();
  
  STAT_GROUPS.forEach((group) => {
    if (group.id !== "other" && group.id !== "abilities" && group.id !== "passives" && group.id !== "general") {
      group.statKeys.forEach((key) => groupedKeys.add(key));
    }
  });

  return STAT_DISPLAY_ORDER.filter(
    (stat) => !groupedKeys.has(stat.key) && stat.key !== "skillLevelUps"
  ).map((stat) => stat.key);
}

// Fonction pour organiser les stats en groupes
export function organizeStatsIntoGroups(
  stats: DaevanionStats,
  searchQuery?: string
): {
  groups: Array<{
    group: StatGroup;
    items: Array<{
      type: "skill" | "stat";
      skill?: DaevanionSkillLevelUp;
      stat?: { key: keyof DaevanionStats; label: string; value: number };
    }>;
  }>;
} {
  const normalizedQuery = searchQuery
    ? searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    : "";

  const normalizeText = (text: string) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Filtrer les skillLevelUps
  const abilities = stats.skillLevelUps.filter(
    (skill) =>
      skill.type === "ability" &&
      (!normalizedQuery ||
        normalizeText(skill.name).includes(normalizedQuery) ||
        normalizeText("ability").includes(normalizedQuery))
  );

  const passives = stats.skillLevelUps.filter(
    (skill) =>
      skill.type === "passive" &&
      (!normalizedQuery ||
        normalizeText(skill.name).includes(normalizedQuery) ||
        normalizeText("passive").includes(normalizedQuery))
  );

  // Fonction pour vérifier si une stat correspond à la recherche
  const matchesSearch = (label: string) =>
    !normalizedQuery || normalizeText(label).includes(normalizedQuery);

  // Fonction pour obtenir les stats d'un groupe
  const getGroupStats = (group: StatGroup): Array<{
    key: keyof DaevanionStats;
    label: string;
    value: number;
  }> => {
    if (group.id === "other") {
      const otherKeys = getOtherStatKeys();
      return otherKeys
        .map((key) => {
          const statDef = STAT_DISPLAY_ORDER.find((s) => s.key === key);
          if (!statDef) return null;
          const value = stats[key];
          if (typeof value !== "number" || value === 0) return null;
          if (!matchesSearch(statDef.label)) return null;
          return { key, label: statDef.label, value };
        })
        .filter((item): item is { key: keyof DaevanionStats; label: string; value: number } => item !== null);
    }

    return group.statKeys
      .map((key) => {
        const statDef = STAT_DISPLAY_ORDER.find((s) => s.key === key);
        if (!statDef) return null;
        const value = stats[key];
        if (typeof value !== "number" || value === 0) return null;
        if (!matchesSearch(statDef.label)) return null;
        return { key, label: statDef.label, value };
      })
      .filter((item): item is { key: keyof DaevanionStats; label: string; value: number } => item !== null);
  };

  const groups = STAT_GROUPS.map((group) => {
    const items: Array<{
      type: "skill" | "stat";
      skill?: DaevanionSkillLevelUp;
      stat?: { key: keyof DaevanionStats; label: string; value: number };
    }> = [];

    if (group.id === "abilities") {
      abilities.forEach((skill) => {
        items.push({ type: "skill", skill });
      });
    } else if (group.id === "passives") {
      passives.forEach((skill) => {
        items.push({ type: "skill", skill });
      });
    } else {
      const groupStats = getGroupStats(group);
      groupStats.forEach((stat) => {
        items.push({ type: "stat", stat });
      });
    }

    return { group, items };
  }).filter((groupData) => groupData.items.length > 0); // Ne garder que les groupes avec des items

  return { groups };
}
