"use client";

import { ABILITY_PATH } from "@/constants/paths";
import { useBuildStore } from "@/store/useBuildEditor";
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
  isReserved?: boolean; // If true, this slot is reserved and cannot be dragged from or have other skills dropped in
  isStigmaOnly?: boolean; // If true, this slot only accepts stigmas
};

export const ShortcutSlot = ({ slotId, skill, onDrop, onClear, className = "", isReserved = false, isStigmaOnly = false }: ShortcutSlotProps) => {
  const { selectedSkill, setSelectedSkill } = useShortcutContext();
  const { build } = useBuildStore();
  
  const [{ isDragging }, drag] = useDrag({
    type: "skill",
    item: { skill, slotId },
    canDrag: () => !!skill && !isReserved, // Cannot drag from reserved slot
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "skill",
    canDrop: (item: { skill?: ShortcutSlotProps["skill"]; slotId?: number }) => {
      // Reserved slots can only accept the reserved skill
      if (isReserved) {
        // The reserved slot logic is handled in handleDrop, so we allow drop here
        // but handleDrop will redirect if needed
        return true;
      }
      // Stigma-only slots can only accept stigmas
      if (isStigmaOnly) {
        const skillToDrop = item?.skill;
        if (skillToDrop && "type" in skillToDrop) {
          return skillToDrop.type === "stigma";
        }
        return false;
      }
      // Non-stigma-only slots can only accept abilities (not stigmas)
      const skillToDrop = item?.skill;
      if (skillToDrop && "type" in skillToDrop) {
        return skillToDrop.type === "ability";
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
        // Stigma-only slots can only accept stigmas
        if (isStigmaOnly) {
          if (skillToDrop.type === "stigma") {
            onDrop(slotId, skillToDrop, sourceSlotId);
          }
        } else {
          // Non-stigma-only slots can only accept abilities
          if (skillToDrop.type === "ability") {
            onDrop(slotId, skillToDrop, sourceSlotId);
          }
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
      const className = skill.ability.class?.name || build?.class?.name;
      if (!className) return null;
      return `${ABILITY_PATH}${className}/${skill.ability.iconUrl || "default-icon.webp"}`;
    }
    if (skill.passive) {
      const className = skill.passive.class?.name || build?.class?.name;
      if (!className) return null;
      return `${ABILITY_PATH}${className}/${skill.passive.iconUrl || "default-icon.webp"}`;
    }
    if (skill.stigma) {
      // Use build class name first, then stigma classes, never use "default"
      const className = build?.class?.name || skill.stigma.classes?.[0]?.name;
      if (!className) return null;
      return `${ABILITY_PATH}${className}/${skill.stigma.iconUrl || "default-icon.webp"}`;
    }
    return null;
  };

  const getSkillName = () => {
    if (!skill) return "";
    return skill.ability?.name || skill.passive?.name || skill.stigma?.name || "";
  };

  const iconSrc = getIconSrc();
  const skillName = getSkillName();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default context menu
    
    // Cannot clear reserved slot
    if (isReserved) {
      return;
    }
    
    // If there's a skill in the slot, clear it
    if (skill) {
      onClear(slotId);
      return;
    }
    
    // If there's a selected skill, place it in this slot
    if (selectedSkill) {
      // Stigma-only slots can only accept stigmas
      if (isStigmaOnly && selectedSkill.type === "stigma") {
        onDrop(slotId, selectedSkill);
        setSelectedSkill(null); // Clear selection after placing
      }
      // Non-stigma-only slots can only accept abilities
      else if (!isStigmaOnly && selectedSkill.type === "ability") {
        onDrop(slotId, selectedSkill);
        setSelectedSkill(null); // Clear selection after placing
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Cannot place skills in reserved slot via click (only the reserved skill can be there)
    if (isReserved) {
      return;
    }
    // Stigma-only slots can only accept stigmas via click
    if (isStigmaOnly && selectedSkill && selectedSkill.type !== "stigma") {
      return;
    }
    // Non-stigma-only slots can only accept abilities via click
    if (!isStigmaOnly && selectedSkill && selectedSkill.type === "stigma") {
      return;
    }
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
        ${skill ? "border-foreground/80" : "border-foreground/30"}
        ${className}
      `}
      onDoubleClick={() => skill && onClear(slotId)}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      title={skillName || "Empty slot - Drag a skill here"}
    >
      {iconSrc ? (
        <Image
          src={iconSrc}
          alt={skillName}
          width={48}
          height={48}
          className="w-full h-full rounded-md object-cover"
        />
      ) : (
        <div className="text-foreground/20 text-xs">+</div>
      )}
    </div>
  );
};

