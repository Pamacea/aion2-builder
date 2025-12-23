import { z } from "zod";
import type { BuildAbilityType } from "./build.type";
import type { ClassType } from "./class.type";
import type { SpecialtyChoiceType } from "./specialty-choice.type";
import type { SpellTagType } from "./spell-tags.type";

// ---------------------------
// Ability Schema Base
// ---------------------------
export const AbilitySchemaBase = z.object({
  id: z.number(),
  name: z.string(),
  iconUrl: z.string().nullish(),
  description: z.string().nullish(),

  damageMin: z.number().nullish(),
  damageMinModifier: z.number().nullish(),
  damageMinModifiers: z
    .union([z.array(z.number()), z.null()])
    .transform((val) => (Array.isArray(val) ? val : null))
    .nullish(),
  damageMax: z.number().nullish(),
  damageMaxModifier: z.number().nullish(),
  damageMaxModifiers: z
    .union([z.array(z.number()), z.null()])
    .transform((val) => (Array.isArray(val) ? val : null))
    .nullish(),
  damageBoost: z.number().nullish(),
  damageBoostModifier: z.number().nullish(),
  damageBoostModifiers: z
    .union([z.array(z.number()), z.null()])
    .transform((val) => (Array.isArray(val) ? val : null))
    .nullish(),
  damageTolerance: z.number().nullish(),
  damageToleranceModifier: z.number().nullish(),
  damageToleranceModifiers: z
    .union([z.array(z.number()), z.null()])
    .transform((val) => (Array.isArray(val) ? val : null))
    .nullish(),

  healMin: z.number().nullish(),
  healMinModifier: z.number().nullish(),
  healMinModifiers: z
    .union([z.array(z.number()), z.null()])
    .transform((val) => (Array.isArray(val) ? val : null))
    .nullish(),
  healMax: z.number().nullish(),
  healMaxModifier: z.number().nullish(),
  healMaxModifiers: z
    .union([z.array(z.number()), z.null()])
    .transform((val) => (Array.isArray(val) ? val : null))
    .nullish(),
  healBoost: z.number().nullish(),
  healBoostModifier: z.number().nullish(),
  healBoostModifiers: z.number().nullish(),
  incomingHeal: z.number().nullish(),
  incomingHealModifier: z.number().nullish(),
  incomingHealModifiers: z.number().nullish(),

  minMP: z.number().nullish(),
  minMPModifier: z.number().nullish(),
  minMPModifiers: z
    .union([z.array(z.number()), z.null()])
    .transform((val) => (Array.isArray(val) ? val : null))
    .nullish(),
  maxHP: z.number().nullish(),
  maxHPModifier: z.number().nullish(),
  maxHPModifiers: z
    .union([z.array(z.number()), z.null()])
    .transform((val) => (Array.isArray(val) ? val : null))
    .nullish(),
  minHP: z.number().nullish(),
  minHPModifier: z.number().nullish(),
  minHPModifiers: z
    .union([z.array(z.number()), z.null()])
    .transform((val) => (Array.isArray(val) ? val : null))
    .nullish(),
  maxMP: z.number().nullish(),
  maxMPModifier: z.number().nullish(),
  maxMPModifiers: z
    .union([z.array(z.number()), z.null()])
    .transform((val) => (Array.isArray(val) ? val : null))
    .nullish(),

  criticalHitResist: z.number().nullish(),
  criticalHitResistModifier: z.number().nullish(),
  criticalHit: z.number().nullish(),
  criticalHitModifier: z.number().nullish(),
  statusEffectResist: z.number().nullish(),
  statusEffectResistModifier: z.number().nullish(),
  impactTypeResist: z.number().nullish(),
  impactTypeResistModifier: z.number().nullish(),
  impactTypeChance: z.number().nullish(),
  impactTypeChanceModifier: z.number().nullish(),

  attack: z.number().nullish(),
  attackModifier: z.number().nullish(),
  defense: z.number().nullish(),
  defenseModifier: z.number().nullish(),

  blockDamage: z.number().nullish(),
  blockDamageModifier: z.number().nullish(),
  blockDamageModifiers: z
    .union([z.array(z.number()), z.null()])
    .transform((val) => (Array.isArray(val) ? val : null))
    .nullish(),

  damagePerSecond: z.number().nullish(),
  damagePerSecondModifier: z.number().nullish(),
  damagePerSecondModifiers: z
    .union([z.array(z.number()), z.null()])
    .transform((val) => (Array.isArray(val) ? val : null))
    .nullish(),

  staggerDamage: z.number().nullish(),

  manaCost: z.number().nullish(),
  manaRegen: z.number().nullish(),

  range: z.number().default(20).nullish(),
  area: z.number().default(4).nullish(),

  castingDuration: z.string().default("Instant Cast").nullish(),
  cooldown: z.string().default("Instant Cast").nullish(),

  target: z.string().default("Single Target").nullish(),

  condition: z.array(z.string()).default([]),

  effectCondition: z.string().nullish(),
  chargeLevels: z.string().nullish(),

  baseCost: z.number().default(1),
  baseCostModifier: z.number().default(2),
  maxLevel: z.number().default(20),

  classId: z.number(),
});
export type AbilityTypeBase = z.infer<typeof AbilitySchemaBase>;

// ---------------------------
// ChainSkill Type
// ---------------------------
export type ChainSkillType = {
  id: number;
  parentAbilityId: number;
  chainAbilityId: number;
  condition: string[];
  parentAbility?: AbilityType;
  chainAbility: AbilityType;
};

// ---------------------------
// Ability Type (with relations)
// ---------------------------
export type AbilityType = AbilityTypeBase & {
  class: ClassType;
  spellTag?: SpellTagType[];
  specialtyChoices?: SpecialtyChoiceType[];
  buildAbilities?: BuildAbilityType[];
  chainSkills?: ChainSkillType[];
  parentAbilities?: ChainSkillType[];
};

