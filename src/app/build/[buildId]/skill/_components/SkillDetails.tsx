"use client";

import { useBuildStore } from "@/store/useBuildEditor";
import {
  AbilityType,
  BuildAbilityType,
  BuildPassiveType,
  BuildStigmaType,
  PassiveType,
  StigmaType,
} from "@/types/schema";
import { AvailableSpeciality } from "../_client/avaible-speciality";
import { AvailableSpecialityStigma } from "../_client/avaible-speciality-stigma.tsx";
import { ChainSkill } from "../_client/chain-skill";
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
  const { build } = useBuildStore();
  
  // Use selected skill from context if available, otherwise use props
  const buildAbility = selectedSkill?.buildAbility || propBuildAbility;
  const buildPassive = selectedSkill?.buildPassive || propBuildPassive;
  const buildStigma = selectedSkill?.buildStigma || propBuildStigma;
  // Determine which skill type we're displaying
  // If skill is selected from context but not in build, use the direct ability/passive/stigma
  const targetAbility = buildAbility?.ability || selectedSkill?.ability || ability;
  const targetPassive = buildPassive?.passive || selectedSkill?.passive || passive;
  const targetStigma = buildStigma?.stigma || selectedSkill?.stigma || stigma;

  // Find the parent skill if the current skill is a chain skill
  // A skill is a chain skill if it appears as chainAbility in parentAbilities of other skills
  let parentAbility: AbilityType | undefined;
  let parentBuildAbility: BuildAbilityType | undefined;
  let parentStigma: StigmaType | undefined;
  let parentBuildStigma: BuildStigmaType | undefined;

  if (targetAbility) {
    // Check if this ability is a chain skill by looking for it in parentAbilities of other abilities
    const allAbilities = build?.class?.abilities || [];
    for (const ab of allAbilities) {
      if (ab.parentAbilities && ab.parentAbilities.length > 0) {
        const isChainSkill = ab.parentAbilities.some(cs => cs.chainAbility.id === targetAbility.id);
        if (isChainSkill) {
          parentAbility = ab;
          // Find the buildAbility for the parent if it exists
          parentBuildAbility = build?.abilities?.find(ba => ba.abilityId === ab.id);
          break;
        }
      }
    }
  } else if (targetStigma) {
    // Same logic for stigmas
    const allStigmas = build?.class?.stigmas || [];
    for (const st of allStigmas) {
      if (st.parentStigmas && st.parentStigmas.length > 0) {
        const isChainSkill = st.parentStigmas.some(cs => cs.chainStigma.id === targetStigma.id);
        if (isChainSkill) {
          parentStigma = st;
          // Find the buildStigma for the parent if it exists
          parentBuildStigma = build?.stigmas?.find(bs => bs.stigmaId === st.id);
          break;
        }
      }
    }
  }

  // Use parent skill for ChainSkill component if current skill is a chain skill, otherwise use current skill
  const chainSkillAbility = parentAbility || targetAbility;
  const chainSkillBuildAbility = parentBuildAbility || buildAbility;
  const chainSkillStigma = parentStigma || targetStigma;
  const chainSkillBuildStigma = parentBuildStigma || buildStigma;

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
        <SkillName ability={targetAbility} passive={targetPassive} stigma={targetStigma} />
        <span className="text-sm font-semibold text-foreground/50">
          {/* If this is a chain skill, use parent's level, otherwise use current skill's level */}
          {(() => {
            // Determine if current skill is a chain skill
            const isChainSkill = (parentAbility || parentStigma) !== undefined;
            // Get the level to display: parent level if chain skill, otherwise current skill level
            const displayLevel = isChainSkill
              ? (parentBuildAbility?.level || parentBuildStigma?.level || 0)
              : (buildAbility?.level || buildPassive?.level || buildStigma?.level || 0);
            const isInBuild = isChainSkill
              ? (parentBuildAbility || parentBuildStigma) !== undefined
              : (buildAbility || buildPassive || buildStigma) !== undefined;
            
            if (!isInBuild) {
              return "Not in build";
            }
            return displayLevel === 0 ? "Locked" : `Lv.${displayLevel}`;
          })()}
        </span>
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

      {/* Specialty Choices (only for stigmas) */}
      {targetStigma && (
        <AvailableSpecialityStigma
          buildStigma={buildStigma}
          stigma={targetStigma}
          currentLevel={buildStigma?.level}
          activeSpecialtyChoiceIds={buildStigma?.activeSpecialtyChoiceIds}
        />
      )}

      {/* Chain Skills (for abilities and stigmas) */}
      {/* Show chain skills if:
          - Current skill has chain skills (parentAbilities/parentStigmas), OR
          - Current skill is a chain skill (we found a parent) */}
      {((targetAbility && ((targetAbility.parentAbilities?.length || 0) > 0 || parentAbility)) || 
        (targetStigma && ((targetStigma.parentStigmas?.length || 0) > 0 || parentStigma))) && (
        <ChainSkill
          buildAbility={chainSkillBuildAbility}
          buildStigma={chainSkillBuildStigma}
          ability={chainSkillAbility}
          stigma={chainSkillStigma}
        />
      )}
      
      {/* Debug: Show chain skills info in development */}
      {process.env.NODE_ENV === 'development' && (targetAbility || targetStigma) && (
        <div className="text-xs text-muted-foreground border-t pt-2">
          <p>Debug - Chain Skills:</p>
          <p>targetAbility: {targetAbility?.name} - parentAbilities: {targetAbility?.parentAbilities?.length || 0}</p>
          <p>targetStigma: {targetStigma?.name} - parentStigmas: {targetStigma?.parentStigmas?.length || 0}</p>
          <p>buildAbility: {buildAbility ? 'present' : 'null'}</p>
          <p>buildAbility?.ability?.parentAbilities: {buildAbility?.ability?.parentAbilities?.length || 0}</p>
          <p>selectedSkill?.ability?.parentAbilities: {selectedSkill?.ability?.parentAbilities?.length || 0}</p>
          <p>ability?.parentAbilities: {ability?.parentAbilities?.length || 0}</p>
          <p>Raw parentAbilities: {JSON.stringify(targetAbility?.parentAbilities?.map(cs => ({ id: cs.id, name: cs.chainAbility?.name })) || [])}</p>
        </div>
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

