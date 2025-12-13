"use client";

import { ABILITY_PATH } from "@/constants/paths";
import { AbilityType, BuildAbilityType } from "@/types/schema";
import Image from "next/image";
import { useState } from "react";
import { DragSourceMonitor, useDrag } from "react-dnd";
import { useShortcutContext } from "../_context/ShortcutContext";

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
  const { selectedSkill, setSelectedSkill } = useShortcutContext();

  const currentLevel = buildAbility?.level ?? 0;
  const isInBuild = buildAbility !== undefined;
  
  // Check if this skill is selected for shortcut
  const isSelectedForShortcut = selectedSkill?.type === "ability" && 
    selectedSkill.ability?.id === ability.id && 
    selectedSkill.buildAbility?.id === buildAbility?.id;

  const [{ isDragging }, drag] = useDrag({
    type: "skill",
    item: {
      skill: {
        type: "ability" as const,
        ability,
        buildAbility,
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

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInBuild) {
      setSelectedSkill({
        type: "ability",
        ability,
        buildAbility,
      });
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
      onContextMenu={handleContextMenu}
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
      {/* Selection indicator for shortcut */}
      {isSelectedForShortcut && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-6 h-6 bg-orange-500/80 rounded-full flex items-center justify-center border-2 border-orange-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 text-white"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.894 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

