
// ==========
// SHORTCUT TYPE

import { AbilityType } from "./ability.type";
import { BuildAbilityType, BuildPassiveType, BuildStigmaType } from "./build.type";
import { PassiveType } from "./passive.type";
import { StigmaType } from "./stigma.type";

// ==========
export type ShortcutSkill = {
    type: "ability" | "passive" | "stigma";
    ability?: AbilityType;
    passive?: PassiveType;
    stigma?: StigmaType;
    buildAbility?: BuildAbilityType;
    buildPassive?: BuildPassiveType;
    buildStigma?: BuildStigmaType;
  };
  
  export type ShortcutContextType = {
    selectedSkill: ShortcutSkill | null;
    setSelectedSkill: (skill: ShortcutSkill | null) => void;
  };