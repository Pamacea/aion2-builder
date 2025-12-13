"use client";

import { ABILITY_PATH } from "@/constants/paths";
import { AbilityType, BuildAbilityType, BuildPassiveType, BuildStigmaType, PassiveType, StigmaType } from "@/types/schema";
import Image from "next/image";
import { DragSourceMonitor, DropTargetMonitor, useDrag, useDrop } from "react-dnd";
import { useShortcutContext } from "../_context/ShortcutContext";

type ShortcutSlotProps = {
  slotId: number;
  skill?: {
    type: "ability" | "passive" | "stigma";
    ability?: AbilityType;
    passive?: PassiveType;
    stigma?: StigmaType;
    buildAbility?: BuildAbilityType;
    buildPassive?: BuildPassiveType;
    buildStigma?: BuildStigmaType;
  };
  onDrop: (slotId: number, skill: ShortcutSlotProps["skill"], sourceSlotId?: number) => void;
  onClear: (slotId: number) => void;
  className?: string;
};

export const ShortcutSlot = ({ slotId, skill, onDrop, onClear, className = "" }: ShortcutSlotProps) => {
  const { selectedSkill, setSelectedSkill } = useShortcutContext();
  
  const [{ isDragging }, drag] = useDrag({
    type: "skill",
    item: { skill, slotId },
    canDrag: () => !!skill,
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "skill",
    canDrop: (item: { skill?: ShortcutSlotProps["skill"]; slotId?: number }) => {
      // Only accept ability and stigma, reject passive
      const skillToDrop = item?.skill;
      if (skillToDrop && "type" in skillToDrop) {
        return skillToDrop.type === "ability" || skillToDrop.type === "stigma";
      }
      return false;
    },
    drop: (item: { skill?: ShortcutSlotProps["skill"]; slotId?: number }) => {
      // The item from skill components has the structure: { skill: { type, ability/passive/stigma, buildAbility/buildPassive/buildStigma } }
      // The item from another slot has: { skill, slotId }
      // Only accept ability and stigma, reject passive
      const skillToDrop = item?.skill;
      const sourceSlotId = item?.slotId; // If present, this means the drag came from another slot
      
      if (skillToDrop && "type" in skillToDrop) {
        // Only allow ability and stigma, not passive
        if (skillToDrop.type === "ability" || skillToDrop.type === "stigma") {
          onDrop(slotId, skillToDrop, sourceSlotId);
        }
      }
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver() && monitor.canDrop(),
    }),
  });

  // Combine drag and drop refs
  const ref = (node: HTMLDivElement | null) => {
    drag(node);
    drop(node);
  };

  const getIconSrc = () => {
    if (!skill) return null;
    
    if (skill.ability) {
      return `${ABILITY_PATH}${skill.ability.class?.name || "default"}/${skill.ability.iconUrl || "default-icon.webp"}`;
    }
    if (skill.passive) {
      return `${ABILITY_PATH}${skill.passive.class?.name || "default"}/${skill.passive.iconUrl || "default-icon.webp"}`;
    }
    if (skill.stigma) {
      const className = skill.stigma.classes?.[0]?.name || "default";
      return `${ABILITY_PATH}${className}/${skill.stigma.iconUrl || "default-icon.webp"}`;
    }
    return null;
  };

  const getSkillName = () => {
    if (!skill) return "";
    return skill.ability?.name || skill.passive?.name || skill.stigma?.name || "";
  };

  const getLevel = () => {
    if (!skill) return null;
    return skill.buildAbility?.level || skill.buildPassive?.level || skill.buildStigma?.level || null;
  };

  const iconSrc = getIconSrc();
  const skillName = getSkillName();
  const level = getLevel();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default context menu
    
    // If there's a skill in the slot, clear it
    if (skill) {
      onClear(slotId);
      return;
    }
    
    // If there's a selected skill, place it in this slot
    if (selectedSkill && (selectedSkill.type === "ability" || selectedSkill.type === "stigma")) {
      onDrop(slotId, selectedSkill);
      setSelectedSkill(null); // Clear selection after placing
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only handle click if we're not dragging and there's a selected skill
    if (!isDragging && selectedSkill && (selectedSkill.type === "ability" || selectedSkill.type === "stigma")) {
      e.stopPropagation();
      onDrop(slotId, selectedSkill);
      setSelectedSkill(null); // Clear selection after placing
    }
  };

  return (
    <div
      ref={ref}
      className={`
        relative w-14 h-14  border-x-2 border-foreground/30 bg-background/80
        flex items-center justify-center
        transition-all cursor-move
        ${isDragging ? "opacity-50" : ""}
        ${isOver ? "border-orange-500 bg-orange-500/20" : ""}
        ${skill ? "border-yellow-500/50" : "border-foreground/30"}
        ${className}
      `}
      onDoubleClick={() => skill && onClear(slotId)}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      title={skillName || "Empty slot - Drag a skill here"}
    >
      {iconSrc ? (
        <>
          <Image
            src={iconSrc}
            alt={skillName}
            width={48}
            height={48}
            className="w-full h-full rounded-md object-cover"
          />
          {level !== null && level > 0 && (
            <div className="absolute bottom-0.5 right-1.5 text-xs font-bold text-foreground pointer-events-none">
              Lv.{level}
            </div>
          )}
        </>
      ) : (
        <div className="text-foreground/20 text-xs">+</div>
      )}
    </div>
  );
};

