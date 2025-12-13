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
  const isUnlocked =
    currentLevel !== undefined && currentLevel >= specialtyChoice.unlockLevel;
  const isLockedByLevel = !isUnlocked && currentLevel !== undefined;
  const isLocked = isLockedByLevel || (!isActive && isMaxReached);

  return (
    <div
      className={`flex gap-2 px-2 py-2 border-b border-foreground/50  ${
        isActive
          ? "border-yellow-600 bg-yellow-600/10"
          : isLocked
            ? "border-muted bg-muted/30 opacity-60"
            : "bg-background/50"
      } ${className}`}
    >
      <div className="flex gap-4 ">
        <div className="relative size-4 flex items-center justify-center">
          {isLocked && (
            <>
              <Image src="/icons/lock-logo.webp" alt="Lock Icon" width={12} height={12} className="absolute z-0" />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-red-500 z-10">
                {specialtyChoice.unlockLevel}
              </span>
            </>
          )}
          {!isLocked && (
            <Image src="/icons/lock-logo.webp" alt="Lock Icon" width={12} height={12} className="absolute z-0" />
          )}
        </div>
        <p className={`text-xs uppercase font-semibold ${isLocked ? "text-foreground/50" : ""}`}>
          {specialtyChoice.description}
        </p>
      </div>
    </div>
  );
};
