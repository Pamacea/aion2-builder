import { StateCreator } from "zustand";
import { isBuildOwner, isStarterBuild } from "@/utils/buildUtils";

export interface ShortcutsSlice {
  // Actions
  updateShortcuts: (shortcuts: any) => Promise<void>;
  updateShortcutLabels: (labels: any) => void;
  updateChainSkill: (skillId: number, chainSkillIds: number[], type: "ability" | "stigma") => Promise<void>;
}

type SetState = (
  partial: any | ((state: any) => any),
  replace?: boolean | undefined
) => void;

type GetState = () => any;

export const createShortcutsSlice: any = (set: SetState, get: GetState) => ({
  updateShortcuts: async (shortcuts: any) => {
    const build = (get() as any).build;
    const currentUserId = (get() as any).currentUserId;

    console.log("[Store] updateShortcuts called", {
      hasBuild: !!build,
      buildId: build?.id,
      isStarter: build ? isStarterBuild(build) : false,
      currentUserId,
      isOwner: build ? isBuildOwner(build, currentUserId) : false
    });

    if (!build || isStarterBuild(build) || !isBuildOwner(build, currentUserId)) {
      console.warn("[Store] updateShortcuts blocked:", {
        noBuild: !build,
        isStarter: build ? isStarterBuild(build) : false,
        isOwner: build ? isBuildOwner(build, currentUserId) : false
      });
      return;
    }

    const previousShortcuts = build.shortcuts;

    set((state: any) => ({
      build: state.build ? { ...state.build, shortcuts } : null,
    }));

    try {
      const { updateShortcutsOnly } = await import("@/actions/buildActions");
      const shortcutsToSave = shortcuts
        ? Object.fromEntries(
            Object.entries(shortcuts).map(([key, value]: [string, any]) => [
              key,
              {
                type: value.type,
                ...(value.abilityId !== undefined && { abilityId: value.abilityId }),
                ...(value.stigmaId !== undefined && { stigmaId: value.stigmaId }),
              },
            ])
          )
        : null;

      if (!build) return;
      console.log("[Store] Calling updateShortcutsOnly with:", shortcutsToSave);
      await updateShortcutsOnly(build.id, shortcutsToSave);
      console.log("[Store] updateShortcutsOnly completed successfully");
    } catch (error) {
      console.error("Error saving shortcuts:", error);
      set((state: any) => ({
        build: state.build ? { ...state.build, shortcuts: previousShortcuts } : null,
      }));
    }
  },

  updateShortcutLabels: (labels: any) => {
    const build = (get() as any).build;
    const currentUserId = (get() as any).currentUserId;
    if (isStarterBuild(build) || !isBuildOwner(build, currentUserId)) return;
    (get() as any).updateBuild({ shortcutLabels: labels });
  },

  updateChainSkill: async (skillId: number, chainSkillIds: number[], type: "ability" | "stigma") => {
    if (type === "ability") {
      await (get() as any).updateChainSkillAbilities(skillId, chainSkillIds);
    } else if (type === "stigma") {
      await (get() as any).updateChainSkillStigmas(skillId, chainSkillIds);
    }
  },
});
