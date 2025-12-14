import { z } from "zod";
import type { BuildPassiveType } from "./build.type";
import type { ClassType } from "./class.type";
import type { SpellTagType } from "./spell-tags.type";

// ---------------------------
// Passive Schema Base
// ---------------------------
export const PassiveSchemaBase = z.object({
  id: z.number(),
  name: z.string(),
  iconUrl: z.string().nullish(),
  description: z.string().nullish(),
  
  maxLevel: z.number().default(10),

  // Stats
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
  damageTolerance: z.number().nullish(),

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
  incomingHeal: z.number().nullish(),
  incomingHealModifier: z.number().nullish(),
  maxHP: z.number().nullish(),
  maxHPModifier: z.number().nullish(),
  maxHPModifiers: z
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
  statusEffectResist: z.number().nullish(),
  statusEffectResistModifier: z.number().nullish(),
  impactTypeResist: z.number().nullish(),
  impactTypeResistModifier: z.number().nullish(),

  attack: z.number().nullish(),
  attackModifier: z.number().nullish(),
  defense: z.number().nullish(),
  defenseModifier: z.number().nullish(),

  staggerDamage: z.number().nullish(),

  manaCost: z.number().nullish(),
  manaRegen: z.number().nullish(),

  range: z.number().default(20).nullish(),
  area: z.number().default(4).nullish(),

  isNontarget: z.boolean().default(false),
  isMobile: z.boolean().default(false),

  castingDuration: z.string().default("Instant Cast").nullish(),
  cooldown: z.string().default("Instant Cast").nullish(),

  target: z.string().default("Single Target").nullish(),

  baseCost: z.number().default(1),
  baseCostModifier: z.number().default(2),

  classId: z.number(),
});
export type PassiveTypeBase = z.infer<typeof PassiveSchemaBase>;

// ---------------------------
// Passive Type (with relations)
// ---------------------------
export type PassiveType = PassiveTypeBase & {
  class: ClassType;
  spellTag?: SpellTagType[];
  buildPassives?: BuildPassiveType[];
};

