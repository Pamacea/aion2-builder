"use client";

import { BuildStigmaType, StigmaType } from "@/types/schema";
import { UnifiedSkillCard } from "./unified-skill-card";

/**
 * StigmaSkill component - Optimized wrapper around UnifiedSkillCard
 *
 * This component serves as a thin wrapper maintaining backward compatibility
 * while leveraging the unified, memoized implementation for maximum performance.
 *
 * Performance optimizations:
 * - React.memo with custom comparison prevents unnecessary re-renders
 * - Selective store subscriptions minimize cascade updates
 * - Memoized computations reduce expensive recalculations
 */
type StigmaSkillProps = {
  stigma: StigmaType;
  buildStigma?: BuildStigmaType;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
};

export const StigmaSkill = ({
  stigma,
  buildStigma,
  isSelected = false,
  onSelect,
  className = "",
}: StigmaSkillProps) => {
  return (
    <UnifiedSkillCard
      skillData={{
        type: "stigma",
        stigma,
        buildStigma,
        id: stigma.id,
        name: stigma.name,
        iconUrl: stigma.iconUrl,
        classes: stigma.classes,
      }}
      isSelected={isSelected}
      onSelect={onSelect}
      className={className}
    />
  );
};

export default StigmaSkill;
