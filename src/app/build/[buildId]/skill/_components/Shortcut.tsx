"use client";

import { useAuth } from "@/hooks/useAuth";
import { useBuildStore } from "@/store/useBuildEditor";
import { ShortcutSkill } from "@/types/shortcut.type";
import { isBuildOwner, isStarterBuild } from "@/utils/buildUtils";
import { isSameSkill, isStigmaOnlySlot } from "@/utils/skillUtils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ResetShortcutButton } from "../_client/buttons/reset-shortcut-button";
import { ShortcutSlot } from "../_client/shortcut-slot";
import {
  BOTTOM_SLOTS_COUNT,
  LEFT_SLOTS_COUNT,
  MIDDLE_SLOTS_COUNT,
  RESERVED_SLOT_ID,
  RIGHT_SLOTS_COUNT,
} from "../_utils/constants";

// Labels par défaut par colonne
const DEFAULT_LABELS: Record<string, string> = {
  "left-0": "1",
  "left-1": "2",
  "left-2": "3",
  "left-3": "4",
  "middle-0": "A",
  "middle-1": "E",
  "right-0": "RC",
  "bottom": "STIGMA",
};

export const Shortcut = () => {
  const { build, updateShortcuts, addStigma } = useBuildStore();
  const { userId } = useAuth();
  const [shortcuts, setShortcuts] = useState<
    Record<number, ShortcutSkill | undefined>
  >({});
  const isInitialLoad = useRef(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shortcutsRef = useRef(shortcuts);
  
  // Synchroniser la ref avec l'état
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);
  const isStarter = isStarterBuild(build);
  const isOwner = isBuildOwner(build, userId);
  const canEdit = !isStarter && isOwner;

  // Récupérer les labels depuis le build ou utiliser les valeurs par défaut
  const getLabel = useCallback((columnId: string): string => {
    return build?.shortcutLabels?.[columnId] ?? DEFAULT_LABELS[columnId] ?? "";
  }, [build?.shortcutLabels]);

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
  // The first ability is determined by the smallest abilityId in the class
  const firstAbility = useMemo(() => {
    if (!build?.class?.abilities || build.class.abilities.length === 0) return null;
    
    // Find the ability with the smallest ID (first ability of the class)
    const sortedAbilities = [...build.class.abilities].sort((a, b) => a.id - b.id);
    const firstClassAbility = sortedAbilities[0];
    
    // Find the corresponding buildAbility
    const firstBuildAbility = build.abilities?.find(
      (ba) => ba.abilityId === firstClassAbility.id
    );
    
    if (firstClassAbility && firstBuildAbility) {
      return {
        type: "ability" as const,
        ability: firstClassAbility,
        buildAbility: firstBuildAbility,
      };
    }
    return null;
  }, [build]);

  // Sync loaded shortcuts to local state and ensure first ability is in slot 11
  // Also update shortcuts that have skills without buildAbility/buildStigma
  useEffect(() => {
    isInitialLoad.current = true;
    // Use setTimeout to avoid synchronous setState in effect
    const timeoutId = setTimeout(() => {
      const updatedShortcuts = { ...loadedShortcuts };

      // Update shortcuts that have skills without buildAbility/buildStigma
      // (skills that were added to shortcuts before being added to build)
      Object.keys(updatedShortcuts).forEach((key) => {
        const slotId = Number(key);
        const skill = updatedShortcuts[slotId];
        if (!skill) return;

        if (skill.type === "ability" && skill.ability && !skill.buildAbility) {
          // Find buildAbility for this ability
          const buildAbility = build?.abilities?.find(
            (ba) => ba.abilityId === skill.ability?.id
          );
          if (buildAbility) {
            updatedShortcuts[slotId] = {
              ...skill,
              buildAbility,
            };
          }
        } else if (
          skill.type === "stigma" &&
          skill.stigma &&
          !skill.buildStigma
        ) {
          // Find buildStigma for this stigma
          const buildStigma = build?.stigmas?.find(
            (bs) => bs.stigmaId === skill.stigma?.id
          );
          if (buildStigma) {
            updatedShortcuts[slotId] = {
              ...skill,
              buildStigma,
            };
          }
        }
      });

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
  }, [loadedShortcuts, firstAbility, build?.abilities, build?.stigmas]);

  // Save shortcuts to build when they change (but not during initial load)
  // Utilise un debounce pour éviter trop de requêtes
  const scheduleSaveShortcuts = useCallback(() => {
    if (isInitialLoad.current) return;

    // Annuler la sauvegarde précédente si elle existe
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Programmer une nouvelle sauvegarde après 500ms
    saveTimeoutRef.current = setTimeout(() => {
      // Utiliser la ref pour obtenir la dernière valeur de shortcuts
      const currentShortcuts = shortcutsRef.current;
      const shortcutsToSaveFormatted: Record<
        string,
        {
          type: "ability" | "stigma";
          abilityId?: number;
          stigmaId?: number;
        }
      > = {};

      Object.entries(currentShortcuts).forEach(([slotIdStr, skill]) => {
        if (!skill) return;

        // Only save skills that are in the build (have buildAbility or buildStigma)
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
        // If skill doesn't have buildAbility/buildStigma, it won't be saved
        // It will be added to the build and then saved on next update
      });

      updateShortcuts(
        Object.keys(shortcutsToSaveFormatted).length > 0
          ? shortcutsToSaveFormatted
          : null
      );
    }, 500);
  }, [updateShortcuts]);

  // Nettoyer le timeout au démontage
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleDrop = (
    slotId: number,
    skill: ShortcutSkill | undefined,
    sourceSlotId?: number
  ) => {
    // Prevent drop if starter build or not owner
    if (!canEdit) {
      return;
    }

    setShortcuts((prev) => {
      const newShortcuts = { ...prev };

      // Check if the skill being dropped is the first ability
      const isFirstAbility =
        firstAbility && skill && isSameSkill(skill, firstAbility);

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

      // If trying to drop a stigma in non-stigma-only slots, prevent it
      if (!isStigmaOnlySlot(slotId) && skill && skill.type === "stigma") {
        // Don't allow dropping stigmas in non-stigma-only slots
        return prev;
      }

      // If dropping a stigma that's not in the build, add it to the build first
      if (
        skill &&
        skill.type === "stigma" &&
        skill.stigma &&
        !skill.buildStigma
      ) {
        // Add stigma to build with level 0
        addStigma(skill.stigma.id, 0);
        // Note: The build will be updated and the shortcut will be reloaded
        // For now, we'll still place it in the slot, but it will need buildStigma on next render
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
          if (
            existingSlotId !== sourceSlotId &&
            existingSlotId !== slotId &&
            existingSlotId !== RESERVED_SLOT_ID
          ) {
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
    // Programmer la sauvegarde après la mise à jour de l'état
    setTimeout(() => {
      scheduleSaveShortcuts();
    }, 0);
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
    // Programmer la sauvegarde après la mise à jour de l'état
    setTimeout(() => {
      scheduleSaveShortcuts();
    }, 0);
  };

  const handleRefresh = () => {
    if (!canEdit) {
      return;
    }
    setShortcuts({});
    setTimeout(() => {
      scheduleSaveShortcuts();
    }, 0);
  };


  return (
    <div className="w-full h-full flex flex-col justify-end gap-2 sm:gap-4">
      {/* Header with Refresh Button - at the bottom */}
      {canEdit && (
        <div className="flex items-center justify-between">
          <ResetShortcutButton onClick={handleRefresh} />
        </div>
      )}
      {/* Main Content: U-shaped layout */}
      <div className="flex flex-col gap-3 sm:gap-6">
        {/* Top Row: Left, Middle and Right blocks */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
          {/* Left: Cast Slots (4x3) */}
          <div className="flex flex-col gap-1 sm:gap-2">
            {/* Labels pour chaque colonne (indicatif uniquement) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2.5">
              {Array.from({ length: 4 }).map((_, colIndex) => (
                <div
                  key={`left-${colIndex}`}
                  className="text-center text-sm font-medium text-gray-400"
                >
                  {getLabel(`left-${colIndex}`)}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 grid-rows-3 gap-1.5 sm:gap-2.5">
              {Array.from({ length: LEFT_SLOTS_COUNT }).map((_, index) => {
                const slotId = index;
                return (
                  <ShortcutSlot
                    key={slotId}
                    slotId={slotId}
                    skill={shortcuts[slotId]}
                    onDrop={handleDrop}
                    onClear={handleClear}
                    disabled={!canEdit}
                  />
                );
              })}
            </div>
          </div>

          <div className="hidden sm:block w-29"></div>

          {/* Middle: Additional Slots (2x3) */}
          <div className="flex flex-col gap-1 sm:gap-2">
            {/* Labels pour chaque colonne (indicatif uniquement) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2.5">
              {Array.from({ length: 2 }).map((_, colIndex) => (
                <div
                  key={`middle-${colIndex}`}
                  className="text-center text-sm font-medium text-gray-400"
                >
                  {getLabel(`middle-${colIndex}`)}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-3 gap-1.5 sm:gap-2.5">
              {Array.from({ length: MIDDLE_SLOTS_COUNT }).map((_, index) => {
                const slotId = LEFT_SLOTS_COUNT + BOTTOM_SLOTS_COUNT + index;
                return (
                  <ShortcutSlot
                    key={slotId}
                    slotId={slotId}
                    skill={shortcuts[slotId]}
                    onDrop={handleDrop}
                    onClear={handleClear}
                    disabled={!canEdit}
                  />
                );
              })}
            </div>
          </div>

          {/* Right: Additional Slots (1x3) */}
          <div className="flex flex-col gap-1 sm:gap-2">
            {/* Label pour la colonne (indicatif uniquement) */}
            <div className="text-center text-sm font-medium text-gray-400">
              {getLabel("right-0")}
            </div>
            <div className="grid grid-cols-1 grid-rows-3 gap-1.5 sm:gap-2.5">
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
                    disabled={!canEdit}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom: Main Bar (12 slots) - aligns with top blocks */}
        <div className="flex flex-col gap-1 sm:gap-2">
          {/* Use same gap as top blocks for proper alignment */}
          <div className="grid grid-cols-6 lg:grid-cols-12 gap-1 sm:gap-2">
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
                  disabled={!canEdit}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
