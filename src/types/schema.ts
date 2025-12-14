// Re-export all types and schemas from separate files
// This ensures backward compatibility - all existing imports from "@/types/schema" continue to work
export * from "./ability.type";
export * from "./build.type";
export * from "./class.type";
export * from "./passive.type";
export * from "./specialty-choice.type";
export * from "./spell-tags.type";
export * from "./stigma.type";
export * from "./tags.type";

import { z } from "zod";
import {
  AbilitySchemaBase,
  type AbilityType,
  type ChainSkillType,
} from "./ability.type";
import {
  BuildSchemaBase,
  type BuildAbilityType,
  type BuildPassiveType,
  type BuildStigmaType,
  type BuildType,
} from "./build.type";
import { ClassSchemaBase, type ClassType } from "./class.type";
import { PassiveSchemaBase, type PassiveType } from "./passive.type";
import {
  SpecialtyChoiceSchemaBase,
  type SpecialtyChoiceType,
} from "./specialty-choice.type";
import { SpellTagSchemaBase, type SpellTagType } from "./spell-tags.type";
import {
  StigmaSchemaBase,
  type ChainSkillStigmaType,
  type StigmaType,
} from "./stigma.type";
import { TagSchemaBase, type TagType } from "./tags.type";

// ================================================================
// Zod Schemas with lazy loading for circular dependencies
// ================================================================

// ---------------------------
// SpellTag Schema
// ---------------------------
export const SpellTagSchema: z.ZodType<SpellTagType> =
  SpellTagSchemaBase.extend({
    abilities: z.lazy(() => z.array(AbilitySchema)).optional(),
    passives: z.lazy(() => z.array(PassiveSchema)).optional(),
    stigmas: z.lazy(() => z.array(StigmaSchema)).optional(),
  }) as z.ZodType<SpellTagType>;

// ---------------------------
// Tag Schema
// ---------------------------
export const TagSchema: z.ZodType<TagType> = TagSchemaBase.extend({
  classes: z.lazy(() => z.array(ClassSchema)).optional(),
}) as z.ZodType<TagType>;

// ---------------------------
// SpecialtyChoice Schema
// ---------------------------
export const SpecialtyChoiceSchema: z.ZodType<SpecialtyChoiceType> =
  SpecialtyChoiceSchemaBase.extend({
    ability: z.lazy(() => AbilitySchema).optional(),
    stigma: z.lazy(() => StigmaSchema).optional(),
  }) as z.ZodType<SpecialtyChoiceType>;

// ---------------------------
// ChainSkill Schema
// ---------------------------
export const ChainSkillSchema: z.ZodType<ChainSkillType> = z.object({
  id: z.number(),
  parentAbilityId: z.number(),
  chainAbilityId: z.number(),
  condition: z.array(z.string()).default([]),
  parentAbility: z.lazy(() => AbilitySchema).optional(),
  chainAbility: z.lazy(() => AbilitySchema),
}) as z.ZodType<ChainSkillType>;

// ---------------------------
// ChainSkillStigma Schema
// ---------------------------
export const ChainSkillStigmaSchema: z.ZodType<ChainSkillStigmaType> = z.object(
  {
    id: z.number(),
    parentStigmaId: z.number(),
    chainStigmaId: z.number(),
    condition: z.array(z.string()).default([]),
    parentStigma: z.lazy(() => StigmaSchema).optional(),
    chainStigma: z.lazy(() => StigmaSchema),
  }
) as z.ZodType<ChainSkillStigmaType>;

// ---------------------------
// BuildAbility Schema
// ---------------------------
export const BuildAbilitySchema: z.ZodType<BuildAbilityType> = z.object({
  id: z.number(),
  buildId: z.number(),
  abilityId: z.number(),
  level: z.number().default(1),
  maxLevel: z.number().default(20),
  activeSpecialtyChoiceIds: z.array(z.number()),
  selectedChainSkillIds: z.array(z.number()).default([]),
  build: z.lazy(() => BuildSchema).optional(),
  ability: z.lazy(() => AbilitySchema),
}) as z.ZodType<BuildAbilityType>;

