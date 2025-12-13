"use client";

import {
  AbilityType,
  BuildAbilityType,
  BuildPassiveType,
  BuildStigmaType,
  PassiveType,
  StigmaType,
} from "@/types/schema";
import { SkillTag } from "../_client/skil-tag";
import { SkillCastDuration } from "../_client/skill-cast-duration";
import { SkillCooldown } from "../_client/skill-cooldown";
import { SkillDesc } from "../_client/skill-desc";
import { SkillName } from "../_client/skill-name";
import { useSelectedSkill } from "../_context/SelectedSkillContext";
import { AvailableSpeciality } from "./AvaibleSpeciality";

type SkillDetailsProps = {
  buildAbility?: BuildAbilityType;
  buildPassive?: BuildPassiveType;
  buildStigma?: BuildStigmaType;
  ability?: AbilityType;
  passive?: PassiveType;
  stigma?: StigmaType;
  className?: string;
};

export const SkillDetails = ({
  buildAbility: propBuildAbility,
  buildPassive: propBuildPassive,
  buildStigma: propBuildStigma,
  ability,
  passive,
  stigma,
  className = "",
}: SkillDetailsProps) => {
  const { selectedSkill } = useSelectedSkill();
  
  // Use selected skill from context if available, otherwise use props
  const buildAbility = selectedSkill?.buildAbility || propBuildAbility;
  const buildPassive = selectedSkill?.buildPassive || propBuildPassive;
  const buildStigma = selectedSkill?.buildStigma || propBuildStigma;
  // Determine which skill type we're displaying
  const targetAbility = buildAbility?.ability || ability;
  const targetPassive = buildPassive?.passive || passive;
  const targetStigma = buildStigma?.stigma || stigma;

  // If no skill is provided, show empty state
  if (!targetAbility && !targetPassive && !targetStigma) {
    return (
      <div className={`flex items-center justify-center h-full text-muted-foreground ${className}`}>
        <p>Select a skill to view details</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col px-2 gap-4 h-full ${className}`}>
      {/* Skill Name with Level */}
      <div className="flex items-baseline gap-2">
        <SkillName ability={targetAbility} passive={targetPassive} />
        {(buildAbility || buildPassive || buildStigma) && (
          <span className="text-sm font-semibold text-foreground/50">
            Lv.{(buildAbility?.level || buildPassive?.level || buildStigma?.level || 0)}
          </span>
        )}
      </div>

      {/* Spell Tags */}
      <SkillTag ability={targetAbility} passive={targetPassive} stigma={targetStigma} />

      {/* Description */}
      <SkillDesc ability={targetAbility} passive={targetPassive} stigma={targetStigma} />

      {/* Specialty Choices (only for abilities) */}
      {targetAbility && (
        <AvailableSpeciality
          buildAbility={buildAbility}
          ability={targetAbility}
          currentLevel={buildAbility?.level}
          activeSpecialtyChoiceIds={buildAbility?.activeSpecialtyChoiceIds}
        />
      )}

      {/* Casting Duration and Cooldown */}
      <div className="flex flex-col gap-2 pt-4 border-t-2 border-background/40">
        <SkillCastDuration ability={targetAbility} passive={targetPassive} stigma={targetStigma} />
        <SkillCooldown ability={targetAbility} passive={targetPassive} stigma={targetStigma} />
      </div>
    </div>
  );
};

