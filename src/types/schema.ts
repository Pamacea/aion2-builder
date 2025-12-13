import { z } from "zod";

// ================================================================
// I. Modèles de Base (Forward Declarations for Circular Dependencies)
// ================================================================

// ---------------------------
// 1. SpellTag
// ---------------------------
export const SpellTagSchemaBase = z.object({
  id: z.number(),
  name: z.string(),
});
export type SpellTagTypeBase = z.infer<typeof SpellTagSchemaBase>;

// ---------------------------
// 2. Class
// ---------------------------
export const ClassSchemaBase = z.object({
  id: z.number(),
  name: z.string(),
  iconUrl: z.string().nullable(),
  bannerUrl: z.string().nullable(),
  characterUrl: z.string().nullable(),
  description: z.string().nullable(),
});
export type ClassTypeBase = z.infer<typeof ClassSchemaBase>;

// ---------------------------
// 3. Tag (Catégories de Classes)
// ---------------------------
export const TagSchemaBase = z.object({
  id: z.number(),
  name: z.string(),
});
export type TagTypeBase = z.infer<typeof TagSchemaBase>;

// ---------------------------
// 4. Ability (Sorts)
// Les champs 'optional()' et 'default()' sont basés sur le schéma Prisma.
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
    .nullish(), // Tableau de modifiers par niveau (JSON de Prisma)
  damageMax: z.number().nullish(),
  damageMaxModifier: z.number().nullish(),
  damageMaxModifiers: z
    .union([z.array(z.number()), z.null()])
    .transform((val) => (Array.isArray(val) ? val : null))
    .nullish(), // Tableau de modifiers par niveau (JSON de Prisma)
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

  classId: z.number(),
});
export type AbilityTypeBase = z.infer<typeof AbilitySchemaBase>;

// ---------------------------
// 5. SpecialtyChoice
// ---------------------------
export const SpecialtyChoiceSchemaBase = z.object({
  id: z.number(),
  description: z.string(),
  unlockLevel: z.number(),
  abilityId: z.number(),
});
export type SpecialtyChoiceTypeBase = z.infer<typeof SpecialtyChoiceSchemaBase>;

// ---------------------------
// 6. Passive
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
    .nullish(), // Tableau de modifiers par niveau (JSON de Prisma)
  damageMax: z.number().nullish(),
  damageMaxModifier: z.number().nullish(),
  damageMaxModifiers: z
    .union([z.array(z.number()), z.null()])
    .transform((val) => (Array.isArray(val) ? val : null))
    .nullish(), // Tableau de modifiers par niveau (JSON de Prisma)
  damageBoost: z.number().nullish(),
  damageTolerance: z.number().nullish(),

  healMin: z.number().nullish(),
  healMinModifier: z.number().nullish(),
  healMinModifiers: z
    .union([z.array(z.number()), z.null()])
    .transform((val) => (Array.isArray(val) ? val : null))
    .nullish(), // Tableau de modifiers par niveau (JSON de Prisma)
  healMax: z.number().nullish(),
  healMaxModifier: z.number().nullish(),
  healMaxModifiers: z
    .union([z.array(z.number()), z.null()])
    .transform((val) => (Array.isArray(val) ? val : null))
    .nullish(), // Tableau de modifiers par niveau (JSON de Prisma)
  healBoost: z.number().nullish(),
  healBoostModifier: z.number().nullish(),
  incomingHeal: z.number().nullish(),
  incomingHealModifier: z.number().nullish(),
  maxHP: z.number().nullish(),
  maxHPModifier: z.number().nullish(),
  maxHPModifiers: z
    .union([z.array(z.number()), z.null()])
    .transform((val) => (Array.isArray(val) ? val : null))
    .nullish(), // Tableau de modifiers par niveau (JSON de Prisma)
  maxMP: z.number().nullish(),
  maxMPModifier: z.number().nullish(),
  maxMPModifiers: z
    .union([z.array(z.number()), z.null()])
    .transform((val) => (Array.isArray(val) ? val : null))
    .nullish(), // Tableau de modifiers par niveau (JSON de Prisma)

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

  classId: z.number(),
});
export type PassiveTypeBase = z.infer<typeof PassiveSchemaBase>;

// ---------------------------
// 7. Stigma
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
    .nullish(), // Tableau de modifiers par niveau (JSON de Prisma)
  damageMax: z.number().nullish(),
  damageMaxModifier: z.number().nullish(),
  damageMaxModifiers: z
    .union([z.array(z.number()), z.null()])
    .transform((val) => (Array.isArray(val) ? val : null))
    .nullish(), // Tableau de modifiers par niveau (JSON de Prisma)

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

  isShared: z.boolean().default(false),
  baseCost: z.number().default(10),
});
export type StigmaTypeBase = z.infer<typeof StigmaSchemaBase>;

// ---------------------------
// 8. Build
// ---------------------------
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
// II. Forward type declarations for circular references
// ================================================================

