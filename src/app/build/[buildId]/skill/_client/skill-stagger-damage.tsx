"use client";

import { AbilityType, PassiveType, StigmaType } from "@/types/schema";

type SkillStaggerDamageProps = {
  ability?: AbilityType;
  passive?: PassiveType;
  stigma?: StigmaType;
  className?: string;
};

export const SkillStaggerDamage = ({ ability, passive, stigma, className = "" }: SkillStaggerDamageProps) => {
  const staggerDamage = ability?.staggerDamage ?? passive?.staggerDamage ?? stigma?.staggerDamage;

  // Don't display if staggerDamage is null, undefined, or 0
  if (!staggerDamage || staggerDamage === 0) {
    return null;
  }

  return (
    <div className={`text-sm text-foreground/80 ${className}`}>
      <span className="font-bold">{staggerDamage} Stagger Gauge Damage</span>
    </div>
  );
};

