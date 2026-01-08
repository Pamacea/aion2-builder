"use client";

import { BuildPassiveType, PassiveType } from "@/types/schema";
import { UnifiedSkillCard } from "./unified-skill-card";

/**
 * PassiveSkill component - Optimized wrapper around UnifiedSkillCard
 *
 * This component serves as a thin wrapper maintaining backward compatibility
 * while leveraging the unified, memoized implementation for maximum performance.
 *
 * Performance optimizations:
 * - React.memo with custom comparison prevents unnecessary re-renders
 * - Selective store subscriptions minimize cascade updates
 * - Memoized computations reduce expensive recalculations
 */
type PassiveSkillProps = {
  passive: PassiveType;
  buildPassive?: BuildPassiveType;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
};

export const PassiveSkill = ({
  passive,
  buildPassive,
  isSelected = false,
  onSelect,
  className = "",
}: PassiveSkillProps) => {
  return (
    <UnifiedSkillCard
      skillData={{
        type: "passive",
        passive,
        buildPassive,
        id: passive.id,
        name: passive.name,
        iconUrl: passive.iconUrl,
        class: passive.class,
      }}
      isSelected={isSelected}
      onSelect={onSelect}
      className={className}
    />
  );
};

export default PassiveSkill;
