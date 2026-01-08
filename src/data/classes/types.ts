// Type definitions for class data structure

export interface SkillLevel {
  level: number;
  minValue?: string |  "0";
  maxValue?: string |  "0";
}

export interface SpecialtyChoiceData {
  description: string;
  unlockLevel: number;
  abilityId?: number;
  stigmaId?: number;
}

export interface AbilityData {
  name: string;
  iconUrl: string;
  description: string;
  descriptionData?: DescriptionData; // Questlog descriptionData with placeholders
  id?: string;
  condition?: string[];
  damageMin?: number;
  damageMinModifier?: number;
  damageMinModifiers?: number[];
  damageMax?: number;
  damageMaxModifier?: number;
  damageMaxModifiers?: number[];
  damageBoost?: number;
  damageBoostModifier?: number;
  damageBoostModifiers?: number[];
  damageTolerance?: number;
  damageToleranceModifier?: number;
  damageToleranceModifiers?: number[];
  healMin?: number;
  healMinModifier?: number;
  healMinModifiers?: number[];
  healMax?: number;
  healMaxModifier?: number;
  healMaxModifiers?: number[];
  healBoost?: number;
  healBoostModifier?: number;
  healBoostModifiers?: number;
  incomingHeal?: number;
  incomingHealModifier?: number;
  incomingHealModifiers?: number;
  minMP?: number;
  minMPModifier?: number;
  minMPModifiers?: number[];
  maxHP?: number;
  maxHPModifier?: number;
  maxHPModifiers?: number[];
  minHP?: number;
  minHPModifier?: number;
  minHPModifiers?: number[];
  maxMP?: number;
  maxMPModifier?: number;
  maxMPModifiers?: number[];
  criticalHitResist?: number;
  criticalHitResistModifier?: number;
  criticalHit?: number;
  criticalHitModifier?: number;
  statusEffectResist?: number;
  statusEffectResistModifier?: number;
  statusEffectResistModifiers?: number[];
  impactTypeResist?: number;
  impactTypeResistModifier?: number;
  impactTypeResistModifiers?: number[];
  impactTypeChance?: number;
  impactTypeChanceModifier?: number;
  impactTypeChanceModifiers?: number[];
  attack?: number;
  attackModifier?: number;
  defense?: number;
  defenseModifier?: number;
  blockDamage?: number;
  blockDamageModifier?: number;
  blockDamageModifiers?: number[];
  damagePerSecond?: number;
  damagePerSecondModifier?: number;
  damagePerSecondModifiers?: number[];
  staggerDamage?: number;
  manaCost?: number;
  manaRegen?: number;
  range?: number;
  area?: number;
  castingDuration?: string;
  cooldown?: string;
  target?: string;
  effectCondition?: string;
  chargeLevels?: string;
  spellTag: string[];
  specialtyChoices?: SpecialtyChoiceData[];
  chainSkills?: string[]; // Names of chain skills
  classId: number;
  baseCost?: number;
  baseCostModifier?: number;
  maxLevel?: number;
  levels?: SkillLevel[];
}

export interface PassiveData {
  name: string;
  iconUrl: string;
  description: string;
  descriptionData?: DescriptionData; // Questlog descriptionData with placeholders
  id?: string;
  damageMin?: number;
  damageMinModifier?: number;
  damageMinModifiers?: number[];
  damageMax?: number;
  damageMaxModifier?: number;
  damageMaxModifiers?: number[];
  damageBoost?: number;
  damageBoostModifier?: number;
  damageBoostModifiers?: number[];
  damageTolerance?: number;
  damageToleranceModifier?: number;
  damageToleranceModifiers?: number[];
  healMin?: number;
  healMinModifier?: number;
  healMinModifiers?: number[];
  healMax?: number;
  healMaxModifier?: number;
  healMaxModifiers?: number[];
  healBoost?: number;
  healBoostModifier?: number;
  healBoostModifiers?: number[];
  incomingHeal?: number;
  incomingHealModifier?: number;
  incomingHealModifiers?: number[];
  minMP?: number;
  minMPModifier?: number;
  minMPModifiers?: number[];
  maxHP?: number;
  maxHPModifier?: number;
  maxHPModifiers?: number[];
  minHP?: number;
  minHPModifier?: number;
  minHPModifiers?: number[];
  maxMP?: number;
  maxMPModifier?: number;
  maxMPModifiers?: number[];
  criticalHitResist?: number;
  criticalHitResistModifier?: number;
  criticalHit?: number;
  criticalHitModifier?: number;
  statusEffectResist?: number;
  statusEffectResistModifier?: number;
  statusEffectResistModifiers?: number[];
  impactTypeResist?: number;
  impactTypeResistModifier?: number;
  impactTypeResistModifiers?: number[];
  impactTypeChance?: number;
  impactTypeChanceModifier?: number;
  impactTypeChanceModifiers?: number[];
  attack?: number;
  attackModifier?: number;
  defense?: number;
  defenseModifier?: number;
  defenseModifiers?: number[];
  blockDamage?: number;
  blockDamageModifier?: number;
  blockDamageModifiers?: number[];
  damagePerSecond?: number;
  damagePerSecondModifier?: number;
  damagePerSecondModifiers?: number[];
  staggerDamage?: number;
  manaCost?: number;
  manaRegen?: number;
  perfect?: number;
  perfectModifier?: number;
  smite?: number;
  smiteModifier?: number;
  smiteModifiers?: number[];
  range?: number;
  area?: number;
  castingDuration?: string;
  cooldown?: string;
  target?: string;
  effectCondition?: string;
  chargeLevels?: string;
  spellTag: string[];
  classId: number;
  baseCost?: number;
  baseCostModifier?: number;
  maxLevel?: number;
  levels?: SkillLevel[];
}

