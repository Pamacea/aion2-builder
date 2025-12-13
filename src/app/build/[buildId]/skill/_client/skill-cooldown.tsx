"use client";

import { AbilityType, PassiveType, StigmaType } from "@/types/schema";

type SkillCooldownProps = {
  ability?: AbilityType;
  passive?: PassiveType;
  stigma?: StigmaType;
  className?: string;
};

export const SkillCooldown = ({ ability, passive, stigma, className = "" }: SkillCooldownProps) => {
  const cooldown = ability?.cooldown || passive?.cooldown || stigma?.cooldown || "Instant Cast";

  return (
    <div className={`flex items-baseline justify-between gap-2 ${className}`}>
      <span className="text-sm font-medium text-foreground/50">Cooldown</span>
      <span className="text-xs font-semibold uppercase">{cooldown}</span>
    </div>
  );
};

