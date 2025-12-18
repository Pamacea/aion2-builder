"use client";

import { useBuildStore } from "@/store/useBuildEditor";
import { BuildStigmaType, StigmaType } from "@/types/schema";
import { canEditBuild } from "@/utils/buildUtils";
import { useEffect, useMemo } from "react";
import { SpecialtyChoice } from "./speciality-choice";

type AvailableSpecialityStigmaProps = {
  buildStigma?: BuildStigmaType;
  stigma?: StigmaType;
  currentLevel?: number;
  activeSpecialtyChoiceIds?: number[];
  className?: string;
  onToggleSpecialtyChoice?: (specialtyChoiceId: number) => void;
};

export const AvailableSpecialityStigma = ({
  buildStigma,
  stigma,
  currentLevel,
  activeSpecialtyChoiceIds,
  className = "",
  onToggleSpecialtyChoice,
}: AvailableSpecialityStigmaProps) => {
  const { toggleSpecialtyChoiceStigma, build, currentUserId } = useBuildStore();
  const canEdit = canEditBuild(build, currentUserId);

  // Determine which stigma and data to use
  const targetStigma = buildStigma?.stigma || stigma;
  const stigmaLevel = currentLevel ?? buildStigma?.level;
  const activeIds = useMemo(
    () => activeSpecialtyChoiceIds ?? buildStigma?.activeSpecialtyChoiceIds ?? [],
    [activeSpecialtyChoiceIds, buildStigma?.activeSpecialtyChoiceIds]
  );

  // Auto-activate/deactivate specialty choices based on level
  useEffect(() => {
    if (!buildStigma || !targetStigma || !targetStigma.specialtyChoices || !canEdit) return;

    const newActiveIds: number[] = [];
    
    // Sort by unlock level to activate in order
    const sortedChoices = [...targetStigma.specialtyChoices].sort(
      (a, b) => a.unlockLevel - b.unlockLevel
    );

    // Auto-activate all specialty choices that are unlocked (no limit for stigmas)
    for (const choice of sortedChoices) {
      // Check if unlocked: level must be greater than 0 and greater than or equal to unlockLevel
      const isUnlocked = stigmaLevel !== undefined && stigmaLevel > 0 && stigmaLevel >= choice.unlockLevel;
      
      if (isUnlocked) {
        // Auto-activate all unlocked specialty choices
        newActiveIds.push(choice.id);
      }
      // If not unlocked, skip (don't include locked choices)
    }

    // Check if we need to update (add or remove specialty choices)
    const currentIdsSet = new Set(activeIds);
    const newIdsSet = new Set(newActiveIds);
    
    // Check if sets are different
    const needsUpdate = 
      activeIds.length !== newActiveIds.length ||
      activeIds.some((id: number) => !newIdsSet.has(id)) ||
      newActiveIds.some((id: number) => !currentIdsSet.has(id));

    if (needsUpdate) {
      // Remove specialty choices that should be deactivated
      activeIds.forEach((id: number) => {
        if (!newIdsSet.has(id)) {
          toggleSpecialtyChoiceStigma(buildStigma.stigmaId, id);
        }
      });

      // Add specialty choices that should be activated
      newActiveIds.forEach((id: number) => {
        if (!currentIdsSet.has(id)) {
          toggleSpecialtyChoiceStigma(buildStigma.stigmaId, id);
        }
      });
    }
  }, [stigmaLevel, buildStigma, targetStigma, activeIds, toggleSpecialtyChoiceStigma, canEdit]);

  if (!targetStigma || !targetStigma.specialtyChoices || targetStigma.specialtyChoices.length === 0) {
    return null;
  }

  // Sort specialty choices by unlock level
  const sortedSpecialtyChoices = [...targetStigma.specialtyChoices].sort(
    (a, b) => a.unlockLevel - b.unlockLevel
  );

  const handleToggle = (specialtyChoiceId: number) => {
    if (onToggleSpecialtyChoice) {
      onToggleSpecialtyChoice(specialtyChoiceId);
    } else if (buildStigma) {
      toggleSpecialtyChoiceStigma(buildStigma.stigmaId, specialtyChoiceId);
    }
  };

  return (
    <div className={`space-y-2 pt-4 border-t-2 border-secondary ${className}`}>
      <h4 className="text-xl font-semibold text-foreground pb-2 uppercase">Speciality Choices</h4>
      {sortedSpecialtyChoices.map((specialtyChoice) => {
        const isActive = activeIds.includes(specialtyChoice.id);
        // If stigma is not in build (no buildStigma), always lock specialty choices
        // If level is 0, always lock specialty choices
        // Otherwise, check if level is below unlock level
        const isLockedByNotInBuild = !buildStigma;
        const isLockedByLevel = stigmaLevel === undefined || stigmaLevel === 0 || stigmaLevel < specialtyChoice.unlockLevel;
        // Specialty choice is locked if not in build, level is 0, level is too low, or user is not the owner (no max limit for stigmas)
        // But keep active specialties visible even if not owner (important information)
        const isLockedByRules = isLockedByNotInBuild || isLockedByLevel;
        const isLocked = isLockedByRules || !canEdit;
        // For active specialties, keep full opacity even if not owner (important information)
        const shouldReduceOpacity = isLocked && !isActive;
        
        return (
          <div
            key={specialtyChoice.id}
            onClick={() => {
              if (!isLocked) {
                handleToggle(specialtyChoice.id);
              }
            }}
            className={
              onToggleSpecialtyChoice || buildStigma
                ? isLocked
                  ? shouldReduceOpacity
                    ? "cursor-not-allowed opacity-80"
                    : "cursor-not-allowed opacity-100"
                  : "cursor-pointer hover:opacity-80 transition-opacity"
                : ""
            }
          >
            <SpecialtyChoice
              specialtyChoice={specialtyChoice}
              isActive={isActive}
              currentLevel={stigmaLevel}
              isMaxReached={false}
            />
          </div>
        );
      })}
    </div>
  );
};

