import type { AbilityType, PassiveType, StigmaType } from "@/types/schema";

type SkillWithDataLevels = AbilityType | PassiveType | StigmaType;

// ==================== PRECOMPILED REGEX PATTERNS ====================
// Precompiled for performance - created once, reused many times

const DAMAGE_MIN_REGEX = /\{se_dmg:[^}]+:SkillUIMinDmg[^\}]*\}/gi;
const DAMAGE_MAX_REGEX = /\{se_dmg:[^}]+:SkillUIMaxDmg[^\}]*\}/gi;
const HEAL_MIN_REGEX = /\{se_dmg:[^}]+:SkillUIHPHealMin\}/gi;
const HEAL_MAX_REGEX = /\{se_dmg:[^}]+:SkillUIHPHealMax\}/gi;
const DURATION_REGEX = /\{se:[^}]+:effect_value02:time\}/gi;
const GENERIC_PLACEHOLDER_REGEX = /\{([a-z_]+):[^}]+\}/gi;
const HTML_SPAN_OPEN_REGEX = /<span[^>]*>/g;
const HTML_SPAN_CLOSE_REGEX = /<\/span>/g;
const HTML_QUOTE_REGEX = /&quot;/g;

// ==================== LRU CACHE ====================
// Cache parsed descriptions to avoid redundant parsing
// Cache key format: "description_skillId_level"
const MAX_CACHE_SIZE = 500;

interface CacheEntry {
  value: string;
  timestamp: number;
}

const descriptionCache = new Map<string, CacheEntry>();

/**
 * Evict oldest entries from cache when size limit is reached
 */
function evictOldestEntries(): void {
  if (descriptionCache.size <= MAX_CACHE_SIZE) {
    return;
  }

  // Sort entries by timestamp and remove oldest 20% of entries
  const entries = Array.from(descriptionCache.entries())
    .sort((a, b) => a[1].timestamp - b[1].timestamp);

  const toRemove = Math.floor(MAX_CACHE_SIZE * 0.2);
  for (let i = 0; i < toRemove; i++) {
    descriptionCache.delete(entries[i][0]);
  }
}

/**
 * Clear the cache (useful for testing or memory management)
 */
export function clearQuestlogCache(): void {
  descriptionCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; maxSize: number } {
  return {
    size: descriptionCache.size,
    maxSize: MAX_CACHE_SIZE
  };
}

// ==================== OPTIMIZED PLACEHOLDER VALUE EXTRACTION ====================

/**
 * Cached descriptionData.access to avoid repeated lookups
 */
const descriptionDataCache = new WeakMap<
  SkillWithDataLevels,
  Map<string, string[]>
>();

/**
 * Extract and cache placeholder values from skill's descriptionData
 */
function getPlaceholderCache(skill: SkillWithDataLevels): Map<string, string[]> {
  if (descriptionDataCache.has(skill)) {
    return descriptionDataCache.get(skill)!;
  }

  type SkillWithKeys = AbilityType | PassiveType | StigmaType;
  const skillRecord = skill as SkillWithKeys & Record<string, unknown>;

  const descriptionData = skillRecord.descriptionData as {
    placeholders?: Record<string, {
      base?: { values?: string[] };
      levels?: Record<string, { values?: string[] }>;
    }>;
  } | undefined;

  const cache = new Map<string, string[]>();

  if (descriptionData?.placeholders) {
    Object.entries(descriptionData.placeholders).forEach(([key, placeholder]) => {
      // Flatten all values into a single array for quick lookup
      const allValues: string[] = [];

      if (placeholder.base?.values) {
        allValues.push(...placeholder.base.values);
      }

      if (placeholder.levels) {
        Object.values(placeholder.levels).forEach(levelData => {
          if (levelData?.values) {
            allValues.push(...levelData.values);
          }
        });
      }

      if (allValues.length > 0) {
        cache.set(key, allValues);
      }
    });
  }

  descriptionDataCache.set(skill, cache);
  return cache;
}

/**
 * Get placeholder value for a specific level
 * Optimized with caching and pre-computed lookups
 */
