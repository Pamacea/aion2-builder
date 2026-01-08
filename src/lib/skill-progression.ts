/**
 * Skill Progression Modifiers
 *
 * Based on statistical analysis of questlog-skills.json (2699 data points)
 * Analysis covers 8 classes across 30 levels
 */

export type PlaceholderType = 'damage' | 'heal' | 'duration';

export interface ProgressionModifiers {
  damage: number;
  heal: number;
  duration: number;
}

export interface ProgressionStatistics {
  count: number;
  mean: number;
  stdDev: number;
  min: number;
  max: number;
}

/**
 * Default progression modifiers based on statistical analysis
 *
 * Source: src/data/level-ratios-summary.json
 * - Damage: 2,146 samples, mean 1.0923 ± 0.101
 * - Heal: 290 samples, mean 1.0937 ± 0.1001
 * - Duration: 174 samples, mean 1.0054 ± 0.0126
 */
export const DEFAULT_MODIFIERS: ProgressionModifiers = {
  damage: 1.09,    // 9% per level (conservative estimate)
  heal: 1.09,      // 9% per level
  duration: 1.005  // 0.5% per level
};

/**
 * Conservative modifiers (lower bound)
 * Use for minimum estimates
 */
export const CONSERVATIVE_MODIFIERS: ProgressionModifiers = {
  damage: 1.07,    // 7% per level
  heal: 1.07,      // 7% per level
  duration: 1.00   // 0% per level (no scaling)
};

/**
 * Aggressive modifiers (upper bound)
 * Use for maximum estimates
 */
export const AGGRESSIVE_MODIFIERS: ProgressionModifiers = {
  damage: 1.11,    // 11% per level
  heal: 1.11,      // 11% per level
  duration: 1.01   // 1% per level
};

/**
 * Per-class modifiers
 *
 * Some classes have slightly different scaling patterns
 * based on role and skill composition
 */
export const CLASS_MODIFIERS: Record<string, ProgressionModifiers> = {
  // Warriors: slightly higher damage scaling
  gladiator: {
    damage: 1.10,
    heal: 1.09,
    duration: 1.005
  },
  templar: {
    damage: 1.10,
    heal: 1.09,
    duration: 1.005
  },

  // Rogues: standard scaling
  assassin: {
    damage: 1.09,
    heal: 1.09,
    duration: 1.005
  },
  ranger: {
    damage: 1.09,
    heal: 1.09,
    duration: 1.005
  },

  // Mages: standard scaling
  sorcerer: {
    damage: 1.09,
    heal: 1.09,
    duration: 1.005
  },
  spiritmaster: {
    damage: 1.09,
    heal: 1.09,
    duration: 1.005
  },

  // Priests: enhanced heal scaling
  cleric: {
    damage: 1.09,
    heal: 1.10,
    duration: 1.005
  },
  chanter: {
    damage: 1.09,
    heal: 1.10,
    duration: 1.005
  }
};

/**
 * Calculate skill value at a given level
 *
 * Formula: baseValue × modifier^(level - 1)
 *
 * @param baseValue - Value at level 1
 * @param level - Target level (1-30)
 * @param modifier - Progression multiplier per level
 * @returns Value at target level
 *
 * @example
 * calculateSkillValue(100, 10, 1.09) // 217.19
 * calculateSkillValue(100, 20, 1.09) // 514.17
 */
export function calculateSkillValue(
  baseValue: number,
  level: number,
  modifier: number
): number {
  if (level < 1 || level > 30) {
    throw new Error('Level must be between 1 and 30');
  }
  if (level === 1) return baseValue;
  return baseValue * Math.pow(modifier, level - 1);
}

/**
 * Calculate skill value with type safety
 *
 * @param baseValue - Value at level 1
 * @param level - Target level (1-30)
 * @param type - Placeholder type (damage/heal/duration)
 * @param modifiers - Custom modifiers (optional, defaults to DEFAULT_MODIFIERS)
 * @returns Value at target level
 */
export function calculateSkillValueByType(
  baseValue: number,
  level: number,
  type: PlaceholderType,
  modifiers: ProgressionModifiers = DEFAULT_MODIFIERS
): number {
  const modifier = modifiers[type];
  return calculateSkillValue(baseValue, level, modifier);
}

/**
 * Calculate skill value for a specific class
 *
 * @param baseValue - Value at level 1
 * @param level - Target level (1-30)
 * @param type - Placeholder type
 * @param className - Class name (e.g., 'gladiator', 'cleric')
 * @returns Value at target level
 */
