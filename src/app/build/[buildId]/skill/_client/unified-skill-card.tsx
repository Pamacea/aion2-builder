"use client";

import { useDaevanionStore } from "@/app/build/[buildId]/sphere/_store/useDaevanionStore";
import { ABILITY_PATH } from "@/constants/paths";
import { useBuildStore } from "@/store/useBuildEditor";
import {
  AbilityType,
  BuildAbilityType,
  BuildPassiveType,
  BuildStigmaType,
  PassiveType,
  StigmaType,
} from "@/types/schema";
import { canEditBuild, isStarterBuild } from "@/utils/buildUtils";
import { getIconUrl } from "@/utils/iconUrl";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DragSourceMonitor, useDrag } from "react-dnd";
import { useShortcutContext } from "../_context/ShortcutContext";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type SkillType = "ability" | "passive" | "stigma";

type BaseSkillData = {
  type: SkillType;
  id: number;
  name: string;
  iconUrl: string | null | undefined;
  class?: { name: string } | null;
};

type AbilitySkillData = BaseSkillData & {
  type: "ability";
  ability: AbilityType;
  buildAbility?: BuildAbilityType;
};

type PassiveSkillData = BaseSkillData & {
  type: "passive";
  passive: PassiveType;
  buildPassive?: BuildPassiveType;
};

type StigmaSkillData = Omit<BaseSkillData, "class"> & {
  type: "stigma";
  stigma: StigmaType;
  buildStigma?: BuildStigmaType;
  classes?: Array<{ name: string }> | null;
};

type UnifiedSkillProps = {
  skillData: AbilitySkillData | PassiveSkillData | StigmaSkillData;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
};

// ============================================================================
// CUSTOM COMPARISON FUNCTION FOR REACT.MEMO
// ============================================================================

const arePropsEqual = (
  prevProps: UnifiedSkillProps,
  nextProps: UnifiedSkillProps
): boolean => {
  // Compare skill data
  const prevSkill = prevProps.skillData;
  const nextSkill = nextProps.skillData;

  // Different skill type - should re-render
  if (prevSkill.type !== nextSkill.type) return false;

  // Different skill ID - should re-render
  if (prevSkill.id !== nextSkill.id) return false;

  // Different selection state - should re-render
  if (prevProps.isSelected !== nextProps.isSelected) return false;

  // Different onSelect handler - should re-render (uncommon)
  if (prevProps.onSelect !== nextProps.onSelect) return false;

  // Different className - should re-render (uncommon)
  if (prevProps.className !== nextProps.className) return false;

  // Type-specific comparisons
  if (prevSkill.type === "ability" && nextSkill.type === "ability") {
    const prevLevel = prevSkill.buildAbility?.level ?? 0;
    const nextLevel = nextSkill.buildAbility?.level ?? 0;
    return prevLevel === nextLevel;
  }

  if (prevSkill.type === "passive" && nextSkill.type === "passive") {
    const prevLevel = prevSkill.buildPassive?.level ?? 0;
    const nextLevel = nextSkill.buildPassive?.level ?? 0;
    return prevLevel === nextLevel;
  }

  if (prevSkill.type === "stigma" && nextSkill.type === "stigma") {
    const prevLevel = prevSkill.buildStigma?.level ?? 0;
    const nextLevel = nextSkill.buildStigma?.level ?? 0;
    return prevLevel === nextLevel;
  }

  return false;
};

// ============================================================================
// HOOKS FOR SELECTIVE STORE SUBSCRIPTIONS
// ============================================================================

/**
 * Hook to subscribe only to the relevant Daevanion paths
 * Prevents unnecessary re-renders when unrelated paths change
 */
const useDaevanionBuildKey = () => {
  // Individual selectors for each path - this is critical for performance
  const nezekan = useDaevanionStore((state) => state.daevanionBuild.nezekan);
  const zikel = useDaevanionStore((state) => state.daevanionBuild.zikel);
  const vaizel = useDaevanionStore((state) => state.daevanionBuild.vaizel);
  const triniel = useDaevanionStore((state) => state.daevanionBuild.triniel);
  const ariel = useDaevanionStore((state) => state.daevanionBuild.ariel);
  const azphel = useDaevanionStore((state) => state.daevanionBuild.azphel);

  // Create a stable dependency based on content
  return useMemo(
    () => JSON.stringify({ nezekan, zikel, vaizel, triniel, ariel, azphel }),
    [nezekan, zikel, vaizel, triniel, ariel, azphel]
  );
};

