"use client";

import { AbilityType, PassiveType, StigmaType } from "@/types/schema";

type SkillNameProps = {
  ability?: AbilityType;
  passive?: PassiveType;
  stigma?: StigmaType;
  className?: string;
};

export const SkillName = ({ ability, passive, stigma, className = "" }: SkillNameProps) => {
  const name = ability?.name || passive?.name || stigma?.name;

  if (!name) {
    return null;
  }

  return (
    <h3 className={`text-xl font-bold ${className}`}>
      {name}
    </h3>
  );
};

