"use client";

import { ABILITY_PATH } from "@/constants/paths";
import { useBuildStore } from "@/store/useBuildEditor";
import { BuildPassiveType, PassiveType } from "@/types/schema";
import { isStarterBuild } from "@/utils/buildUtils";
import Image from "next/image";
import { useState } from "react";
import { DragSourceMonitor, useDrag } from "react-dnd";

type PassiveSkillProps = {
  passive: PassiveType;
  buildPassive?: BuildPassiveType;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
};

export const PassiveSkill = ({
  passive,
  buildPassive,
  isSelected = false,
  onSelect,
  className = "",
}: PassiveSkillProps) => {
  const { build } = useBuildStore();
  const [localSelected, setLocalSelected] = useState(isSelected);
  const [imageError, setImageError] = useState(false);

  const currentLevel = buildPassive?.level ?? 0;
  const isInBuild = buildPassive !== undefined;
  const isStarter = isStarterBuild(build);

  // Build image path with fallback
  const classNameForPath = passive.class?.name || "default";
  const iconUrl = passive.iconUrl || "default-icon.webp";
  const imageSrc = imageError 
    ? "/icons/IC_Ability_Default.webp"
    : `${ABILITY_PATH}${classNameForPath}/${iconUrl}`;

  const [{ isDragging }, drag] = useDrag({
    type: "skill",
    item: {
      skill: {
        type: "passive" as const,
        passive,
        buildPassive,
      },
    },
    canDrag: () => !isStarter && isInBuild, // Cannot drag if starter build
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleSelect = () => {
    if (onSelect) {
      onSelect();
    } else {
      setLocalSelected(!localSelected);
    }
  };

  const selected = onSelect ? isSelected : localSelected;

  // Create ref callback for drag
  const dragRef = (node: HTMLDivElement | null) => {
    drag(node);
  };

  return (
    <div
      ref={dragRef}
      className={`relative cursor-pointer transition-all ${className} inline-block w-14 h-14 ${
        isDragging ? "opacity-50" : ""
      } ${isInBuild && !isStarter ? "cursor-move" : ""} ${isStarter ? "cursor-not-allowed" : ""}`}
      onClick={handleSelect}
    >
      {/* Icon with gold border */}
      <div
        className={`w-full h-full rounded-md border-2 flex items-center justify-center ${
          imageError ? "bg-background/80" : ""
        } ${
          currentLevel === 0 ? "grayscale opacity-50" : ""
        } ${
          selected
            ? "border-yellow-500"
            : isInBuild
              ? "border-yellow-400/50"
              : "border-yellow-600/30"
        }`}
      >
        <Image
          src={imageSrc}
          alt={passive.name}
          width={48}
          height={48}
          onError={() => setImageError(true)}
          className={`rounded-md object-contain ${
            imageError ? "w-3/4 h-3/4" : "w-full h-full object-cover"
          }`}
        />
      </div>
      {/* Lock icon when level is 0 */}
      {currentLevel === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Image
            src="/icons/IC_Speciality_Locked.webp"
            alt="Lock Icon"
            width={24}
            height={24}
            className="opacity-80"
          />
        </div>
      )}
      {/* Level badge - only show if level > 0 */}
      {isInBuild && currentLevel > 0 && (
        <div className="absolute bottom-1 right-1 text-foreground text-xs font-bold pointer-events-none leading-none">
          Lv.{currentLevel}
        </div>
      )}
    </div>
  );
};