export interface StigmaData {
  name: string;
  iconUrl: string;
  description: string;
  descriptionData?: DescriptionData; // Questlog descriptionData with placeholders
  id?: string;
  condition?: string[];
  damageMin?: number;
  damageMinModifier?: number;
  damageMinModifiers?: number[];
  damageMax?: number;
  damageMaxModifier?: number;
  damageMaxModifiers?: number[];
  damageBoost?: number;
  damageBoostModifier?: number;
  damageBoostModifiers?: number[];
  damageTolerance?: number;
  damageToleranceModifier?: number;
  damageToleranceModifiers?: number[];
  healMin?: number;
  healMinModifier?: number;
  healMinModifiers?: number[];
  healMax?: number;
  healMaxModifier?: number;
  healMaxModifiers?: number[];
  healBoost?: number;
  healBoostModifier?: number;
  healBoostModifiers?: number;
  incomingHeal?: number;
  incomingHealModifier?: number;
  incomingHealModifiers?: number;
  minMP?: number;
  minMPModifier?: number;
  minMPModifiers?: number[];
  maxHP?: number;
  maxHPModifier?: number;
  maxHPModifiers?: number[];
  minHP?: number;
  minHPModifier?: number;
  minHPModifiers?: number[];
  maxMP?: number;
  maxMPModifier?: number;
  maxMPModifiers?: number[];
  criticalHitResist?: number;
  criticalHitResistModifier?: number;
  criticalHit?: number;
  criticalHitModifier?: number;
  statusEffectResist?: number;
  statusEffectResistModifier?: number;
  impactTypeResist?: number;
  impactTypeResistModifier?: number;
  impactTypeResistModifiers?: number[];
  impactTypeChance?: number;
  impactTypeChanceModifier?: number;
  attack?: number;
  attackModifier?: number;
  defense?: number;
  defenseModifier?: number;
  defenseModifiers?: number[];
  blockDamage?: number;
  blockDamageModifier?: number;
  blockDamageModifiers?: number[];
  damagePerSecond?: number;
  damagePerSecondModifier?: number;
  damagePerSecondModifiers?: number[];
  staggerDamage?: number;
  manaCost?: number;
  manaRegen?: number;
  range?: number;
  area?: number;
  castingDuration?: string;
  cooldown?: string;
  target?: string;
  effectCondition?: string;
  chargeLevels?: string;
  enmity?: number;
  enmityModifier?: number;
  enmityModifiers?: number[];
  duration?: number;
  durationModifier?: number;
  durationModifiers?: number[];
  protectiveShield?: number;
  protectiveShieldModifier?: number;
  protectiveShieldModifiers?: number[];
  spellTag: string[];
  specialtyChoices?: SpecialtyChoiceData[];
  classId: number;
  baseCost?: number;
  baseCostModifier?: number;
  maxLevel?: number;
  levels?: SkillLevel[];
}

export interface ClassData {
  name: string;
  iconUrl: string;
  bannerUrl: string;
  characterURL: string;
  description: string;
  tags: string[];
  abilities?: AbilityData[];
  passives?: PassiveData[];
  stigmas?: StigmaData[];
}

// ============================================================================
// Questlog descriptionData structure
// ============================================================================

/**
 * Base placeholder level data structure
 */
export interface PlaceholderLevelData {
  aggro?: number;
  values: (string | number)[];
}

/**
 * Placeholder data structure from Questlog
 * Contains dynamic values used in skill descriptions
 */
export interface PlaceholderData {
  /** Base values for the placeholder (used when no level-specific data exists) */
  base?: PlaceholderLevelData;
  /** ABE (Ability Effect) base values */
  abeBase?: PlaceholderLevelData;
  /** Type identifier for the placeholder (e.g., "se_dmg", "se", "heal") */
  type?: string;
  /** Property name for the placeholder */
  property?: string;
  /** Modifier to apply to the value (e.g., "time", "divide100") */
  modifier?: string;
  /** Range values for the placeholder */
  rangeValues?: (string | number)[];
  /** Maximum target count */
  targetCountMax?: string | number;
  /** Level-specific values (key is level number as string) */
  levels?: Record<string, PlaceholderLevelData>;
  /** ABE level-specific values */
  abeLevels?: Record<string, PlaceholderLevelData>;
}

/**
 * Description data structure from Questlog
 * Contains the display text with placeholders and their corresponding values
 */
export interface DescriptionData {
  /** The display text containing placeholder references like {se_dmg:id:property} */
  text: string;
  /** Map of placeholder keys to their data */
  placeholders: Record<string, PlaceholderData>;
}

// ============================================================================
// Validation Types (re-exported from validators.ts)
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
  maxWarnings?: boolean;
  /** Whether to validate deep nested structures (default: true) */
  deepValidation?: boolean;
}

