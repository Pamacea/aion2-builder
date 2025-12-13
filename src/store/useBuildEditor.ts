"use client";

import { getClassByName } from "@/actions/classActions";
import { BuildAbilityType, BuildPassiveType, BuildStigmaType, BuildType } from "@/types/schema";
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
  
  // Ability management
  updateAbilityLevel: (abilityId: number, level: number) => void;
  addAbility: (abilityId: number, level?: number) => void;
  removeAbility: (abilityId: number) => void;
  toggleSpecialtyChoice: (abilityId: number, specialtyChoiceId: number) => void;
  getAbilitiesBySpellTag: (spellTagName: string) => BuildType["abilities"];
  getAvailableAbilities: () => BuildType["class"]["abilities"];
  
  // Passive management
  updatePassiveLevel: (passiveId: number, level: number) => void;
  addPassive: (passiveId: number, level?: number) => void;
  removePassive: (passiveId: number) => void;
  getPassivesBySpellTag: (spellTagName: string) => BuildType["passives"];
  getAvailablePassives: () => BuildType["class"]["passives"];
  
  // Stigma management
  updateStigma: (stigmaId: number, stigmaCost: number) => void;
  updateStigmaLevel: (stigmaId: number, level: number) => void;
  addStigma: (stigmaId: number, level?: number, stigmaCost?: number) => void;
  removeStigma: (stigmaId: number) => void;
  toggleSpecialtyChoiceStigma: (stigmaId: number, specialtyChoiceId: number) => void;
  getStigmasBySpellTag: (spellTagName: string) => BuildType["stigmas"];
  getAvailableStigmas: () => BuildType["class"]["stigmas"];
  
  // Shortcuts management
  updateShortcuts: (shortcuts: BuildType["shortcuts"]) => void;
  
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
    saveTimeout = setTimeout(autoSave, 100);
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
        // Deep merge to ensure nested arrays are properly replaced
        const updated = { 
          ...state.build!, 
          ...partial,
          // Ensure abilities, passives, and stigmas arrays are properly replaced (not merged)
          ...(partial.abilities !== undefined && { abilities: partial.abilities }),
          ...(partial.passives !== undefined && { passives: partial.passives }),
          ...(partial.stigmas !== undefined && { stigmas: partial.stigmas }),
        };
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
      // Include abilities, passives, and stigmas so they're available for the skill page
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
      
      // Find the ability in class abilities to get specialtyChoices
      const classAbility = build?.class?.abilities?.find((a) => a.id === abilityId);
      
      const abilities = build?.abilities?.map((a) => {
        if (a.abilityId !== abilityId) return a;
        
        // Filter activeSpecialtyChoiceIds to only keep those that are still available at the new level
        // This ensures specialtyChoices are automatically deactivated when level decreases
        let filteredActiveSpecialtyChoiceIds: number[] = [];
        if (classAbility?.specialtyChoices && a.activeSpecialtyChoiceIds.length > 0) {
          filteredActiveSpecialtyChoiceIds = a.activeSpecialtyChoiceIds.filter((choiceId) => {
            const specialtyChoice = classAbility.specialtyChoices?.find((sc) => sc.id === choiceId);
            // Only keep specialtyChoice if level is sufficient
            return specialtyChoice ? level >= specialtyChoice.unlockLevel : false;
          });
        }
        
        return { ...a, level, activeSpecialtyChoiceIds: filteredActiveSpecialtyChoiceIds };
      });
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

    // ==========================================================
    // ABILITY MANAGEMENT
    // ==========================================================

    addAbility: (abilityId, level = 0) => {
      const build = get().build;
      if (isStarterBuild(build) || !build) return;

      // Check if ability already exists
      const existingAbility = build.abilities?.find((a) => a.abilityId === abilityId);
      if (existingAbility) return;

      // Find the ability in class abilities to get maxLevel
      const classAbility = build.class.abilities?.find((a) => a.id === abilityId);
      if (!classAbility) return;

      const newBuildAbility = {
        id: 0, // Will be set by the server
        buildId: build.id,
        abilityId,
        level,
        maxLevel: ("maxLevel" in classAbility ? classAbility.maxLevel : 20) as number,
        activeSpecialtyChoiceIds: [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        build: build as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ability: classAbility as any,
      } as BuildAbilityType;

      const abilities = [...(build.abilities || []), newBuildAbility];
      get().updateBuild({ abilities });
    },

    removeAbility: (abilityId) => {
      const build = get().build;
      if (isStarterBuild(build) || !build) return;
      const abilities = build.abilities?.filter((a) => a.abilityId !== abilityId);
      get().updateBuild({ abilities });
    },

    toggleSpecialtyChoice: (abilityId, specialtyChoiceId) => {
      const build = get().build;
      if (isStarterBuild(build) || !build) return;
      
      // Find the ability and its class ability to check unlock level
      const buildAbility = build.abilities?.find((a) => a.abilityId === abilityId);
      if (!buildAbility) return;
      
      const classAbility = build.class?.abilities?.find((a) => a.id === abilityId);
      if (!classAbility) return;
      
      const specialtyChoice = classAbility.specialtyChoices?.find((sc) => sc.id === specialtyChoiceId);
      if (!specialtyChoice) return;
      
      // Check if trying to activate a locked specialtyChoice (level is 0 or too low)
      const isActive = buildAbility.activeSpecialtyChoiceIds.includes(specialtyChoiceId);
      if (!isActive && (buildAbility.level === 0 || buildAbility.level < specialtyChoice.unlockLevel)) {
        // Cannot activate: level is 0 or too low
        return;
      }
      
      // If trying to activate the 3rd specialty choice, require level 20
      if (!isActive && buildAbility.activeSpecialtyChoiceIds.length >= 2) {
        // Trying to activate 3rd specialty choice - require level 20
        if (buildAbility.level < 20) {
          return;
        }
      }
      
      // If trying to activate and already have 3 active, don't allow
      if (!isActive && buildAbility.activeSpecialtyChoiceIds.length >= 3) {
        return;
      }
      
      const abilities = build.abilities?.map((a) => {
        if (a.abilityId !== abilityId) return a;
        
        return {
          ...a,
          activeSpecialtyChoiceIds: isActive
            ? a.activeSpecialtyChoiceIds.filter((id) => id !== specialtyChoiceId)
            : [...a.activeSpecialtyChoiceIds, specialtyChoiceId],
        };
      });
      get().updateBuild({ abilities });
    },

    getAbilitiesBySpellTag: (spellTagName) => {
      const build = get().build;
      if (!build?.abilities) return [];
      return build.abilities.filter((buildAbility) =>
        buildAbility.ability.spellTag?.some((tag) => tag.name === spellTagName)
      );
    },

    getAvailableAbilities: () => {
      const build = get().build;
      return build?.class?.abilities || [];
    },

    // ==========================================================
    // PASSIVE MANAGEMENT
    // ==========================================================

    addPassive: (passiveId, level = 0) => {
      const build = get().build;
      if (isStarterBuild(build) || !build) return;

      // Check if passive already exists
      const existingPassive = build.passives?.find((p) => p.passiveId === passiveId);
      if (existingPassive) return;

      // Find the passive in class passives to get maxLevel
      const classPassive = build.class.passives?.find((p) => p.id === passiveId);
      if (!classPassive) return;

      const newBuildPassive = {
        id: 0, // Will be set by the server
        buildId: build.id,
        passiveId,
        level,
        maxLevel: ("maxLevel" in classPassive ? classPassive.maxLevel : 20) as number,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        build: build as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        passive: classPassive as any,
      } as BuildPassiveType;

      const passives = [...(build.passives || []), newBuildPassive];
      get().updateBuild({ passives });
    },

    removePassive: (passiveId) => {
      const build = get().build;
      if (isStarterBuild(build) || !build) return;
      const passives = build.passives?.filter((p) => p.passiveId !== passiveId);
      get().updateBuild({ passives });
    },

    getPassivesBySpellTag: (spellTagName) => {
      const build = get().build;
      if (!build?.passives) return [];
      return build.passives.filter((buildPassive) =>
        buildPassive.passive.spellTag?.some((tag) => tag.name === spellTagName)
      );
    },

    getAvailablePassives: () => {
      const build = get().build;
      return build?.class?.passives || [];
    },

    // ==========================================================
    // STIGMA MANAGEMENT
    // ==========================================================

    updateStigmaLevel: (stigmaId, level) => {
      const build = get().build;
      if (isStarterBuild(build)) return;
      const stigmas = build?.stigmas?.map((s) =>
        s.stigmaId === stigmaId ? { ...s, level } : s
      );
      get().updateBuild({ stigmas });
    },

    addStigma: (stigmaId, level = 0, stigmaCost) => {
      const build = get().build;
      if (isStarterBuild(build) || !build) return;

      // Check if stigma already exists
      const existingStigma = build.stigmas?.find((s) => s.stigmaId === stigmaId);
      if (existingStigma) return;

      // Find the stigma in class stigmas to get maxLevel and baseCost
      const classStigma = build.class.stigmas?.find((s) => s.id === stigmaId);
      if (!classStigma) return;

      const newBuildStigma = {
        id: 0, // Will be set by the server
        buildId: build.id,
        stigmaId,
        level,
        maxLevel: ("maxLevel" in classStigma ? classStigma.maxLevel : 20) as number,
        stigmaCost: stigmaCost ?? ("baseCost" in classStigma ? classStigma.baseCost : 10) ?? 10,
        activeSpecialtyChoiceIds: [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        build: build as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stigma: classStigma as any,
      } as BuildStigmaType;

      const stigmas = [...(build.stigmas || []), newBuildStigma];
      get().updateBuild({ stigmas });
    },

    removeStigma: (stigmaId) => {
      const build = get().build;
      if (isStarterBuild(build) || !build) return;
      const stigmas = build.stigmas?.filter((s) => s.stigmaId !== stigmaId);
      get().updateBuild({ stigmas });
    },

    toggleSpecialtyChoiceStigma: (stigmaId, specialtyChoiceId) => {
      const build = get().build;
      if (isStarterBuild(build) || !build) return;
      
      // Find the stigma and its class stigma to check unlock level
      const buildStigma = build.stigmas?.find((s) => s.stigmaId === stigmaId);
      if (!buildStigma) return;
      
      const classStigma = build.class?.stigmas?.find((s) => s.id === stigmaId);
      if (!classStigma) return;
      
      const specialtyChoice = classStigma.specialtyChoices?.find((sc) => sc.id === specialtyChoiceId);
      if (!specialtyChoice) return;
      
      // Check if trying to activate a locked specialtyChoice (level is 0 or too low)
      const isActive = buildStigma.activeSpecialtyChoiceIds.includes(specialtyChoiceId);
      if (!isActive && (buildStigma.level === 0 || buildStigma.level < specialtyChoice.unlockLevel)) {
        // Cannot activate: level is 0 or too low
        return;
      }
      
      const stigmas = build.stigmas?.map((s) => {
        if (s.stigmaId !== stigmaId) return s;
        
        if (isActive) {
          // Deactivate: remove from active list
          return {
            ...s,
            activeSpecialtyChoiceIds: s.activeSpecialtyChoiceIds.filter((id) => id !== specialtyChoiceId),
          };
        } else {
          // Activate: add to active list (no limit for stigmas)
          return {
            ...s,
            activeSpecialtyChoiceIds: [...s.activeSpecialtyChoiceIds, specialtyChoiceId],
          };
        }
      });
      get().updateBuild({ stigmas });
    },

    getStigmasBySpellTag: (spellTagName) => {
      const build = get().build;
      if (!build?.stigmas) return [];
      return build.stigmas.filter((buildStigma) =>
        buildStigma.stigma.spellTag?.some((tag) => tag.name === spellTagName)
      );
    },

    getAvailableStigmas: () => {
      const build = get().build;
      return build?.class?.stigmas || [];
    },

    // ==========================================================
    // SHORTCUTS MANAGEMENT
    // ==========================================================

    updateShortcuts: (shortcuts) => {
      const build = get().build;
      if (isStarterBuild(build)) return;
      get().updateBuild({ shortcuts });
    },
  };
});