export type SpellTagType = SpellTagTypeBase & {
  abilities?: AbilityType[];
  passives?: PassiveType[];
  stigmas?: StigmaType[];
};

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
  class: ClassType;
  spellTag?: SpellTagType[];
  specialtyChoices?: SpecialtyChoiceType[];
  buildAbilities?: BuildAbilityType[];
};

export type SpecialtyChoiceType = SpecialtyChoiceTypeBase & {
  ability?: AbilityType;
};

export type PassiveType = PassiveTypeBase & {
  class: ClassType;
  spellTag?: SpellTagType[];
  buildPassives?: BuildPassiveType[];
};

export type StigmaType = StigmaTypeBase & {
  spellTag?: SpellTagType[];
  classes?: ClassType[];
  buildStigmas?: BuildStigmaType[];
};

export type BuildAbilityType = {
  id: number;
  buildId: number;
  abilityId: number;
  level: number;
  maxLevel: number;
  activeSpecialtyChoiceIds: number[];
  build?: BuildType;
  ability: AbilityType;
};

export type BuildPassiveType = {
  id: number;
  buildId: number;
  passiveId: number;
  level: number;
  maxLevel: number;
  build?: BuildType;
  passive: PassiveType;
};

export type BuildStigmaType = {
  id: number;
  buildId: number;
  stigmaId: number;
  level: number;
  maxLevel: number;
  stigmaCost: number;
  build?: BuildType;
  stigma: StigmaType;
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
// SpellTag (references Ability, Passive, Stigma)
// ---------------------------
export const SpellTagSchema: z.ZodType<SpellTagType> = SpellTagSchemaBase.extend({
  abilities: z.lazy(() => z.array(AbilitySchema)).optional(),
  passives: z.lazy(() => z.array(PassiveSchema)).optional(),
  stigmas: z.lazy(() => z.array(StigmaSchema)).optional(),
}) as z.ZodType<SpellTagType>;

// ---------------------------
// Tag (references Class)
// ---------------------------
export const TagSchema: z.ZodType<TagType> = TagSchemaBase.extend({
  classes: z.lazy(() => z.array(ClassSchema)).optional(),
}) as z.ZodType<TagType>;

// ---------------------------
// SpecialtyChoice (references Ability)
// ---------------------------
export const SpecialtyChoiceSchema: z.ZodType<SpecialtyChoiceType> = SpecialtyChoiceSchemaBase.extend({
  ability: z.lazy(() => AbilitySchema).optional(),
}) as z.ZodType<SpecialtyChoiceType>;

// ---------------------------
// BuildAbility (references Build and Ability)
// ---------------------------
export const BuildAbilitySchema: z.ZodType<BuildAbilityType> = z.object({
  id: z.number(),
  buildId: z.number(),
  abilityId: z.number(),
  level: z.number().default(1),
  maxLevel: z.number().default(20), // Ajouté: Correspond au schéma Prisma
  activeSpecialtyChoiceIds: z.array(z.number()),
  build: z.lazy(() => BuildSchema).optional(),
  ability: z.lazy(() => AbilitySchema),
}) as z.ZodType<BuildAbilityType>;

// ---------------------------
// Ability (references SpecialtyChoice, BuildAbility, SpellTag, Class)
// ---------------------------
export const AbilitySchema: z.ZodType<AbilityType> = AbilitySchemaBase.extend({
  class: z.lazy(() => ClassSchema),
  spellTag: z.array(SpellTagSchema).optional(), // Ajouté
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
  maxLevel: z.number().default(20), // Ajouté: Correspond au schéma Prisma
  build: z.lazy(() => BuildSchema).optional(),
  passive: z.lazy(() => PassiveSchema),
}) as z.ZodType<BuildPassiveType>;

// ---------------------------
// Passive (references BuildPassive, SpellTag, Class)
// ---------------------------
export const PassiveSchema: z.ZodType<PassiveType> = PassiveSchemaBase.extend({
  class: z.lazy(() => ClassSchema),
  spellTag: z.array(SpellTagSchema).optional(), // Ajouté
  buildPassives: z.lazy(() => z.array(BuildPassiveSchema)).optional(),
}) as z.ZodType<PassiveType>;

// ---------------------------
// BuildStigma (references Build and Stigma)
// ---------------------------
export const BuildStigmaSchema: z.ZodType<BuildStigmaType> = z.object({
  id: z.number(),
  buildId: z.number(),
  stigmaId: z.number(),
  level: z.number().default(1),
  maxLevel: z.number().default(20), // Ajouté: Correspond au schéma Prisma
  stigmaCost: z.number().default(10),
  build: z.lazy(() => BuildSchema).optional(),
  stigma: z.lazy(() => StigmaSchema),
}) as z.ZodType<BuildStigmaType>;

// ---------------------------
// Stigma (references Class, BuildStigma, SpellTag)
// ---------------------------
export const StigmaSchema: z.ZodType<StigmaType> = StigmaSchemaBase.extend({
  spellTag: z.array(SpellTagSchema).optional(), // Ajouté
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