/**
 * Hook to compute Daevanion boost with memoization
 */
const useDaevanionBoost = (
  skillId: number,
  skillType: "ability" | "passive",
  daevanionBuildKey: string
) => {
  const { getDaevanionBoostForSkill } = useDaevanionStore();
  const [boost, setBoost] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchBoost = async () => {
      const computedBoost = await getDaevanionBoostForSkill(skillId, skillType);
      if (!cancelled) {
        setBoost(computedBoost);
      }
    };

    fetchBoost();

    return () => {
      cancelled = true;
    };
  }, [skillId, skillType, getDaevanionBoostForSkill, daevanionBuildKey]);

  return boost;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const UnifiedSkillCard = React.memo(
  ({
    skillData,
    isSelected = false,
    onSelect,
    className = "",
  }: UnifiedSkillProps) => {
    const { build, currentUserId, addAbility, updateAbilityLevel, addPassive, updatePassiveLevel, addStigma, updateStigmaLevel } =
      useBuildStore();
    const { selectedSkill, setSelectedSkill } = useShortcutContext();

    // ========================================================================
    // STATE & REFS
    // ========================================================================

    const [localSelected, setLocalSelected] = useState(isSelected);
    const [imageError, setImageError] = useState(false);
    const hasClickedOnceRef = useRef(false);
    const lastClickTimeRef = useRef<number>(0);
    const clickButtonRef = useRef<"left" | "right" | null>(null);

    // ========================================================================
    // MEMOIZED COMPUTATIONS
    // ========================================================================

    const daevanionBuildKey = useDaevanionBuildKey();

    // Extract base skill info with memoization
    const skillInfo = useMemo(() => {
      if (skillData.type === "ability") {
        return {
          type: skillData.type,
          id: skillData.id,
          name: skillData.name,
          iconUrl: skillData.iconUrl,
          classNameForPath: (skillData as AbilitySkillData).class?.name || "default",
          buildEntity: skillData.buildAbility,
          isInBuild: skillData.buildAbility !== undefined,
          baseLevel: skillData.buildAbility?.level ?? 0,
          isAbility12: skillData.id === 12,
        };
      }

      if (skillData.type === "passive") {
        return {
          type: skillData.type,
          id: skillData.id,
          name: skillData.name,
          iconUrl: skillData.iconUrl,
          classNameForPath: (skillData as PassiveSkillData).class?.name || "default",
          buildEntity: skillData.buildPassive,
          isInBuild: skillData.buildPassive !== undefined,
          baseLevel: skillData.buildPassive?.level ?? 0,
          isAbility12: false,
        };
      }

      // Stigma
      const classNameForPath =
        build?.class?.name ||
        (skillData as StigmaSkillData).classes?.[0]?.name ||
        "default";

      return {
        type: skillData.type,
        id: skillData.id,
        name: skillData.name,
        iconUrl: skillData.iconUrl,
        classNameForPath,
        buildEntity: (skillData as StigmaSkillData).buildStigma,
        isInBuild: (skillData as StigmaSkillData).buildStigma !== undefined,
        baseLevel: (skillData as StigmaSkillData).buildStigma?.level ?? 0,
        isAbility12: false,
      };
    }, [skillData, build?.class?.name]);

    // Daevanion boost computation (only for ability and passive)
    const daevanionBoost = useDaevanionBoost(
      skillInfo.id,
      skillInfo.type === "ability" ? "ability" : "passive",
      daevanionBuildKey
    );

    // Current level computation
    const currentLevel = useMemo(
      () => skillInfo.baseLevel + daevanionBoost,
      [skillInfo.baseLevel, daevanionBoost]
    );

    const isEffectivelyInBuild = skillInfo.isInBuild || currentLevel > 0;
    const isStarter = isStarterBuild(build);
    const canEdit = build ? canEditBuild(build, currentUserId) : false;
    const isLockedOrNotInBuild = !skillInfo.isInBuild || skillInfo.baseLevel === 0;

    // Stigma-specific limit computation
    const stigmaLimitInfo = useMemo(() => {
      if (skillInfo.type !== "stigma") {
        return { isLockedByLimit: false, canAddOrIncrement: true };
      }

      const stigmasWithLevelOneOrMore =
        build?.stigmas?.filter((s) => s.level >= 1) || [];
      const stigmaCountAtLevelOneOrMore = stigmasWithLevelOneOrMore.length;
      const maxStigmasAllowed = 4;

      const isLockedByLimit =
        (currentLevel === 0 || !skillInfo.isInBuild) &&
        stigmaCountAtLevelOneOrMore >= maxStigmasAllowed;

      const canAddOrIncrement = () => {
        if (skillInfo.isInBuild && currentLevel >= 1) {
          return true;
        }
        return stigmaCountAtLevelOneOrMore < maxStigmasAllowed;
      };

      return { isLockedByLimit, canAddOrIncrement: canAddOrIncrement() };
    }, [skillInfo.type, skillInfo.isInBuild, currentLevel, build?.stigmas]);

    // Image path computation
    const imageSrc = useMemo(() => {
      const localPath = `${ABILITY_PATH}${skillInfo.classNameForPath}/`;
      return imageError
        ? "/icons/IC_Ability_Default.webp"
        : getIconUrl(skillInfo.iconUrl, localPath);
    }, [skillInfo.iconUrl, skillInfo.classNameForPath, imageError]);

    // Selection state computation
    const isSelectedForShortcut = useMemo(() => {
      if (!selectedSkill) return false;

      if (skillInfo.type === "ability") {
        return (
          selectedSkill.type === "ability" &&
          selectedSkill.ability?.id === skillInfo.id &&
          selectedSkill.buildAbility?.id ===
            (skillData as AbilitySkillData).buildAbility?.id
        );
      }

      if (skillInfo.type === "passive") {
        return false; // Passives don't support shortcuts
      }

      // Stigma
      return (
        selectedSkill.type === "stigma" &&
        selectedSkill.stigma?.id === skillInfo.id &&
        selectedSkill.buildStigma?.id ===
          (skillData as StigmaSkillData).buildStigma?.id
      );
    }, [selectedSkill, skillInfo.type, skillInfo.id, skillData]);

    const selected = onSelect ? isSelected : localSelected;

    // ========================================================================
    // EFFECTS
    // ========================================================================

    // Reset click tracking when selection changes
    useEffect(() => {
      if (!isSelectedForShortcut) {
        hasClickedOnceRef.current = selected;
      }
    }, [isSelectedForShortcut, selected]);

    // Auto-deselect when level drops to 0 or if starter build
    useEffect(() => {
      if (
        isSelectedForShortcut &&
        ((currentLevel === 0 && skillInfo.isInBuild) || isStarter)
      ) {
        setSelectedSkill(null);
      }
    }, [
      currentLevel,
      isSelectedForShortcut,
      skillInfo.isInBuild,
      isStarter,
      setSelectedSkill,
    ]);

    // Image key reset for stigma
    useEffect(() => {
      setImageError(false);
    }, [skillInfo.id]);

    // ========================================================================
    // DRAG AND DROP
    // ========================================================================

    const [{ isDragging }, drag] = useDrag({
      type: "skill",
      item: {
        skill: skillData,
      },
      canDrag: () => {
        if (isStarter) return false;
        if (skillInfo.isAbility12) return false;

        if (skillInfo.type === "stigma") {
          if (!skillInfo.isInBuild) return true;
          return currentLevel > 0;
        }

        // Ability and Passive
        return !skillInfo.isInBuild || currentLevel > 0;
      },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const dragRef = useCallback(
      (node: HTMLDivElement | null) => {
        drag(node);
      },
      [drag]
    );

    // ========================================================================
    // EVENT HANDLERS ( useCallback for stability )
    // ========================================================================

    const handleDoubleClick = useCallback(
      (button: "left" | "right") => {
        if (!isLockedOrNotInBuild || isStarter || skillInfo.isAbility12 || !canEdit) {
          return false;
        }

        if (skillInfo.type === "stigma" && stigmaLimitInfo.isLockedByLimit) {
          return false;
        }

        if (skillInfo.type === "stigma" && !stigmaLimitInfo.canAddOrIncrement) {
          return false;
        }

        if (!skillInfo.isInBuild) {
          // Add to build with level 1
          if (skillInfo.type === "ability") {
            addAbility(skillInfo.id, 1);
          } else if (skillInfo.type === "passive") {
            addPassive(skillInfo.id, 1);
          } else if (skillInfo.type === "stigma") {
            addStigma(skillInfo.id, 1);
          }
        } else if (currentLevel === 0) {
          // Update existing skill from level 0 to level 1
          if (skillInfo.type === "ability") {
            updateAbilityLevel(skillInfo.id, 1);
          } else if (skillInfo.type === "passive") {
            updatePassiveLevel(skillInfo.id, 1);
          } else if (skillInfo.type === "stigma") {
            updateStigmaLevel(skillInfo.id, 1);
          }
        }

        return true;
      },
      [
        isLockedOrNotInBuild,
        isStarter,
        skillInfo.isAbility12,
        canEdit,
        skillInfo.type,
        skillInfo.isInBuild,
        skillInfo.id,
        currentLevel,
        stigmaLimitInfo.isLockedByLimit,
        stigmaLimitInfo.canAddOrIncrement,
        addAbility,
        addPassive,
        addStigma,
        updateAbilityLevel,
        updatePassiveLevel,
        updateStigmaLevel,
      ]
    );

    const handleClick = useCallback(() => {
      const now = Date.now();
      const timeSinceLastClick = now - lastClickTimeRef.current;
      const isDoubleClick =
        timeSinceLastClick < 300 && clickButtonRef.current === "left";

      lastClickTimeRef.current = now;
      clickButtonRef.current = "left";

      // Handle double-click to add skill
      if (isDoubleClick && handleDoubleClick("left")) {
        return;
      }

      // Normal click handling
      const canInteract =
        !isStarter &&
        !skillInfo.isAbility12 &&
        (!skillInfo.isInBuild || currentLevel > 0);

      if (!isDragging && canInteract) {
        // Shortcut selection (only for ability and stigma)
        if (skillInfo.type !== "passive") {
          if (isSelectedForShortcut) {
            setSelectedSkill(null);
            hasClickedOnceRef.current = selected;
          } else {
            if (selected) {
              setSelectedSkill({
                type: skillInfo.type,
                [skillInfo.type]: skillData,
              });
              hasClickedOnceRef.current = false;
            } else {
              if (!hasClickedOnceRef.current) {
                hasClickedOnceRef.current = true;
                if (onSelect) {
                  onSelect();
                } else {
                  setLocalSelected(!localSelected);
                }
              } else {
                setSelectedSkill({
                  type: skillInfo.type,
                  [skillInfo.type]: skillData,
                });
                hasClickedOnceRef.current = false;
              }
            }
          }
        } else {
          // Passive - just show details
          if (onSelect) {
            onSelect();
          } else {
            setLocalSelected(!localSelected);
          }
        }
      } else {
        // Locked or starter - just show details
        if (onSelect) {
          onSelect();
        } else {
          setLocalSelected(!localSelected);
        }
      }
    }, [
      isDragging,
      isStarter,
      skillInfo.isAbility12,
      skillInfo.isInBuild,
      currentLevel,
      skillInfo.type,
      isSelectedForShortcut,
      selected,
      skillData,
      onSelect,
      localSelected,
      setSelectedSkill,
      handleDoubleClick,
    ]);

    const handleContextMenu = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();

        const now = Date.now();
        const timeSinceLastClick = now - lastClickTimeRef.current;
        const isDoubleClick =
          timeSinceLastClick < 300 && clickButtonRef.current === "right";

        lastClickTimeRef.current = now;
        clickButtonRef.current = "right";

        // Handle double right-click to add skill
        if (isDoubleClick && handleDoubleClick("right")) {
          return;
        }

        // For passives: no right-click selection
        if (skillInfo.type === "passive") {
          return;
        }

        // For abilities: right-click toggles shortcut selection
        if (skillInfo.type === "ability") {
          if (skillInfo.isInBuild && currentLevel > 0 && !isStarter && !skillInfo.isAbility12) {
            if (isSelectedForShortcut) {
              setSelectedSkill(null);
              hasClickedOnceRef.current = selected;
            } else {
              setSelectedSkill({
                type: "ability",
                ability: (skillData as AbilitySkillData).ability,
                buildAbility: (skillData as AbilitySkillData).buildAbility,
              });
              hasClickedOnceRef.current = false;
            }
          }
        }

        // For stigmas: right-click does nothing (only double right-click adds)
      },
      [
        skillInfo.type,
        skillInfo.isInBuild,
        skillInfo.isAbility12,
        currentLevel,
        isStarter,
        isSelectedForShortcut,
        selected,
        skillData,
        setSelectedSkill,
        handleDoubleClick,
      ]
    );

    // ========================================================================
    // RENDER
    // ========================================================================

    const isLockedByLimit =
      skillInfo.type === "stigma" && stigmaLimitInfo.isLockedByLimit;

    return (
      <div
        ref={dragRef}
        className={`relative transition-all ${className} inline-block w-14 h-14 ${
          isDragging ? "opacity-50" : ""
        } ${
          skillInfo.isAbility12 || isStarter
            ? "cursor-not-allowed"
            : isEffectivelyInBuild
              ? "cursor-move"
              : "cursor-pointer"
        }`}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        role="button"
        tabIndex={0}
        aria-label={`${skillInfo.name}${skillInfo.isInBuild ? `, Level ${currentLevel}` : ''}${selected ? ', selected' : ''}${currentLevel === 0 || isLockedByLimit ? ', locked' : ''}`}
        aria-pressed={selected}
        aria-disabled={currentLevel === 0 || isLockedByLimit || skillInfo.isAbility12 || isStarter}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {/* Icon with gold border */}
        <div
          className={`w-full h-full rounded-md border-2 flex items-center justify-center ${
            imageError ? "bg-secondary/30" : ""
          } ${
            currentLevel === 0 || isLockedByLimit ? "grayscale opacity-50" : ""
          } ${
            selected
              ? "border-yellow-500"
              : skillInfo.isInBuild
                ? "border-yellow-400/50"
                : "border-yellow-600/30"
          }`}
        >
          <Image
            src={imageSrc}
            alt={skillInfo.name}
            width={48}
            height={48}
            onError={() => setImageError(true)}
            className={`rounded-md object-contain ${
              imageError ? "w-3/4 h-3/4" : "w-full h-full object-cover"
            }`}
          />
        </div>

        {/* Lock icon when level is 0 */}
        {(currentLevel === 0 || isLockedByLimit) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            <Image
              src="/icons/IC_Speciality_Locked.webp"
              alt=""
              width={24}
              height={24}
              className="opacity-80"
            />
          </div>
        )}

        {/* Level badge - only show if level > 0 */}
        {isEffectivelyInBuild && currentLevel > 0 && (
          <div className="absolute bottom-1 right-1 text-foreground text-xs font-bold pointer-events-none leading-none" aria-live="polite">
            Lv.{currentLevel}
          </div>
        )}

        {/* Selection indicator for shortcut (only for ability and stigma) */}
        {isSelectedForShortcut && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            <div className="w-full h-full bg-secondary/30 flex items-center justify-center border-2 border-secondary">
              <Image
                src="/icons/IC_Feature_SelectnDrop.webp"
                alt=""
                width={32}
                height={32}
                className="opacity-80"
              />
            </div>
          </div>
        )}
      </div>
    );
  },
  arePropsEqual
);

// Import React for memo
import React from "react";
