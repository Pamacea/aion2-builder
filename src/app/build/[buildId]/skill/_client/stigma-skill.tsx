"use client";

import { ABILITY_PATH } from "@/constants/paths";
import { useBuildStore } from "@/store/useBuildEditor";
import { BuildStigmaType, StigmaType } from "@/types/schema";
import Image from "next/image";
import { useState } from "react";

type StigmaSkillProps = {
  stigma: StigmaType;
  buildStigma?: BuildStigmaType;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
};

export const StigmaSkill = ({
  stigma,
  buildStigma,
  isSelected = false,
  onSelect,
  className = "",
}: StigmaSkillProps) => {
  const { build } = useBuildStore();
  const [localSelected, setLocalSelected] = useState(isSelected);

  // Get class name from build or first class of stigma
  const classNameForPath =
    build?.class?.name || stigma.classes?.[0]?.name || "default";

  const currentLevel = buildStigma?.level ?? 0;
  const isInBuild = buildStigma !== undefined;

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
      className={`relative cursor-pointer transition-all ${className} border inline-block w-14 h-14`}
      onClick={handleSelect}
    >
      {/* Icon with gold border */}
      <Image
        src={`${ABILITY_PATH}${classNameForPath}/${stigma.iconUrl || "default-icon.webp"}`}
        alt={stigma.name}
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
