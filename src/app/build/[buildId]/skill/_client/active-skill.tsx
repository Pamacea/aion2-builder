"use client";

import { AbilityType, BuildAbilityType } from "@/types/schema";
import { UnifiedSkillCard } from "./unified-skill-card";

/**
 * ActiveSkill component - Optimized wrapper around UnifiedSkillCard
 *
 * This component serves as a thin wrapper maintaining backward compatibility
 * while leveraging the unified, memoized implementation for maximum performance.
 *
 * Performance optimizations:
 * - React.memo with custom comparison prevents unnecessary re-renders
 * - Selective store subscriptions minimize cascade updates
 * - Memoized computations reduce expensive recalculations
 */
type ActiveSkillProps = {
  ability: AbilityType;
  buildAbility?: BuildAbilityType;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
};

export const ActiveSkill = ({
  ability,
  buildAbility,
  isSelected = false,
  onSelect,
  className = "",
}: ActiveSkillProps) => {
  return (
    <UnifiedSkillCard
      skillData={{
        type: "ability",
        ability,
        buildAbility,
        id: ability.id,
        name: ability.name,
        iconUrl: ability.iconUrl,
        class: ability.class,
      }}
      isSelected={isSelected}
      onSelect={onSelect}
      className={className}
    />
  );
};

export default ActiveSkill;
