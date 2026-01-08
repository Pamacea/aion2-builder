"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { BuildState } from "@/types/build.type";

// Import slice creators directly
import { createBuildSlice, BuildSlice } from "./slices/build.slice";
import { createAbilitiesSlice, AbilitiesSlice } from "./slices/abilities.slice";
import { createPassivesSlice, PassivesSlice } from "./slices/passives.slice";
import { createStigmasSlice, StigmasSlice } from "./slices/stigmas.slice";
import { createShortcutsSlice, ShortcutsSlice } from "./slices/shortcuts.slice";

// Combined store type with all slices
type BuildStore = BuildSlice &
  AbilitiesSlice &
  PassivesSlice &
  StigmasSlice &
  ShortcutsSlice;

// Create the refactored store with devtools middleware
export const useBuildStore = create<BuildStore>()(
  devtools(
    (set, get, api) => ({
      ...createBuildSlice(set as any, get as any, api),
      ...createAbilitiesSlice(set as any, get as any, api),
      ...createPassivesSlice(set as any, get as any, api),
      ...createStigmasSlice(set as any, get as any, api),
      ...createShortcutsSlice(set as any, get as any, api),
    }),
    {
      name: "BuildStore",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

// Type assertion to maintain backward compatibility
export type BuildStateCompat = BuildState & BuildStore;

// ============================================================================
// SELECTIVE SUBSCRIPTION HOOKS
// These hooks prevent unnecessary re-renders by only subscribing to specific slices
// ============================================================================

/**
 * Hook for accessing the build object
 * Only re-renders when the build itself changes
 */
export const useBuild = () => useBuildStore((state) => state.build);

/**
 * Hook for accessing loading state
 * Only re-renders when loading state changes
 */
export const useBuildLoading = () => useBuildStore((state) => state.loading);

/**
 * Hook for accessing saving state
 * Only re-renders when saving state changes
 */
export const useBuildSaving = () => useBuildStore((state) => state.saving);

/**
 * Hook for accessing the current user ID
 * Only re-renders when the current user ID changes
 */
export const useCurrentUserId = () => useBuildStore((state) => state.currentUserId);

/**
 * Hook for accessing abilities
 * Only re-renders when abilities change
 */
export const useAbilities = () => useBuildStore((state) => state.build?.abilities);

/**
 * Hook for accessing passives
 * Only re-renders when passives change
 */
export const usePassives = () => useBuildStore((state) => state.build?.passives);

/**
 * Hook for accessing stigmas
 * Only re-renders when stigmas change
 */
export const useStigmas = () => useBuildStore((state) => state.build?.stigmas);

/**
 * Hook for accessing the class object
 * Only re-renders when the class changes
 */
export const useClass = () => useBuildStore((state) => state.build?.class);

/**
 * Hook for accessing shortcuts
 * Only re-renders when shortcuts change
 */
export const useShortcuts = () => useBuildStore((state) => state.build?.shortcuts);

/**
 * Hook for accessing build actions
 * Prevents re-renders entirely as actions are stable references
 */
export const useBuildActions = () => ({
  setCurrentUserId: useBuildStore((state) => state.setCurrentUserId),
  setBuild: useBuildStore((state) => state.setBuild),
  loadBuild: useBuildStore((state) => state.loadBuild),
  updateBuild: useBuildStore((state) => state.updateBuild),
  setName: useBuildStore((state) => state.setName),
  setClassId: useBuildStore((state) => state.setClassId),
  setClassByName: useBuildStore((state) => state.setClassByName),
});

/**
 * Hook for accessing ability actions
 */
export const useAbilityActions = () => ({
  updateAbilityLevel: useBuildStore((state) => state.updateAbilityLevel),
  addAbility: useBuildStore((state) => state.addAbility),
  removeAbility: useBuildStore((state) => state.removeAbility),
  toggleSpecialtyChoice: useBuildStore((state) => state.toggleSpecialtyChoice),
  getAbilitiesBySpellTag: useBuildStore((state) => state.getAbilitiesBySpellTag),
  getAvailableAbilities: useBuildStore((state) => state.getAvailableAbilities),
  updateChainSkillAbilities: useBuildStore((state) => state.updateChainSkillAbilities),
});

/**
 * Hook for accessing passive actions
 */
export const usePassiveActions = () => ({
  updatePassiveLevel: useBuildStore((state) => state.updatePassiveLevel),
  addPassive: useBuildStore((state) => state.addPassive),
  removePassive: useBuildStore((state) => state.removePassive),
  getPassivesBySpellTag: useBuildStore((state) => state.getPassivesBySpellTag),
  getAvailablePassives: useBuildStore((state) => state.getAvailablePassives),
});

/**
 * Hook for accessing stigma actions
 */
export const useStigmaActions = () => ({
  updateStigma: useBuildStore((state) => state.updateStigma),
  updateStigmaLevel: useBuildStore((state) => state.updateStigmaLevel),
  addStigma: useBuildStore((state) => state.addStigma),
  removeStigma: useBuildStore((state) => state.removeStigma),
  toggleSpecialtyChoiceStigma: useBuildStore((state) => state.toggleSpecialtyChoiceStigma),
  getStigmasBySpellTag: useBuildStore((state) => state.getStigmasBySpellTag),
  getAvailableStigmas: useBuildStore((state) => state.getAvailableStigmas),
  updateChainSkillStigmas: useBuildStore((state) => state.updateChainSkillStigmas),
});

/**
 * Hook for accessing shortcut actions
 */
export const useShortcutActions = () => ({
  updateShortcuts: useBuildStore((state) => state.updateShortcuts),
  updateShortcutLabels: useBuildStore((state) => state.updateShortcutLabels),
  updateChainSkill: useBuildStore((state) => state.updateChainSkill),
});
