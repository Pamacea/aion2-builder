"use client";

import { useBuildStore } from "@/store/useBuildEditor";
import {
  AbilityType,
  BuildAbilityType,
  BuildPassiveType,
  BuildStigmaType,
  PassiveType,
  StigmaType,
} from "@/types/schema";
import { useEffect, useMemo, useRef, useState } from "react";
import { ResetShortcutButton } from "../_client/reset-shortcut-button";
import { ShortcutSlot } from "./ShortcutSlot";

type ShortcutSkill = {
  type: "ability" | "passive" | "stigma";
  ability?: AbilityType;
  passive?: PassiveType;
  stigma?: StigmaType;
  buildAbility?: BuildAbilityType;
  buildPassive?: BuildPassiveType;
  buildStigma?: BuildStigmaType;
};

// Structure: 20 slots (4x5) pour "Cast" à gauche, 10 slots (2x5) au milieu, 5 slots (1x5) à droite, 12 slots en bas
const LEFT_SLOTS_COUNT = 20; // 4x5 grid
const MIDDLE_SLOTS_COUNT = 10; // 2x5 grid
const RIGHT_SLOTS_COUNT = 5; // 1x5 grid
const BOTTOM_SLOTS_COUNT = 12; // 1x12 row
// Slot 11 (index 10) of Main Bar is reserved for the first ability
const RESERVED_SLOT_ID = LEFT_SLOTS_COUNT + 10; // Slot 30 (index 10 of Main Bar)
// Slots 5-8 (indices 4-7) of Main Bar are reserved for stigmas only
const STIGMA_SLOT_START = LEFT_SLOTS_COUNT + 4; // Slot 24 (index 4 of Main Bar)
const STIGMA_SLOT_END = LEFT_SLOTS_COUNT + 7; // Slot 27 (index 7 of Main Bar)

// Helper function to check if a slot is reserved for stigmas
const isStigmaOnlySlot = (slotId: number): boolean => {
  return slotId >= STIGMA_SLOT_START && slotId <= STIGMA_SLOT_END;
};

// Helper function to check if two skills are the same
const isSameSkill = (
  skill1: ShortcutSkill | undefined,
  skill2: ShortcutSkill | undefined
): boolean => {
  if (!skill1 || !skill2) return false;
  if (skill1.type !== skill2.type) return false;

  if (skill1.type === "ability" && skill2.type === "ability") {
    return (
      skill1.ability?.id === skill2.ability?.id &&
      skill1.buildAbility?.id === skill2.buildAbility?.id
    );
  }

  if (skill1.type === "stigma" && skill2.type === "stigma") {
    return (
      skill1.stigma?.id === skill2.stigma?.id &&
      skill1.buildStigma?.id === skill2.buildStigma?.id
    );
  }

  return false;
};

