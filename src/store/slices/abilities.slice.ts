import { StateCreator } from "zustand";
import { BuildAbilityType } from "@/types/schema";
import { isBuildOwner, isStarterBuild } from "@/utils/buildUtils";
import { syncChainSkills } from "@/utils/buildUtils";
import { filterChainSkills } from "@/utils/chainSkillsUtils";

export interface AbilitiesSlice {
  // Actions
  updateAbilityLevel: (abilityId: number, level: number) => Promise<void>;
  addAbility: (abilityId: number, level?: number) => Promise<void>;
  removeAbility: (abilityId: number) => Promise<void>;
  toggleSpecialtyChoice: (abilityId: number, specialtyChoiceId: number) => Promise<void>;
  getAbilitiesBySpellTag: (spellTagName: string) => BuildAbilityType[] | undefined;
  getAvailableAbilities: () => any[];
  updateChainSkillAbilities: (skillId: number, chainSkillIds: number[]) => Promise<void>;
}

type SetState = (
  partial: any | ((state: any) => any),
  replace?: boolean | undefined
) => void;

type GetState = () => any;

export const createAbilitiesSlice: any = (set: SetState, get: GetState) => ({
  updateAbilityLevel: async (abilityId: number, level: number) => {
    const build = (get() as any).build;
    const currentUserId = (get() as any).currentUserId;
    if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

    const firstAbilityId = build.class?.abilities
      ?.sort((a: any, b: any) => a.id - b.id)[0]?.id;

    if (firstAbilityId && abilityId === firstAbilityId && level < 1) {
      level = 1;
    }

    const classAbility = build.class?.abilities?.find((a: any) => a.id === abilityId);
    let selectedChainSkillIds: number[] = [];

    const updatedAbilities =
      build.abilities?.map((a: any) => {
        if (a.abilityId !== abilityId) return a;

        selectedChainSkillIds = a.selectedChainSkillIds || [];
        const filteredSpecialties =
          classAbility?.specialtyChoices &&
          a.activeSpecialtyChoiceIds.length > 0
            ? a.activeSpecialtyChoiceIds.filter((id: number) => {
                const choice = classAbility.specialtyChoices?.find(
                  (sc: any) => sc.id === id
                );
                return choice ? level >= choice.unlockLevel : false;
              })
            : [];

        return { ...a, level, activeSpecialtyChoiceIds: filteredSpecialties };
      }) || [];

    const finalAbilities =
      selectedChainSkillIds.length > 0
        ? syncChainSkills(
            updatedAbilities,
            level,
            selectedChainSkillIds,
            (id: any) => build.class?.abilities?.find((ca: any) => ca.id === id),
            (id: any, lvl: any, classItem: any) =>
              ({
                id: 0,
                buildId: build.id,
                abilityId: id,
                level: lvl,
                maxLevel: ("maxLevel" in classItem ? classItem.maxLevel : 20) as number,
                activeSpecialtyChoiceIds: [],
                selectedChainSkillIds: [],
                build: build as any,
                ability: classItem as any,
              }) as BuildAbilityType
          )
        : updatedAbilities;

    set((state: any) => ({
      build: state.build ? { ...state.build, abilities: finalAbilities } : null,
    }));

    try {
      const { updateAbilityLevelOnly } = await import("@/actions/buildActions");
      await updateAbilityLevelOnly(build.id, abilityId, level);
    } catch (error) {
      console.error("Error saving ability level:", error);
      (get() as any).updateBuild({ abilities: finalAbilities });
    }
  },

  addAbility: async (abilityId: number, level: number = 0) => {
    const build = (get() as any).build;
    const currentUserId = (get() as any).currentUserId;
    if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

    const existingAbility = build.abilities?.find((a: any) => a.abilityId === abilityId);
    if (existingAbility) return;

    const classAbility = build.class?.abilities?.find((a: any) => a.id === abilityId);
    if (!classAbility) return;

    const maxLevel = ("maxLevel" in classAbility ? classAbility.maxLevel : 20) as number;

    const newBuildAbility = {
      id: 0,
      buildId: build.id,
      abilityId,
      level,
      maxLevel,
      activeSpecialtyChoiceIds: [],
      selectedChainSkillIds: [],
      build: build as any,
      ability: classAbility as any,
    } as BuildAbilityType;

    const abilities = [...(build.abilities || []), newBuildAbility];

    set((state: any) => ({
      build: state.build ? { ...state.build, abilities } : null,
    }));

    try {
      const { addAbilityOnly } = await import("@/actions/buildActions");
      await addAbilityOnly(build.id, abilityId, level, maxLevel, [], []);
    } catch (error) {
      console.error("Error adding ability:", error);
      (get() as any).updateBuild({ abilities });
    }
  },

  removeAbility: async (abilityId: number) => {
    const build = (get() as any).build;
    const currentUserId = (get() as any).currentUserId;
    if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

    const abilities = build.abilities?.filter((a: any) => a.abilityId !== abilityId);

    set((state: any) => ({
      build: state.build ? { ...state.build, abilities } : null,
    }));

    try {
      const { removeAbilityOnly } = await import("@/actions/buildActions");
      await removeAbilityOnly(build.id, abilityId);
    } catch (error) {
      console.error("Error removing ability:", error);
      (get() as any).updateBuild({ abilities });
    }
  },

  toggleSpecialtyChoice: async (abilityId: number, specialtyChoiceId: number) => {
    const build = (get() as any).build;
    const currentUserId = (get() as any).currentUserId;
    if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

    const buildAbility = build.abilities?.find((a: any) => a.abilityId === abilityId);
    if (!buildAbility) return;

    const classAbility = build.class?.abilities?.find((a: any) => a.id === abilityId);
    if (!classAbility) return;

    const specialtyChoice = classAbility.specialtyChoices?.find(
      (sc: any) => sc.id === specialtyChoiceId
    );
    if (!specialtyChoice) return;

    let effectiveLevel = buildAbility.level;
    try {
      const { useDaevanionStore } = await import("@/app/build/[buildId]/sphere/_store/useDaevanionStore");
      const daevanionBoost = await useDaevanionStore.getState().getDaevanionBoostForSkill(abilityId, "ability");
      effectiveLevel = buildAbility.level + daevanionBoost;
    } catch (error) {
      console.warn("Could not calculate daevanion boost, using base level:", error);
    }

    const isActive =
      buildAbility.activeSpecialtyChoiceIds.includes(specialtyChoiceId);
    if (
      !isActive &&
      (effectiveLevel === 0 || effectiveLevel < specialtyChoice.unlockLevel)
    ) {
      return;
    }

    if (!isActive && buildAbility.activeSpecialtyChoiceIds.length >= 2) {
      if (effectiveLevel < 20) {
        return;
      }
    }

    if (!isActive && buildAbility.activeSpecialtyChoiceIds.length >= 3) {
      return;
    }

    const newActiveSpecialtyChoiceIds = isActive
      ? buildAbility.activeSpecialtyChoiceIds.filter((id: number) => id !== specialtyChoiceId)
      : [...buildAbility.activeSpecialtyChoiceIds, specialtyChoiceId];

    set((state: any) => {
      if (!state.build) return state;
      const updatedAbilities = state.build.abilities?.map((a: any) => {
        if (a.abilityId !== abilityId) return a;
        return {
          ...a,
          activeSpecialtyChoiceIds: newActiveSpecialtyChoiceIds,
        };
      });
      return {
        build: {
          ...state.build,
          abilities: updatedAbilities,
        },
      };
    });

    try {
      const { updateAbilitySpecialtyChoicesOnly } = await import("@/actions/buildActions");
      await updateAbilitySpecialtyChoicesOnly(build.id, abilityId, newActiveSpecialtyChoiceIds);
    } catch (error) {
      console.error("Error saving ability specialty choices:", error);
    }
  },

  getAbilitiesBySpellTag: (spellTagName: string) => {
    const build = (get() as any).build;
    if (!build?.abilities) return [];
    return build.abilities.filter((buildAbility: any) =>
      buildAbility.ability.spellTag?.some((tag: any) => tag.name === spellTagName)
    );
  },

  getAvailableAbilities: () => {
    const build = (get() as any).build;
    const allAbilities = build?.class?.abilities || [];
    return filterChainSkills(
      allAbilities,
      (ability: any) => ability.parentAbilities?.map((cs: any) => cs.chainAbility.id) || []
    );
  },

  updateChainSkillAbilities: async (skillId: number, chainSkillIds: number[]) => {
    const build = (get() as any).build;
    const currentUserId = (get() as any).currentUserId;
    if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

    const parentAbility = build.abilities?.find((a: any) => a.abilityId === skillId);
    if (!parentAbility) return;
    const parentLevel = parentAbility.level || 0;

    const abilities =
      build.abilities?.map((a: any) => {
        if (a.abilityId !== skillId) return a;
        return {
          ...a,
          selectedChainSkillIds: chainSkillIds,
        };
      }) || [];

    for (const chainSkillId of chainSkillIds) {
      const chainSkillIndex = abilities.findIndex(
        (ba: any) => ba.abilityId === chainSkillId
      );
      if (chainSkillIndex === -1) {
        const chainClassAbility = build.class?.abilities?.find(
          (ca: any) => ca.id === chainSkillId
        );
        if (chainClassAbility) {
          const maxLevel = ("maxLevel" in chainClassAbility
            ? chainClassAbility.maxLevel
            : 20) as number;
          const newChainSkillAbility = {
            id: 0,
            buildId: build.id,
            abilityId: chainSkillId,
            level: parentLevel,
            maxLevel,
            activeSpecialtyChoiceIds: [],
            selectedChainSkillIds: [],
            build: build as any,
            ability: chainClassAbility as any,
          } as BuildAbilityType;
          abilities.push(newChainSkillAbility);

          try {
            const { addAbilityOnly } = await import("@/actions/buildActions");
            await addAbilityOnly(build.id, chainSkillId, parentLevel, maxLevel, [], []);
          } catch (error) {
            console.error("Error adding chain skill:", error);
          }
        }
      } else {
        abilities[chainSkillIndex] = {
          ...abilities[chainSkillIndex],
          level: parentLevel,
        };

        try {
          const { updateAbilityLevelOnly } = await import("@/actions/buildActions");
          await updateAbilityLevelOnly(build.id, chainSkillId, parentLevel);
        } catch (error) {
          console.error("Error updating chain skill level:", error);
        }
      }
    }

    const removedChainSkillIds = (
      parentAbility.selectedChainSkillIds || []
    ).filter((id: number) => !chainSkillIds.includes(id));
    for (const removedId of removedChainSkillIds) {
      const isUsedElsewhere = abilities.some(
        (a: any) =>
          a.abilityId !== skillId &&
          a.selectedChainSkillIds?.includes(removedId)
      );
      if (!isUsedElsewhere) {
        const index = abilities.findIndex((ba: any) => ba.abilityId === removedId);
        if (index !== -1) {
          abilities.splice(index, 1);

          try {
            const { removeAbilityOnly } = await import("@/actions/buildActions");
            await removeAbilityOnly(build.id, removedId);
          } catch (error) {
            console.error("Error removing chain skill:", error);
          }
        }
      }
    }

    set((state: any) => ({
      build: state.build ? { ...state.build, abilities } : null,
    }));

    try {
      const { updateAbilityChainSkillsOnly } = await import("@/actions/buildActions");
      await updateAbilityChainSkillsOnly(build.id, skillId, chainSkillIds);
    } catch (error) {
      console.error("Error saving chain skills:", error);
      (get() as any).updateBuild({ abilities });
    }
  },
});
