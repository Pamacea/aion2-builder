"use client";

import { useDaevanionStore } from "@/app/build/[buildId]/sphere/_store/useDaevanionStore";
import { useBuildStore } from "@/store/useBuildEditor";
import {
  AbilityType,
  BuildAbilityType,
  BuildStigmaType,
  ChainSkillStigmaType,
  ChainSkillType,
  StigmaType,
} from "@/types/schema";
import { SkillDetailsProps } from "@/types/skill.type";
import { useEffect, useMemo, useState } from "react";
import { AvailableSpeciality } from "../_client/avaible-speciality";
import { AvailableSpecialityStigma } from "../_client/avaible-speciality-stigma.tsx";
import { ChainSkill } from "../_client/chain-skill";
import { SkillTag } from "../_client/skil-tag";
import { SkillCastDuration } from "../_client/skill-cast-duration";
import { SkillCondition } from "../_client/skill-condition";
import { SkillCooldown } from "../_client/skill-cooldown";
import { SkillDesc } from "../_client/skill-desc";
import { SkillManaCost } from "../_client/skill-mana-cost";
import { SkillName } from "../_client/skill-name";
import { SkillRange } from "../_client/skill-range";
import { SkillStaggerDamage } from "../_client/skill-stagger-damage";
import { SkillTarget } from "../_client/skill-target";
import { useSelectedSkill } from "../_context/SelectedSkillContext";

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
  const { getDaevanionBoostForSkill } = useDaevanionStore();
  // Sélecteurs individuels pour chaque chemin pour détecter les changements
  const nezekan = useDaevanionStore((state) => state.daevanionBuild.nezekan);
  const zikel = useDaevanionStore((state) => state.daevanionBuild.zikel);
  const vaizel = useDaevanionStore((state) => state.daevanionBuild.vaizel);
  const triniel = useDaevanionStore((state) => state.daevanionBuild.triniel);
  const ariel = useDaevanionStore((state) => state.daevanionBuild.ariel);
  const azphel = useDaevanionStore((state) => state.daevanionBuild.azphel);
  // Créer une dépendance stable basée sur le contenu
  const daevanionBuildKey = useMemo(() => 
    JSON.stringify({ nezekan, zikel, vaizel, triniel, ariel, azphel }),
    [nezekan, zikel, vaizel, triniel, ariel, azphel]
  );
  const [daevanionBoost, setDaevanionBoost] = useState(0);
  
  // Use selected skill from context if available, otherwise use props
  // Mais toujours synchroniser avec le build actuel pour garantir que le niveau est à jour
  // On lit directement depuis le build pour garantir que le niveau est toujours à jour
  const skillFromContext = selectedSkill?.buildAbility || propBuildAbility;
  const buildAbility = skillFromContext && build
    ? build.abilities?.find((a) => a.abilityId === skillFromContext.abilityId) || skillFromContext
    : skillFromContext;
  
  const passiveFromContext = selectedSkill?.buildPassive || propBuildPassive;
  const buildPassive = passiveFromContext && build
    ? build.passives?.find((p) => p.passiveId === passiveFromContext.passiveId) || passiveFromContext
    : passiveFromContext;
  
  const stigmaFromContext = selectedSkill?.buildStigma || propBuildStigma;
  const buildStigma = stigmaFromContext && build
    ? build.stigmas?.find((s) => s.stigmaId === stigmaFromContext.stigmaId) || stigmaFromContext
    : stigmaFromContext;
  // Determine which skill type we're displaying
  // If skill is selected from context but not in build, use the direct ability/passive/stigma
  const targetAbility =
    buildAbility?.ability || selectedSkill?.ability || ability;
  const targetPassive =
    buildPassive?.passive || selectedSkill?.passive || passive;
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
        const isChainSkill = ab.parentAbilities.some(
          (cs) => cs.chainAbility.id === targetAbility.id
        );
        if (isChainSkill) {
          parentAbility = ab;
          // Find the buildAbility for the parent if it exists
          parentBuildAbility = build?.abilities?.find(
            (ba) => ba.abilityId === ab.id
          );
          break;
        }
      }
    }
  } else if (targetStigma) {
    // Same logic for stigmas
    const allStigmas = build?.class?.stigmas || [];
    for (const st of allStigmas) {
      if (st.parentStigmas && st.parentStigmas.length > 0) {
        const isChainSkill = st.parentStigmas.some(
          (cs) => cs.chainStigma.id === targetStigma.id
        );
        if (isChainSkill) {
          parentStigma = st;
          // Find the buildStigma for the parent if it exists
          parentBuildStigma = build?.stigmas?.find(
            (bs) => bs.stigmaId === st.id
          );
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

  // Find the ChainSkill or ChainSkillStigma object if current skill is a chain skill
  let chainSkillData: ChainSkillType | undefined;
  let chainSkillStigmaData: ChainSkillStigmaType | undefined;

  if (targetAbility && parentAbility) {
    // Current skill is a chain skill, find the ChainSkill object
    const chainSkill = parentAbility.parentAbilities?.find(
      (cs) => cs.chainAbility.id === targetAbility.id
    );
    if (chainSkill) {
      chainSkillData = chainSkill;
    }
  } else if (targetStigma && parentStigma) {
    // Current skill is a chain skill stigma, find the ChainSkillStigma object
    const chainSkill = parentStigma.parentStigmas?.find(
      (cs) => cs.chainStigma.id === targetStigma.id
    );
    if (chainSkill) {
      chainSkillStigmaData = chainSkill;
    }
  }

  // Calculer le boost Daevanion pour le skill affiché
  // Recalculer quand daevanionBuild change pour mettre à jour les niveaux après l'initialisation
  useEffect(() => {
    let cancelled = false;
    const fetchBoost = async () => {
      if (buildAbility) {
        const boost = await getDaevanionBoostForSkill(buildAbility.abilityId, "ability");
        if (!cancelled) setDaevanionBoost(boost);
      } else if (buildPassive) {
        const boost = await getDaevanionBoostForSkill(buildPassive.passiveId, "passive");
        if (!cancelled) setDaevanionBoost(boost);
      } else {
        if (!cancelled) setDaevanionBoost(0);
      }
    };
    fetchBoost();
    return () => {
      cancelled = true;
    };
  }, [buildAbility, buildPassive, getDaevanionBoostForSkill, daevanionBuildKey]);

  // If no skill is provided, show empty state
  if (!targetAbility && !targetPassive && !targetStigma) {
    return (
      <div
        className={`flex items-center justify-center h-full text-muted-foreground ${className}`}
      >
        <p>Select a skill to view details</p>
      </div>
    );
  }

  // Calculer le niveau effectif pour l'affichage
  const baseLevel = (() => {
    const isChainSkill = (parentAbility || parentStigma) !== undefined;
    if (isChainSkill) {
      return parentBuildAbility?.level || parentBuildStigma?.level || 0;
    }
    return buildAbility?.level || buildPassive?.level || buildStigma?.level || 0;
  })();
  
  const effectiveLevel = baseLevel + (buildAbility || buildPassive ? daevanionBoost : 0);

  return (
    <div className={`flex flex-col  px-2 gap-8 h-full ${className}`}>
      {/* Skill Name with Level */}
      <div className="flex items-baseline gap-2">
        <SkillName
          ability={targetAbility}
          passive={targetPassive}
          stigma={targetStigma}
        />
        <div className="text-sm font-semibold text-foreground/50">
          {(() => {
            const isChainSkill = (parentAbility || parentStigma) !== undefined;
            const isInBuild = isChainSkill
              ? (parentBuildAbility || parentBuildStigma) !== undefined
              : (buildAbility || buildPassive || buildStigma) !== undefined;

            if (!isInBuild) {
              return "Not in build";
            }
            if (effectiveLevel === 0) {
              return "Locked";
            }
            if (daevanionBoost > 0) {
              return (
                <>
                  Lv.{effectiveLevel}{" "}
                  <span className="text-green-500">(+{daevanionBoost})</span>
                </>
              );
            }
            return `Lv.${effectiveLevel}`;
          })()}
        </div>
      </div>

      {/* Spell Tags */}
      <SkillTag
        ability={targetAbility}
        passive={targetPassive}
        stigma={targetStigma}
      />

      {/* Description */}
      <SkillDesc
        ability={targetAbility}
        passive={targetPassive}
        stigma={targetStigma}
        buildAbility={buildAbility}
        buildPassive={buildPassive}
        buildStigma={buildStigma}
        daevanionBoost={buildAbility || buildPassive ? daevanionBoost : 0}
      />

      {/* Stagger Damage */}
      <SkillStaggerDamage
        ability={targetAbility}
        passive={targetPassive}
        stigma={targetStigma}
      />

      {/* Condition */}
      <SkillCondition
        ability={targetAbility}
        stigma={targetStigma}
        chainSkill={chainSkillData}
        chainSkillStigma={chainSkillStigmaData}
      />

      {/* Specialty Choices (only for abilities) */}
      {targetAbility && (
        <AvailableSpeciality
          buildAbility={buildAbility}
          ability={targetAbility}
          currentLevel={buildAbility ? effectiveLevel : undefined}
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
      {((targetAbility &&
        ((targetAbility.parentAbilities?.length || 0) > 0 || parentAbility)) ||
        (targetStigma &&
          ((targetStigma.parentStigmas?.length || 0) > 0 || parentStigma))) && (
        <ChainSkill
          buildAbility={chainSkillBuildAbility}
          buildStigma={chainSkillBuildStigma}
          ability={chainSkillAbility}
          stigma={chainSkillStigma}
        />
      )}

      {/* Debug: Show chain skills info in development 
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
        */}

      {/* Casting Duration, Cooldown, Mana Cost, Range, and Target */}
      <div className="flex flex-col gap-2 pt-4 border-t-2 border-secondary">
        <SkillManaCost ability={targetAbility} stigma={targetStigma} />
        <SkillRange
          ability={targetAbility}
          passive={targetPassive}
          stigma={targetStigma}
        />
        <SkillTarget
          ability={targetAbility}
          passive={targetPassive}
          stigma={targetStigma}
        />
        <SkillCastDuration
          ability={targetAbility}
          passive={targetPassive}
          stigma={targetStigma}
        />
        <SkillCooldown
          ability={targetAbility}
          passive={targetPassive}
          stigma={targetStigma}
        />
      </div>
    </div>
  );
};
