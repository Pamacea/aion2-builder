"use client";

import { AbilityType, PassiveType, StigmaType } from "@/types/schema";

type SkillTargetProps = {
  ability?: AbilityType;
  passive?: PassiveType;
  stigma?: StigmaType;
  className?: string;
};

export const SkillTarget = ({ ability, passive, stigma, className = "" }: SkillTargetProps) => {
  const target = ability?.target ?? passive?.target ?? stigma?.target ?? "Single Target";

  return (
    <div className={`flex items-baseline justify-between gap-2 ${className}`}>
      <span className="text-sm font-medium text-foreground/50">Target</span>
      <span className="text-xs font-semibold uppercase">{target}</span>
    </div>
  );
};

