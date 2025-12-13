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
import { SkillManaCost } from "../_client/skill-mana-cost";
import { SkillName } from "../_client/skill-name";
import { SkillRange } from "../_client/skill-range";
import { SkillStaggerDamage } from "../_client/skill-stagger-damage";
import { SkillTarget } from "../_client/skill-target";
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
  // If skill is selected from context but not in build, use the direct ability/passive/stigma
  const targetAbility = buildAbility?.ability || selectedSkill?.ability || ability;
  const targetPassive = buildPassive?.passive || selectedSkill?.passive || passive;
  const targetStigma = buildStigma?.stigma || selectedSkill?.stigma || stigma;

  // If no skill is provided, show empty state
  if (!targetAbility && !targetPassive && !targetStigma) {
    return (
      <div className={`flex items-center justify-center h-full text-muted-foreground ${className}`}>
        <p>Select a skill to view details</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col justify-between px-2 gap-4 h-full ${className}`}>
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
      <SkillDesc
        ability={targetAbility}
        passive={targetPassive}
        stigma={targetStigma}
        buildAbility={buildAbility}
        buildPassive={buildPassive}
        buildStigma={buildStigma}
      />

      {/* Stagger Damage */}
      <SkillStaggerDamage
        ability={targetAbility}
        passive={targetPassive}
        stigma={targetStigma}
      />

      {/* Specialty Choices (only for abilities) */}
      {targetAbility && (
        <AvailableSpeciality
          buildAbility={buildAbility}
          ability={targetAbility}
          currentLevel={buildAbility?.level}
          activeSpecialtyChoiceIds={buildAbility?.activeSpecialtyChoiceIds}
        />
      )}

      {/* Casting Duration, Cooldown, Mana Cost, Range, and Target */}
      <div className="flex flex-col gap-2 pt-4 border-t-2 border-background/40">
        <SkillManaCost ability={targetAbility} stigma={targetStigma} />
        <SkillRange ability={targetAbility} passive={targetPassive} stigma={targetStigma} />
        <SkillTarget ability={targetAbility} passive={targetPassive} stigma={targetStigma} />
        <SkillCastDuration ability={targetAbility} passive={targetPassive} stigma={targetStigma} />
        <SkillCooldown ability={targetAbility} passive={targetPassive} stigma={targetStigma} />
      </div>
    </div>
  );
};

