"use client";

import { AbilityType, PassiveType, StigmaType } from "@/types/schema";

type SkillDescProps = {
  ability?: AbilityType;
  passive?: PassiveType;
  stigma?: StigmaType;
  className?: string;
};

export const SkillDesc = ({ ability, passive, stigma, className = "" }: SkillDescProps) => {
  const description = ability?.description || passive?.description || stigma?.description;

  if (!description) {
    return null;
  }

  return (
    <div className={className}>
      <p className="text-sm text-foreground/80 pt-4 border-t-2 border-background/40">{description}</p>
    </div>
  );
};

