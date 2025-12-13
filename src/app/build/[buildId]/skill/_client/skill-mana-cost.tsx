"use client";

import { AbilityType, StigmaType } from "@/types/schema";

type SkillManaCostProps = {
  ability?: AbilityType;
  stigma?: StigmaType;
  className?: string;
};

export const SkillManaCost = ({ ability, stigma, className = "" }: SkillManaCostProps) => {
  const manaCost = ability?.manaCost ?? stigma?.manaCost;

  // Ne pas afficher si manaCost est null ou undefined
  if (manaCost === null || manaCost === undefined) {
    return null;
  }

  return (
    <div className={`flex items-baseline justify-between gap-2 ${className}`}>
      <span className="text-sm font-medium text-foreground/50">Mana Cost</span>
      <span className="text-xs font-semibold uppercase">{manaCost} MP</span>
    </div>
  );
};

