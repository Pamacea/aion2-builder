"use client";

import { SpecialtyChoiceType } from "@/types/schema";
import Image from "next/image";

type SpecialtyChoiceProps = {
  specialtyChoice: SpecialtyChoiceType;
  isActive?: boolean;
  currentLevel?: number;
  isMaxReached?: boolean;
  className?: string;
};

export const SpecialtyChoice = ({
  specialtyChoice,
  isActive = false,
  currentLevel,
  isMaxReached = false,
  className = "",
}: SpecialtyChoiceProps) => {
  // Lock specialty choice if level is undefined (not in build), level is 0, or below unlock level
  const isUnlocked =
    currentLevel !== undefined && currentLevel > 0 && currentLevel >= specialtyChoice.unlockLevel;
  // Lock if level is undefined (not in build), level is 0, or level is too low
  const isLockedByLevel = currentLevel === undefined || (currentLevel !== undefined && currentLevel === 0) || (!isUnlocked && currentLevel !== undefined);
  const isLocked = isLockedByLevel || (!isActive && isMaxReached);

  return (
    <div
      className={`flex gap-2 px-2 py-2 border-b-2 border-secondary  ${
        isActive
          ? "border-none bg-yellow-600/80"
          : isLocked
            ? "border-primary bg-secondary/30"
            : "bg-secondary"
      } ${className}`}
    >
      <div className="flex gap-4 ">
        <div className="relative size-4 flex items-center justify-center">
          {isLocked && (
            <>
              <Image src="/icons/IC_Speciality_Locked.webp" alt="Lock Icon" width={12} height={12} className="absolute z-0" />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-red-500 z-10">
                {specialtyChoice.unlockLevel}
              </span>
            </>
          )}
          {!isLocked && (
            <Image src="/icons/IC_Speciality_Avaible.webp" alt="Lock Icon" width={24} height={24} className="absolute z-0" />
          )}
          {!isLocked && isActive && (
            <Image src="/icons/IC_Speciality_Activated.webp" alt="Active Icon" width={24} height={24} className="absolute z-0" />
          )}
        </div>
        <p className={`text-xs uppercase font-semibold ${isLocked ? "text-foreground/50" : ""}`}>
          {specialtyChoice.description}
        </p>
      </div>
    </div>
  );
};
