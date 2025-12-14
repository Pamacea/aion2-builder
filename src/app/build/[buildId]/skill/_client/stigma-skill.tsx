"use client";

import { ABILITY_PATH } from "@/constants/paths";
import { useBuildStore } from "@/store/useBuildEditor";
import { BuildStigmaType, StigmaType } from "@/types/schema";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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

  // Check if this skill is selected for shortcut
  const isSelectedForShortcut =
    selectedSkill?.type === "stigma" &&
    selectedSkill.stigma?.id === stigma.id &&
    selectedSkill.buildStigma?.id === buildStigma?.id;

  // Deselect skill automatically if level drops to 0 (only if in build)
  useEffect(() => {
    if (isSelectedForShortcut && currentLevel === 0 && isInBuild) {
      setSelectedSkill(null);
    }
  }, [currentLevel, isSelectedForShortcut, isInBuild, setSelectedSkill]);

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
    // But prevent selection if in build with level 0 (locked)
    if (!isDragging && (!isInBuild || currentLevel > 0)) {
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
      // If not in build or locked, just show details
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
    // But prevent selection if in build with level 0 (locked)
    if (!isInBuild || currentLevel > 0) {
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
      } ${isInBuild ? "cursor-move" : ""}`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {/* Icon with gold border */}
      {classNameForPath ? (
        <Image
          src={`${ABILITY_PATH}${classNameForPath}/${stigma.iconUrl || "default-icon.webp"}`}
          alt={stigma.name}
          width={48}
          height={48}
          className={`w-full h-full rounded-md object-cover border-2 ${
            currentLevel === 0 ? "grayscale opacity-50" : ""
          } ${
            selected
              ? "border-yellow-500"
              : isInBuild
                ? "border-yellow-400/50"
                : "border-yellow-600/30"
          }`}
        />
      ) : (
        <div
          className={`w-full h-full rounded-md border-2 flex items-center justify-center ${
            currentLevel === 0 ? "grayscale opacity-50" : ""
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
      {/* Lock icon when level is 0 */}
      {currentLevel === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Image
            src="/icons/lock-logo.webp"
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
              src="/icons/skill-selected-icon.webp"
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
