import { z } from "zod";
import type { AbilityType } from "./ability.type";
import type { ClassType } from "./class.type";
import type { PassiveType } from "./passive.type";
import type { StigmaType } from "./stigma.type";

export type BuildState = {
  build: BuildType | null;
  loading: boolean;
  saving: boolean;
  setBuild: (build: BuildType) => void;
  updateBuild: (partial: Partial<BuildType>) => void;
  setName: (name: string) => void;
  setClassId: (classId: number) => void;
  setClassByName: (className: string) => Promise<void>;
  
  // Ability management
  updateAbilityLevel: (abilityId: number, level: number) => void;
  addAbility: (abilityId: number, level?: number) => void;
  removeAbility: (abilityId: number) => void;
  toggleSpecialtyChoice: (abilityId: number, specialtyChoiceId: number) => void;
  getAbilitiesBySpellTag: (spellTagName: string) => BuildType["abilities"];
  getAvailableAbilities: () => BuildType["class"]["abilities"];
  
  // Passive management
  updatePassiveLevel: (passiveId: number, level: number) => void;
  addPassive: (passiveId: number, level?: number) => void;
  removePassive: (passiveId: number) => void;
  getPassivesBySpellTag: (spellTagName: string) => BuildType["passives"];
  getAvailablePassives: () => BuildType["class"]["passives"];
  
  // Stigma management
  updateStigma: (stigmaId: number, stigmaCost: number) => void;
  updateStigmaLevel: (stigmaId: number, level: number) => void;
  addStigma: (stigmaId: number, level?: number, stigmaCost?: number) => void;
  removeStigma: (stigmaId: number) => void;
  toggleSpecialtyChoiceStigma: (stigmaId: number, specialtyChoiceId: number) => void;
  getStigmasBySpellTag: (spellTagName: string) => BuildType["stigmas"];
  getAvailableStigmas: () => BuildType["class"]["stigmas"];
  
  // Shortcuts management
  updateShortcuts: (shortcuts: BuildType["shortcuts"]) => void;
  
  // Chain Skills management
  updateChainSkill: (skillId: number, chainSkillIds: number[], type: "ability" | "stigma") => void;
  
  loadBuild: (buildId: number) => Promise<void>;
};

// ---------------------------
// Build Schema Base
// ---------------------------
export const BuildSchemaBase = z.object({
  id: z.number(),
  name: z.string(),
  classId: z.number(),
  baseSP: z.number().default(231),
  extraSP: z.number().default(0),
  baseSTP: z.number().default(40),
  extraSTP: z.number().default(0),
  shortcuts: z.record(z.string(), z.object({
    type: z.enum(["ability", "stigma"]),
    abilityId: z.number().optional(),
    stigmaId: z.number().optional(),
    buildAbilityId: z.number().optional(),
    buildStigmaId: z.number().optional(),
  })).nullish(),
});
export type BuildTypeBase = z.infer<typeof BuildSchemaBase>;

// ---------------------------
// BuildAbility Type
// ---------------------------
export type BuildAbilityType = {
  id: number;
  buildId: number;
  abilityId: number;
  level: number;
  maxLevel: number;
  activeSpecialtyChoiceIds: number[];
  selectedChainSkillIds: number[];
  build?: BuildType;
  ability: AbilityType;
};

// ---------------------------
// BuildPassive Type
// ---------------------------
export type BuildPassiveType = {
  id: number;
  buildId: number;
  passiveId: number;
  level: number;
  maxLevel: number;
  build?: BuildType;
  passive: PassiveType;
};

// ---------------------------
// BuildStigma Type
// ---------------------------
export type BuildStigmaType = {
  id: number;
  buildId: number;
  stigmaId: number;
  level: number;
  maxLevel: number;
  stigmaCost: number;
  activeSpecialtyChoiceIds: number[];
  selectedChainSkillIds: number[];
  build?: BuildType;
  stigma: StigmaType;
};

// ---------------------------
// Build Type (with relations)
// ---------------------------
export type BuildType = BuildTypeBase & {
  class: ClassType;
  abilities?: BuildAbilityType[];
  passives?: BuildPassiveType[];
  stigmas?: BuildStigmaType[];
  shortcuts?: Record<string, {
    type: "ability" | "stigma";
    abilityId?: number;
    stigmaId?: number;
    buildAbilityId?: number;
    buildStigmaId?: number;
  }> | null;
};

