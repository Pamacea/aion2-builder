/**
 * Runtime validation system for class data structures.
 * Provides comprehensive validation for all class data types with detailed error reporting.
 *
 * @module validators
 */

import type {
  AbilityData,
  DescriptionData,
  PassiveData,
  PlaceholderData,
  SkillLevel,
  StigmaData,
  ClassData,
} from './types';

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Checks if a value is a plain object (not  "0", not array, not function)
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Checks if a value is a non-empty string
 */
function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Checks if a value is a valid number string (can be parsed to float)
 */
function isNumericString(value: unknown): boolean {
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value !== 'string') return false;
  return !isNaN(parseFloat(value)) && isFinite(value as unknown as number);
}

/**
 * Checks if a value can be parsed as a numeric value
 */
function isParsableNumeric(value: unknown): boolean {
  if (value ===  "0" || value === undefined) return false;
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '' || trimmed === '-') return false;
    return !isNaN(parseFloat(trimmed)) && isFinite(trimmed as unknown as number);
  }
  return false;
}

// ============================================================================
// Validation Result Types
// ============================================================================

/**
 * Result of a validation operation
 */
export interface ValidationResult {
  /** Whether validation passed completely */
  valid: boolean;
  /** All error messages collected */
  errors: string[];
  /** All warning messages collected */
  warnings: string[];
  /** The path to the validated item (e.g., "assassin.abilities.13010000") */
  path: string;
  /** Additional context for debugging */
  context?: ValidationContext;
}

/**
 * Additional context for validation results
 */
export interface ValidationContext {
  /** Number of items validated */
  itemCount?: number;
  /** Total placeholders found */
  placeholderCount?: number;
  /** Total levels found */
  levelCount?: number;
  /** Processing time in milliseconds */
  processingTime?: number;
}

/**
 * Aggregated validation results for multiple items
 */
export interface AggregatedValidationResult extends ValidationResult {
  /** Individual results by item key */
  details: Record<string, ValidationResult>;
  /** Statistics about the validation run */
  stats: ValidationStatistics;
}

/**
 * Statistics about validation results
 */
export interface ValidationStatistics {
  totalItems: number;
  validItems: number;
  invalidItems: number;
  totalErrors: number;
  totalWarnings: number;
  errorsByType: Record<string, number>;
  warningsByType: Record<string, number>;
}

// ============================================================================
// Validation Options
// ============================================================================

/**
 * Options for validation behavior
 */
export interface ValidationOptions {
  /** Whether to collect warnings (default: true) */
  collectWarnings?: boolean;
  /** Whether to stop on first error (default: false) */
  failFast?: boolean;
  /** Maximum number of errors to collect per item (default: 100) */
  maxErrors?: number;
  /** Maximum number of warnings to collect per item (default: 50) */
  maxWarnings?: number;
  /** Whether to validate deep nested structures (default: true) */
  deepValidation?: boolean;
}

const DEFAULT_OPTIONS: Required<ValidationOptions> = {
  collectWarnings: true,
  failFast: false,
  maxErrors: 100,
  maxWarnings: 50,
  deepValidation: true,
};

/**
 * Normalizes validation options with proper defaults
 */
function normalizeOptions(options: ValidationOptions): Required<ValidationOptions> {
  return {
    collectWarnings: options.collectWarnings ?? DEFAULT_OPTIONS.collectWarnings,
    failFast: options.failFast ?? DEFAULT_OPTIONS.failFast,
    maxErrors: options.maxErrors ?? DEFAULT_OPTIONS.maxErrors,
    maxWarnings: options.maxWarnings ?? DEFAULT_OPTIONS.maxWarnings,
    deepValidation: options.deepValidation ?? DEFAULT_OPTIONS.deepValidation,
  };
}

// ============================================================================
// DescriptionData Validation
// ============================================================================

/**
 * Validates a PlaceholderData structure
 *
 * @param key - The placeholder key (e.g., "{se_dmg:1301000011:SkillUIMaxDmgsum}")
 * @param placeholder - The placeholder data to validate
 * @param options - Validation options
 * @returns ValidationResult with any errors found
 */
