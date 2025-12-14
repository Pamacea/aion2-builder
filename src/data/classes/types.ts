// Type definitions for class data structure

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
  condition?: string[];
  damageMin?: number;
  damageMinModifier?: number;
  damageMinModifiers?: number[];
  damageMax?: number;
  damageMaxModifier?: number;
  damageMaxModifiers?: number[];
  staggerDamage?: number;
  manaCost?: number;
  manaRegen?: number;
  range?: number;
  area?: number;
  isNontarget?: boolean;
  isMobile?: boolean;
  castingDuration?: string;
  cooldown?: string;
  target?: string;
  spellTag: string[];
  specialtyChoices?: SpecialtyChoiceData[];
  chainSkills?: string[]; // Names of chain skills
  classId: number;
  baseCost?: number;
  baseCostModifier?: number;
  maxLevel?: number;
}

export interface PassiveData {
  name: string;
  iconUrl: string;
  description: string;
  maxHP?: number;
  maxHPModifier?: number;
  maxMP?: number;
  maxMPModifier?: number;
  isNontarget?: boolean;
  isMobile?: boolean;
  castingDuration?: string;
  cooldown?: string;
  target?: string;
  spellTag: string[];
  classId: number;
  baseCost?: number;
  baseCostModifier?: number;
  maxLevel?: number;
}

export interface StigmaData {
  name: string;
  iconUrl: string;
  description: string;
  condition?: string[];
  damageMin?: number;
  damageMinModifier?: number;
  damageMinModifiers?: number[];
  damageMax?: number;
  damageMaxModifier?: number;
  damageMaxModifiers?: number[];
  staggerDamage?: number;
  manaCost?: number;
  manaRegen?: number;
  range?: number;
  area?: number;
  isNontarget?: boolean;
  isMobile?: boolean;
  castingDuration?: string;
  cooldown?: string;
  target?: string;
  spellTag: string[];
  specialtyChoices?: SpecialtyChoiceData[];
  classId: number;
  baseCost?: number;
  baseCostModifier?: number;
  maxLevel?: number;
  isShared?: boolean;
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

