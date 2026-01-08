import { STAT_DISPLAY_ORDER } from "@/constants/daevanion.constant";
import { DaevanionSkillLevelUp, DaevanionStats } from "@/types/daevanion.type";
import type { SkillLevel } from "@/data/classes/types";

// ============================================================================
// DEBUG LOGGING CONFIGURATION
// ============================================================================

/**
 * Debug mode flag - can be toggled at runtime
 * @default process.env.NODE_ENV === 'development'
 */
let debugMode = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';

/**
 * Enable or disable debug logging for stats utilities
 * @param enabled - Whether to enable debug mode
 */
export function setDebugMode(enabled: boolean): void {
  debugMode = enabled;
}

/**
 * Check if debug mode is currently enabled
 * @returns true if debug mode is enabled
 */
export function isDebugMode(): boolean {
  return debugMode;
}

/**
 * Internal debug logger that only logs in development mode
 */
function debugLog(category: string, message: string, ...args: unknown[]): void {
  if (debugMode) {
    console.log(`[statsUtils:${category}] ${message}`, ...args);
  }
}

/**
 * Internal warning logger that always logs regardless of debug mode
 */
function warnLog(category: string, message: string, ...args: unknown[]): void {
  console.warn(`[statsUtils:${category}] ${message}`, ...args);
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Known invalid string values that should be treated as zero or null
 */
const INVALID_STRING_VALUES = [
  'FALSE',
  'Debuff',
  'IgnoreOtherActor',
  'Vacant',
] as const;

/**
 * Prefix values that indicate special target location values
 */
const TARGET_LOCATION_PREFIX = 'TargetLocation_';

/**
 * Result type for validation functions
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Cache key type for stat calculation caching
 */
type StatCacheKey = `${string}:${number}:${'minValue' | 'maxValue'}`;

// ============================================================================
// PERFORMANCE CACHING
// ============================================================================

/**
 * In-memory cache for stat calculations to avoid repeated computations
 * Key format: "levelData_hash:level:valueKey"
 */
const statCalculationCache = new Map<StatCacheKey, number | null>();

/**
 * Maximum number of entries to keep in the cache
 */
const MAX_CACHE_SIZE = 1000;

/**
 * Simple hash function for level data arrays
 */
function hashLevelData(levels: SkillLevel[]): string {
  // Create a simple hash based on level numbers and values
  const parts = levels
    .map((l) => `${l.level}:${l.minValue ?? ''}:${l.maxValue ?? ''}`)
    .join('|');
  // Simple string hash
  let hash = 0;
  for (let i = 0; i < parts.length; i++) {
    const char = parts.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Clear the stat calculation cache
 * Useful for testing or when data changes
 */
export function clearStatCache(): void {
  statCalculationCache.clear();
  debugLog('cache', 'Stat calculation cache cleared');
}

/**
 * Get current cache size (for monitoring)
 */
export function getCacheSize(): number {
  return statCalculationCache.size;
}

// ============================================================================
// VALUE PARSING
// ============================================================================

/**
 * Check if a string value is a known invalid value
 * @param value - The string value to check
 * @returns true if the value is known to be invalid
 */
function isInvalidStringValue(value: string): boolean {
  return INVALID_STRING_VALUES.includes(value as typeof INVALID_STRING_VALUES[number]);
}

/**
 * Check if a string value is a TargetLocation reference
 * @param value - The string value to check
 * @returns true if the value is a TargetLocation reference
 */
function isTargetLocationValue(value: string): boolean {
  return value.startsWith(TARGET_LOCATION_PREFIX);
}

/**
 * Parse a value that may be a string or number into a number
 * Handles special cases like invalid strings and TargetLocation values
 *
 * @param value - The value to parse (string, number, null, or undefined)
 * @param context - Context information for logging
 * @returns The parsed number, or 0 for invalid values, or null for missing values
 */
function parseStatValue(
  value: string | number | null | undefined,
  context: { level: number; valueKey: string }
): number | null {
  // Handle null/undefined - return null to indicate "no value available"
  if (value === null || value === undefined) {
    return null;
  }

  // Handle numeric values directly
  if (typeof value === 'number') {
    return isNaN(value) ? null : value;
  }

  // Handle string values
  if (typeof value === 'string') {
    // Check for known invalid values
    if (isInvalidStringValue(value)) {
      debugLog(
        'parse',
        `Invalid value "${value}" for ${context.valueKey} at level ${context.level}, returning 0`
      );
      return 0;
    }

    // Check for TargetLocation values
    if (isTargetLocationValue(value)) {
      debugLog(
        'parse',
        `TargetLocation value "${value}" for ${context.valueKey} at level ${context.level}, returning 0`
      );
      return 0;
    }

    // Try to parse as number
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      warnLog(
        'parse',
        `Cannot parse value "${value}" for ${context.valueKey} at level ${context.level}, returning 0`
      );
      return 0;
    }

    return numValue;
  }

  // Unknown type
  warnLog('parse', `Unknown value type ${typeof value} for ${context.valueKey} at level ${context.level}`);
  return 0;
}

// ============================================================================
// STAT CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calcule une statistique en utilisant base, modifier et level
 *
 * Base : la valeur de base au niveau 1
 * Modifier : la valeur qu'on ajoute a la base a chaque niveau (fixe)
 * Modifiers : tableau de modifiers par niveau [modifierNiveau2, modifierNiveau3, ...]
 * Level : le niveau de l'élément
 *
 * @param base - Valeur de base (niveau 1)
 * @param modifier - Modifier fixe par niveau
 * @param level - Niveau actuel
 * @param modifiers - Tableau de modifiers (système ancien, optionnel)
 * @returns La valeur calculée
 */
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
    // Le tableau commence a l'index 0 pour le niveau 2
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
 * Calcule une statistique en utilisant les données de niveaux Questlog si disponibles
 *
 * Cette fonction gère maintenant gracieusement les valeurs non-numériques:
 * - Les valeurs comme "FALSE", "Debuff", "IgnoreOtherActor", "Vacant" retournent 0
 * - Les valeurs commençant par "TargetLocation_" retournent 0
 * - Les chaînes qui ne peuvent pas être converties retournent 0
 * - Les valeurs null/undefined retournent null (pas de valeur disponible)
 *
 * @param levels - Données de niveaux depuis Questlog
 * @param level - Niveau actuel du skill
 * @param valueKey - Clé à utiliser ('minValue' ou 'maxValue')
 * @param useCache - Utiliser le cache pour les performances (default: true)
 * @returns La valeur calculée, null si non disponible, 0 pour les valeurs invalides
 */
export function calculateStatFromLevels(
  levels: SkillLevel[] | undefined,
  level: number,
  valueKey: 'minValue' | 'maxValue',
  useCache: boolean = true
): number | null {
  // Validation des entrées
  if (!levels || levels.length === 0) {
    return null;
  }

  // Vérification du cache
  if (useCache) {
    const cacheKey: StatCacheKey = `${hashLevelData(levels)}:${level}:${valueKey}`;
    const cached = statCalculationCache.get(cacheKey);
    if (cached !== undefined) {
      debugLog('cache', `Cache hit for level ${level}, ${valueKey}`);
      return cached;
    }
  }

  // Chercher le niveau exact
  const levelData = levels.find(l => l.level === level);
  if (!levelData) {
    debugLog('calc', `Level ${level} not found in levels data`, { availableLevels: levels.map(l => l.level) });
    return null;
  }

  const value = levelData[valueKey];

  // Utiliser la fonction de parsing robuste
  const result = parseStatValue(value, { level, valueKey });

  // Mettre en cache le résultat
  if (useCache) {
    // Gérer la taille du cache
    if (statCalculationCache.size >= MAX_CACHE_SIZE) {
      // Supprimer la première entrée (FIFO)
      const firstKey = statCalculationCache.keys().next().value;
      if (firstKey) {
        statCalculationCache.delete(firstKey);
      }
    }
    const cacheKey: StatCacheKey = `${hashLevelData(levels)}:${level}:${valueKey}`;
    statCalculationCache.set(cacheKey, result);
  }

  return result;
}

/**
 * Version améliorée de calculateStat qui utilise les données Questlog si disponibles
 *
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
    debugLog('calc', `Using Questlog data for ${valueKey} at level ${level}: ${questlogValue}`);
    return questlogValue;
  }

  // Fallback sur l'ancien système
  const fallbackValue = calculateStat(base, modifier, level, modifiers);
  debugLog('calc', `Using fallback calculation for ${valueKey} at level ${level}: ${fallbackValue}`);
  return fallbackValue;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Valide les données de niveaux pour détecter les problèmes potentiels
 *
 * @param levels - Données de niveaux à valider
 * @returns Un objet de validation avec erreurs et avertissements
 */
export function validateLevelData(levels: SkillLevel[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!levels || levels.length === 0) {
    errors.push('Level data is empty or undefined');
    return { valid: false, errors, warnings };
  }

  // Vérifier les duplicats de niveaux
  const levelMap = new Map<number, SkillLevel[]>();
  levels.forEach((l) => {
    if (!levelMap.has(l.level)) {
      levelMap.set(l.level, []);
    }
    levelMap.get(l.level)!.push(l);
  });

  const duplicates: Array<{ level: number; count: number }> = [];
  levelMap.forEach((entries, levelNum) => {
    if (entries.length > 1) {
      duplicates.push({ level: levelNum, count: entries.length });
    }
  });

  if (duplicates.length > 0) {
    errors.push(
      `Duplicate levels found: ${duplicates.map((d) => `level ${d.level} (${d.count} entries)`).join(', ')}`
    );
  }

  // Vérifier les valeurs invalides
  levels.forEach((l) => {
    const checkValue = (value: string | number | null | undefined, key: string) => {
      if (value === null || value === undefined) {
        return; // Null/undefined est acceptable
      }

      if (typeof value === 'string') {
        if (isInvalidStringValue(value)) {
          warnings.push(`Level ${l.level}: ${key} has known invalid value "${value}"`);
        } else if (isTargetLocationValue(value)) {
          warnings.push(`Level ${l.level}: ${key} has TargetLocation value "${value}"`);
        } else if (isNaN(parseFloat(value))) {
          errors.push(`Level ${l.level}: ${key} cannot be parsed as number: "${value}"`);
        }
      } else if (typeof value === 'number') {
        if (isNaN(value)) {
          errors.push(`Level ${l.level}: ${key} is NaN`);
        }
      }
    };

    checkValue(l.minValue, 'minValue');
    checkValue(l.maxValue, 'maxValue');
  });

  // Vérifier la continuité des niveaux (warning seulement)
  const sortedLevels = [...levels].sort((a, b) => a.level - b.level);
  for (let i = 1; i < sortedLevels.length; i++) {
    const prev = sortedLevels[i - 1];
    const curr = sortedLevels[i];
    if (curr.level - prev.level > 1) {
      warnings.push(
        `Gap in levels: level ${prev.level} to ${curr.level} (missing ${curr.level - prev.level - 1} levels)`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Valide un seul niveau de données
 *
 * @param levelData - Données du niveau à valider
 * @returns true si les données sont valides
 */
export function validateSingleLevel(levelData: SkillLevel): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (typeof levelData.level !== 'number' || levelData.level < 1) {
    errors.push(`Invalid level number: ${levelData.level}`);
  }

  const checkValue = (value: string | number | null | undefined, key: string) => {
    if (value === null || value === undefined) {
      return; // Null/undefined est acceptable
    }

    if (typeof value === 'string') {
      if (isInvalidStringValue(value)) {
        warnings.push(`Known invalid value for ${key}: "${value}"`);
      } else if (isTargetLocationValue(value)) {
        warnings.push(`TargetLocation value for ${key}: "${value}"`);
      } else if (isNaN(parseFloat(value))) {
        errors.push(`Cannot parse ${key} as number: "${value}"`);
      }
    } else if (typeof value === 'number' && isNaN(value)) {
      errors.push(`${key} is NaN`);
    }
  };

  checkValue(levelData.minValue, 'minValue');
  checkValue(levelData.maxValue, 'maxValue');

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// TYPES FOR STATS GROUPING
// ============================================================================

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

// ============================================================================
// STATS GROUPS DEFINITION
// ============================================================================

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

// ============================================================================
// STATS ORGANIZATION FUNCTIONS
// ============================================================================

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

/**
 * Fonction pour organiser les stats en groupes
 *
 * @param stats - Les statistiques Daevanion à organiser
 * @param searchQuery - Optionnel, une requête de recherche pour filtrer les résultats
 * @returns Un objet contenant les groupes organisés avec leurs items
 */
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
