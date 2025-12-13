"use client";

import { ABILITY_PATH } from "@/constants/paths";
import { BuildPassiveType, PassiveType } from "@/types/schema";
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
  const [localSelected, setLocalSelected] = useState(isSelected);

  const currentLevel = buildPassive?.level ?? 0;
  const isInBuild = buildPassive !== undefined;

  const [{ isDragging }, drag] = useDrag({
    type: "skill",
    item: {
      skill: {
        type: "passive" as const,
        passive,
        buildPassive,
      },
    },
    canDrag: () => isInBuild,
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
      } ${isInBuild ? "cursor-move" : ""}`}
      onClick={handleSelect}
    >
      {/* Icon with gold border */}
      <Image
        src={`${ABILITY_PATH}${passive.class?.name || "default"}/${passive.iconUrl || "default-icon.webp"}`}
        alt={passive.name}
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

