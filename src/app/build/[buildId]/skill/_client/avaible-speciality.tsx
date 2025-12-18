"use client";

import { useBuildStore } from "@/store/useBuildEditor";
import { AbilityType, BuildAbilityType } from "@/types/schema";
import { isBuildOwner } from "@/utils/buildUtils";
import { SpecialtyChoice } from "./speciality-choice";

type AvailableSpecialityProps = {
  buildAbility?: BuildAbilityType;
  ability?: AbilityType;
  currentLevel?: number;
  activeSpecialtyChoiceIds?: number[];
  className?: string;
  onToggleSpecialtyChoice?: (specialtyChoiceId: number) => void;
};

export const AvailableSpeciality = ({
  buildAbility,
  ability,
  currentLevel,
  activeSpecialtyChoiceIds,
  className = "",
  onToggleSpecialtyChoice,
}: AvailableSpecialityProps) => {
  const { toggleSpecialtyChoice, build, currentUserId } = useBuildStore();
  const isOwner = isBuildOwner(build, currentUserId);

  // Determine which ability and data to use
  const targetAbility = buildAbility?.ability || ability;
  const abilityLevel = currentLevel ?? buildAbility?.level;
  const activeIds = activeSpecialtyChoiceIds ?? buildAbility?.activeSpecialtyChoiceIds ?? [];

  if (!targetAbility || !targetAbility.specialtyChoices || targetAbility.specialtyChoices.length === 0) {
    return null;
  }

  // Sort specialty choices by unlock level, then by id for stable sorting
  const sortedSpecialtyChoices = [...targetAbility.specialtyChoices].sort(
    (a, b) => {
      if (a.unlockLevel !== b.unlockLevel) {
        return a.unlockLevel - b.unlockLevel;
      }
      return a.id - b.id;
    }
  );

  const handleToggle = (specialtyChoiceId: number) => {
    if (onToggleSpecialtyChoice) {
      onToggleSpecialtyChoice(specialtyChoiceId);
    } else if (buildAbility) {
      toggleSpecialtyChoice(buildAbility.abilityId, specialtyChoiceId);
    }
  };

  const maxActiveSpecialties = 3;
  const canActivateMore = activeIds.length < maxActiveSpecialties;

  return (
    <div className={`space-y-2 pt-4 border-t-2 border-secondary ${className}`}>
      <h4 className="text-xl font-semibold text-foreground pb-2 uppercase">Speciality Choices</h4>
      {sortedSpecialtyChoices.map((specialtyChoice) => {
        const isActive = activeIds.includes(specialtyChoice.id);
        // If ability is not in build (no buildAbility), always lock specialty choices
        // If level is 0, always lock specialty choices
        // Otherwise, check if level is below unlock level
        const isLockedByNotInBuild = !buildAbility;
        const isLockedByLevel = abilityLevel !== undefined && (abilityLevel === 0 || abilityLevel < specialtyChoice.unlockLevel);
        // Check if locked by max reached (already have 3 active and this one is not active)
        const isLockedByMax = !isActive && !canActivateMore;
        // Check if trying to activate 3rd specialty choice - requires level 20
        const isLockedByThirdSlot = !isActive && activeIds.length >= 2 && (abilityLevel === undefined || abilityLevel < 20);
        // Specialty choice is locked if not in build, level is 0, level is too low, max reached, or trying to activate 3rd without level 20
        // Also lock if user is not the owner (but keep active specialties visible)
        const isLockedByRules = isLockedByNotInBuild || isLockedByLevel || isLockedByMax || isLockedByThirdSlot;
        const isLocked = isLockedByRules || !isOwner;
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
              onToggleSpecialtyChoice || buildAbility
                ? isLocked
                  ? shouldReduceOpacity
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-not-allowed opacity-100"
                  : "cursor-pointer hover:opacity-80 transition-opacity"
                : ""
            }
          >
            <SpecialtyChoice
              specialtyChoice={specialtyChoice}
              isActive={isActive}
              currentLevel={abilityLevel}
              isMaxReached={!isActive && !canActivateMore}
            />
          </div>
        );
      })}
    </div>
  );
};

