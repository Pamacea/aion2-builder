"use client";

import { useBuildStore } from "@/store/useBuildEditor";
import { useEffect } from "react";
import { ActiveSkill } from "../_client/active-skill";
import { MinusButton } from "../_client/buttons/minus-button";
import { PlusButton } from "../_client/buttons/plus-button";
import { ResetSkillButton } from "../_client/buttons/reset-skill-button";
import { PassiveSkill } from "../_client/passive-skill";
import { SkillLevelModifier } from "../_client/skill-level-modifier";
import { SkillsPoints } from "../_client/skills-points";
import { StigmaSkill } from "../_client/stigma-skill";
import { useSelectedSkill } from "../_context/SelectedSkillContext";
import { getEffectiveMaxLevel } from "../_utils/levelLimits";

export const Skill = () => {
  const {
    build,
    getAvailableAbilities,
    getAvailablePassives,
    getAvailableStigmas,
    updateAbilityLevel,
    updatePassiveLevel,
    updateStigmaLevel,
    addAbility,
    addPassive,
    addStigma,
    removeAbility,
    removePassive,
    removeStigma,
  } = useBuildStore();
  const { selectedSkill, setSelectedSkill } = useSelectedSkill();

  // Helper to find build ability/passive/stigma
  const findBuildAbility = (abilityId: number) =>
    build?.abilities?.find((a) => a.abilityId === abilityId);
  const findBuildPassive = (passiveId: number) =>
    build?.passives?.find((p) => p.passiveId === passiveId);
  const findBuildStigma = (stigmaId: number) =>
    build?.stigmas?.find((s) => s.stigmaId === stigmaId);

  // Sync selected skill with build updates - simple direct sync
  useEffect(() => {
    if (!build || !selectedSkill) return;

    // If skill is already in build, update it
    if (selectedSkill.buildAbility) {
      const updated = findBuildAbility(selectedSkill.buildAbility.abilityId);
      if (updated) {
        setSelectedSkill({ buildAbility: updated });
      } else {
        setSelectedSkill(null);
      }
    } else if (selectedSkill.buildPassive) {
      const updated = findBuildPassive(selectedSkill.buildPassive.passiveId);
      if (updated) {
        setSelectedSkill({ buildPassive: updated });
      } else {
        setSelectedSkill(null);
      }
    } else if (selectedSkill.buildStigma) {
      const updated = findBuildStigma(selectedSkill.buildStigma.stigmaId);
      if (updated) {
        setSelectedSkill({ buildStigma: updated });
      } else {
        setSelectedSkill(null);
      }
    }
    // If skill is selected but not in build yet, check if it was just added
    else if (selectedSkill.ability) {
      const buildAbility = findBuildAbility(selectedSkill.ability.id);
      if (buildAbility) {
        // Skill was just added to build, update selectedSkill
        setSelectedSkill({ buildAbility });
      }
    } else if (selectedSkill.passive) {
      const buildPassive = findBuildPassive(selectedSkill.passive.id);
      if (buildPassive) {
        // Skill was just added to build, update selectedSkill
        setSelectedSkill({ buildPassive });
      }
    } else if (selectedSkill.stigma) {
      const buildStigma = findBuildStigma(selectedSkill.stigma.id);
      if (buildStigma) {
        // Skill was just added to build, update selectedSkill
        setSelectedSkill({ buildStigma });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [build?.abilities, build?.passives, build?.stigmas]);

  if (!build) {
    return <div className="p-4">Loading...</div>;
  }

  const availableAbilities = getAvailableAbilities() || [];
  const availablePassives = getAvailablePassives() || [];
  const availableStigmas = getAvailableStigmas() || [];

  // Get selected skill info for dynamic buttons
  const selectedBuildAbility = selectedSkill?.buildAbility;
  const selectedBuildPassive = selectedSkill?.buildPassive;
  const selectedBuildStigma = selectedSkill?.buildStigma;
  // Also get the direct ability/passive/stigma if not in build yet
  const selectedAbility = selectedSkill?.ability;
  const selectedPassive = selectedSkill?.passive;
  const selectedStigma = selectedSkill?.stigma;

  // Check if the selected skill is a chain skill
  // A skill is a chain skill if it appears as chainAbility/chainStigma in parentAbilities/parentStigmas of other skills
  let isChainSkill = false;
  if (selectedAbility || selectedBuildAbility) {
    const abilityToCheck = selectedBuildAbility?.ability || selectedAbility;
    if (abilityToCheck) {
      const allAbilities = build?.class?.abilities || [];
      for (const ab of allAbilities) {
        if (ab.parentAbilities && ab.parentAbilities.length > 0) {
          const isChain = ab.parentAbilities.some(cs => cs.chainAbility.id === abilityToCheck.id);
          if (isChain) {
            isChainSkill = true;
            break;
          }
        }
      }
    }
  } else if (selectedStigma || selectedBuildStigma) {
    const stigmaToCheck = selectedBuildStigma?.stigma || selectedStigma;
    if (stigmaToCheck) {
      const allStigmas = build?.class?.stigmas || [];
      for (const st of allStigmas) {
        if (st.parentStigmas && st.parentStigmas.length > 0) {
          const isChain = st.parentStigmas.some(cs => cs.chainStigma.id === stigmaToCheck.id);
          if (isChain) {
            isChainSkill = true;
            break;
          }
        }
      }
    }
  }

  const currentLevel =
    selectedBuildAbility?.level ||
    selectedBuildPassive?.level ||
    selectedBuildStigma?.level ||
    0;
  
  // Get actual maxLevel from the skill
  const actualMaxLevel =
    selectedBuildAbility?.maxLevel ||
    selectedBuildPassive?.maxLevel ||
    selectedBuildStigma?.maxLevel ||
    (selectedAbility && "maxLevel" in selectedAbility
      ? selectedAbility.maxLevel
      : undefined) ||
    (selectedPassive && "maxLevel" in selectedPassive
      ? selectedPassive.maxLevel
      : undefined) ||
    (selectedStigma && "maxLevel" in selectedStigma
      ? selectedStigma.maxLevel
      : undefined) ||
    20;
  
  // Determine skill type for effective max level calculation
  const skillType = selectedBuildAbility || selectedAbility
    ? "ability"
    : selectedBuildPassive || selectedPassive
      ? "passive"
      : "stigma";
  
  // Apply effective max level (10 for abilities/passives, full maxLevel for stigmas)
  const maxLevel = getEffectiveMaxLevel(skillType, actualMaxLevel);
  
  const hasSelectedSkill = !!selectedSkill;

  // Handle level changes
  const handleIncrement = () => {
    // Don't allow level changes for chain skills
    if (isChainSkill) return;
    
    if (selectedBuildAbility) {
      const newLevel = Math.min(currentLevel + 1, maxLevel);
      updateAbilityLevel(selectedBuildAbility.abilityId, newLevel);
      // The useEffect will handle updating selectedSkill automatically
    } else if (selectedAbility) {
      // Ability is selected but not in build yet
      const newLevel = Math.min(currentLevel + 1, maxLevel);
      addAbility(selectedAbility.id, newLevel);
    } else if (selectedBuildPassive) {
      const newLevel = Math.min(currentLevel + 1, maxLevel);
      updatePassiveLevel(selectedBuildPassive.passiveId, newLevel);
      // The useEffect will handle updating selectedSkill automatically
    } else if (selectedPassive) {
      // Passive is selected but not in build yet
      const newLevel = Math.min(currentLevel + 1, maxLevel);
      addPassive(selectedPassive.id, newLevel);
    } else if (selectedBuildStigma) {
      const newLevel = Math.min(currentLevel + 1, maxLevel);
      updateStigmaLevel(selectedBuildStigma.stigmaId, newLevel);
      // The useEffect will handle updating selectedSkill automatically
    } else if (selectedStigma) {
      // Stigma is selected but not in build yet
      const newLevel = Math.min(currentLevel + 1, maxLevel);
      addStigma(selectedStigma.id, newLevel);
    }
  };

  const handleDecrement = () => {
    // Don't allow level changes for chain skills
    if (isChainSkill) return;
    
    if (selectedBuildAbility) {
      if (currentLevel <= 0) {
        // Remove skill from build if level would go below 0
        removeAbility(selectedBuildAbility.abilityId);
        setSelectedSkill(null);
      } else {
        // Decrement level (minimum is 0)
        const newLevel = Math.max(0, currentLevel - 1);
        updateAbilityLevel(selectedBuildAbility.abilityId, newLevel);
      }
    } else if (selectedBuildPassive) {
      if (currentLevel <= 0) {
        // Remove skill from build if level would go below 0
        removePassive(selectedBuildPassive.passiveId);
        setSelectedSkill(null);
      } else {
        // Decrement level (minimum is 0)
        const newLevel = Math.max(0, currentLevel - 1);
        updatePassiveLevel(selectedBuildPassive.passiveId, newLevel);
      }
    } else if (selectedBuildStigma) {
      if (currentLevel <= 0) {
        // Remove skill from build if level would go below 0
        removeStigma(selectedBuildStigma.stigmaId);
        setSelectedSkill(null);
      } else {
        // Decrement level (minimum is 0)
        const newLevel = Math.max(0, currentLevel - 1);
        updateStigmaLevel(selectedBuildStigma.stigmaId, newLevel);
      }
    }
  };

  const handleSelectSkill = (
    type: "ability" | "passive" | "stigma",
    id: number
  ) => {
    if (type === "ability") {
      const buildAbility = findBuildAbility(id);
      const ability = availableAbilities.find((a) => a.id === id);
      setSelectedSkill(
        buildAbility ? { buildAbility } : ability ? { ability } : null
      );
    } else if (type === "passive") {
      const buildPassive = findBuildPassive(id);
      const passive = availablePassives.find((p) => p.id === id);
      setSelectedSkill(
        buildPassive ? { buildPassive } : passive ? { passive } : null
      );
    } else if (type === "stigma") {
      const buildStigma = findBuildStigma(id);
      const stigma = availableStigmas.find((s) => s.id === id);
      setSelectedSkill(
        buildStigma ? { buildStigma } : stigma ? { stigma } : null
      );
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 px-2">
      {/* Three Categories in Column */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto min-h-0">
        {/* ACTIVE Category */}
        <div className="flex flex-col gap-4">
          <div className="py-2 bg-background/60 border-y-2 border-foreground/50 text-center font-bold uppercase">
            ACTIVE
          </div>
          <div className="grid grid-cols-3 gap-2 px-2">
            {availableAbilities.map((ability) => {
              const buildAbility = findBuildAbility(ability.id);
              const isSelected = selectedBuildAbility?.abilityId === ability.id;
              return (
                <ActiveSkill
                  key={ability.id}
                  ability={ability}
                  buildAbility={buildAbility}
                  isSelected={isSelected}
                  onSelect={() => handleSelectSkill("ability", ability.id)}
                />
              );
            })}
          </div>
        </div>

        {/* PASSIVE Category */}
        <div className="flex flex-col gap-4">
          <div className="py-2 bg-background/60 border-y-2 border-foreground/50 text-center font-bold uppercase">
            PASSIVE
          </div>
          <div className="grid grid-cols-3 gap-2 px-2">
            {availablePassives.map((passive) => {
              const buildPassive = findBuildPassive(passive.id);
              const isSelected = selectedBuildPassive?.passiveId === passive.id;
              return (
                <PassiveSkill
                  key={passive.id}
                  passive={passive}
                  buildPassive={buildPassive}
                  isSelected={isSelected}
                  onSelect={() => handleSelectSkill("passive", passive.id)}
                />
              );
            })}
          </div>
        </div>

        {/* STIGMA Category */}
        <div className="flex flex-col gap-4">
          <div className="py-2 bg-background/60 border-y-2 border-foreground/50 text-center font-bold uppercase">
            STIGMA
          </div>
          <div className="grid grid-cols-3 gap-2 px-2">
            {availableStigmas.map((stigma) => {
              const buildStigma = findBuildStigma(stigma.id);
              const isSelected = selectedBuildStigma?.stigmaId === stigma.id;
              return (
                <StigmaSkill
                  key={stigma.id}
                  stigma={stigma}
                  buildStigma={buildStigma}
                  isSelected={isSelected}
                  onSelect={() => handleSelectSkill("stigma", stigma.id)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className=" w-full flex flex-col items-center justify-between gap-2 pt-2">
        <section className="w-full flex flex-col gap-2">
          <SkillsPoints />
          <SkillLevelModifier />
        </section>

        <section className="w-full flex items-center justify-between gap-2 pt-2">
          <ResetSkillButton disabled={isChainSkill} />
          <PlusButton
            onClick={handleIncrement}
            disabled={!hasSelectedSkill || currentLevel >= maxLevel || isChainSkill}
          />
          <MinusButton
            onClick={handleDecrement}
            disabled={!hasSelectedSkill || currentLevel <= 1 || isChainSkill}
          />
        </section>
      </div>
    </div>
  );
};
