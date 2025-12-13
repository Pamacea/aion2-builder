"use client";

import { AbilityType, PassiveType, StigmaType } from "@/types/schema";

type SkillRangeProps = {
  ability?: AbilityType;
  passive?: PassiveType;
  stigma?: StigmaType;
  className?: string;
};

export const SkillRange = ({ ability, passive, stigma, className = "" }: SkillRangeProps) => {
  const range = ability?.range ?? passive?.range ?? stigma?.range ?? 20;

  return (
    <div className={`flex items-baseline justify-between gap-2 ${className}`}>
      <span className="text-sm font-medium text-foreground/50">Range</span>
      <span className="text-xs font-semibold uppercase">{range}m</span>
    </div>
  );
};

