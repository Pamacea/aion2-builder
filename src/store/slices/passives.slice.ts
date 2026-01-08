import { StateCreator } from "zustand";
import { BuildPassiveType } from "@/types/schema";
import { isBuildOwner, isStarterBuild } from "@/utils/buildUtils";

export interface PassivesSlice {
  // Actions
  updatePassiveLevel: (passiveId: number, level: number) => Promise<void>;
  addPassive: (passiveId: number, level?: number) => Promise<void>;
  removePassive: (passiveId: number) => Promise<void>;
  getPassivesBySpellTag: (spellTagName: string) => BuildPassiveType[] | undefined;
  getAvailablePassives: () => any[];
}

type SetState = (
  partial: any | ((state: any) => any),
  replace?: boolean | undefined
) => void;

type GetState = () => any;

export const createPassivesSlice: any = (set: SetState, get: GetState) => ({
  updatePassiveLevel: async (passiveId: number, level: number) => {
    const build = (get() as any).build;
    const currentUserId = (get() as any).currentUserId;
    if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

    const passives = build.passives?.map((p: any) =>
      p.passiveId === passiveId ? { ...p, level } : p
    );

    set((state: any) => ({
      build: state.build ? { ...state.build, passives } : null,
    }));

    try {
      const { updatePassiveLevelOnly } = await import("@/actions/buildActions");
      if (!build) return;
      await updatePassiveLevelOnly(build.id, passiveId, level);
    } catch (error) {
      console.error("Error saving passive level:", error);
      (get() as any).updateBuild({ passives });
    }
  },

  addPassive: async (passiveId: number, level: number = 0) => {
    const build = (get() as any).build;
    const currentUserId = (get() as any).currentUserId;
    if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

    const existingPassive = build.passives?.find((p: any) => p.passiveId === passiveId);
    if (existingPassive) return;

    const classPassive = build.class?.passives?.find((p: any) => p.id === passiveId);
    if (!classPassive) return;

    const maxLevel = ("maxLevel" in classPassive ? classPassive.maxLevel : 20) as number;

    const newBuildPassive = {
      id: 0,
      buildId: build.id,
      passiveId,
      level,
      maxLevel,
      build: build as any,
      passive: classPassive as any,
    } as BuildPassiveType;

    const passives = [...(build.passives || []), newBuildPassive];

    set((state: any) => ({
      build: state.build ? { ...state.build, passives } : null,
    }));

    try {
      const { addPassiveOnly } = await import("@/actions/buildActions");
      await addPassiveOnly(build.id, passiveId, level, maxLevel);
    } catch (error) {
      console.error("Error adding passive:", error);
      (get() as any).updateBuild({ passives });
    }
  },

  removePassive: async (passiveId: number) => {
    const build = (get() as any).build;
    const currentUserId = (get() as any).currentUserId;
    if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

    const passives = build.passives?.filter((p: any) => p.passiveId !== passiveId);

    set((state: any) => ({
      build: state.build ? { ...state.build, passives } : null,
    }));

    try {
      const { removePassiveOnly } = await import("@/actions/buildActions");
      await removePassiveOnly(build.id, passiveId);
    } catch (error) {
      console.error("Error removing passive:", error);
      (get() as any).updateBuild({ passives });
    }
  },

  getPassivesBySpellTag: (spellTagName: string) => {
    const build = (get() as any).build;
    if (!build?.passives) return [];
    return build.passives.filter((buildPassive: any) =>
      buildPassive.passive.spellTag?.some((tag: any) => tag.name === spellTagName)
    );
  },

  getAvailablePassives: () => {
    const build = (get() as any).build;
    return build?.class?.passives || [];
  },
});