// ---------------------------
// Ability Schema
// ---------------------------
export const AbilitySchema: z.ZodType<AbilityType> = AbilitySchemaBase.extend({
  class: z.lazy(() => ClassSchema),
  spellTag: z.array(SpellTagSchema).optional(),
  specialtyChoices: z.array(SpecialtyChoiceSchema).optional(),
  buildAbilities: z.lazy(() => z.array(BuildAbilitySchema)).optional(),
  chainSkills: z.array(ChainSkillSchema).optional(),
  parentAbilities: z.array(ChainSkillSchema).optional(),
}) as z.ZodType<AbilityType>;

// ---------------------------
// BuildPassive Schema
// ---------------------------
export const BuildPassiveSchema: z.ZodType<BuildPassiveType> = z.object({
  id: z.number(),
  buildId: z.number(),
  passiveId: z.number(),
  level: z.number().default(1),
  maxLevel: z.number().default(20),
  build: z.lazy(() => BuildSchema).optional(),
  passive: z.lazy(() => PassiveSchema),
}) as z.ZodType<BuildPassiveType>;

// ---------------------------
// Passive Schema
// ---------------------------
export const PassiveSchema: z.ZodType<PassiveType> = PassiveSchemaBase.extend({
  class: z.lazy(() => ClassSchema),
  spellTag: z.array(SpellTagSchema).optional(),
  buildPassives: z.lazy(() => z.array(BuildPassiveSchema)).optional(),
}) as z.ZodType<PassiveType>;

// ---------------------------
// BuildStigma Schema
// ---------------------------
export const BuildStigmaSchema: z.ZodType<BuildStigmaType> = z.object({
  id: z.number(),
  buildId: z.number(),
  stigmaId: z.number(),
  level: z.number().default(1),
  maxLevel: z.number().default(20),
  stigmaCost: z.number().default(10),
  activeSpecialtyChoiceIds: z.array(z.number()).default([]),
  selectedChainSkillIds: z.array(z.number()).default([]),
  build: z.lazy(() => BuildSchema).optional(),
  stigma: z.lazy(() => StigmaSchema),
}) as z.ZodType<BuildStigmaType>;

// ---------------------------
// Stigma Schema
// ---------------------------
export const StigmaSchema: z.ZodType<StigmaType> = StigmaSchemaBase.extend({
  spellTag: z.array(SpellTagSchema).optional(),
  classes: z.array(z.lazy(() => ClassSchema)).optional(),
  buildStigmas: z.lazy(() => z.array(BuildStigmaSchema)).optional(),
  specialtyChoices: z.array(SpecialtyChoiceSchema).optional(),
  chainSkills: z.array(ChainSkillStigmaSchema).optional(),
  parentStigmas: z.array(ChainSkillStigmaSchema).optional(),
}) as z.ZodType<StigmaType>;

// ---------------------------
// Build Schema
// ---------------------------
export const BuildSchema: z.ZodType<BuildType> = BuildSchemaBase.extend({
  class: z.lazy(() => ClassSchema),
  abilities: z.array(BuildAbilitySchema).optional(),
  passives: z.array(BuildPassiveSchema).optional(),
  stigmas: z.array(BuildStigmaSchema).optional(),
}) as z.ZodType<BuildType>;

// ---------------------------
// Class Schema
// ---------------------------
export const ClassSchema: z.ZodType<ClassType> = ClassSchemaBase.extend({
  tags: z.array(TagSchema).default([]),
  abilities: z.array(AbilitySchema).optional(),
  passives: z.array(PassiveSchema).optional(),
  stigmas: z.array(StigmaSchema).optional(),
  builds: z.lazy(() => z.array(BuildSchema)).optional(),
}) as z.ZodType<ClassType>;
