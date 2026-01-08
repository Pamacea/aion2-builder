import { StateCreator } from "zustand";
import { BuildType } from "@/types/schema";
import { canEditBuild, isBuildOwner, isStarterBuild } from "@/utils/buildUtils";

export interface BuildSlice {
  // State
  build: BuildType | null;
  loading: boolean;
  saving: boolean;
  currentUserId: string | null;

  // Actions
  setCurrentUserId: (userId: string | null) => void;
  setBuild: (build: BuildType) => void;
  loadBuild: (buildId: number, userId?: string | null) => Promise<void>;
  updateBuild: (partial: Partial<BuildType>) => void;
  setName: (name: string) => void;
  setClassId: (classId: number) => void;
  setClassByName: (className: string) => Promise<void>;
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;
let isSaving = false;
let needsSave = false;

const autoSave = async (build: BuildType, set: any) => {
  if (isSaving) {
    needsSave = true;
    return;
  }

  if (!build || isStarterBuild(build)) {
    needsSave = false;
    return;
  }

  const buildToSave = build;
  isSaving = true;
  set({ saving: true });

  try {
    const { saveBuildAction } = await import("actions/buildActions");
    await saveBuildAction(buildToSave.id, buildToSave);
  } catch (error) {
    console.error("Error saving build:", error);
  } finally {
    isSaving = false;
    set({ saving: false });

    if (needsSave) {
      needsSave = false;
      setTimeout(() => {
        autoSave(buildToSave, set);
      }, 100);
    }
  }
};

const scheduleSave = (build: BuildType | null, set: any) => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = null;
  }

  if (isSaving) {
    needsSave = true;
    return;
  }

  if (!build) return;

  saveTimeout = setTimeout(() => {
    saveTimeout = null;
    autoSave(build, set);
  }, 200);
};

export const createBuildSlice: StateCreator<BuildSlice> = (set, get) => ({
  // Initial state
  build: null,
  loading: true,
  saving: false,
  currentUserId: null,

  // Actions
  setCurrentUserId: (userId) => set({ currentUserId: userId }),

  setBuild: (build) => set({ build }),

  loadBuild: async (buildId, userId = null) => {
    set({ loading: true });

    if (userId) {
      set({ currentUserId: userId });
    }

    try {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
        saveTimeout = null;
      }
      needsSave = false;

      const { loadBuildAction } = await import("actions/buildActions");
      const data = await loadBuildAction(buildId);

      set({ build: data, loading: false });
    } catch (error) {
      console.error("Error loading build:", error);
      set({ build: null, loading: false });
    }
  },

  updateBuild: (partial) => {
    const currentBuild = get().build;
    const currentUserId = get().currentUserId;
    if (!currentBuild) return;

    if (isStarterBuild(currentBuild)) {
      console.warn("Cannot modify starter builds");
      return;
    }

    if (!canEditBuild(currentBuild, currentUserId)) {
      console.warn("Cannot modify builds that you don't own");
      return;
    }

    set((state) => {
      const updated = {
        ...state.build!,
        ...partial,
        ...(partial.abilities !== undefined && { abilities: partial.abilities }),
        ...(partial.passives !== undefined && { passives: partial.passives }),
        ...(partial.stigmas !== undefined && { stigmas: partial.stigmas }),
      };
      scheduleSave(updated, set);
      return { build: updated };
    });
  },

  setName: (name) => {
    const build = get().build;
    const currentUserId = get().currentUserId;
    if (isStarterBuild(build) || !isBuildOwner(build, currentUserId)) return;
    get().updateBuild({ name });
  },

  setClassId: (classId) => {
    const build = get().build;
    const currentUserId = get().currentUserId;
    if (isStarterBuild(build) || !isBuildOwner(build, currentUserId)) return;
    const currentClass = build?.class;
    if (!currentClass) return;
    get().updateBuild({ classId, class: { ...currentClass, id: classId } });
  },

  setClassByName: async (className) => {
    const build = get().build;
    const currentUserId = get().currentUserId;
    if (isStarterBuild(build) || !isBuildOwner(build, currentUserId)) return;

    const { getClassByName } = await import("@/actions/classActions");
    const newClass = await getClassByName(className);
    if (!newClass || !build) return;

    const classData = {
      id: newClass.id,
      name: newClass.name,
      iconUrl: newClass.iconUrl,
      bannerUrl: newClass.bannerUrl,
      characterUrl: newClass.characterUrl,
      description: newClass.description,
      tags: newClass.tags,
      abilities: newClass.abilities || [],
      passives: newClass.passives || [],
      stigmas: newClass.stigmas || [],
    };

    get().updateBuild({
      classId: newClass.id,
      class: classData,
      abilities: [],
      passives: [],
      stigmas: [],
    });
  },
});
