import { z } from "zod";
import type { BuildStigmaType } from "./build.type";
import type { ClassType } from "./class.type";
import type { SpecialtyChoiceType } from "./specialty-choice.type";
import type { SpellTagType } from "./spell-tags.type";

// ---------------------------
// Stigma Schema Base
// ---------------------------
export const StigmaSchemaBase = z.object({
  id: z.number(),
  name: z.string(),
  iconUrl: z.string().nullish(),
  maxLevel: z.number().default(20),
  description: z.string().nullish(),

  // Stats et Coûts
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

  condition: z.array(z.string()).default([]),

  isShared: z.boolean().default(false),
  baseCost: z.number().default(10),
  baseCostModifier: z.number().default(2),
});
export type StigmaTypeBase = z.infer<typeof StigmaSchemaBase>;

// ---------------------------
// ChainSkillStigma Type
// ---------------------------
export type ChainSkillStigmaType = {
  id: number;
  parentStigmaId: number;
  chainStigmaId: number;
  condition: string[];
  parentStigma?: StigmaType;
  chainStigma: StigmaType;
};

// ---------------------------
// Stigma Type (with relations)
// ---------------------------
export type StigmaType = StigmaTypeBase & {
  spellTag?: SpellTagType[];
  classes?: ClassType[];
  buildStigmas?: BuildStigmaType[];
  specialtyChoices?: SpecialtyChoiceType[];
  chainSkills?: ChainSkillStigmaType[];
  parentStigmas?: ChainSkillStigmaType[];
};