export const Shortcut = () => {
  const { build, updateShortcuts } = useBuildStore();
  const [shortcuts, setShortcuts] = useState<
    Record<number, ShortcutSkill | undefined>
  >({});
  const isInitialLoad = useRef(true);
  const [shouldSave, setShouldSave] = useState(false);

  // Convert saved shortcuts (with IDs) to local format (with full objects)
  const loadedShortcuts = useMemo(() => {
    if (!build?.shortcuts) {
      return {};
    }

    const shortcuts: Record<number, ShortcutSkill | undefined> = {};

    Object.entries(build.shortcuts).forEach(([slotIdStr, shortcutData]) => {
      const slotId = Number(slotIdStr);
      if (!shortcutData || typeof shortcutData !== "object") return;

      const shortcut = shortcutData as {
        type: "ability" | "stigma";
        abilityId?: number;
        stigmaId?: number;
      };

      if (shortcut.type === "ability" && shortcut.abilityId) {
        const ability = build.class?.abilities?.find(
          (a) => a.id === shortcut.abilityId
        );
        // Find buildAbility by abilityId (not by buildAbility.id which might change)
        const buildAbility = build.abilities?.find(
          (ba) => ba.abilityId === shortcut.abilityId
        );

        if (!ability) {
          console.warn(
            `Ability with id ${shortcut.abilityId} not found in class abilities`
          );
        }
        if (!buildAbility) {
          console.warn(
            `BuildAbility with abilityId ${shortcut.abilityId} not found. Available abilityIds:`,
            build.abilities?.map((ba) => ba.abilityId)
          );
        }

        if (ability && buildAbility) {
          shortcuts[slotId] = {
            type: "ability",
            ability,
            buildAbility,
          };
        }
      } else if (shortcut.type === "stigma" && shortcut.stigmaId) {
        const stigma = build.class?.stigmas?.find(
          (s) => s.id === shortcut.stigmaId
        );
        // Find buildStigma by stigmaId (not by buildStigma.id which might change)
        const buildStigma = build.stigmas?.find(
          (bs) => bs.stigmaId === shortcut.stigmaId
        );

        if (!stigma) {
          console.warn(
            `Stigma with id ${shortcut.stigmaId} not found in class stigmas`
          );
        }
        if (!buildStigma) {
          console.warn(
            `BuildStigma with stigmaId ${shortcut.stigmaId} not found. Available stigmaIds:`,
            build.stigmas?.map((bs) => bs.stigmaId)
          );
        }

        if (stigma && buildStigma) {
          shortcuts[slotId] = {
            type: "stigma",
            stigma,
            buildStigma,
          };
        }
      }
    });

    return shortcuts;
  }, [build]);

  // Get the first ability from build (reserved for slot 11)
  const firstAbility = useMemo(() => {
    if (!build?.abilities || build.abilities.length === 0) return null;
    const firstBuildAbility = build.abilities[0];
    const firstAbility = build.class?.abilities?.find(
      (a) => a.id === firstBuildAbility.abilityId
    );
    if (firstAbility && firstBuildAbility) {
      return {
        type: "ability" as const,
        ability: firstAbility,
        buildAbility: firstBuildAbility,
      };
    }
    return null;
  }, [build]);

  // Sync loaded shortcuts to local state and ensure first ability is in slot 11
  useEffect(() => {
    isInitialLoad.current = true;
    // Use setTimeout to avoid synchronous setState in effect
    const timeoutId = setTimeout(() => {
      const updatedShortcuts = { ...loadedShortcuts };
      
      // Ensure first ability is always in slot 11
      if (firstAbility) {
        // Remove first ability from any other slot
        Object.keys(updatedShortcuts).forEach((key) => {
          const existingSlotId = Number(key);
          if (existingSlotId !== RESERVED_SLOT_ID) {
            const existingSkill = updatedShortcuts[existingSlotId];
            if (isSameSkill(existingSkill, firstAbility)) {
              delete updatedShortcuts[existingSlotId];
            }
          }
        });
        // Place first ability in slot 11
        updatedShortcuts[RESERVED_SLOT_ID] = firstAbility;
      }
      
      setShortcuts(updatedShortcuts);
      // Reset flag after state is set
      setTimeout(() => {
        isInitialLoad.current = false;
      }, 0);
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [loadedShortcuts, firstAbility]);

  // Save shortcuts to build when they change (but not during initial load)
  useEffect(() => {
    if (isInitialLoad.current || !shouldSave) return;
    
    const shortcutsToSaveFormatted: Record<
      string,
      {
        type: "ability" | "stigma";
        abilityId?: number;
        stigmaId?: number;
      }
    > = {};

    Object.entries(shortcuts).forEach(([slotIdStr, skill]) => {
      if (!skill) return;

      if (skill.type === "ability" && skill.ability && skill.buildAbility) {
        shortcutsToSaveFormatted[slotIdStr] = {
          type: "ability",
          abilityId: skill.ability.id,
        };
      } else if (skill.type === "stigma" && skill.stigma && skill.buildStigma) {
        shortcutsToSaveFormatted[slotIdStr] = {
          type: "stigma",
          stigmaId: skill.stigma.id,
        };
      }
    });

    updateShortcuts(
      Object.keys(shortcutsToSaveFormatted).length > 0 ? shortcutsToSaveFormatted : null
    );
    // Reset flag asynchronously to avoid setState in effect
    setTimeout(() => {
      setShouldSave(false);
    }, 0);
  }, [shouldSave, shortcuts, updateShortcuts]);

  // Queue shortcuts to be saved (will be saved in useEffect)
  const queueSaveShortcuts = () => {
    if (!isInitialLoad.current) {
      setShouldSave(true);
    }
  };

  const handleDrop = (
    slotId: number,
    skill: ShortcutSkill | undefined,
    sourceSlotId?: number
  ) => {
    setShortcuts((prev) => {
      const newShortcuts = { ...prev };

      // Check if the skill being dropped is the first ability
      const isFirstAbility = firstAbility && skill && isSameSkill(skill, firstAbility);

      // If trying to drop the first ability anywhere except slot 11, force it to slot 11
      if (isFirstAbility && slotId !== RESERVED_SLOT_ID) {
        // Remove from any other slot
        if (sourceSlotId !== undefined) {
          delete newShortcuts[sourceSlotId];
        }
        // Remove from any other slot if it exists
        Object.keys(newShortcuts).forEach((key) => {
          const existingSlotId = Number(key);
          if (existingSlotId !== RESERVED_SLOT_ID) {
            const existingSkill = newShortcuts[existingSlotId];
            if (isSameSkill(existingSkill, firstAbility)) {
              delete newShortcuts[existingSlotId];
            }
          }
        });
        // Force first ability to slot 11
        newShortcuts[RESERVED_SLOT_ID] = firstAbility;
        return newShortcuts;
      }

      // If trying to drop a different skill in slot 11, prevent it
      if (slotId === RESERVED_SLOT_ID && !isFirstAbility) {
        // Don't allow dropping other skills in reserved slot
        return prev;
      }

      // If trying to drop an ability in stigma-only slots (5-8), prevent it
      if (isStigmaOnlySlot(slotId) && skill && skill.type !== "stigma") {
        // Don't allow dropping abilities in stigma-only slots
        return prev;
      }

      // If the skill is being moved from another slot, clear the source slot
      if (sourceSlotId !== undefined && sourceSlotId !== slotId) {
        delete newShortcuts[sourceSlotId];
      }

      // Remove the skill from any other slot if it exists (to prevent duplicates)
      if (skill) {
        Object.keys(newShortcuts).forEach((key) => {
          const existingSlotId = Number(key);
          // Skip the source slot (already handled above), the target slot, and reserved slot
          if (existingSlotId !== sourceSlotId && existingSlotId !== slotId && existingSlotId !== RESERVED_SLOT_ID) {
            const existingSkill = newShortcuts[existingSlotId];
            if (isSameSkill(existingSkill, skill)) {
              delete newShortcuts[existingSlotId];
            }
          }
        });
      }

      // Set the skill in the target slot
      newShortcuts[slotId] = skill;

      return newShortcuts;
    });
    // Queue save after state update
    queueSaveShortcuts();
  };

  const handleClear = (slotId: number) => {
    // Cannot clear reserved slot
    if (slotId === RESERVED_SLOT_ID) {
      return;
    }
    setShortcuts((prev) => {
      const newShortcuts = { ...prev };
      delete newShortcuts[slotId];
      return newShortcuts;
    });
    // Queue save after state update
    queueSaveShortcuts();
  };

  const handleRefresh = () => {
    setShortcuts({});
    queueSaveShortcuts();
  };

  return (
    <div className="w-full h-full flex flex-col justify-end gap-4 ">
      {/* Header with Refresh Button - at the bottom */}
      <div className="flex items-center justify-between">
        <ResetShortcutButton onClick={handleRefresh} />
      </div>
      {/* Main Content: U-shaped layout */}
      <div className="flex flex-col gap-6">
        {/* Top Row: Left, Middle and Right blocks */}
        <div className="flex justify-between">
          {/* Left: Cast Slots (4x5) */}
          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold text-foreground/80 px-2">
              1
            </div>
            <div className="grid grid-cols-4 grid-rows-5 gap-2.5">
              {Array.from({ length: LEFT_SLOTS_COUNT }).map((_, index) => {
                const slotId = index;
                return (
                  <ShortcutSlot
                    key={slotId}
                    slotId={slotId}
                    skill={shortcuts[slotId]}
                    onDrop={handleDrop}
                    onClear={handleClear}
                  />
                );
              })}
            </div>
          </div>

          <div className="w-29"></div>

          {/* Middle: Additional Slots (2x5) */}
          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold text-foreground/80 px-2">
              A
            </div>
            <div className="grid grid-cols-2 grid-rows-5 gap-2.5">
              {Array.from({ length: MIDDLE_SLOTS_COUNT }).map((_, index) => {
                const slotId = LEFT_SLOTS_COUNT + BOTTOM_SLOTS_COUNT + index;
                return (
                  <ShortcutSlot
                    key={slotId}
                    slotId={slotId}
                    skill={shortcuts[slotId]}
                    onDrop={handleDrop}
                    onClear={handleClear}
                  />
                );
              })}
            </div>
          </div>

          {/* Right: Additional Slots (1x5) */}
          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold text-foreground/80 px-2">
              RC
            </div>
            <div className="grid grid-cols-1 grid-rows-5 gap-2.5">
              {Array.from({ length: RIGHT_SLOTS_COUNT }).map((_, index) => {
                const slotId =
                  LEFT_SLOTS_COUNT +
                  BOTTOM_SLOTS_COUNT +
                  MIDDLE_SLOTS_COUNT +
                  index;
                return (
                  <ShortcutSlot
                    key={slotId}
                    slotId={slotId}
                    skill={shortcuts[slotId]}
                    onDrop={handleDrop}
                    onClear={handleClear}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom: Main Bar (12 slots) - aligns with top blocks */}
        <div className="flex flex-col gap-2">
          {/* Use same gap as top blocks for proper alignment */}
          <div className="grid grid-cols-12 gap-2">
            {Array.from({ length: BOTTOM_SLOTS_COUNT }).map((_, index) => {
              const slotId = LEFT_SLOTS_COUNT + index;
              const isReserved = slotId === RESERVED_SLOT_ID;
              const isStigmaOnly = isStigmaOnlySlot(slotId);
              return (
                <ShortcutSlot
                  key={slotId}
                  slotId={slotId}
                  skill={shortcuts[slotId]}
                  onDrop={handleDrop}
                  onClear={handleClear}
                  isReserved={isReserved}
                  isStigmaOnly={isStigmaOnly}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
