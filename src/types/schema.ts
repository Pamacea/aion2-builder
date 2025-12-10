import { z, ZodType } from "zod";

// ================================================================
// I. Modèles de Base (Forward Declarations for Circular Dependencies)
// ================================================================

// Declare the base Zod types before their complex definitions
export const ClassSchemaBase = z.object({
  id: z.number(),
  name: z.string(),
  iconUrl: z.string().optional(),
  description: z.string().optional(),
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
// III. Définitions Complètes (Including all z.lazy() extensions)
// ================================================================

// ---------------------------
// Tag (references Class)
// ---------------------------
export const TagSchema: ZodType = TagSchemaBase.extend({
  // FIX: Ensure ClassSchema is imported via lazy
  classes: z.lazy(() => z.array(ClassSchema)).optional(),
});
export type TagType = z.infer<typeof TagSchema>;

// ---------------------------
// SpecialtyChoice (references Ability)
// ---------------------------
export const SpecialtyChoiceSchema: ZodType = z.object({
  id: z.number(),
  description: z.string(),
  unlockLevel: z.number(),
  abilityId: z.number(),
}).extend({
  // FIX: Ensure AbilitySchema is imported via lazy
  ability: z.lazy(() => AbilitySchema),
});
export type SpecialtyChoiceType = z.infer<typeof SpecialtyChoiceSchema>;

// ---------------------------
// BuildAbility (references Build and Ability)
// ---------------------------
export const BuildAbilitySchema: ZodType = z.object({
  id: z.number(),
  buildId: z.number(),
  abilityId: z.number(),
  level: z.number().default(1),
  activeSpecialtyChoiceIds: z.array(z.number()),
}).extend({
  // FIX: Ensure BuildSchema is imported via lazy
  build: z.lazy(() => BuildSchema),
  // FIX: Ensure AbilitySchema is imported via lazy
  ability: z.lazy(() => AbilitySchema),
});
export type BuildAbilityType = z.infer<typeof BuildAbilitySchema>;

// ---------------------------
// Ability (references SpecialtyChoice and BuildAbility)
// ---------------------------
export const AbilitySchema: ZodType = AbilitySchemaBase.extend({
  specialtyChoices: z.array(SpecialtyChoiceSchema).optional(),
  // FIX: Ensure BuildAbilitySchema is imported via lazy
  buildAbilities: z.lazy(() => z.array(BuildAbilitySchema)).optional(),
});
export type AbilityType = z.infer<typeof AbilitySchema>;

// ---------------------------
// BuildPassive (references Build and Passive)
// ---------------------------
export const BuildPassiveSchema: ZodType = z.object({
  id: z.number(),
  buildId: z.number(),
  passiveId: z.number(),
  level: z.number().default(1),
}).extend({
  // FIX: Ensure BuildSchema is imported via lazy
  build: z.lazy(() => BuildSchema),
  // FIX: Ensure PassiveSchema is imported via lazy
  passive: z.lazy(() => PassiveSchema),
});
export type BuildPassiveType = z.infer<typeof BuildPassiveSchema>;

// ---------------------------
// Passive (references BuildPassive)
// ---------------------------
export const PassiveSchema: ZodType = z.object({
  id: z.number(),
  name: z.string(),
  iconUrl: z.string().optional(),
  description: z.string().optional(),
  maxLevel: z.number().default(10),
  classId: z.number(),
}).extend({
  // FIX: Ensure BuildPassiveSchema is imported via lazy
  buildPassives: z.lazy(() => z.array(BuildPassiveSchema)).optional(),
});
export type PassiveType = z.infer<typeof PassiveSchema>;

// ---------------------------
// BuildStigma (references Build and Stigma)
// ---------------------------
export const BuildStigmaSchema: ZodType = z.object({
  id: z.number(),
  buildId: z.number(),
  stigmaId: z.number(),
  stigmaCost: z.number().default(10),
}).extend({
  // FIX: Ensure BuildSchema is imported via lazy
  build: z.lazy(() => BuildSchema),
  // FIX: Ensure StigmaSchema is imported via lazy
  stigma: z.lazy(() => StigmaSchema),
});
export type BuildStigmaType = z.infer<typeof BuildStigmaSchema>;


// ---------------------------
// Stigma (references Class and BuildStigma)
// ---------------------------
export const StigmaSchema: ZodType = z.object({
  id: z.number(),
  name: z.string(),
  iconUrl: z.string().optional(),
  description: z.string().optional(),
  isShared: z.boolean().default(false),
  baseCost: z.number().default(10),
}).extend({
  // FIX: Ensure ClassSchema is imported via lazy
  classes: z.array(z.lazy(() => ClassSchema)).optional(),
  // FIX: Ensure BuildStigmaSchema is imported via lazy
  buildStigmas: z.lazy(() => z.array(BuildStigmaSchema)).optional(),
});
export type StigmaType = z.infer<typeof StigmaSchema>;


// ---------------------------
// Build (references Class, BuildAbility, BuildPassive, BuildStigma)
// ---------------------------
export const BuildSchema: ZodType = BuildSchemaBase.extend({
  // FIX: Ensure ClassSchema is imported via lazy
  class: z.lazy(() => ClassSchema),
  abilities: z.array(BuildAbilitySchema).optional(),
  passives: z.array(BuildPassiveSchema).optional(),
  stigmas: z.array(BuildStigmaSchema).optional(),
});
export type BuildType = z.infer<typeof BuildSchema>;

// ---------------------------
// Class (references Tag, Ability, Passive, Stigma, Build)
// ---------------------------
export const ClassSchema = ClassSchemaBase.extend({
  tags: z.array(TagSchema).optional(),
  abilities: z.array(AbilitySchema).optional(),
  passives: z.array(PassiveSchema).optional(),
  stigmas: z.array(StigmaSchema).optional(),
  // FIX: Ensure BuildSchema is imported via lazy
  builds: z.lazy(() => z.array(BuildSchema)).optional(),
});
export type ClassType = z.infer<typeof ClassSchema>;

