"use client";

import {
  BuildAbilityType,
  BuildPassiveType,
  BuildState,
  BuildStigmaType,
} from "@/types/schema";
import { isBuildOwner, isStarterBuild, syncChainSkills } from "@/utils/buildUtils";
import { filterChainSkills } from "@/utils/chainSkillsUtils";
import { create } from "zustand";

export const useBuildStore = create<BuildState>((set, get) => {
  let saveTimeout: ReturnType<typeof setTimeout> | null = null;

  let isSaving = false;

  const autoSave = async () => {
    // Empêcher les sauvegardes multiples simultanées
    if (isSaving) {
      return;
    }

    const build = get().build;
    if (!build) return;

    // Prevent saving starter builds
    if (isStarterBuild(build)) {
      return;
    }

    isSaving = true;
    set({ saving: true });
    try {
      // Use dynamic import to avoid bundling server actions in client
      const { saveBuildAction } = await import("actions/buildActions");
      const savedBuild = await saveBuildAction(build.id, build);
      // Mettre à jour le build avec la réponse du serveur pour s'assurer que les données sont synchronisées
      if (savedBuild) {
        set({ build: savedBuild });
      }
    } catch (error) {
      console.error("Error saving build:", error);
    } finally {
      isSaving = false;
      set({ saving: false });
    }
  };

  const scheduleSave = () => {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(autoSave, 300);
  };

  return {
    build: null,
    loading: true,
    saving: false,
    currentUserId: null,

    setCurrentUserId: (userId) => set({ currentUserId: userId }),

    setBuild: (build) => set({ build }),

    loadBuild: async (buildId, userId = null) => {
      set({ loading: true });
      // Utiliser le userId fourni ou laisser null (sera défini par les composants qui utilisent useAuth)
      if (userId) {
        set({ currentUserId: userId });
      }
      
      try {
        // Use dynamic import to avoid bundling server actions in client
        const { loadBuildAction } = await import("actions/buildActions");
        const data = await loadBuildAction(buildId);
        
        // Annuler toutes les sauvegardes en attente avant de charger un nouveau build
        if (saveTimeout) {
          clearTimeout(saveTimeout);
          saveTimeout = null;
        }
        
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

      // Prevent updating starter builds
      if (isStarterBuild(currentBuild)) {
        console.warn("Cannot modify starter builds");
        return;
      }

      // Prevent updating builds if user is not the owner
      if (!isBuildOwner(currentBuild, currentUserId)) {
        console.warn("Cannot modify builds that you don't own");
        return;
      }

      set((state) => {
        // Deep merge to ensure nested arrays are properly replaced
        const updated = {
          ...state.build!,
          ...partial,
          // Ensure abilities, passives, and stigmas arrays are properly replaced (not merged)
          ...(partial.abilities !== undefined && {
            abilities: partial.abilities,
          }),
          ...(partial.passives !== undefined && { passives: partial.passives }),
          ...(partial.stigmas !== undefined && { stigmas: partial.stigmas }),
        };
        scheduleSave();
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

      // Use dynamic import to avoid bundling server actions in client
      const { getClassByName } = await import("@/actions/classActions");
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
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

      // Get the first ability ID (auto-attack) - cannot be set below level 1
      const firstAbilityId = build.class?.abilities
        ?.sort((a, b) => a.id - b.id)[0]?.id;
      
      // Prevent setting first ability below level 1
      if (firstAbilityId && abilityId === firstAbilityId && level < 1) {
        level = 1;
      }

      const classAbility = build.class?.abilities?.find(
        (a) => a.id === abilityId
      );
      let selectedChainSkillIds: number[] = [];

      const updatedAbilities =
        build.abilities?.map((a) => {
          if (a.abilityId !== abilityId) return a;

          selectedChainSkillIds = a.selectedChainSkillIds || [];
          const filteredSpecialties =
            classAbility?.specialtyChoices &&
            a.activeSpecialtyChoiceIds.length > 0
              ? a.activeSpecialtyChoiceIds.filter((id) => {
                  const choice = classAbility.specialtyChoices?.find(
                    (sc) => sc.id === id
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
              (id) => build.class?.abilities?.find((ca) => ca.id === id),
              (id, lvl, classItem) =>
                ({
                  id: 0,
                  buildId: build.id,
                  abilityId: id,
                  level: lvl,
                  maxLevel: ("maxLevel" in classItem
                    ? classItem.maxLevel
                    : 20) as number,
                  activeSpecialtyChoiceIds: [],
                  selectedChainSkillIds: [],
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  build: build as any,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ability: classItem as any,
                }) as BuildAbilityType
            )
          : updatedAbilities;

      get().updateBuild({ abilities: finalAbilities });
    },

    updatePassiveLevel: (passiveId, level) => {
      const build = get().build;
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !isBuildOwner(build, currentUserId)) return;
      const passives = build?.passives?.map((p) =>
        p.passiveId === passiveId ? { ...p, level } : p
      );
      get().updateBuild({ passives });
    },

    updateStigma: (stigmaId, stigmaCost) => {
      const build = get().build;
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !isBuildOwner(build, currentUserId)) return;
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
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

      // Check if ability already exists
      const existingAbility = build.abilities?.find(
        (a) => a.abilityId === abilityId
      );
      if (existingAbility) return;

      // Find the ability in class abilities to get maxLevel
      const classAbility = build.class.abilities?.find(
        (a) => a.id === abilityId
      );
      if (!classAbility) return;

      const newBuildAbility = {
        id: 0, // Will be set by the server
        buildId: build.id,
        abilityId,
        level,
        maxLevel: ("maxLevel" in classAbility
          ? classAbility.maxLevel
          : 20) as number,
        activeSpecialtyChoiceIds: [],
        selectedChainSkillIds: [],
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
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;
      const abilities = build.abilities?.filter(
        (a) => a.abilityId !== abilityId
      );
      get().updateBuild({ abilities });
    },

    toggleSpecialtyChoice: (abilityId, specialtyChoiceId) => {
      const build = get().build;
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

      // Find the ability and its class ability to check unlock level
      const buildAbility = build.abilities?.find(
        (a) => a.abilityId === abilityId
      );
      if (!buildAbility) return;

      const classAbility = build.class?.abilities?.find(
        (a) => a.id === abilityId
      );
      if (!classAbility) return;

      const specialtyChoice = classAbility.specialtyChoices?.find(
        (sc) => sc.id === specialtyChoiceId
      );
      if (!specialtyChoice) return;

      // Check if trying to activate a locked specialtyChoice (level is 0 or too low)
      const isActive =
        buildAbility.activeSpecialtyChoiceIds.includes(specialtyChoiceId);
      if (
        !isActive &&
        (buildAbility.level === 0 ||
          buildAbility.level < specialtyChoice.unlockLevel)
      ) {
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
            ? a.activeSpecialtyChoiceIds.filter(
                (id) => id !== specialtyChoiceId
              )
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
      const allAbilities = build?.class?.abilities || [];
      return filterChainSkills(
        allAbilities,
        (ability) =>
          ability.parentAbilities?.map((cs) => cs.chainAbility.id) || []
      );
    },

    // ==========================================================
    // PASSIVE MANAGEMENT
    // ==========================================================

    addPassive: (passiveId, level = 0) => {
      const build = get().build;
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

      // Check if passive already exists
      const existingPassive = build.passives?.find(
        (p) => p.passiveId === passiveId
      );
      if (existingPassive) return;

      // Find the passive in class passives to get maxLevel
      const classPassive = build.class.passives?.find(
        (p) => p.id === passiveId
      );
      if (!classPassive) return;

      const newBuildPassive = {
        id: 0, // Will be set by the server
        buildId: build.id,
        passiveId,
        level,
        maxLevel: ("maxLevel" in classPassive
          ? classPassive.maxLevel
          : 20) as number,
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
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;
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
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

      let selectedChainSkillIds: number[] = [];
      const updatedStigmas =
        build.stigmas?.map((s) => {
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
              (id) => build.class?.stigmas?.find((cs) => cs.id === id),
              (id, lvl, classItem) =>
                ({
                  id: 0,
                  buildId: build.id,
                  stigmaId: id,
                  level: lvl,
                  maxLevel: ("maxLevel" in classItem
                    ? classItem.maxLevel
                    : 20) as number,
                  stigmaCost:
                    ("baseCost" in classItem ? classItem.baseCost : 10) ?? 10,
                  activeSpecialtyChoiceIds: [],
                  selectedChainSkillIds: [],
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  build: build as any,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  stigma: classItem as any,
                }) as BuildStigmaType
            )
          : updatedStigmas;

      get().updateBuild({ stigmas: finalStigmas });
    },

    addStigma: (stigmaId, level = 0, stigmaCost) => {
      const build = get().build;
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

      // Check if stigma already exists
      const existingStigma = build.stigmas?.find(
        (s) => s.stigmaId === stigmaId
      );
      if (existingStigma) return;

      // Find the stigma in class stigmas to get maxLevel and baseCost
      const classStigma = build.class.stigmas?.find((s) => s.id === stigmaId);
      if (!classStigma) return;

      const newBuildStigma = {
        id: 0, // Will be set by the server
        buildId: build.id,
        stigmaId,
        level,
        maxLevel: ("maxLevel" in classStigma
          ? classStigma.maxLevel
          : 20) as number,
        stigmaCost:
          stigmaCost ??
          ("baseCost" in classStigma ? classStigma.baseCost : 10) ??
          10,
        activeSpecialtyChoiceIds: [],
        selectedChainSkillIds: [],
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
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;
      const stigmas = build.stigmas?.filter((s) => s.stigmaId !== stigmaId);
      get().updateBuild({ stigmas });
    },

    toggleSpecialtyChoiceStigma: (stigmaId, specialtyChoiceId) => {
      const build = get().build;
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

      // Find the stigma and its class stigma to check unlock level
      const buildStigma = build.stigmas?.find((s) => s.stigmaId === stigmaId);
      if (!buildStigma) return;

      const classStigma = build.class?.stigmas?.find((s) => s.id === stigmaId);
      if (!classStigma) return;

      const specialtyChoice = classStigma.specialtyChoices?.find(
        (sc) => sc.id === specialtyChoiceId
      );
      if (!specialtyChoice) return;

      // Check if trying to activate a locked specialtyChoice (level is 0 or too low)
      const isActive =
        buildStigma.activeSpecialtyChoiceIds.includes(specialtyChoiceId);
      if (
        !isActive &&
        (buildStigma.level === 0 ||
          buildStigma.level < specialtyChoice.unlockLevel)
      ) {
        // Cannot activate: level is 0 or too low
        return;
      }

      const stigmas = build.stigmas?.map((s) => {
        if (s.stigmaId !== stigmaId) return s;

        if (isActive) {
          // Deactivate: remove from active list
          return {
            ...s,
            activeSpecialtyChoiceIds: s.activeSpecialtyChoiceIds.filter(
              (id) => id !== specialtyChoiceId
            ),
          };
        } else {
          // Activate: add to active list (no limit for stigmas)
          return {
            ...s,
            activeSpecialtyChoiceIds: [
              ...s.activeSpecialtyChoiceIds,
              specialtyChoiceId,
            ],
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
      const allStigmas = build?.class?.stigmas || [];
      return filterChainSkills(
        allStigmas,
        (stigma) => stigma.parentStigmas?.map((cs) => cs.chainStigma.id) || []
      );
    },

    // ==========================================================
    // SHORTCUTS MANAGEMENT
    // ==========================================================

    updateShortcuts: (shortcuts) => {
      const build = get().build;
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !isBuildOwner(build, currentUserId)) return;
      get().updateBuild({ shortcuts });
    },

    updateShortcutLabels: (labels) => {
      const build = get().build;
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !isBuildOwner(build, currentUserId)) return;
      get().updateBuild({ shortcutLabels: labels });
    },

    // ==========================================================
    // CHAIN SKILLS MANAGEMENT
    // ==========================================================

    updateChainSkill: (skillId, chainSkillIds, type) => {
      const build = get().build;
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

      if (type === "ability") {
        // Find the parent ability to get its level
        const parentAbility = build.abilities?.find(
          (a) => a.abilityId === skillId
        );
        const parentLevel = parentAbility?.level || 0;

        const abilities =
          build.abilities?.map((a) => {
            if (a.abilityId !== skillId) return a;
            return {
              ...a,
              selectedChainSkillIds: chainSkillIds,
            };
          }) || [];

        // Add or update chain skills with parent's level
        chainSkillIds.forEach((chainSkillId) => {
          const chainSkillIndex = abilities.findIndex(
            (ba) => ba.abilityId === chainSkillId
          );
          if (chainSkillIndex === -1) {
            // Chain skill not in build yet, add it with parent's level
            const chainClassAbility = build.class?.abilities?.find(
              (ca) => ca.id === chainSkillId
            );
            if (chainClassAbility) {
              const newChainSkillAbility = {
                id: 0, // Will be set by the server
                buildId: build.id,
                abilityId: chainSkillId,
                level: parentLevel,
                maxLevel: ("maxLevel" in chainClassAbility
                  ? chainClassAbility.maxLevel
                  : 20) as number,
                activeSpecialtyChoiceIds: [],
                selectedChainSkillIds: [],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                build: build as any,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ability: chainClassAbility as any,
              } as BuildAbilityType;
              abilities.push(newChainSkillAbility);
            }
          } else {
            // Chain skill already in build, update its level to match parent
            abilities[chainSkillIndex] = {
              ...abilities[chainSkillIndex],
              level: parentLevel,
            };
          }
        });

        // Remove chain skills that are no longer selected (if they're not used elsewhere)
        const removedChainSkillIds = (
          parentAbility?.selectedChainSkillIds || []
        ).filter((id) => !chainSkillIds.includes(id));
        removedChainSkillIds.forEach((removedId) => {
          // Check if this chain skill is used by another parent
          const isUsedElsewhere = abilities.some(
            (a) =>
              a.abilityId !== skillId &&
              a.selectedChainSkillIds?.includes(removedId)
          );
          if (!isUsedElsewhere) {
            // Remove from build if not used elsewhere
            const index = abilities.findIndex(
              (ba) => ba.abilityId === removedId
            );
            if (index !== -1) {
              abilities.splice(index, 1);
            }
          }
        });

        get().updateBuild({ abilities });
      } else if (type === "stigma") {
        // Find the parent stigma to get its level
        const parentStigma = build.stigmas?.find((s) => s.stigmaId === skillId);
        const parentLevel = parentStigma?.level || 0;

        const stigmas =
          build.stigmas?.map((s) => {
            if (s.stigmaId !== skillId) return s;
            return {
              ...s,
              selectedChainSkillIds: chainSkillIds,
            };
          }) || [];

        // Add or update chain skills with parent's level
        chainSkillIds.forEach((chainSkillId) => {
          const chainSkillIndex = stigmas.findIndex(
            (bs) => bs.stigmaId === chainSkillId
          );
          if (chainSkillIndex === -1) {
            // Chain skill not in build yet, add it with parent's level
            const chainClassStigma = build.class?.stigmas?.find(
              (cs) => cs.id === chainSkillId
            );
            if (chainClassStigma) {
              const newChainSkillStigma = {
                id: 0, // Will be set by the server
                buildId: build.id,
                stigmaId: chainSkillId,
                level: parentLevel,
                maxLevel: ("maxLevel" in chainClassStigma
                  ? chainClassStigma.maxLevel
                  : 20) as number,
                stigmaCost:
                  ("baseCost" in chainClassStigma
                    ? chainClassStigma.baseCost
                    : 10) ?? 10,
                activeSpecialtyChoiceIds: [],
                selectedChainSkillIds: [],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                build: build as any,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                stigma: chainClassStigma as any,
              } as BuildStigmaType;
              stigmas.push(newChainSkillStigma);
            }
          } else {
            // Chain skill already in build, update its level to match parent
            stigmas[chainSkillIndex] = {
              ...stigmas[chainSkillIndex],
              level: parentLevel,
            };
          }
        });

        // Remove chain skills that are no longer selected (if they're not used elsewhere)
        const removedChainSkillIds = (
          parentStigma?.selectedChainSkillIds || []
        ).filter((id) => !chainSkillIds.includes(id));
        removedChainSkillIds.forEach((removedId) => {
          // Check if this chain skill is used by another parent
          const isUsedElsewhere = stigmas.some(
            (s) =>
              s.stigmaId !== skillId &&
              s.selectedChainSkillIds?.includes(removedId)
          );
          if (!isUsedElsewhere) {
            // Remove from build if not used elsewhere
            const index = stigmas.findIndex((bs) => bs.stigmaId === removedId);
            if (index !== -1) {
              stigmas.splice(index, 1);
            }
          }
        });

        get().updateBuild({ stigmas });
      }
    },
  };
});
