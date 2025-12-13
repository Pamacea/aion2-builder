"use client";

import { AbilityType, PassiveType, StigmaType } from "@/types/schema";

type SkillCastDurationProps = {
  ability?: AbilityType;
  passive?: PassiveType;
  stigma?: StigmaType;
  className?: string;
};

export const SkillCastDuration = ({ ability, passive, stigma, className = "" }: SkillCastDurationProps) => {
  const castingDuration = ability?.castingDuration || passive?.castingDuration || stigma?.castingDuration || "Instant Cast";

  return (
    <div className={`flex items-baseline justify-between gap-2 ${className}`}>
      <span className="text-sm font-medium text-foreground/50">Cast Duration</span>
      <span className="text-xs font-semibold uppercase">{castingDuration}</span>
    </div>
  );
};

