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

