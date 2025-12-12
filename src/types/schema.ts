import { z } from "zod";

// ================================================================
// I. Modèles de Base (Forward Declarations for Circular Dependencies)
// ================================================================

// Declare the base Zod types before their complex definitions
export const ClassSchemaBase = z.object({
  id: z.number(),
  name: z.string(),
  iconUrl: z.string().nullable(),
  bannerUrl: z.string().nullable(),
  characterUrl: z.string().nullable(),
  description: z.string().nullable(),
});
export type ClassTypeBase = z.infer<typeof ClassSchemaBase>;

export const TagSchemaBase = z.object({
  id: z.number(),
  name: z.string(),
});
export type TagTypeBase = z.infer<typeof TagSchemaBase>;

export const AbilitySchemaBase = z.object({
  id: z.number(),
  name: z.string(),
  iconUrl: z.string().optional(),
  description: z.string().optional(),
  damageMin: z.number().optional(),
  damageMax: z.number().optional(),
  targetRange: z.number().optional(),
  effect: z.string().optional(),
  type: z.string().default("Physical"),
  category: z.string().default("Attack"),
  isNontarget: z.boolean().default(false),
  isMobile: z.boolean().default(false),
  castingDuration: z.string().default("Instant Cast"),
  cooldown: z.string().default("Instant Cast"),
  maxLevel: z.number().default(20),
  classId: z.number(),
});
export type AbilityTypeBase = z.infer<typeof AbilitySchemaBase>;


// ================================================================
// II. Modèles du Builder (Forward Declarations)
// ================================================================

export const BuildSchemaBase = z.object({
  id: z.number(),
  name: z.string(),
  classId: z.number(),
  baseSP: z.number().default(231),
  extraSP: z.number().default(0),
  baseSTP: z.number().default(40),
  extraSTP: z.number().default(0),
});
export type BuildTypeBase = z.infer<typeof BuildSchemaBase>;

// ================================================================
// Forward type declarations for circular references
// ================================================================
export type ClassType = ClassTypeBase & {
  tags?: TagType[];
  abilities?: AbilityType[];
  passives?: PassiveType[];
  stigmas?: StigmaType[];
  builds?: BuildType[];
};

export type TagType = TagTypeBase & {
  classes?: ClassType[];
};

export type AbilityType = AbilityTypeBase & {
  specialtyChoices?: SpecialtyChoiceType[];
  buildAbilities?: BuildAbilityType[];
};

export type SpecialtyChoiceType = {
  id: number;
  description: string;
  unlockLevel: number;
  abilityId: number;
  ability: AbilityType;
};

export type BuildAbilityType = {
  id: number;
  buildId: number;
  abilityId: number;
  level: number;
  activeSpecialtyChoiceIds: number[];
  build: BuildType;
  ability: AbilityType;
};

export type BuildPassiveType = {
  id: number;
  buildId: number;
  passiveId: number;
  level: number;
  build: BuildType;
  passive: PassiveType;
};

export type PassiveType = {
  id: number;
  name: string;
  iconUrl?: string;
  description?: string;
  maxLevel: number;
  classId: number;
  buildPassives?: BuildPassiveType[];
};

export type BuildStigmaType = {
  id: number;
  buildId: number;
  stigmaId: number;
  stigmaCost: number;
  build: BuildType;
  stigma: StigmaType;
};

export type StigmaType = {
  id: number;
  name: string;
  iconUrl?: string;
  description?: string;
  level: number;
  isShared: boolean;
  baseCost: number;
  classes?: ClassType[];
  buildStigmas?: BuildStigmaType[];
};

export type BuildType = BuildTypeBase & {
  class: ClassType;
  abilities?: BuildAbilityType[];
  passives?: BuildPassiveType[];
  stigmas?: BuildStigmaType[];
};


// ================================================================
// III. Définitions Complètes (Including all z.lazy() extensions)
// ================================================================

// ---------------------------
// Tag (references Class)
// ---------------------------
export const TagSchema: z.ZodType<TagType> = TagSchemaBase.extend({
  classes: z.lazy(() => z.array(ClassSchema)).optional(),
}) as z.ZodType<TagType>;

