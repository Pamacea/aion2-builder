import { AbilityType } from "./ability.type";
import { BuildAbilityType, BuildPassiveType, BuildStigmaType } from "./build.type";
import { PassiveType } from "./passive.type";
import { StigmaType } from "./stigma.type";

export type SelectedSkill = {
    buildAbility?: BuildAbilityType;
    buildPassive?: BuildPassiveType;
    buildStigma?: BuildStigmaType;
    ability?: AbilityType;
    passive?: PassiveType;
    stigma?: StigmaType;
  } | null;
  
 export type SelectedSkillContextType = {
    selectedSkill: SelectedSkill;
    setSelectedSkill: (skill: SelectedSkill) => void;
  };