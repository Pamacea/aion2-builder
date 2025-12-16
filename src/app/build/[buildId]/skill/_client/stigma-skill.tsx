"use client";

import { ABILITY_PATH } from "@/constants/paths";
import { useBuildStore } from "@/store/useBuildEditor";
import { BuildStigmaType, StigmaType } from "@/types/schema";
import { isStarterBuild } from "@/utils/buildUtils";
import Image from "next/image";
import { startTransition, useEffect, useRef, useState } from "react";
import { DragSourceMonitor, useDrag } from "react-dnd";
import { useShortcutContext } from "../_context/ShortcutContext";

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
  const [imageError, setImageError] = useState(false);
  const { selectedSkill, setSelectedSkill } = useShortcutContext();
  const hasClickedOnceRef = useRef(false);

  // Get class name from build first, then from stigma classes, never use "default"
  const classNameForPath = build?.class?.name || stigma.classes?.[0]?.name;

  // If no class name found, log error and don't render image
  if (!classNameForPath) {
    console.error(
      `No class name found for stigma ${stigma.id} (${stigma.name})`
    );
  }

  const currentLevel = buildStigma?.level ?? 0;
  const isInBuild = buildStigma !== undefined;
  const isStarter = isStarterBuild(build);

  // Count stigmas with level >= 1 to check if limit is reached
  const stigmasWithLevelOneOrMore = build?.stigmas?.filter((s) => s.level >= 1) || [];
  const stigmaCountAtLevelOneOrMore = stigmasWithLevelOneOrMore.length;
  const maxStigmasAllowed = 4;
  
  // Check if this stigma is locked due to the 4-stigma limit
  // A stigma is locked if:
  // - It's not in build or has level 0
  // - AND we already have 4 stigmas with level >= 1
  const isLockedByLimit = 
    (currentLevel === 0 || !isInBuild) && 
    stigmaCountAtLevelOneOrMore >= maxStigmasAllowed;

  // Build image path with fallback
  const iconUrl = stigma.iconUrl || "default-icon.webp";
  const baseImageSrc = classNameForPath 
    ? `${ABILITY_PATH}${classNameForPath}/${iconUrl}`
    : "/icons/default-spell-icon.webp";
  const imageSrc = imageError 
    ? "/icons/IC_Ability_Default.webp"
    : baseImageSrc;

  // Create a unique key for the image component to force remount when image changes
  // This resets the error state automatically when the image source changes
  const imageKey = `${stigma.id}-${baseImageSrc}`;
  
  // Reset image error when image key changes (using startTransition to avoid cascading renders)
  useEffect(() => {
    startTransition(() => {
      setImageError(false);
    });
  }, [imageKey]);

  // Check if this skill is selected for shortcut
  const isSelectedForShortcut =
    selectedSkill?.type === "stigma" &&
    selectedSkill.stigma?.id === stigma.id &&
    selectedSkill.buildStigma?.id === buildStigma?.id;

  // Deselect skill automatically if level drops to 0 or if starter build (only if in build)
  useEffect(() => {
    if (isSelectedForShortcut && ((currentLevel === 0 && isInBuild) || isStarter)) {
      setSelectedSkill(null);
    }
  }, [currentLevel, isSelectedForShortcut, isInBuild, isStarter, setSelectedSkill]);


  // Reset click tracking when selection changes or when details are shown
  useEffect(() => {
    if (!isSelectedForShortcut) {
      // If details are already shown, we can directly select for shortcut on next click
      const selected = onSelect ? isSelected : localSelected;
      hasClickedOnceRef.current = selected;
    }
  }, [isSelectedForShortcut, isSelected, localSelected, onSelect]);

  const selected = onSelect ? isSelected : localSelected;

  const [{ isDragging }, drag] = useDrag({
    type: "skill",
    item: {
      skill: {
        type: "stigma" as const,
        stigma,
        buildStigma,
      },
    },
    canDrag: () => {
      // Cannot drag if starter build
      if (isStarter) return false;
      // Allow drag if not in build (will be added on drop)
      // But prevent drag if in build with level 0 (locked)
      if (!isInBuild) return true;
      return currentLevel > 0;
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleClick = () => {
    // Handle left click (only if not dragging and not locked)
    // Allow selection if not in build (for shortcut placement)
    // But prevent selection if in build with level 0 (locked) or if starter build
    if (!isDragging && !isStarter && (!isInBuild || currentLevel > 0)) {
      // If already selected for shortcut, deselect on click
      if (isSelectedForShortcut) {
        setSelectedSkill(null);
        hasClickedOnceRef.current = selected; // Keep track of details state
      } else {
        // If details are already shown, directly select for shortcut
        if (selected) {
          setSelectedSkill({
            type: "stigma",
            stigma,
            buildStigma,
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
              type: "stigma",
              stigma,
              buildStigma,
            });
            hasClickedOnceRef.current = false;
          }
        }
      }
    } else {
      // If not in build or locked or starter build, just show details
      if (onSelect) {
        onSelect();
      } else {
        setLocalSelected(!localSelected);
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    // Handle right click for selection - toggle behavior
    // Allow selection if not in build (for shortcut placement)
    // But prevent selection if in build with level 0 (locked) or if starter build
    if (!isStarter && (!isInBuild || currentLevel > 0)) {
      // Toggle selection: if already selected, deselect it
      if (isSelectedForShortcut) {
        setSelectedSkill(null);
        hasClickedOnceRef.current = selected; // Keep track of details state
      } else {
        setSelectedSkill({
          type: "stigma",
          stigma,
          buildStigma,
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
      className={`relative cursor-pointer transition-all ${className}  inline-block w-14 h-14 ${
        isDragging ? "opacity-50" : ""
      } ${isInBuild && !isStarter ? "cursor-move" : ""} ${isStarter ? "cursor-not-allowed" : ""}`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {/* Icon with gold border */}
      {classNameForPath ? (
        <div
          className={`w-full h-full rounded-md border-2 flex items-center justify-center ${
            imageError ? "bg-background/80" : ""
          } ${
            currentLevel === 0 || isLockedByLimit ? "grayscale opacity-50" : ""
          } ${
            selected
              ? "border-yellow-500"
              : isInBuild
                ? "border-yellow-400/50"
                : "border-yellow-600/30"
          }`}
        >
          <Image
            key={imageKey}
            src={imageSrc}
            alt={stigma.name}
            width={48}
            height={48}
            onError={() => setImageError(true)}
            className={`rounded-md object-contain ${
              imageError ? "w-3/4 h-3/4" : "w-full h-full object-cover"
            }`}
          />
        </div>
      ) : (
        <div
          className={`w-full h-full rounded-md border-2 flex items-center justify-center ${
            currentLevel === 0 || isLockedByLimit ? "grayscale opacity-50" : ""
          } ${
            selected
              ? "border-yellow-500"
              : isInBuild
                ? "border-yellow-400/50"
                : "border-yellow-600/30"
          }`}
        >
          <span className="text-xs text-foreground/50">?</span>
        </div>
      )}
      {/* Lock icon when level is 0 or locked by limit */}
      {(currentLevel === 0 || isLockedByLimit) && (
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
