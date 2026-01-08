import { StateCreator } from "zustand";
import { BuildStigmaType } from "@/types/schema";
import { isBuildOwner, isStarterBuild } from "@/utils/buildUtils";
import { syncChainSkills } from "@/utils/buildUtils";
import { filterChainSkills } from "@/utils/chainSkillsUtils";

export interface StigmasSlice {
  // Actions
  updateStigma: (stigmaId: number, stigmaCost: number) => Promise<void>;
  updateStigmaLevel: (stigmaId: number, level: number) => Promise<void>;
  addStigma: (stigmaId: number, level?: number, stigmaCost?: number) => Promise<void>;
  removeStigma: (stigmaId: number) => Promise<void>;
  toggleSpecialtyChoiceStigma: (stigmaId: number, specialtyChoiceId: number) => Promise<void>;
  getStigmasBySpellTag: (spellTagName: string) => BuildStigmaType[] | undefined;
  getAvailableStigmas: () => any[];
  updateChainSkillStigmas: (skillId: number, chainSkillIds: number[]) => Promise<void>;
}

type SetState = (
  partial: any | ((state: any) => any),
  replace?: boolean | undefined
) => void;

type GetState = () => any;

export const createStigmasSlice: any = (set: SetState, get: GetState) => ({
  updateStigma: async (stigmaId: number, stigmaCost: number) => {
    const build = (get() as any).build;
    const currentUserId = (get() as any).currentUserId;
    if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

    const stigmas = build.stigmas?.map((s: any) =>
      s.stigmaId === stigmaId ? { ...s, stigmaCost } : s
    );

    set((state: any) => ({
      build: state.build ? { ...state.build, stigmas } : null,
    }));

    try {
      const { updateStigmaCostOnly } = await import("@/actions/buildActions");
      await updateStigmaCostOnly(build.id, stigmaId, stigmaCost);
    } catch (error) {
      console.error("Error saving stigma cost:", error);
      (get() as any).updateBuild({ stigmas });
    }
  },

  updateStigmaLevel: async (stigmaId: number, level: number) => {
    const build = (get() as any).build;
    const currentUserId = (get() as any).currentUserId;
    if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

    let selectedChainSkillIds: number[] = [];
    const updatedStigmas =
      build.stigmas?.map((s: any) => {
        if (s.stigmaId !== stigmaId) return s;
        selectedChainSkillIds = s.selectedChainSkillIds || [];
        return { ...s, level };
      }) || [];

    const finalStigmas =
      selectedChainSkillIds.length > 0
        ? syncChainSkills(
            updatedStigmas,
            level,
            selectedChainSkillIds,
            (id: any) => build.class?.stigmas?.find((cs: any) => cs.id === id),
            (id: any, lvl: any, classItem: any) =>
              ({
                id: 0,
                buildId: build.id,
                stigmaId: id,
                level: lvl,
                maxLevel: ("maxLevel" in classItem ? classItem.maxLevel : 20) as number,
                stigmaCost: ("baseCost" in classItem ? classItem.baseCost : 10) ?? 10,
                activeSpecialtyChoiceIds: [],
                selectedChainSkillIds: [],
                build: build as any,
                stigma: classItem as any,
              }) as BuildStigmaType
          )
        : updatedStigmas;

    set((state: any) => ({
      build: state.build ? { ...state.build, stigmas: finalStigmas } : null,
    }));

    try {
      const { updateStigmaLevelOnly } = await import("@/actions/buildActions");
      await updateStigmaLevelOnly(build.id, stigmaId, level);
    } catch (error) {
      console.error("Error saving stigma level:", error);
      (get() as any).updateBuild({ stigmas: finalStigmas });
    }
  },

  addStigma: async (stigmaId: number, level: number = 0, stigmaCost?: number) => {
    const build = (get() as any).build;
    const currentUserId = (get() as any).currentUserId;
    if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

    const existingStigma = build.stigmas?.find((s: any) => s.stigmaId === stigmaId);
    if (existingStigma) return;

    const classStigma = build.class?.stigmas?.find((s: any) => s.id === stigmaId);
    if (!classStigma) return;

    const maxLevel = ("maxLevel" in classStigma ? classStigma.maxLevel : 20) as number;
    const finalStigmaCost =
      stigmaCost ?? ("baseCost" in classStigma ? classStigma.baseCost : 10) ?? 10;

    const newBuildStigma = {
      id: 0,
      buildId: build.id,
      stigmaId,
      level,
      maxLevel,
      stigmaCost: finalStigmaCost,
      activeSpecialtyChoiceIds: [],
      selectedChainSkillIds: [],
      build: build as any,
      stigma: classStigma as any,
    } as BuildStigmaType;

    const stigmas = [...(build.stigmas || []), newBuildStigma];

    set((state: any) => ({
      build: state.build ? { ...state.build, stigmas } : null,
    }));

    try {
      const { addStigmaOnly } = await import("@/actions/buildActions");
      await addStigmaOnly(build.id, stigmaId, level, maxLevel, finalStigmaCost, [], []);
    } catch (error) {
      console.error("Error adding stigma:", error);
      (get() as any).updateBuild({ stigmas });
    }
  },

  removeStigma: async (stigmaId: number) => {
    const build = (get() as any).build;
    const currentUserId = (get() as any).currentUserId;
    if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

    const stigmas = build.stigmas?.filter((s: any) => s.stigmaId !== stigmaId);

    set((state: any) => ({
      build: state.build ? { ...state.build, stigmas } : null,
    }));

    try {
      const { removeStigmaOnly } = await import("@/actions/buildActions");
      await removeStigmaOnly(build.id, stigmaId);
    } catch (error) {
      console.error("Error removing stigma:", error);
      (get() as any).updateBuild({ stigmas });
    }
  },

  toggleSpecialtyChoiceStigma: async (stigmaId: number, specialtyChoiceId: number) => {
    const build = (get() as any).build;
    const currentUserId = (get() as any).currentUserId;
    if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

    const buildStigma = build.stigmas?.find((s: any) => s.stigmaId === stigmaId);
    if (!buildStigma) return;

    const classStigma = build.class?.stigmas?.find((s: any) => s.id === stigmaId);
    if (!classStigma) return;

    const specialtyChoice = classStigma.specialtyChoices?.find(
      (sc: any) => sc.id === specialtyChoiceId
    );
    if (!specialtyChoice) return;

    const isActive =
      buildStigma.activeSpecialtyChoiceIds.includes(specialtyChoiceId);
    if (
      !isActive &&
      (buildStigma.level === 0 || buildStigma.level < specialtyChoice.unlockLevel)
    ) {
      return;
    }

    const newActiveSpecialtyChoiceIds = isActive
      ? buildStigma.activeSpecialtyChoiceIds.filter((id: number) => id !== specialtyChoiceId)
      : [...buildStigma.activeSpecialtyChoiceIds, specialtyChoiceId];

    set((state: any) => {
      if (!state.build) return state;
      const updatedStigmas = state.build.stigmas?.map((s: any) => {
        if (s.stigmaId !== stigmaId) return s;
        return {
          ...s,
          activeSpecialtyChoiceIds: newActiveSpecialtyChoiceIds,
        };
      });
      return {
        build: {
          ...state.build,
          stigmas: updatedStigmas,
        },
      };
    });

    try {
      const { updateStigmaSpecialtyChoicesOnly } = await import("@/actions/buildActions");
      await updateStigmaSpecialtyChoicesOnly(build.id, stigmaId, newActiveSpecialtyChoiceIds);
    } catch (error) {
      console.error("Error saving stigma specialty choices:", error);
    }
  },

  getStigmasBySpellTag: (spellTagName: string) => {
    const build = (get() as any).build;
    if (!build?.stigmas) return [];
    return build.stigmas.filter((buildStigma: any) =>
      buildStigma.stigma.spellTag?.some((tag: any) => tag.name === spellTagName)
    );
  },

  getAvailableStigmas: () => {
    const build = (get() as any).build;
    const allStigmas = build?.class?.stigmas || [];
    return filterChainSkills(
      allStigmas,
      (stigma: any) => stigma.parentStigmas?.map((cs: any) => cs.chainStigma.id) || []
    );
  },

  updateChainSkillStigmas: async (skillId: number, chainSkillIds: number[]) => {
    const build = (get() as any).build;
    const currentUserId = (get() as any).currentUserId;
    if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

    const parentStigma = build.stigmas?.find((s: any) => s.stigmaId === skillId);
    if (!parentStigma) return;
    const parentLevel = parentStigma.level || 0;

    const stigmas =
      build.stigmas?.map((s: any) => {
        if (s.stigmaId !== skillId) return s;
        return {
          ...s,
          selectedChainSkillIds: chainSkillIds,
        };
      }) || [];

    for (const chainSkillId of chainSkillIds) {
      const chainSkillIndex = stigmas.findIndex(
        (bs: any) => bs.stigmaId === chainSkillId
      );
      if (chainSkillIndex === -1) {
        const chainClassStigma = build.class?.stigmas?.find(
          (cs: any) => cs.id === chainSkillId
        );
        if (chainClassStigma) {
          const maxLevel = ("maxLevel" in chainClassStigma
            ? chainClassStigma.maxLevel
            : 20) as number;
          const stigmaCost =
            ("baseCost" in chainClassStigma ? chainClassStigma.baseCost : 10) ?? 10;
          const newChainSkillStigma = {
            id: 0,
            buildId: build.id,
            stigmaId: chainSkillId,
            level: parentLevel,
            maxLevel,
            stigmaCost,
            activeSpecialtyChoiceIds: [],
            selectedChainSkillIds: [],
            build: build as any,
            stigma: chainClassStigma as any,
          } as BuildStigmaType;
          stigmas.push(newChainSkillStigma);

          try {
            const { addStigmaOnly } = await import("@/actions/buildActions");
            await addStigmaOnly(build.id, chainSkillId, parentLevel, maxLevel, stigmaCost, [], []);
          } catch (error) {
            console.error("Error adding chain skill:", error);
          }
        }
      } else {
        stigmas[chainSkillIndex] = {
          ...stigmas[chainSkillIndex],
          level: parentLevel,
        };

        try {
          const { updateStigmaLevelOnly } = await import("@/actions/buildActions");
          await updateStigmaLevelOnly(build.id, chainSkillId, parentLevel);
        } catch (error) {
          console.error("Error updating chain skill level:", error);
        }
      }
    }

    const removedChainSkillIds = (
      parentStigma.selectedChainSkillIds || []
    ).filter((id: number) => !chainSkillIds.includes(id));
    for (const removedId of removedChainSkillIds) {
      const isUsedElsewhere = stigmas.some(
        (s: any) =>
          s.stigmaId !== skillId &&
          s.selectedChainSkillIds?.includes(removedId)
      );
      if (!isUsedElsewhere) {
        const index = stigmas.findIndex((bs: any) => bs.stigmaId === removedId);
        if (index !== -1) {
          stigmas.splice(index, 1);

          try {
            const { removeStigmaOnly } = await import("@/actions/buildActions");
            await removeStigmaOnly(build.id, removedId);
          } catch (error) {
            console.error("Error removing chain skill:", error);
          }
        }
      }
    }

    set((state: any) => ({
      build: state.build ? { ...state.build, stigmas } : null,
    }));

    try {
      const { updateStigmaChainSkillsOnly } = await import("@/actions/buildActions");
      await updateStigmaChainSkillsOnly(build.id, skillId, chainSkillIds);
    } catch (error) {
      console.error("Error saving chain skills:", error);
      (get() as any).updateBuild({ stigmas });
    }
  },
});
