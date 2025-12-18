"use client";

import { useDaevanionStore } from "@/app/build/[buildId]/sphere/_store/useDaevanionStore";
import { ABILITY_PATH } from "@/constants/paths";
import { useBuildStore } from "@/store/useBuildEditor";
import { AbilityType, BuildAbilityType } from "@/types/schema";
import { isBuildOwner, isStarterBuild } from "@/utils/buildUtils";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  const { build, currentUserId, addAbility, updateAbilityLevel } = useBuildStore();
  const { getDaevanionBoostForSkill } = useDaevanionStore();
  const [localSelected, setLocalSelected] = useState(isSelected);
  const [imageError, setImageError] = useState(false);
  const [daevanionBoost, setDaevanionBoost] = useState(0);
  const { selectedSkill, setSelectedSkill } = useShortcutContext();
  const hasClickedOnceRef = useRef(false);
  const lastClickTimeRef = useRef<number>(0);
  const clickButtonRef = useRef<"left" | "right" | null>(null);

  const baseLevel = buildAbility?.level ?? 0;
  
  // Calculer le boost Daevanion
  useEffect(() => {
    let cancelled = false;
    const fetchBoost = async () => {
      const boost = await getDaevanionBoostForSkill(ability.id, "ability");
      if (!cancelled) {
        setDaevanionBoost(boost);
      }
    };
    fetchBoost();
    return () => {
      cancelled = true;
    };
  }, [ability.id, getDaevanionBoostForSkill]);

  const currentLevel = baseLevel + daevanionBoost;
  const isInBuild = buildAbility !== undefined;
  const isStarter = isStarterBuild(build);
  const isOwner = build ? isBuildOwner(build, currentUserId) : false;

  // Check if skill is locked/not in build/level 0 (eligible for double-click to add)
  // Utiliser le niveau de base pour déterminer si le skill est verrouillé
  const isLockedOrNotInBuild = !isInBuild || baseLevel === 0;

  // Build image path
  const classNameForPath = ability.class?.name || "default";
  const iconUrl = ability.iconUrl || "default-icon.webp";
  const imageSrc = imageError 
    ? "/icons/IC_Ability_Default.webp"
    : `${ABILITY_PATH}${classNameForPath}/${iconUrl}`;
  
  // Check if this skill is selected for shortcut
  const isSelectedForShortcut = selectedSkill?.type === "ability" && 
    selectedSkill.ability?.id === ability.id && 
    selectedSkill.buildAbility?.id === buildAbility?.id;

  // Reset click tracking when selection changes or when details are shown
  useEffect(() => {
    if (!isSelectedForShortcut) {
      // If details are already shown, we can directly select for shortcut on next click
      const selected = onSelect ? isSelected : localSelected;
      hasClickedOnceRef.current = selected;
    }
  }, [isSelectedForShortcut, isSelected, localSelected, onSelect]);

  const selected = onSelect ? isSelected : localSelected;

  // Deselect skill automatically if level drops to 0 or if starter build
  useEffect(() => {
    if (isSelectedForShortcut && ((currentLevel === 0 && isInBuild) || isStarter)) {
      setSelectedSkill(null);
    }
  }, [currentLevel, isSelectedForShortcut, isInBuild, isStarter, setSelectedSkill]);

  // Exception : l'ability ID 12 ne peut jamais être draguée pour les shortcuts
  const isAbility12 = ability.id === 12;
  
  const [{ isDragging }, drag] = useDrag({
    type: "skill",
    item: {
      skill: {
        type: "ability" as const,
        ability,
        buildAbility,
      },
    },
    canDrag: () => !isStarter && !isAbility12 && (!isInBuild || currentLevel > 0), // Cannot drag if ability ID 12, can drag otherwise if not in build or if in build with level > 0
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleClick = () => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;
    const isDoubleClick = timeSinceLastClick < 300 && clickButtonRef.current === "left";
    
    lastClickTimeRef.current = now;
    clickButtonRef.current = "left";

    // Handle double-click to add skill to build (locked/not in build/level 0)
    if (isDoubleClick && isLockedOrNotInBuild && !isStarter && !isAbility12 && isOwner) {
      if (!isInBuild) {
        // Add ability to build with level 1
        addAbility(ability.id, 1);
      } else if (currentLevel === 0) {
        // Update existing ability from level 0 to level 1
        updateAbilityLevel(ability.id, 1);
      }
      return; // Prevent normal click handling on double-click
    }

    // Handle left click (only if not dragging, not locked, and not starter build)
    if (!isDragging && !isStarter && !isAbility12 && (!isInBuild || currentLevel > 0)) {
      // If already selected for shortcut, deselect on click
      if (isSelectedForShortcut) {
        setSelectedSkill(null);
        hasClickedOnceRef.current = selected; // Keep track of details state
      } else {
        // If details are already shown, directly select for shortcut
        if (selected) {
          setSelectedSkill({
            type: "ability",
            ability,
            buildAbility,
          });
          hasClickedOnceRef.current = false;
        } else {
          // First click: show details only, don't select for shortcut
          if (!hasClickedOnceRef.current) {
            hasClickedOnceRef.current = true;
            // Show details via onSelect
            if (onSelect) {
              onSelect();
            } else {
              setLocalSelected(!localSelected);
            }
          } else {
            // Second click: select for shortcut
            setSelectedSkill({
              type: "ability",
              ability,
              buildAbility,
            });
            hasClickedOnceRef.current = false;
          }
        }
      }
    } else {
      // If locked or starter build, just show details
      if (onSelect) {
        onSelect();
      } else {
        setLocalSelected(!localSelected);
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;
    const isDoubleClick = timeSinceLastClick < 300 && clickButtonRef.current === "right";
    
    lastClickTimeRef.current = now;
    clickButtonRef.current = "right";

    // Handle double right-click to add skill to build (locked/not in build/level 0)
    if (isDoubleClick && isLockedOrNotInBuild && !isStarter && !isAbility12 && isOwner) {
      if (!isInBuild) {
        // Add ability to build with level 1
        addAbility(ability.id, 1);
      } else if (currentLevel === 0) {
        // Update existing ability from level 0 to level 1
        updateAbilityLevel(ability.id, 1);
      }
      return; // Prevent normal right-click handling on double-click
    }

    // Handle right click for selection - toggle behavior (only if not locked, not starter build, and not ability ID 12)
    if (isInBuild && currentLevel > 0 && !isStarter && !isAbility12) {
      // Toggle selection: if already selected, deselect it
      if (isSelectedForShortcut) {
        setSelectedSkill(null);
        hasClickedOnceRef.current = selected; // Keep track of details state
      } else {
        setSelectedSkill({
          type: "ability",
          ability,
          buildAbility,
        });
        hasClickedOnceRef.current = false;
      }
    }
  };

  // Create ref callback for drag
  const dragRef = (node: HTMLDivElement | null) => {
    drag(node);
  };

  return (
    <div
      ref={dragRef}
      className={`relative transition-all ${className} inline-block w-14 h-14 ${
        isDragging ? "opacity-50" : ""
      } ${
        isAbility12 || isStarter
          ? "cursor-not-allowed"
          : isInBuild
            ? "cursor-move"
            : "cursor-pointer"
      }`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
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
          alt={ability.name}
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
      {/* Selection indicator for shortcut */}
      {isSelectedForShortcut && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full bg-background/50 flex items-center justify-center border-2 border-foreground/50">
            <Image
              src="/icons/IC_Feature_SelectnDrop.webp"
              alt="Selected Icon"
              width={32}
              height={32}
              className="opacity-80"
            />
          </div>
        </div>
      )}
    </div>
  );
};