// ---------------------------
// SpecialtyChoice (references Ability)
// ---------------------------
export const SpecialtyChoiceSchema: z.ZodType<SpecialtyChoiceType> = z.object({
  id: z.number(),
  description: z.string(),
  unlockLevel: z.number(),
  abilityId: z.number(),
  ability: z.lazy(() => AbilitySchema),
}) as z.ZodType<SpecialtyChoiceType>;

// ---------------------------
// BuildAbility (references Build and Ability)
// ---------------------------
export const BuildAbilitySchema: z.ZodType<BuildAbilityType> = z.object({
  id: z.number(),
  buildId: z.number(),
  abilityId: z.number(),
  level: z.number().default(1),
  activeSpecialtyChoiceIds: z.array(z.number()),
  build: z.lazy(() => BuildSchema),
  ability: z.lazy(() => AbilitySchema),
}) as z.ZodType<BuildAbilityType>;

// ---------------------------
// Ability (references SpecialtyChoice and BuildAbility)
// ---------------------------
export const AbilitySchema: z.ZodType<AbilityType> = AbilitySchemaBase.extend({
  specialtyChoices: z.array(SpecialtyChoiceSchema).optional(),
  buildAbilities: z.lazy(() => z.array(BuildAbilitySchema)).optional(),
}) as z.ZodType<AbilityType>;

// ---------------------------
// BuildPassive (references Build and Passive)
// ---------------------------
export const BuildPassiveSchema: z.ZodType<BuildPassiveType> = z.object({
  id: z.number(),
  buildId: z.number(),
  passiveId: z.number(),
  level: z.number().default(1),
  build: z.lazy(() => BuildSchema),
  passive: z.lazy(() => PassiveSchema),
}) as z.ZodType<BuildPassiveType>;

// ---------------------------
// Passive (references BuildPassive)
// ---------------------------
export const PassiveSchema: z.ZodType<PassiveType> = z.object({
  id: z.number(),
  name: z.string(),
  iconUrl: z.string().optional(),
  description: z.string().optional(),
  maxLevel: z.number().default(10),
  classId: z.number(),
  buildPassives: z.lazy(() => z.array(BuildPassiveSchema)).optional(),
}) as z.ZodType<PassiveType>;

// ---------------------------
// BuildStigma (references Build and Stigma)
// ---------------------------
export const BuildStigmaSchema: z.ZodType<BuildStigmaType> = z.object({
  id: z.number(),
  buildId: z.number(),
  stigmaId: z.number(),
  stigmaCost: z.number().default(10),
  build: z.lazy(() => BuildSchema),
  stigma: z.lazy(() => StigmaSchema),
}) as z.ZodType<BuildStigmaType>;

// ---------------------------
// Stigma (references Class and BuildStigma)
// ---------------------------
export const StigmaSchema: z.ZodType<StigmaType> = z.object({
  id: z.number(),
  name: z.string(),
  iconUrl: z.string().optional(),
  description: z.string().optional(),
  level: z.number().default(1),
  isShared: z.boolean().default(false),
  baseCost: z.number().default(10),
  classes: z.array(z.lazy(() => ClassSchema)).optional(),
  buildStigmas: z.lazy(() => z.array(BuildStigmaSchema)).optional(),
}) as z.ZodType<StigmaType>;

// ---------------------------
// Build (references Class, BuildAbility, BuildPassive, BuildStigma)
// ---------------------------
export const BuildSchema: z.ZodType<BuildType> = BuildSchemaBase.extend({
  class: z.lazy(() => ClassSchema),
  abilities: z.array(BuildAbilitySchema).optional(),
  passives: z.array(BuildPassiveSchema).optional(),
  stigmas: z.array(BuildStigmaSchema).optional(),
}) as z.ZodType<BuildType>;

// ---------------------------
// Class (references Tag, Ability, Passive, Stigma, Build)
// ---------------------------
export const ClassSchema: z.ZodType<ClassType> = ClassSchemaBase.extend({
  tags: z.array(TagSchema).default([]),
  abilities: z.array(AbilitySchema).optional(),
  passives: z.array(PassiveSchema).optional(),
  stigmas: z.array(StigmaSchema).optional(),
  builds: z.lazy(() => z.array(BuildSchema)).optional(),
}) as z.ZodType<ClassType>;