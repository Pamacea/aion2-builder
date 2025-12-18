"use client";

import { AbilityType, PassiveType, SpellTagType, StigmaType } from "@/types/schema";

type SkillTagProps = {
  ability?: AbilityType;
  passive?: PassiveType;
  stigma?: StigmaType;
  className?: string;
};

// Color mapping for spell tags
const spellTagColors: Record<string, string> = {
  Attack: "border-red-500 text-red-500 bg-red-500/10",
  Magic: "border-purple-500 text-purple-500 bg-purple-500/10",
  Heal: "border-green-500 text-green-500 bg-green-500/10",
  Debuff: "border-orange-500 text-orange-500 bg-orange-500/10",
  Buff: "border-blue-500 text-blue-500 bg-blue-500/10",
  Earth: "border-amber-600 text-amber-600 bg-amber-600/10",
  Fire: "border-red-600 text-red-600 bg-red-600/10",
  Wind: "border-cyan-500 text-cyan-500 bg-cyan-500/10",
  Water: "border-blue-400 text-blue-400 bg-blue-400/10",
  Ice: "border-sky-400 text-sky-400 bg-sky-400/10",
  Lightning: "border-yellow-400 text-yellow-400 bg-yellow-400/10",
  Dark: "border-gray-800 text-gray-800 bg-gray-800/10",
  Light: "border-yellow-200 text-yellow-200 bg-yellow-200/10",
};

export const SkillTag = ({ ability, passive, stigma, className = "" }: SkillTagProps) => {
  // Get spell tags from either ability, passive, or stigma
  const spellTags: SpellTagType[] | undefined = ability?.spellTag || passive?.spellTag || stigma?.spellTag;

  if (!spellTags || spellTags.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 pt-4 border-t-2 border-secondary ${className}`}>
      {spellTags.map((tag) => {
        const tagColor = spellTagColors[tag.name] || "border-gray-500 text-gray-500 bg-gray-500/10";
        return (
          <div
            key={tag.id}
            className={`border ${tagColor} px-3 py-1 uppercase text-xs font-semibold rounded-sm`}
          >
            {tag.name}
          </div>
        );
      })}
    </div>
  );
};