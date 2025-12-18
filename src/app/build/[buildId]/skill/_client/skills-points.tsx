"use client";

import { useBuildStore } from "@/store/useBuildEditor";
import { useMemo } from "react";

/**
 * Calculate the cost for a skill level using baseCost and baseCostModifier
 * The modifier applies every 4 levels (levels 1-4: baseCost, 5-8: baseCost * modifier, 9-12: baseCost * modifier^2, etc.)
 */
function calculateSkillCost(
  level: number,
  baseCost: number,
  baseCostModifier: number
): number {
  if (level <= 0) return 0;

  let totalCost = 0;
  let currentLevel = 1;
  let currentCost = baseCost;
  let modifierMultiplier = 1;

  while (currentLevel <= level) {
    // Calculate how many levels in this cost tier (4 levels per tier)
    const levelsInTier = Math.min(5, level - currentLevel + 1);
    totalCost += currentCost * levelsInTier;

    currentLevel += levelsInTier;
    // Every 4 levels, multiply the cost by the modifier
    if (currentLevel <= level) {
      modifierMultiplier *= baseCostModifier;
      currentCost = baseCost * modifierMultiplier;
    }
  }

  return totalCost;
}

export const SkillsPoints = () => {
  const { build } = useBuildStore();

  const { totalSP, totalSTP, maxSP, maxSTP } = useMemo(() => {
    if (!build) {
      return { totalSP: 0, totalSTP: 0, maxSP: 0, maxSTP: 0 };
    }

    // Collect all chain skill IDs (abilities and stigmas that are chain skills)
    const chainSkillAbilityIds = new Set<number>();
    const chainSkillStigmaIds = new Set<number>();

    // Find all chain skill ability IDs from selectedChainSkillIds
    build.abilities?.forEach((buildAbility) => {
      buildAbility.selectedChainSkillIds?.forEach((chainSkillId) => {
        chainSkillAbilityIds.add(chainSkillId);
      });
    });

    // Find all chain skill stigma IDs from selectedChainSkillIds
    build.stigmas?.forEach((buildStigma) => {
      buildStigma.selectedChainSkillIds?.forEach((chainSkillId) => {
        chainSkillStigmaIds.add(chainSkillId);
      });
    });

    let spUsed = 0;
    let stpUsed = 0;

    // Calculate SP for abilities (exclude chain skills)
    build.abilities?.forEach((buildAbility) => {
      // Skip if this ability is a chain skill (referenced in another ability's selectedChainSkillIds)
      if (chainSkillAbilityIds.has(buildAbility.abilityId)) {
        return;
      }

      const ability = buildAbility.ability;
      if (ability && buildAbility.level > 0) {
        const cost = calculateSkillCost(
          buildAbility.level,
          ability.baseCost ?? 1,
          ability.baseCostModifier ?? 2
        );
        spUsed += cost;
      }
    });

    // Calculate SP for passives
    build.passives?.forEach((buildPassive) => {
      const passive = buildPassive.passive;
      if (passive && buildPassive.level > 0) {
        const cost = calculateSkillCost(
          buildPassive.level,
          passive.baseCost ?? 1,
          passive.baseCostModifier ?? 2
        );
        spUsed += cost;
      }
    });

    // Calculate STP for stigmas (exclude chain skills)
    build.stigmas?.forEach((buildStigma) => {
      // Skip if this stigma is a chain skill (referenced in another stigma's selectedChainSkillIds)
      if (chainSkillStigmaIds.has(buildStigma.stigmaId)) {
        return;
      }

      const stigma = buildStigma.stigma;
      if (stigma && buildStigma.level > 0) {
        const cost = calculateSkillCost(
          buildStigma.level,
          stigma.baseCost ?? 10,
          stigma.baseCostModifier ?? 2
        );
        stpUsed += cost;
      }
    });

    const maxSP = build.baseSP + (build.extraSP ?? 0);
    const maxSTP = build.baseSTP + (build.extraSTP ?? 0);

    return {
      totalSP: spUsed,
      totalSTP: stpUsed,
      maxSP,
      maxSTP,
    };
  }, [build]);

  if (!build) return null;

  return (
    <div className="flex lg:flex-row flex-col items-center justify-between gap-4 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-green-600 bg-green-600/30 border-y-2 border-secondary text-center font-bold uppercase px-3 py-1 rounded-sm">SP</span>
        <span
          className={`bg-background/60 border-y-2 border-secondary text-center font-bold uppercase px-2 py-1 rounded-sm ${
            totalSP > maxSP ? "text-destructive" : "text-foreground"
          }`}
        >
          {totalSP}/{maxSP}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`bg-background/60 border-y-2 border-secondary text-center font-bold uppercase px-2 py-1 rounded-sm ${
            totalSTP > maxSTP ? "text-destructive" : "text-foreground"
          }`}
        >
          {totalSTP}/{maxSTP}
        </span>
        <span className="text-blue-600 bg-blue-600/30 border-y-2 border-secondary text-center font-bold uppercase px-3 py-1 rounded-sm">STP</span>
      </div>
    </div>
  );
};