export function calculateSkillValueByClass(
  baseValue: number,
  level: number,
  type: PlaceholderType,
  className: string
): number {
  const modifiers = CLASS_MODIFIERS[className] || DEFAULT_MODIFIERS;
  return calculateSkillValueByType(baseValue, level, type, modifiers);
}

/**
 * Pre-calculate values for all levels (1-30)
 *
 * Useful for lookup tables or generating static data
 *
 * @param baseValue - Value at level 1
 * @param modifier - Progression multiplier per level
 * @returns Array of 30 values (index 0 = level 1)
 *
 * @example
 * const damageTable = generateProgressionTable(100, 1.09);
 * // damageTable[9] = value at level 10
 */
export function generateProgressionTable(
  baseValue: number,
  modifier: number
): number[] {
  const table: number[] = [];
  for (let level = 1; level <= 30; level++) {
    table.push(calculateSkillValue(baseValue, level, modifier));
  }
  return table;
}

/**
 * Calculate the level progression ratio between two levels
 *
 * @param fromLevel - Starting level
 * @param toLevel - Target level
 * @param modifier - Progression multiplier per level
 * @returns Ratio between the two levels
 *
 * @example
 * calculateRatio(1, 10, 1.09) // 2.17 (10 levels of growth)
 */
export function calculateRatio(
  fromLevel: number,
  toLevel: number,
  modifier: number
): number {
  const levelsDiff = toLevel - fromLevel;
  return Math.pow(modifier, levelsDiff);
}

/**
 * Validate if a value matches expected progression
 *
 * @param actual - Actual value from game data
 * @param baseValue - Base value at level 1
 * @param level - Target level
 * @param modifier - Progression multiplier
 * @param tolerance - Acceptable deviation (default: 0.15 = 15%)
 * @returns True if value is within tolerance
 *
 * @example
 * validateSkillProgression(217, 100, 10, 1.09) // true
 * validateSkillProgression(300, 100, 10, 1.09) // false (too high)
 */
export function validateSkillProgression(
  actual: number,
  baseValue: number,
  level: number,
  modifier: number,
  tolerance: number = 0.15
): boolean {
  const expected = calculateSkillValue(baseValue, level, modifier);
  const ratio = actual / expected;
  return ratio >= (1 - tolerance) && ratio <= (1 + tolerance);
}

/**
 * Find the best-fitting modifier from actual data
 *
 * @param values - Array of actual values (starting from level 1)
 * @returns Best-fit modifier
 *
 * @example
 * const values = [100, 109, 119, 130]; // levels 1-4
 * const modifier = findBestModifier(values); // ~1.09
 */
export function findBestModifier(values: number[]): number {
  if (values.length < 2) {
    throw new Error('Need at least 2 values to calculate modifier');
  }

  const ratios: number[] = [];
  for (let i = 1; i < values.length; i++) {
    const ratio = values[i] / values[i - 1];
    if (isFinite(ratio) && ratio > 0) {
      ratios.push(ratio);
    }
  }

  if (ratios.length === 0) {
    throw new Error('Could not calculate any valid ratios');
  }

  const sum = ratios.reduce((a, b) => a + b, 0);
  return Math.round((sum / ratios.length) * 1000) / 1000; // Round to 3 decimals
}

/**
 * Calculate statistics for a progression series
 *
 * @param values - Array of ratios
 * @returns Statistical summary
 */
export function calculateProgressionStatistics(
  values: number[]
): ProgressionStatistics {
  if (values.length === 0) {
    throw new Error('Cannot calculate statistics for empty array');
  }

  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return {
    count: values.length,
    mean: Math.round(mean * 10000) / 10000,
    stdDev: Math.round(stdDev * 10000) / 10000,
    min: Math.round(Math.min(...values) * 10000) / 10000,
    max: Math.round(Math.max(...values) * 10000) / 10000
  };
}

/**
 * Format value with appropriate precision
 *
 * @param value - Value to format
 * @param decimals - Number of decimal places
 * @returns Formatted string
 */
export function formatSkillValue(value: number, decimals: number = 0): string {
  return value.toFixed(decimals);
}

/**
 * Get modifier description for UI/display
 *
 * @param modifier - Progression modifier
 * @returns Human-readable description
 */
export function getModifierDescription(modifier: number): string {
  const percentage = Math.round((modifier - 1) * 100);
  return `${percentage}% per level`;
}
