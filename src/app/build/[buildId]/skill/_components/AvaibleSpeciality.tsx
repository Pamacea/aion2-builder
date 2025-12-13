"use client";

import { useBuildStore } from "@/store/useBuildEditor";
import { AbilityType, BuildAbilityType } from "@/types/schema";
import { SpecialtyChoice } from "../_client/speciality-choice";

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
  const { toggleSpecialtyChoice } = useBuildStore();

  // Determine which ability and data to use
  const targetAbility = buildAbility?.ability || ability;
  const abilityLevel = currentLevel ?? buildAbility?.level;
  const activeIds = activeSpecialtyChoiceIds ?? buildAbility?.activeSpecialtyChoiceIds ?? [];

  if (!targetAbility || !targetAbility.specialtyChoices || targetAbility.specialtyChoices.length === 0) {
    return null;
  }

  // Sort specialty choices by unlock level
  const sortedSpecialtyChoices = [...targetAbility.specialtyChoices].sort(
    (a, b) => a.unlockLevel - b.unlockLevel
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
    <div className={`space-y-2 pt-4 border-t-2 border-background/40 ${className}`}>
      <h4 className="text-sm font-semibold text-foreground pb-2">Speciality Choices</h4>
      {sortedSpecialtyChoices.map((specialtyChoice) => {
        const isActive = activeIds.includes(specialtyChoice.id);
        // Check if locked by level (unlockLevel > currentLevel)
        const isLockedByLevel = abilityLevel !== undefined && abilityLevel < specialtyChoice.unlockLevel;
        // Check if locked by max reached (already have 3 active and this one is not active)
        const isLockedByMax = !isActive && !canActivateMore;
        const isLocked = isLockedByLevel || isLockedByMax;
        
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
                  ? "cursor-not-allowed opacity-50"
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

