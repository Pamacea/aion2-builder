"use client";

import { getClassByName } from "@/actions/classActions";
import { BuildType } from "@/types/schema";
import { isStarterBuild } from "@/utils/buildUtils";
import { loadBuildAction, saveBuildAction } from "actions/buildActions";
import { create } from "zustand";

type BuildState = {
  build: BuildType | null;
  loading: boolean;
  saving: boolean;
  setBuild: (build: BuildType) => void;
  updateBuild: (partial: Partial<BuildType>) => void;
  setName: (name: string) => void;
  setClassId: (classId: number) => void;
  setClassByName: (className: string) => Promise<void>;
  updateAbilityLevel: (abilityId: number, level: number) => void;
  updatePassiveLevel: (passiveId: number, level: number) => void;
  updateStigma: (stigmaId: number, stigmaCost: number) => void;
  loadBuild: (buildId: number) => Promise<void>;
};

export const useBuildStore = create<BuildState>((set, get) => {
  let saveTimeout: NodeJS.Timeout | null = null;

  const autoSave = async () => {
    const build = get().build;
    if (!build) return;

    // Prevent saving starter builds
    if (isStarterBuild(build)) {
      return;
    }

    set({ saving: true });
    try {
      await saveBuildAction(build.id, build);
    } catch (error) {
      console.error("Error saving build:", error);
    } finally {
      set({ saving: false });
    }
  };

  const scheduleSave = () => {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(autoSave, 500);
  };

  return {
    build: null,
    loading: true,
    saving: false,

    setBuild: (build) => set({ build }),

    loadBuild: async (buildId) => {
      set({ loading: true });
      const data = await loadBuildAction(buildId);
      set({ build: data, loading: false });
    },

    updateBuild: (partial) => {
      const currentBuild = get().build;
      if (!currentBuild) return;

      // Prevent updating starter builds
      if (isStarterBuild(currentBuild)) {
        console.warn("Cannot modify starter builds");
        return;
      }

      set((state) => {
        const updated = { ...state.build!, ...partial };
        scheduleSave();
        return { build: updated };
      });
    },

    setName: (name) => {
      const build = get().build;
      if (isStarterBuild(build)) return;
      get().updateBuild({ name });
    },

    setClassId: (classId) => {
      const build = get().build;
      if (isStarterBuild(build)) return;
      const currentClass = build?.class;
      if (!currentClass) return;
      get().updateBuild({ classId, class: { ...currentClass, id: classId } });
    },

    setClassByName: async (className) => {
      const build = get().build;
      if (isStarterBuild(build)) return;

      const newClass = await getClassByName(className);
      if (!newClass) return;
      
      if (!build) return;

      // Update the build with the new class data
      // Only include the base class properties (exclude nested arrays to avoid circular refs)
      const classData = {
        id: newClass.id,
        name: newClass.name,
        iconUrl: newClass.iconUrl,
        bannerUrl: newClass.bannerUrl,
        characterUrl: newClass.characterUrl,
        description: newClass.description,
        tags: newClass.tags,
      };

      // Clear abilities, passives, and stigmas since they're class-specific
      get().updateBuild({
        classId: newClass.id,
        class: classData,
        abilities: [],
        passives: [],
        stigmas: [],
      });
    },

    updateAbilityLevel: (abilityId, level) => {
      const build = get().build;
      if (isStarterBuild(build)) return;
      const abilities = build?.abilities?.map((a) =>
        a.abilityId === abilityId ? { ...a, level } : a
      );
      get().updateBuild({ abilities });
    },

    updatePassiveLevel: (passiveId, level) => {
      const build = get().build;
      if (isStarterBuild(build)) return;
      const passives = build?.passives?.map((p) =>
        p.passiveId === passiveId ? { ...p, level } : p
      );
      get().updateBuild({ passives });
    },

    updateStigma: (stigmaId, stigmaCost) => {
      const build = get().build;
      if (isStarterBuild(build)) return;
      const stigmas = build?.stigmas?.map((s) =>
        s.stigmaId === stigmaId ? { ...s, stigmaCost } : s
      );
      get().updateBuild({ stigmas });
    },
  };
});
