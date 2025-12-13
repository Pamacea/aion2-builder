"use client";

import { ABILITY_PATH } from "@/constants/paths";
import { AbilityType, BuildAbilityType } from "@/types/schema";
import Image from "next/image";
import { useState } from "react";

type ActiveSkillProps = {
  ability: AbilityType;
  buildAbility?: BuildAbilityType;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
};

export const ActiveSkill = ({
  ability,
  buildAbility,
  isSelected = false,
  onSelect,
  className = "",
}: ActiveSkillProps) => {
  const [localSelected, setLocalSelected] = useState(isSelected);

  const currentLevel = buildAbility?.level ?? 0;
  const isInBuild = buildAbility !== undefined;

  const handleSelect = () => {
    if (onSelect) {
      onSelect();
    } else {
      setLocalSelected(!localSelected);
    }
  };

  const selected = onSelect ? isSelected : localSelected;

  return (
    <div
      className={`relative cursor-pointer transition-all ${className} inline-block w-14 h-14`}
      onClick={handleSelect}
    >
      {/* Icon with gold border */}
      <Image
        src={`${ABILITY_PATH}${ability.class?.name || "default"}/${ability.iconUrl || "default-icon.webp"}`}
        alt={ability.name}
        width={48}
        height={48}
        className={`w-full h-full rounded-md object-cover border-2 ${
          selected
            ? "border-yellow-500"
            : isInBuild
              ? "border-yellow-400/50"
              : "border-yellow-600/30"
        }`}
      />
      {/* Level badge */}
      {currentLevel > 0 && (
        <div className="absolute bottom-1 right-1 text-foreground text-xs font-bold pointer-events-none leading-none">
          Lv.{currentLevel}
        </div>
      )}
    </div>
  );
};