function getQuestlogPlaceholderValue(
  placeholderKey: string,
  skill: SkillWithDataLevels,
  level: number
): string | null {
  const cache = getPlaceholderCache(skill);
  const allValues = cache.get(placeholderKey);

  if (!allValues || allValues.length === 0) {
    return null;
  }

  // For level 1, return the first value (base)
  // For higher levels, calculate the index
  // Note: This assumes values are ordered: base, then levels
  if (level === 1) {
    return allValues[0];
  }

  // Try to get value for specific level
  // The exact index depends on the data structure
  // For now, we'll return the first available value if no level-specific data
  const levelIndex = level; // Simplified - may need adjustment based on actual data
  return allValues[levelIndex] || allValues[0];
}

// ==================== MAIN PARSER FUNCTION ====================

/**
 * Parse les descriptions Questlog et convertit TOUS les placeholders au format standard
 *
 * @param description - Description brute avec placeholders Questlog
 * @param skill - Skill avec descriptionData
 * @param level - Niveau actuel (1-30)
 * @returns Description avec placeholders {{FORMAT}} standards
 *
 * @example
 * ```typescript
 * const result = parseQuestlogDescription(
 *   "Deals {se_dmg:XXX:SkillUIMinDmgsum} damage",
 *   skill,
 *   5
 * );
 * // -> "Deals {{DMG_MIN}} damage"
 * ```
 *
 * Performance optimizations:
 * - LRU cache for parsed descriptions (500 entries max)
 * - Precompiled regex patterns (created once, reused)
 * - WeakMap for skill data caching (auto-garbage collected)
 * - Optimized placeholder value extraction
 */
export function parseQuestlogDescription(
  description: string,
  skill: SkillWithDataLevels,
  level: number
): string {
  // Check cache first
  const cacheKey = `${description}_${skill.id}_${level}`;
  const cached = descriptionCache.get(cacheKey);

  if (cached) {
    cached.timestamp = Date.now(); // Update access time for LRU
    return cached.value;
  }

  let cleaned = description;

  // Nettoyer le HTML si présent (using precompiled regex)
  cleaned = cleaned.replace(HTML_SPAN_OPEN_REGEX, '');
  cleaned = cleaned.replace(HTML_SPAN_CLOSE_REGEX, '');
  cleaned = cleaned.replace(HTML_QUOTE_REGEX, '"');

  // ==================== DÉGÂTS ====================
  // {se_dmg:XXXX:SkillUIMinDmgsum} ou {se_dmg:XXXX:SkillUIMinDmgSum} -> {{DMG_MIN}}
  cleaned = cleaned.replace(DAMAGE_MIN_REGEX, '{{DMG_MIN}}');
  cleaned = cleaned.replace(DAMAGE_MAX_REGEX, '{{DMG_MAX}}');

  // ==================== HEALS ====================
  // {se_dmg:XXXX:SkillUIHPHealMin} -> {{HEAL_MIN}}
  cleaned = cleaned.replace(HEAL_MIN_REGEX, '{{HEAL_MIN}}');
  cleaned = cleaned.replace(HEAL_MAX_REGEX, '{{HEAL_MAX}}');

  // ==================== DURÉES ====================
  // {se:XXXX:effect_value02:time} -> {{DURATION}}
  cleaned = cleaned.replace(DURATION_REGEX, '{{DURATION}}');

  // ==================== TOUS LES AUTRES PLACEHOLDERS ====================
  // Pour les placeholders inconnus, on extrait directement la valeur depuis descriptionData
  // Pattern: {se:XXXX:effect_value02} ou {se_abe:XXXX:XXXX:value02} ou {abe:XXXX:value02} etc.
  cleaned = cleaned.replace(GENERIC_PLACEHOLDER_REGEX, (match) => {
    // Try to get value from Questlog data
    const value = getQuestlogPlaceholderValue(match, skill, level);

    if (value !== null) {
      // Retourner la valeur directement (elle sera affichée en texte normal)
      return value;
    }

    // Si pas de valeur trouvée, garder le placeholder tel quel (pour le débogage)
    return match;
  });

  const result = cleaned.trim();

  // Cache the result
  descriptionCache.set(cacheKey, {
    value: result,
    timestamp: Date.now()
  });

  // Evict old entries if cache is too large
  evictOldestEntries();

  return result;
}
