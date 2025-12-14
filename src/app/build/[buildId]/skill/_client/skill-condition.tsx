"use client";

import { SkillConditionProps } from "@/types/skill.type";
import { useMemo } from "react";

const normalizeCondition = (cond: string[] | undefined | null | object): string[] => {
  if (!cond) return [];
  if (Array.isArray(cond)) {
    return cond.filter((item): item is string => typeof item === "string" && item.length > 0);
  }
  if (typeof cond === "object") {
    const values = Object.values(cond).filter((item): item is string => typeof item === "string" && item.length > 0);
    return values;
  }
  return [];
};

export const SkillCondition = ({
  ability,
  stigma,
  chainSkill,
  chainSkillStigma,
  className = "",
}: SkillConditionProps) => {
  const conditions = useMemo(() => {
    const chainSkillCond = normalizeCondition(chainSkill?.condition);
    if (chainSkillCond.length > 0) return chainSkillCond;

    const chainStigmaCond = normalizeCondition(chainSkillStigma?.condition);
    if (chainStigmaCond.length > 0) return chainStigmaCond;

    const abilityCond = normalizeCondition(ability?.condition);
    if (abilityCond.length > 0) return abilityCond;

    return normalizeCondition(stigma?.condition);
  }, [ability?.condition, stigma?.condition, chainSkill?.condition, chainSkillStigma?.condition]);

  if (conditions.length === 0) return null;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {conditions.map((condition, index) => (
          <span key={index} className="text-xs font-semibold text-orange-500 uppercase">
            {condition}
          </span>
        ))}
      </div>
    </div>
  );
};

