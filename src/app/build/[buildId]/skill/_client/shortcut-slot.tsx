"use client";

import { ABILITY_PATH } from "@/constants/paths";
import { useBuildStore } from "@/store/useBuildEditor";
import { ShortcutSlotProps } from "@/types/shortcut.type";
import { isStarterBuild } from "@/utils/buildUtils";
import Image from "next/image";
import { useRef, useState } from "react";
import { DragSourceMonitor, DropTargetMonitor, useDrag, useDrop } from "react-dnd";
import { useShortcutContext } from "../_context/ShortcutContext";


export const ShortcutSlot = ({ slotId, skill, onDrop, onClear, className = "", isReserved = false, isStigmaOnly = false }: ShortcutSlotProps) => {
  const { selectedSkill, setSelectedSkill } = useShortcutContext();
  const { build } = useBuildStore();
  const [imageError, setImageError] = useState(false);
  const prevIconSrcRef = useRef<string | null>(null);
  const isStarter = isStarterBuild(build);
  
  const [{ isDragging }, drag] = useDrag({
    type: "skill",
    item: { skill, slotId },
    canDrag: () => !isStarter && !!skill && !isReserved, // Cannot drag if starter build or from reserved slot
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "skill",
    canDrop: (item: { skill?: ShortcutSlotProps["skill"]; slotId?: number }) => {
      // Cannot drop if starter build
      if (isStarter) {
        return false;
      }

      const skillToDrop = item?.skill;
      
      // If no skill to drop, cannot drop
      if (!skillToDrop) {
        return false;
      }
      
      // Check if skillToDrop has a type property
      if (!("type" in skillToDrop)) {
        return false;
      }
      
      // Reserved slots can only accept the reserved skill
      // The reserved slot logic is handled in handleDrop, so we allow drop here
      // but handleDrop will redirect if needed
      if (isReserved) {
        return true;
      }
      
      // Stigma-only slots can only accept stigmas
      if (isStigmaOnly) {
        return skillToDrop.type === "stigma";
      }
      
      // Non-stigma-only slots can only accept abilities (not stigmas)
      return skillToDrop.type === "ability";
    },
    drop: (item: { skill?: ShortcutSlotProps["skill"]; slotId?: number }) => {
      // The item from skill components has the structure: { skill: { type, ability/passive/stigma, buildAbility/buildPassive/buildStigma } }
      // The item from another slot has: { skill, slotId }
      // Only accept ability and stigma, reject passive
      const skillToDrop = item?.skill;
      const sourceSlotId = item?.slotId; // If present, this means the drag came from another slot
      
      // If no skill to drop, do nothing
      if (!skillToDrop || !("type" in skillToDrop)) {
        return;
      }
      
      // Stigma-only slots can only accept stigmas
      if (isStigmaOnly) {
        if (skillToDrop.type === "stigma") {
          onDrop(slotId, skillToDrop, sourceSlotId);
        }
        return;
      }
      
      // Reserved slots: handled in handleDrop
      if (isReserved) {
        onDrop(slotId, skillToDrop, sourceSlotId);
        return;
      }
      
      // Non-stigma-only, non-reserved slots can only accept abilities
      if (skillToDrop.type === "ability") {
        onDrop(slotId, skillToDrop, sourceSlotId);
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
  
  // Reset image error when iconSrc changes (new skill or skill change)
  if (prevIconSrcRef.current !== iconSrc) {
    prevIconSrcRef.current = iconSrc;
    if (imageError) {
      setImageError(false);
    }
  }
  
  // Build image path with fallback
  const imageSrc = imageError 
    ? "/icons/IC_Ability_Default.webp"
    : iconSrc || "/icons/default-spell-icon.webp";
  
  // Create a key for the image to reset error state when skill changes
  const imageKey = `${skill?.ability?.id || skill?.passive?.id || skill?.stigma?.id || 'empty'}-${iconSrc}`;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default context menu
    
    // Cannot modify shortcuts if starter build
    if (isStarter) {
      return;
    }
    
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
    // Cannot place skills if starter build
    if (isStarter) {
      return;
    }
    // Cannot place skills in reserved slot via click (only the reserved skill can be there)
    // This is handled by handleDrop, so we just prevent the click
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
        relative w-6 h-6 md:w-8 md:h-8 lg:w-12 lg:h-12 xl:w-14 xl:h-14
        border-2 border-foreground/30 bg-background/80
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
          key={imageKey}
          src={imageSrc}
          alt={skillName}
          width={48}
          height={48}
          onError={() => setImageError(true)}
          className={`w-full h-full rounded-md object-cover ${
            imageError ? "bg-background/80 scale-70" : ""
          }`}
        />
      ) : (
        <div className="text-foreground/20 text-[10px] sm:text-xs">+</div>
      )}
    </div>
  );
};

