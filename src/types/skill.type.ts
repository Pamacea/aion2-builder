// =================
// SKILL TYPE

import { AbilityType, ChainSkillType } from "./ability.type";
import {
  BuildAbilityType,
  BuildPassiveType,
  BuildStigmaType,
} from "./build.type";
import { PassiveType } from "./passive.type";
import { ChainSkillStigmaType, StigmaType } from "./stigma.type";

// =================

export type SkillDetailsProps = {
  buildAbility?: BuildAbilityType;
  buildPassive?: BuildPassiveType;
  buildStigma?: BuildStigmaType;
  ability?: AbilityType;
  passive?: PassiveType;
  stigma?: StigmaType;
  className?: string;
};

export type SkillConditionProps = {
  ability?: AbilityType;
  stigma?: StigmaType;
  chainSkill?: ChainSkillType;
  chainSkillStigma?: ChainSkillStigmaType;
  className?: string;
};

export type SkillDescProps = {
  ability?: AbilityType;
  passive?: PassiveType;
  stigma?: StigmaType;
  buildAbility?: BuildAbilityType;
  buildPassive?: BuildPassiveType;
  buildStigma?: BuildStigmaType;
  className?: string;
};