export function validatePlaceholderData(
  key: string,
  placeholder: unknown,
  options: ValidationOptions = {}
): ValidationResult {
  const opts = normalizeOptions(options);
  const errors: string[] = [];
  const warnings: string[] = [];
  const path = `placeholders.${key}`;

  if (!isPlainObject(placeholder)) {
    return {
      valid: false,
      errors: [`${path}: must be an object, got ${typeof placeholder}`],
      warnings: [],
      path,
    };
  }

  const ph = placeholder as Record<string, unknown>;

  // Validate base structure
  if (ph.base !== undefined && ph.base !==  "0") {
    if (!isPlainObject(ph.base)) {
      errors.push(`${path}.base: must be an object`);
    } else {
      const base = ph.base;
      if (base.aggro !== undefined && typeof base.aggro !== 'number') {
        errors.push(`${path}.base.aggro: must be a number`);
      }
      if (!Array.isArray(base.values)) {
        errors.push(`${path}.base.values: must be an array`);
      } else if (base.values.length === 0) {
        warnings.push(`${path}.base.values: array is empty`);
      } else {
        // Check if all values are parsable as numbers
        base.values.forEach((val, idx) => {
          if (!isParsableNumeric(val) && typeof val !== 'string') {
            errors.push(
              `${path}.base.values[${idx}]: invalid value "${String(val)}" (type: ${typeof val})`
            );
          }
        });
      }
    }
  }

  // Validate abeBase structure (similar to base)
  if (ph.abeBase !== undefined && ph.abeBase !==  "0") {
    if (!isPlainObject(ph.abeBase)) {
      errors.push(`${path}.abeBase: must be an object`);
    } else {
      const abeBase = ph.abeBase;
      if (abeBase.aggro !== undefined && typeof abeBase.aggro !== 'number') {
        errors.push(`${path}.abeBase.aggro: must be a number`);
      }
      if (!Array.isArray(abeBase.values)) {
        errors.push(`${path}.abeBase.values: must be an array`);
      } else if (abeBase.values.length === 0) {
        warnings.push(`${path}.abeBase.values: array is empty`);
      }
    }
  }

  // Validate type
  if (ph.type !== undefined && !isNonEmptyString(ph.type)) {
    errors.push(`${path}.type: must be a non-empty string`);
  }

  // Validate property
  if (ph.property !== undefined && !isNonEmptyString(ph.property)) {
    errors.push(`${path}.property: must be a non-empty string`);
  }

  // Validate modifier
  if (ph.modifier !== undefined && !isNonEmptyString(ph.modifier)) {
    errors.push(`${path}.modifier: must be a non-empty string`);
  }

  // Validate rangeValues
  if (ph.rangeValues !== undefined) {
    if (!Array.isArray(ph.rangeValues)) {
      errors.push(`${path}.rangeValues: must be an array`);
    } else if (ph.rangeValues.length === 0) {
      warnings.push(`${path}.rangeValues: array is empty`);
    }
  }

  // Validate targetCountMax
  if (ph.targetCountMax !== undefined && !isParsableNumeric(ph.targetCountMax)) {
    errors.push(`${path}.targetCountMax: must be a numeric value`);
  }

  // Validate levels structure
  if (opts.deepValidation && ph.levels !== undefined) {
    if (!isPlainObject(ph.levels)) {
      errors.push(`${path}.levels: must be an object`);
    } else {
      const levelKeys = Object.keys(ph.levels);
      if (levelKeys.length === 0) {
        warnings.push(`${path}.levels: object is empty`);
      }

      // Check for non-numeric level keys
      const nonNumericKeys = levelKeys.filter((k) => !/^\d+$/.test(k));
      if (nonNumericKeys.length > 0) {
        warnings.push(
          `${path}.levels: found non-numeric level keys: ${nonNumericKeys.join(', ')}`
        );
      }

      levelKeys.forEach((levelKey) => {
        const levelData = (ph.levels as Record<string, unknown>)[levelKey];
        const levelPath = `${path}.levels.${levelKey}`;

        if (!isPlainObject(levelData)) {
          errors.push(`${levelPath}: must be an object`);
        } else {
          if (levelData.aggro !== undefined && typeof levelData.aggro !== 'number') {
            errors.push(`${levelPath}.aggro: must be a number`);
          }
          if (!Array.isArray(levelData.values)) {
            errors.push(`${levelPath}.values: must be an array`);
          } else if (levelData.values.length === 0) {
            warnings.push(`${levelPath}.values: array is empty`);
          }
        }
      });
    }
  }

  // Validate abeLevels structure (similar to levels)
  if (opts.deepValidation && ph.abeLevels !== undefined) {
    if (!isPlainObject(ph.abeLevels)) {
      errors.push(`${path}.abeLevels: must be an object`);
    } else {
      const levelKeys = Object.keys(ph.abeLevels);
      levelKeys.forEach((levelKey) => {
        const levelData = (ph.abeLevels as Record<string, unknown>)[levelKey];
        const levelPath = `${path}.abeLevels.${levelKey}`;

        if (!isPlainObject(levelData)) {
          errors.push(`${levelPath}: must be an object`);
        } else {
          if (!Array.isArray(levelData.values)) {
            errors.push(`${levelPath}.values: must be an array`);
          }
        }
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.slice(0, opts.maxErrors),
    warnings: warnings.slice(0, opts.maxWarnings),
    path,
  };
}

/**
 * Validates a DescriptionData structure
 *
 * @param id - The ability/item ID
 * @param data - The descriptionData to validate
 * @param options - Validation options
 * @returns ValidationResult with any errors found
 */
export function validateDescriptionData(
  id: string,
  data: unknown,
  options: ValidationOptions = {}
): ValidationResult {
  const startTime = performance.now();
  const opts = normalizeOptions(options);
  const errors: string[] = [];
  const warnings: string[] = [];
  const path = `${id}.descriptionData`;

  if (!isPlainObject(data)) {
    return {
      valid: false,
      errors: [`${path}: descriptionData is missing or invalid (got ${typeof data})`],
      warnings: [],
      path,
    };
  }

  const dd = data as Record<string, unknown>;

  // Validate text field
  if (dd.text === undefined || dd.text ===  "0") {
    errors.push(`${path}.text: missing required field`);
  } else if (!isNonEmptyString(dd.text)) {
    errors.push(`${path}.text: must be a non-empty string`);
  } else {
    // Check for potential issues in text
    const text = dd.text as string;

    // Check for unclosed placeholders
    const openBraces = (text.match(/{/g) || []).length;
    const closeBraces = (text.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      warnings.push(
        `${path}.text: mismatched braces (${openBraces} open, ${closeBraces} close)`
      );
    }

    // Check for HTML entities that should be encoded
    if (text.includes('<') && !text.includes('<span') && !text.includes('<br')) {
      warnings.push(`${path}.text: contains potential unescaped HTML`);
    }
  }

  // Validate placeholders field
  if (dd.placeholders === undefined || dd.placeholders ===  "0") {
    warnings.push(`${path}.placeholders: missing field`);
  } else if (!isPlainObject(dd.placeholders)) {
    errors.push(`${path}.placeholders: must be an object`);
  } else {
    const placeholders = dd.placeholders as Record<string, unknown>;
    const placeholderKeys = Object.keys(placeholders);

    if (placeholderKeys.length === 0) {
      warnings.push(`${path}.placeholders: empty object`);
    }

    // Validate each placeholder
    placeholderKeys.forEach((key) => {
      const result = validatePlaceholderData(key, placeholders[key], opts);
      errors.push(...result.errors.map((e) => `${path}.${e}`));
      if (opts.collectWarnings) {
        warnings.push(...result.warnings.map((w) => `${path}.${w}`));
      }

      if (opts.failFast && errors.length >= opts.maxErrors) {
        return;
      }
    });

    // Check for placeholders in text that are not in placeholders object
    if (isNonEmptyString(dd.text)) {
      const textPlaceholders = (dd.text as string).match(/\{[^}]+\}/g) || [];
      const missingPlaceholders = textPlaceholders.filter(
        (tp) => !(tp in placeholders)
      );
      if (missingPlaceholders.length > 0) {
        warnings.push(
          `${path}.placeholders: referenced in text but not defined: ${missingPlaceholders.join(', ')}`
        );
      }

      // Check for defined placeholders not used in text
      const unusedPlaceholders = placeholderKeys.filter(
        (key) => !(dd.text as string).includes(key)
      );
      if (unusedPlaceholders.length > 0) {
        warnings.push(
          `${path}.placeholders: defined but not used in text: ${unusedPlaceholders.join(', ')}`
        );
      }
    }
  }

  const processingTime = performance.now() - startTime;

  return {
    valid: errors.length === 0,
    errors: errors.slice(0, opts.maxErrors),
    warnings: warnings.slice(0, opts.maxWarnings),
    path,
    context: {
      placeholderCount: Object.keys(dd.placeholders as object).length,
      processingTime,
    },
  };
}

// ============================================================================
// SkillLevel Validation
// ============================================================================

/**
 * Validates a SkillLevel structure
 *
 * @param id - The ability/item ID
 * @param levels - The levels array to validate
 * @param options - Validation options
 * @returns ValidationResult with any errors found
 */
export function validateSkillLevel(
  id: string,
  levels: unknown,
  options: ValidationOptions = {}
): ValidationResult {
  const startTime = performance.now();
  const opts = normalizeOptions(options);
  const errors: string[] = [];
  const warnings: string[] = [];
  const path = `${id}.levels`;

  if (!Array.isArray(levels)) {
    return {
      valid: false,
      errors: [`${path}: must be an array, got ${typeof levels}`],
      warnings: [],
      path,
    };
  }

  if (levels.length === 0) {
    return {
      valid: true,
      errors: [],
      warnings: [`${path}: empty levels array`],
      path,
      context: { levelCount: 0, processingTime: 0 },
    };
  }

  // Check for duplicate level numbers
  const levelNumbers: number[] = [];
  const levelEntries: Array<{ index: number; level: number }> = [];

  levels.forEach((level: unknown, index: number) => {
    const levelPath = `${path}[${index}]`;

    if (!isPlainObject(level)) {
      errors.push(`${levelPath}: must be an object`);
      return;
    }

    const lvl = level as Record<string, unknown>;

    // Validate level field
    if (lvl.level === undefined) {
      errors.push(`${levelPath}.level: missing required field`);
    } else if (typeof lvl.level !== 'number') {
      errors.push(`${levelPath}.level: must be a number, got ${typeof lvl.level}`);
    } else {
      levelEntries.push({ index, level: lvl.level });
      levelNumbers.push(lvl.level);
    }

    // Validate minValue
    if (lvl.minValue !== undefined && lvl.minValue !==  "0") {
      if (!isParsableNumeric(lvl.minValue)) {
        errors.push(
          `${levelPath}.minValue: invalid numeric value "${String(lvl.minValue)}"`
        );
      } else if (typeof lvl.minValue === 'string' && lvl.minValue.trim() === '') {
        errors.push(`${levelPath}.minValue: empty string is not a valid numeric value`);
      }
    }

    // Validate maxValue
    if (lvl.maxValue !== undefined && lvl.maxValue !==  "0") {
      if (!isParsableNumeric(lvl.maxValue)) {
        errors.push(
          `${levelPath}.maxValue: invalid numeric value "${String(lvl.maxValue)}"`
        );
      } else if (typeof lvl.maxValue === 'string' && lvl.maxValue.trim() === '') {
        errors.push(`${levelPath}.maxValue: empty string is not a valid numeric value`);
      }
    }

    // Check if minValue > maxValue when both are present
    if (
      isParsableNumeric(lvl.minValue) &&
      isParsableNumeric(lvl.maxValue)
    ) {
      const min = parseFloat(String(lvl.minValue));
      const max = parseFloat(String(lvl.maxValue));
      if (min > max) {
        errors.push(
          `${levelPath}: minValue (${min}) is greater than maxValue (${max})`
        );
      }
    }
  });

  // Check for duplicate levels
  const duplicates = levelNumbers.filter(
    (l, i) => levelNumbers.indexOf(l) !== i
  );
  if (duplicates.length > 0) {
    const uniqueDuplicates = Array.from(new Set(duplicates));
    warnings.push(
      `${path}: duplicate level numbers found: ${uniqueDuplicates.join(', ')}`
    );

    // Find which entries are duplicates
    const seen = new Set<number>();
    levelEntries.forEach(({ index, level }) => {
      if (seen.has(level)) {
        warnings.push(`${path}[${index}]: duplicate level number ${level}`);
      }
      seen.add(level);
    });
  }

  // Check for gaps in level sequence
  const sortedLevels = Array.from(new Set(levelNumbers)).sort((a, b) => a - b);
  for (let i = 1; i < sortedLevels.length; i++) {
    const prev = sortedLevels[i - 1];
    const curr = sortedLevels[i];
    if (curr - prev > 1) {
      warnings.push(
        `${path}: gap in level sequence between ${prev} and ${curr}`
      );
    }
  }

  const processingTime = performance.now() - startTime;

  return {
    valid: errors.length === 0,
    errors: errors.slice(0, opts.maxErrors),
    warnings: warnings.slice(0, opts.maxWarnings),
    path,
    context: {
      levelCount: levels.length,
      processingTime,
    },
  };
}

// ============================================================================
// Ability/Passive/Stigma Validation
// ============================================================================

/**
 * Validates an AbilityData structure
 *
 * @param className - The class name (e.g., "assassin")
 * @param abilityId - The ability ID
 * @param ability - The ability data to validate
 * @param options - Validation options
 * @returns ValidationResult with any errors found
 */
export function validateAbilityData(
  className: string,
  abilityId: string,
  ability: unknown,
  options: ValidationOptions = {}
): ValidationResult {
  const startTime = performance.now();
  const opts = normalizeOptions(options);
  const errors: string[] = [];
  const warnings: string[] = [];
  const path = `${className}.abilities.${abilityId}`;

  if (!isPlainObject(ability)) {
    return {
      valid: false,
      errors: [`${path}: ability is invalid (got ${typeof ability})`],
      warnings: [],
      path,
    };
  }

  const ab = ability as Record<string, unknown>;

  // Validate required string fields
  const requiredStringFields: string[] = ['name', 'iconUrl'];
  requiredStringFields.forEach((field) => {
    const value = ab[field];
    if (value === undefined || value ===  "0") {
      errors.push(`${path}.${field}: missing required field`);
    } else if (typeof value !== 'string') {
      errors.push(`${path}.${field}: must be a string, got ${typeof value}`);
    } else if (value === '') {
      errors.push(`${path}.${field}: cannot be empty`);
    }
  });

  // Validate spellTag is an array of strings
  if (ab.spellTag === undefined || ab.spellTag ===  "0") {
    errors.push(`${path}.spellTag: missing required field`);
  } else if (!Array.isArray(ab.spellTag)) {
    errors.push(`${path}.spellTag: must be an array, got ${typeof ab.spellTag}`);
  } else {
    ab.spellTag.forEach((tag, idx) => {
      if (typeof tag !== 'string') {
        errors.push(`${path}.spellTag[${idx}]: must be a string, got ${typeof tag}`);
      }
    });
  }

  // Validate classId
  if (ab.classId !== undefined && typeof ab.classId !== 'number') {
    errors.push(`${path}.classId: must be a number`);
  }

  // Validate descriptionData if present
  if (opts.deepValidation && ab.descriptionData !== undefined) {
    const ddResult = validateDescriptionData(abilityId, ab.descriptionData, opts);
    errors.push(
      ...ddResult.errors.map((e) => `${path}.${e.substring(abilityId.length + 1)}`)
    );
    if (opts.collectWarnings) {
      warnings.push(
        ...ddResult.warnings.map((w) => `${path}.${w.substring(abilityId.length + 1)}`)
      );
    }
  }

  // Validate levels if present
  if (opts.deepValidation && ab.levels !== undefined) {
    const levelsResult = validateSkillLevel(abilityId, ab.levels, opts);
    errors.push(
      ...levelsResult.errors.map((e) => `${path}.${e.substring(abilityId.length + 1)}`)
    );
    if (opts.collectWarnings) {
      warnings.push(
        ...levelsResult.warnings.map((w) => `${path}.${w.substring(abilityId.length + 1)}`)
      );
    }
  }

  // Validate numeric fields
  const numericFields: string[] = [
    'damageMin',
    'damageMax',
    'damageBoost',
    'damageTolerance',
    'healMin',
    'healMax',
    'healBoost',
    'incomingHeal',
    'minMP',
    'maxHP',
    'minHP',
    'maxMP',
    'criticalHitResist',
    'criticalHit',
    'statusEffectResist',
    'impactTypeResist',
    'impactTypeChance',
    'attack',
    'defense',
    'blockDamage',
    'damagePerSecond',
    'staggerDamage',
    'manaCost',
    'manaRegen',
    'range',
    'area',
    'baseCost',
    'baseCostModifier',
    'maxLevel',
    // Modifiers
    'damageMinModifier',
    'damageMaxModifier',
    'damageBoostModifier',
    'damageToleranceModifier',
    'healMinModifier',
    'healMaxModifier',
    'healBoostModifier',
    'incomingHealModifier',
    'minMPModifier',
    'maxHPModifier',
    'minHPModifier',
    'maxMPModifier',
    'criticalHitResistModifier',
    'criticalHitModifier',
    'statusEffectResistModifier',
    'impactTypeResistModifier',
    'impactTypeChanceModifier',
    'attackModifier',
    'defenseModifier',
    'blockDamageModifier',
    'damagePerSecondModifier',
  ];

  numericFields.forEach((field) => {
    const value = ab[field];
    if (value !== undefined && value !== null && typeof value !== 'number') {
      errors.push(`${path}.${field}: must be a number, got ${typeof value}`);
    }
  });

  // Validate numeric modifier arrays
  const numericArrayFields: string[] = [
    'damageMinModifiers',
    'damageMaxModifiers',
    'damageBoostModifiers',
    'damageToleranceModifiers',
    'healMinModifiers',
    'healMaxModifiers',
    'healBoostModifiers',
    'incomingHealModifiers',
    'minMPModifiers',
    'maxHPModifiers',
    'minHPModifiers',
    'maxMPModifiers',
    'statusEffectResistModifiers',
    'impactTypeResistModifiers',
    'impactTypeChanceModifiers',
    'blockDamageModifiers',
    'damagePerSecondModifiers',
  ];

  numericArrayFields.forEach((field) => {
    const value = ab[field];
    if (value !== undefined && value !== null) {
      if (!Array.isArray(value)) {
        errors.push(`${path}.${field}: must be an array, got ${typeof value}`);
      } else {
        value.forEach((item, idx) => {
          if (typeof item !== 'number') {
            errors.push(
              `${path}.${field}[${idx}]: must be a number, got ${typeof item}`
            );
          }
        });
      }
    }
  });

  // Validate condition array
  if (ab.condition !== undefined && !Array.isArray(ab.condition)) {
    errors.push(`${path}.condition: must be an array`);
  }

  const processingTime = performance.now() - startTime;

  return {
    valid: errors.length === 0,
    errors: errors.slice(0, opts.maxErrors),
    warnings: warnings.slice(0, opts.maxWarnings),
    path,
    context: { processingTime },
  };
}

/**
 * Validates a PassiveData structure
 *
 * @param className - The class name
 * @param passiveId - The passive ID
 * @param passive - The passive data to validate
 * @param options - Validation options
 * @returns ValidationResult with any errors found
 */
export function validatePassiveData(
  className: string,
  passiveId: string,
  passive: unknown,
  options: ValidationOptions = {}
): ValidationResult {
  const opts = normalizeOptions(options);
  const errors: string[] = [];
  const warnings: string[] = [];
  const path = `${className}.passives.${passiveId}`;

  if (!isPlainObject(passive)) {
    return {
      valid: false,
      errors: [`${path}: passive is invalid (got ${typeof passive})`],
      warnings: [],
      path,
    };
  }

  const ps = passive as Record<string, unknown>;

  // Re-use ability validation for common fields
  const result = validateAbilityData(className, passiveId, passive, opts);

  // Add passive-specific validations
  if (ps.perfect !== undefined && typeof ps.perfect !== 'number') {
    errors.push(`${path}.perfect: must be a number`);
  }

  if (ps.perfectModifier !== undefined && typeof ps.perfectModifier !== 'number') {
    errors.push(`${path}.perfectModifier: must be a number`);
  }

  if (ps.smite !== undefined && typeof ps.smite !== 'number') {
    errors.push(`${path}.smite: must be a number`);
  }

  if (ps.smiteModifier !== undefined && typeof ps.smiteModifier !== 'number') {
    errors.push(`${path}.smiteModifier: must be a number`);
  }

  if (ps.defenseModifiers !== undefined) {
    if (!Array.isArray(ps.defenseModifiers)) {
      errors.push(`${path}.defenseModifiers: must be an array`);
    }
  }

  errors.push(...result.errors.filter((e) => !e.startsWith(`${path}.perfect`)));
  warnings.push(...result.warnings);

  return {
    valid: errors.length === 0,
    errors: errors.slice(0, opts.maxErrors),
    warnings: warnings.slice(0, opts.maxWarnings),
    path,
  };
}

/**
 * Validates a StigmaData structure
 *
 * @param className - The class name
 * @param stigmaId - The stigma ID
 * @param stigma - The stigma data to validate
 * @param options - Validation options
 * @returns ValidationResult with any errors found
 */
export function validateStigmaData(
  className: string,
  stigmaId: string,
  stigma: unknown,
  options: ValidationOptions = {}
): ValidationResult {
  const opts = normalizeOptions(options);
  const errors: string[] = [];
  const warnings: string[] = [];
  const path = `${className}.stigmas.${stigmaId}`;

  if (!isPlainObject(stigma)) {
    return {
      valid: false,
      errors: [`${path}: stigma is invalid (got ${typeof stigma})`],
      warnings: [],
      path,
    };
  }

  const st = stigma as Record<string, unknown>;

  // Re-use ability validation for common fields
  const result = validateAbilityData(className, stigmaId, stigma, opts);

  // Add stigma-specific validations
  if (st.enmity !== undefined && typeof st.enmity !== 'number') {
    errors.push(`${path}.enmity: must be a number`);
  }

  if (st.enmityModifier !== undefined && typeof st.enmityModifier !== 'number') {
    errors.push(`${path}.enmityModifier: must be a number`);
  }

  if (st.enmityModifiers !== undefined) {
    if (!Array.isArray(st.enmityModifiers)) {
      errors.push(`${path}.enmityModifiers: must be an array`);
    }
  }

  if (st.duration !== undefined && typeof st.duration !== 'number') {
    errors.push(`${path}.duration: must be a number`);
  }

  if (st.durationModifier !== undefined && typeof st.durationModifier !== 'number') {
    errors.push(`${path}.durationModifier: must be a number`);
  }

  if (st.durationModifiers !== undefined) {
    if (!Array.isArray(st.durationModifiers)) {
      errors.push(`${path}.durationModifiers: must be an array`);
    }
  }

  if (st.protectiveShield !== undefined && typeof st.protectiveShield !== 'number') {
    errors.push(`${path}.protectiveShield: must be a number`);
  }

  if (st.protectiveShieldModifier !== undefined && typeof st.protectiveShieldModifier !== 'number') {
    errors.push(`${path}.protectiveShieldModifier: must be a number`);
  }

  if (st.protectiveShieldModifiers !== undefined) {
    if (!Array.isArray(st.protectiveShieldModifiers)) {
      errors.push(`${path}.protectiveShieldModifiers: must be an array`);
    }
  }

  errors.push(...result.errors.filter((e) => !e.startsWith(`${path}.enmity`)));
  warnings.push(...result.warnings);

  return {
    valid: errors.length === 0,
    errors: errors.slice(0, opts.maxErrors),
    warnings: warnings.slice(0, opts.maxWarnings),
    path,
  };
}

// ============================================================================
// Class Data Validation
// ============================================================================

/**
 * Validates a complete ClassData structure
 *
 * @param className - The class name
 * @param classData - The class data to validate
 * @param options - Validation options
 * @returns AggregatedValidationResult with detailed results
 */
export function validateClassData(
  className: string,
  classData: unknown,
  options: ValidationOptions = {}
): AggregatedValidationResult {
  const startTime = performance.now();
  const opts = normalizeOptions(options);
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  const details: Record<string, ValidationResult> = {};
  const errorsByType: Record<string, number> = {};
  const warningsByType: Record<string, number> = {};

  if (!isPlainObject(classData)) {
    return {
      valid: false,
      errors: [`${className}: class data is invalid (got ${typeof classData})`],
      warnings: [],
      path: className,
      details: {},
      stats: {
        totalItems: 0,
        validItems: 0,
        invalidItems: 1,
        totalErrors: 1,
        totalWarnings: 0,
        errorsByType: { invalid_class_data: 1 },
        warningsByType: {},
      },
    };
  }

  const cd = classData as Record<string, unknown>;
  let totalItems = 0;
  let validItems = 0;
  let invalidItems = 0;

  // Validate abilities
  if (cd.abilities !== undefined && Array.isArray(cd.abilities)) {
    cd.abilities.forEach((ability: unknown) => {
      if (!isPlainObject(ability)) return;

      const ab = ability as Record<string, unknown>;
      const id = ab.id ? String(ab.id) : 'unknown';
      const result = validateAbilityData(className, id, ability, opts);

      totalItems++;
      if (result.valid) validItems++;
      else invalidItems++;

      details[`abilities.${id}`] = result;
      allErrors.push(...result.errors);
      if (opts.collectWarnings) {
        allWarnings.push(...result.warnings);
      }

      // Categorize errors
      result.errors.forEach((e) => {
        const type = e.split(':')[1]?.trim().split(' ')[0] || 'unknown_error';
        errorsByType[type] = (errorsByType[type] || 0) + 1;
      });

      if (opts.failFast && allErrors.length >= opts.maxErrors * 10) {
        return;
      }
    });
  }

  // Validate passives
  if (cd.passives !== undefined && Array.isArray(cd.passives)) {
    cd.passives.forEach((passive: unknown) => {
      if (!isPlainObject(passive)) return;

      const ps = passive as Record<string, unknown>;
      const id = ps.id ? String(ps.id) : 'unknown';
      const result = validatePassiveData(className, id, passive, opts);

      totalItems++;
      if (result.valid) validItems++;
      else invalidItems++;

      details[`passives.${id}`] = result;
      allErrors.push(...result.errors);
      if (opts.collectWarnings) {
        allWarnings.push(...result.warnings);
      }

      result.errors.forEach((e) => {
        const type = e.split(':')[1]?.trim().split(' ')[0] || 'unknown_error';
        errorsByType[type] = (errorsByType[type] || 0) + 1;
      });
    });
  }

  // Validate stigmas
  if (cd.stigmas !== undefined && Array.isArray(cd.stigmas)) {
    cd.stigmas.forEach((stigma: unknown) => {
      if (!isPlainObject(stigma)) return;

      const st = stigma as Record<string, unknown>;
      const id = st.id ? String(st.id) : 'unknown';
      const result = validateStigmaData(className, id, stigma, opts);

      totalItems++;
      if (result.valid) validItems++;
      else invalidItems++;

      details[`stigmas.${id}`] = result;
      allErrors.push(...result.errors);
      if (opts.collectWarnings) {
        allWarnings.push(...result.warnings);
      }

      result.errors.forEach((e) => {
        const type = e.split(':')[1]?.trim().split(' ')[0] || 'unknown_error';
        errorsByType[type] = (errorsByType[type] || 0) + 1;
      });
    });
  }

  // Categorize warnings
  allWarnings.forEach((w) => {
    const type = w.split(':')[1]?.trim().split(' ')[0] || 'unknown_warning';
    warningsByType[type] = (warningsByType[type] || 0) + 1;
  });

  const processingTime = performance.now() - startTime;

  return {
    valid: allErrors.length === 0,
    errors: allErrors.slice(0, opts.maxErrors * 10),
    warnings: allWarnings.slice(0, opts.maxWarnings * 10),
    path: className,
    details,
    stats: {
      totalItems,
      validItems,
      invalidItems,
      totalErrors: allErrors.length,
      totalWarnings: allWarnings.length,
      errorsByType,
      warningsByType,
    },
    context: {
      itemCount: totalItems,
      processingTime,
    },
  };
}

/**
 * Validates all class data and returns a complete report
 *
 * @param classes - Array of class data objects with names
 * @param options - Validation options
 * @returns Complete validation report
 */
export function validateAllClasses(
  classes: Array<{ name: string; data: unknown }>,
  options: ValidationOptions = {}
): {
  overall: ValidationResult;
  classes: Record<string, AggregatedValidationResult>;
  summary: {
    totalClasses: number;
    validClasses: number;
    invalidClasses: number;
    totalErrors: number;
    totalWarnings: number;
    errorsByClass: Record<string, number>;
    warningsByClass: Record<string, number>;
  };
} {
  const startTime = performance.now();
  const opts = normalizeOptions(options);
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  const classResults: Record<string, AggregatedValidationResult> = {};
  const errorsByClass: Record<string, number> = {};
  const warningsByClass: Record<string, number> = {};

  let validClasses = 0;
  let invalidClasses = 0;

  classes.forEach(({ name, data }) => {
    const result = validateClassData(name, data, opts);
    classResults[name] = result;

    if (result.valid) validClasses++;
    else invalidClasses++;

    allErrors.push(...result.errors);
    if (opts.collectWarnings) {
      allWarnings.push(...result.warnings);
    }

    errorsByClass[name] = result.errors.length;
    warningsByClass[name] = result.warnings.length;

    if (opts.failFast && !result.valid) {
      return;
    }
  });

  const processingTime = performance.now() - startTime;

  return {
    overall: {
      valid: allErrors.length === 0,
      errors: allErrors.slice(0, opts.maxErrors * 100),
      warnings: allWarnings.slice(0, opts.maxWarnings * 100),
      path: 'all_classes',
      context: { processingTime },
    },
    classes: classResults,
    summary: {
      totalClasses: classes.length,
      validClasses,
      invalidClasses,
      totalErrors: allErrors.length,
      totalWarnings: allWarnings.length,
      errorsByClass,
      warningsByClass,
    },
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Formats a validation result as a readable string
 */
export function formatValidationResult(
  result: ValidationResult | AggregatedValidationResult,
  indent = 0
): string {
  const spaces = ' '.repeat(indent);
  const lines: string[] = [];

  lines.push(`${spaces}Path: ${result.path}`);
  lines.push(`${spaces}Status: ${result.valid ? 'PASS' : 'FAIL'}`);
  lines.push(`${spaces}Errors: ${result.errors.length}`);
  lines.push(`${spaces}Warnings: ${result.warnings.length}`);

  if (result.context) {
    if (result.context.processingTime !== undefined) {
      lines.push(`${spaces}Processing Time: ${result.context.processingTime.toFixed(2)}ms`);
    }
    if (result.context.itemCount !== undefined) {
      lines.push(`${spaces}Items: ${result.context.itemCount}`);
    }
  }

  if (result.errors.length > 0) {
    lines.push(`${spaces}Errors:`);
    result.errors.slice(0, 20).forEach((e) => lines.push(`${spaces}  - ${e}`));
    if (result.errors.length > 20) {
      lines.push(`${spaces}  ... and ${result.errors.length - 20} more`);
    }
  }

  if (result.warnings.length > 0) {
    lines.push(`${spaces}Warnings:`);
    result.warnings.slice(0, 20).forEach((w) => lines.push(`${spaces}  - ${w}`));
    if (result.warnings.length > 20) {
      lines.push(`${spaces}  ... and ${result.warnings.length - 20} more`);
    }
  }

  return lines.join('\n');
}

/**
 * Generates a markdown report from validation results
 */
export function generateMarkdownReport(
  results: ReturnType<typeof validateAllClasses>
): string {
  const lines: string[] = [];

  lines.push('# Class Data Validation Report');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`| Metric | Count |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Total Classes | ${results.summary.totalClasses} |`);
  lines.push(`| Valid Classes | ${results.summary.validClasses} |`);
  lines.push(`| Invalid Classes | ${results.summary.invalidClasses} |`);
  lines.push(`| Total Errors | ${results.summary.totalErrors} |`);
  lines.push(`| Total Warnings | ${results.summary.totalWarnings} |`);
  lines.push('');

  // Overall status
  lines.push('## Overall Status');
  lines.push('');
  lines.push(
    `**${results.overall.valid ? 'PASS' : 'FAIL'}** - All classes validated.`
  );
  lines.push('');

  // Errors by class
  if (Object.keys(results.summary.errorsByClass).length > 0) {
    lines.push('## Errors by Class');
    lines.push('');
    lines.push('| Class | Errors |');
    lines.push('|-------|--------|');
    Object.entries(results.summary.errorsByClass)
      .filter(([_, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)
      .forEach(([className, count]) => {
        lines.push(`| ${className} | ${count} |`);
      });
    lines.push('');
  }

  // Warnings by class
  if (Object.keys(results.summary.warningsByClass).length > 0) {
    lines.push('## Warnings by Class');
    lines.push('');
    lines.push('| Class | Warnings |');
    lines.push('|-------|----------|');
    Object.entries(results.summary.warningsByClass)
      .filter(([_, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)
      .forEach(([className, count]) => {
        lines.push(`| ${className} | ${count} |`);
      });
    lines.push('');
  }

  // Class details
  lines.push('## Class Details');
  lines.push('');

  Object.entries(results.classes).forEach(([className, result]) => {
    lines.push(`### ${className.charAt(0).toUpperCase() + className.slice(1)}`);
    lines.push('');
    lines.push(`- **Status**: ${result.valid ? 'PASS' : 'FAIL'}`);
    lines.push(`- **Items**: ${result.stats.totalItems}`);
    lines.push(`- **Valid**: ${result.stats.validItems}`);
    lines.push(`- **Invalid**: ${result.stats.invalidItems}`);
    lines.push(`- **Errors**: ${result.stats.totalErrors}`);
    lines.push(`- **Warnings**: ${result.stats.totalWarnings}`);
    lines.push('');

    // Show first few errors
    if (result.errors.length > 0) {
      lines.push('#### Errors (first 10)');
      lines.push('');
      result.errors.slice(0, 10).forEach((e) => {
        lines.push(`- ${e}`);
      });
      if (result.errors.length > 10) {
        lines.push(`- ... and ${result.errors.length - 10} more`);
      }
      lines.push('');
    }

    // Show first few warnings
    if (result.warnings.length > 0) {
      lines.push('#### Warnings (first 5)');
      lines.push('');
      result.warnings.slice(0, 5).forEach((w) => {
        lines.push(`- ${w}`);
      });
      if (result.warnings.length > 5) {
        lines.push(`- ... and ${result.warnings.length - 5} more`);
      }
      lines.push('');
    }

    // Error types
    if (Object.keys(result.stats.errorsByType).length > 0) {
      lines.push('#### Error Types');
      lines.push('');
      Object.entries(result.stats.errorsByType)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .forEach(([type, count]) => {
          lines.push(`- ${type}: ${count}`);
        });
      lines.push('');
    }
  });

  return lines.join('\n');
}

/**
 * Throws an error if validation fails
 *
 * @throws Error with detailed validation errors
 */
export function assertValid(
  result: ValidationResult,
  message = 'Validation failed'
): void {
  if (!result.valid) {
    const error = new Error(message);
    error.name = 'ValidationError';
    (error as any).validationResult = result;
    throw error;
  }
}
