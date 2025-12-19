"use client";

import {
  BuildAbilityType,
  BuildPassiveType,
  BuildState,
  BuildStigmaType,
} from "@/types/schema";
import { canEditBuild, isBuildOwner, isStarterBuild, syncChainSkills } from "@/utils/buildUtils";
import { filterChainSkills } from "@/utils/chainSkillsUtils";
import { create } from "zustand";

export const useBuildStore = create<BuildState>((set, get) => {
  let saveTimeout: ReturnType<typeof setTimeout> | null = null;
  let isSaving = false;
  let needsSave = false; // Flag pour indiquer qu'une nouvelle sauvegarde est nécessaire

  const autoSave = async () => {
    // Si une sauvegarde est déjà en cours, on marque juste qu'une nouvelle sauvegarde est nécessaire
    if (isSaving) {
      needsSave = true;
      return;
    }

    const build = get().build;
    if (!build) {
      needsSave = false;
      return;
    }

    // Prevent saving starter builds
    if (isStarterBuild(build)) {
      needsSave = false;
      return;
    }

    // Capturer le build au moment où on commence la sauvegarde
    // pour éviter de sauvegarder un état obsolète
    const buildToSave = build;

    isSaving = true;
    set({ saving: true });
    try {
      // Use dynamic import to avoid bundling server actions in client
      const { saveBuildAction } = await import("actions/buildActions");
      await saveBuildAction(buildToSave.id, buildToSave);
    } catch (error) {
      console.error("Error saving build:", error);
    } finally {
      isSaving = false;
      set({ saving: false });
      
      // Si une nouvelle sauvegarde est nécessaire (modifications faites pendant la sauvegarde),
      // la planifier immédiatement
      if (needsSave) {
        needsSave = false;
        // Petit délai pour éviter de surcharger le serveur
        setTimeout(() => {
          autoSave();
        }, 100);
      }
    }
  };

  const scheduleSave = () => {
    // Annuler le timeout précédent pour regrouper les modifications rapides
    if (saveTimeout) {
      clearTimeout(saveTimeout);
      saveTimeout = null;
    }

    // Si une sauvegarde est en cours, marquer qu'une nouvelle sauvegarde est nécessaire
    if (isSaving) {
      needsSave = true;
      return;
    }

    // Sinon, planifier une sauvegarde après un délai
    saveTimeout = setTimeout(() => {
      saveTimeout = null;
      autoSave();
    }, 200); // Délai pour regrouper les modifications rapides
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
        // Annuler toutes les sauvegardes en attente avant de charger un nouveau build
        if (saveTimeout) {
          clearTimeout(saveTimeout);
          saveTimeout = null;
        }
        // Réinitialiser le flag de sauvegarde nécessaire
        needsSave = false;
        
        // Use dynamic import to avoid bundling server actions in client
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

      // Prevent updating starter builds
      if (isStarterBuild(currentBuild)) {
        console.warn("Cannot modify starter builds");
        return;
      }

      // Prevent updating builds if user is not the owner or admin
      if (!canEditBuild(currentBuild, currentUserId)) {
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

    updateAbilityLevel: async (abilityId, level) => {
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

      // Mettre à jour localement immédiatement
      set((state) => ({
        build: state.build ? { ...state.build, abilities: finalAbilities } : null,
      }));

      // Sauvegarder de manière optimisée (seulement le niveau)
      // Utiliser la fonction optimisée pour une sauvegarde beaucoup plus rapide
      try {
        const { updateAbilityLevelOnly } = await import("@/actions/buildActions");
        await updateAbilityLevelOnly(build.id, abilityId, level);
      } catch (error) {
        console.error("Error saving ability level:", error);
        // En cas d'erreur, fallback sur la sauvegarde complète
        get().updateBuild({ abilities: finalAbilities });
      }
    },

    updatePassiveLevel: async (passiveId, level) => {
      const build = get().build;
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;
      
      const passives = build.passives?.map((p) =>
        p.passiveId === passiveId ? { ...p, level } : p
      );

      // Mettre à jour localement immédiatement
      set((state) => ({
        build: state.build ? { ...state.build, passives } : null,
      }));

      // Sauvegarder de manière optimisée (seulement le niveau)
      try {
        const { updatePassiveLevelOnly } = await import("@/actions/buildActions");
        if (!build) return; // Double vérification pour TypeScript
        await updatePassiveLevelOnly(build.id, passiveId, level);
      } catch (error) {
        console.error("Error saving passive level:", error);
        // En cas d'erreur, fallback sur la sauvegarde complète
        get().updateBuild({ passives });
      }
    },

    updateStigma: async (stigmaId, stigmaCost) => {
      const build = get().build;
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;
      
      const stigmas = build.stigmas?.map((s) =>
        s.stigmaId === stigmaId ? { ...s, stigmaCost } : s
      );

      // Mettre à jour localement immédiatement
      set((state) => ({
        build: state.build ? { ...state.build, stigmas } : null,
      }));

      // Sauvegarder de manière optimisée (seulement le stigmaCost)
      try {
        const { updateStigmaCostOnly } = await import("@/actions/buildActions");
        await updateStigmaCostOnly(build.id, stigmaId, stigmaCost);
      } catch (error) {
        console.error("Error saving stigma cost:", error);
        // En cas d'erreur, fallback sur la sauvegarde complète
        get().updateBuild({ stigmas });
      }
    },

    // ==========================================================
    // ABILITY MANAGEMENT
    // ==========================================================

    addAbility: async (abilityId, level = 0) => {
      const build = get().build;
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

      // Check if ability already exists
      const existingAbility = build.abilities?.find(
        (a) => a.abilityId === abilityId
      );
      if (existingAbility) return;

      // Find the ability in class abilities to get maxLevel
      const classAbility = build.class?.abilities?.find(
        (a) => a.id === abilityId
      );
      if (!classAbility) return;

      const maxLevel = ("maxLevel" in classAbility
        ? classAbility.maxLevel
        : 20) as number;

      const newBuildAbility = {
        id: 0, // Will be set by the server
        buildId: build.id,
        abilityId,
        level,
        maxLevel,
        activeSpecialtyChoiceIds: [],
        selectedChainSkillIds: [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        build: build as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ability: classAbility as any,
      } as BuildAbilityType;

      const abilities = [...(build.abilities || []), newBuildAbility];

      // Mettre à jour localement immédiatement
      set((state) => ({
        build: state.build ? { ...state.build, abilities } : null,
      }));

      // Sauvegarder de manière optimisée
      try {
        const { addAbilityOnly } = await import("@/actions/buildActions");
        await addAbilityOnly(build.id, abilityId, level, maxLevel, [], []);
      } catch (error) {
        console.error("Error adding ability:", error);
        // En cas d'erreur, fallback sur la sauvegarde complète
        get().updateBuild({ abilities });
      }
    },

    removeAbility: async (abilityId) => {
      const build = get().build;
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;
      
      const abilities = build.abilities?.filter(
        (a) => a.abilityId !== abilityId
      );

      // Mettre à jour localement immédiatement
      set((state) => ({
        build: state.build ? { ...state.build, abilities } : null,
      }));

      // Sauvegarder de manière optimisée
      try {
        const { removeAbilityOnly } = await import("@/actions/buildActions");
        await removeAbilityOnly(build.id, abilityId);
      } catch (error) {
        console.error("Error removing ability:", error);
        // En cas d'erreur, fallback sur la sauvegarde complète
        get().updateBuild({ abilities });
      }
    },

    toggleSpecialtyChoice: async (abilityId, specialtyChoiceId) => {
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

      // Calculer le niveau effectif (niveau de base + boost Daevanion)
      // pour vérifier si on peut activer la spécialité
      let effectiveLevel = buildAbility.level;
      try {
        const { useDaevanionStore } = await import("@/app/build/[buildId]/sphere/_store/useDaevanionStore");
        const daevanionBoost = await useDaevanionStore.getState().getDaevanionBoostForSkill(abilityId, "ability");
        effectiveLevel = buildAbility.level + daevanionBoost;
      } catch (error) {
        // Si on ne peut pas calculer le boost, utiliser le niveau de base
        console.warn("Could not calculate daevanion boost, using base level:", error);
      }

      // Check if trying to activate a locked specialtyChoice (level is 0 or too low)
      const isActive =
        buildAbility.activeSpecialtyChoiceIds.includes(specialtyChoiceId);
      if (
        !isActive &&
        (effectiveLevel === 0 ||
          effectiveLevel < specialtyChoice.unlockLevel)
      ) {
        // Cannot activate: level is 0 or too low
        return;
      }

      // If trying to activate the 3rd specialty choice, require level 20
      if (!isActive && buildAbility.activeSpecialtyChoiceIds.length >= 2) {
        // Trying to activate 3rd specialty choice - require level 20
        if (effectiveLevel < 20) {
          return;
        }
      }

      // If trying to activate and already have 3 active, don't allow
      if (!isActive && buildAbility.activeSpecialtyChoiceIds.length >= 3) {
        return;
      }

      // Calculer les nouveaux activeSpecialtyChoiceIds
      const newActiveSpecialtyChoiceIds = isActive
        ? buildAbility.activeSpecialtyChoiceIds.filter(
            (id) => id !== specialtyChoiceId
          )
        : [...buildAbility.activeSpecialtyChoiceIds, specialtyChoiceId];

      // Mettre à jour localement immédiatement pour une réactivité instantanée
      set((state) => {
        if (!state.build) return state;
        const updatedAbilities = state.build.abilities?.map((a) => {
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

      // Sauvegarder de manière optimisée (seulement activeSpecialtyChoiceIds)
      try {
        const { updateAbilitySpecialtyChoicesOnly } = await import("@/actions/buildActions");
        await updateAbilitySpecialtyChoicesOnly(build.id, abilityId, newActiveSpecialtyChoiceIds);
      } catch (error) {
        console.error("Error saving ability specialty choices:", error);
      }
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

    addPassive: async (passiveId, level = 0) => {
      const build = get().build;
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

      // Check if passive already exists
      const existingPassive = build.passives?.find(
        (p) => p.passiveId === passiveId
      );
      if (existingPassive) return;

      // Find the passive in class passives to get maxLevel
      const classPassive = build.class?.passives?.find(
        (p) => p.id === passiveId
      );
      if (!classPassive) return;

      const maxLevel = ("maxLevel" in classPassive
        ? classPassive.maxLevel
        : 20) as number;

      const newBuildPassive = {
        id: 0, // Will be set by the server
        buildId: build.id,
        passiveId,
        level,
        maxLevel,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        build: build as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        passive: classPassive as any,
      } as BuildPassiveType;

      const passives = [...(build.passives || []), newBuildPassive];

      // Mettre à jour localement immédiatement
      set((state) => ({
        build: state.build ? { ...state.build, passives } : null,
      }));

      // Sauvegarder de manière optimisée
      try {
        const { addPassiveOnly } = await import("@/actions/buildActions");
        await addPassiveOnly(build.id, passiveId, level, maxLevel);
      } catch (error) {
        console.error("Error adding passive:", error);
        // En cas d'erreur, fallback sur la sauvegarde complète
        get().updateBuild({ passives });
      }
    },

    removePassive: async (passiveId) => {
      const build = get().build;
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;
      
      const passives = build.passives?.filter((p) => p.passiveId !== passiveId);

      // Mettre à jour localement immédiatement
      set((state) => ({
        build: state.build ? { ...state.build, passives } : null,
      }));

      // Sauvegarder de manière optimisée
      try {
        const { removePassiveOnly } = await import("@/actions/buildActions");
        await removePassiveOnly(build.id, passiveId);
      } catch (error) {
        console.error("Error removing passive:", error);
        // En cas d'erreur, fallback sur la sauvegarde complète
        get().updateBuild({ passives });
      }
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

    updateStigmaLevel: async (stigmaId, level) => {
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

      // Mettre à jour localement immédiatement
      set((state) => ({
        build: state.build ? { ...state.build, stigmas: finalStigmas } : null,
      }));

      // Sauvegarder de manière optimisée (seulement le niveau)
      try {
        const { updateStigmaLevelOnly } = await import("@/actions/buildActions");
        await updateStigmaLevelOnly(build.id, stigmaId, level);
      } catch (error) {
        console.error("Error saving stigma level:", error);
        // En cas d'erreur, fallback sur la sauvegarde complète
        get().updateBuild({ stigmas: finalStigmas });
      }
    },

    addStigma: async (stigmaId, level = 0, stigmaCost) => {
      const build = get().build;
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

      // Check if stigma already exists
      const existingStigma = build.stigmas?.find(
        (s) => s.stigmaId === stigmaId
      );
      if (existingStigma) return;

      // Find the stigma in class stigmas to get maxLevel and baseCost
      const classStigma = build.class?.stigmas?.find((s) => s.id === stigmaId);
      if (!classStigma) return;

      const maxLevel = ("maxLevel" in classStigma
        ? classStigma.maxLevel
        : 20) as number;
      const finalStigmaCost =
        stigmaCost ??
        ("baseCost" in classStigma ? classStigma.baseCost : 10) ??
        10;

      const newBuildStigma = {
        id: 0, // Will be set by the server
        buildId: build.id,
        stigmaId,
        level,
        maxLevel,
        stigmaCost: finalStigmaCost,
        activeSpecialtyChoiceIds: [],
        selectedChainSkillIds: [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        build: build as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stigma: classStigma as any,
      } as BuildStigmaType;

      const stigmas = [...(build.stigmas || []), newBuildStigma];

      // Mettre à jour localement immédiatement
      set((state) => ({
        build: state.build ? { ...state.build, stigmas } : null,
      }));

      // Sauvegarder de manière optimisée
      try {
        const { addStigmaOnly } = await import("@/actions/buildActions");
        await addStigmaOnly(build.id, stigmaId, level, maxLevel, finalStigmaCost, [], []);
      } catch (error) {
        console.error("Error adding stigma:", error);
        // En cas d'erreur, fallback sur la sauvegarde complète
        get().updateBuild({ stigmas });
      }
    },

    removeStigma: async (stigmaId) => {
      const build = get().build;
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;
      
      const stigmas = build.stigmas?.filter((s) => s.stigmaId !== stigmaId);

      // Mettre à jour localement immédiatement
      set((state) => ({
        build: state.build ? { ...state.build, stigmas } : null,
      }));

      // Sauvegarder de manière optimisée
      try {
        const { removeStigmaOnly } = await import("@/actions/buildActions");
        await removeStigmaOnly(build.id, stigmaId);
      } catch (error) {
        console.error("Error removing stigma:", error);
        // En cas d'erreur, fallback sur la sauvegarde complète
        get().updateBuild({ stigmas });
      }
    },

    toggleSpecialtyChoiceStigma: async (stigmaId, specialtyChoiceId) => {
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

      // Calculer les nouveaux activeSpecialtyChoiceIds
      const newActiveSpecialtyChoiceIds = isActive
        ? buildStigma.activeSpecialtyChoiceIds.filter(
            (id) => id !== specialtyChoiceId
          )
        : [...buildStigma.activeSpecialtyChoiceIds, specialtyChoiceId];

      // Mettre à jour localement immédiatement pour une réactivité instantanée
      set((state) => {
        if (!state.build) return state;
        const updatedStigmas = state.build.stigmas?.map((s) => {
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

      // Sauvegarder de manière optimisée (seulement activeSpecialtyChoiceIds)
      try {
        const { updateStigmaSpecialtyChoicesOnly } = await import("@/actions/buildActions");
        await updateStigmaSpecialtyChoicesOnly(build.id, stigmaId, newActiveSpecialtyChoiceIds);
      } catch (error) {
        console.error("Error saving stigma specialty choices:", error);
      }
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

    updateShortcuts: async (shortcuts) => {
      const build = get().build;
      const currentUserId = get().currentUserId;
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
      
      // Sauvegarder l'état précédent pour rollback en cas d'erreur
      const previousShortcuts = build.shortcuts;

      // Mettre à jour localement immédiatement pour une réactivité instantanée
      set((state) => ({
        build: state.build ? { ...state.build, shortcuts } : null,
      }));

      // Sauvegarder de manière optimisée (seulement shortcuts)
      try {
        const { updateShortcutsOnly } = await import("@/actions/buildActions");
        // Filtrer les propriétés inutiles et convertir undefined en null
        const shortcutsToSave = shortcuts
          ? Object.fromEntries(
              Object.entries(shortcuts).map(([key, value]) => [
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
        
        // Ne PAS recharger le build immédiatement après la sauvegarde des shortcuts
        // car :
        // 1. Les shortcuts sont déjà à jour localement et sauvegardés sur le serveur
        // 2. Le cache peut ne pas être immédiatement mis à jour après revalidateTag/revalidatePath
        // 3. Un rechargement prématuré peut récupérer l'ancienne version et écraser les shortcuts locaux
        // 4. Le composant Shortcut gère déjà la synchronisation via loadedShortcuts
        // Le rechargement se fera naturellement lors du prochain chargement de page ou via router.refresh()
      } catch (error) {
        console.error("Error saving shortcuts:", error);
        // En cas d'erreur, restaurer l'ancien état des shortcuts
        set((state) => ({
          build: state.build ? { ...state.build, shortcuts: previousShortcuts } : null,
        }));
      }
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

    updateChainSkill: async (skillId, chainSkillIds, type) => {
      const build = get().build;
      const currentUserId = get().currentUserId;
      if (isStarterBuild(build) || !build || !isBuildOwner(build, currentUserId)) return;

      if (type === "ability") {
        // Find the parent ability to get its level
        const parentAbility = build.abilities?.find(
          (a) => a.abilityId === skillId
        );
        if (!parentAbility) return;
        const parentLevel = parentAbility.level || 0;

        const abilities =
          build.abilities?.map((a) => {
            if (a.abilityId !== skillId) return a;
            return {
              ...a,
              selectedChainSkillIds: chainSkillIds,
            };
          }) || [];

        // Add or update chain skills with parent's level
        for (const chainSkillId of chainSkillIds) {
          const chainSkillIndex = abilities.findIndex(
            (ba) => ba.abilityId === chainSkillId
          );
          if (chainSkillIndex === -1) {
            // Chain skill not in build yet, add it with parent's level
            const chainClassAbility = build.class?.abilities?.find(
              (ca) => ca.id === chainSkillId
            );
            if (chainClassAbility) {
              const maxLevel = ("maxLevel" in chainClassAbility
                ? chainClassAbility.maxLevel
                : 20) as number;
              const newChainSkillAbility = {
                id: 0, // Will be set by the server
                buildId: build.id,
                abilityId: chainSkillId,
                level: parentLevel,
                maxLevel,
                activeSpecialtyChoiceIds: [],
                selectedChainSkillIds: [],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                build: build as any,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ability: chainClassAbility as any,
              } as BuildAbilityType;
              abilities.push(newChainSkillAbility);
              
              // Sauvegarder la nouvelle chain skill
              try {
                const { addAbilityOnly } = await import("@/actions/buildActions");
                await addAbilityOnly(build.id, chainSkillId, parentLevel, maxLevel, [], []);
              } catch (error) {
                console.error("Error adding chain skill:", error);
              }
            }
          } else {
            // Chain skill already in build, update its level to match parent
            abilities[chainSkillIndex] = {
              ...abilities[chainSkillIndex],
              level: parentLevel,
            };
            
            // Sauvegarder le niveau mis à jour
            try {
              const { updateAbilityLevelOnly } = await import("@/actions/buildActions");
              await updateAbilityLevelOnly(build.id, chainSkillId, parentLevel);
            } catch (error) {
              console.error("Error updating chain skill level:", error);
            }
          }
        }

        // Remove chain skills that are no longer selected (if they're not used elsewhere)
        const removedChainSkillIds = (
          parentAbility.selectedChainSkillIds || []
        ).filter((id) => !chainSkillIds.includes(id));
        for (const removedId of removedChainSkillIds) {
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
              
              // Sauvegarder la suppression
              try {
                const { removeAbilityOnly } = await import("@/actions/buildActions");
                await removeAbilityOnly(build.id, removedId);
              } catch (error) {
                console.error("Error removing chain skill:", error);
              }
            }
          }
        }

        // Mettre à jour localement immédiatement
        set((state) => ({
          build: state.build ? { ...state.build, abilities } : null,
        }));

        // Sauvegarder les selectedChainSkillIds du parent
        try {
          const { updateAbilityChainSkillsOnly } = await import("@/actions/buildActions");
          await updateAbilityChainSkillsOnly(build.id, skillId, chainSkillIds);
        } catch (error) {
          console.error("Error saving chain skills:", error);
          // En cas d'erreur, fallback sur la sauvegarde complète
          get().updateBuild({ abilities });
        }
      } else if (type === "stigma") {
        // Find the parent stigma to get its level
        const parentStigma = build.stigmas?.find((s) => s.stigmaId === skillId);
        if (!parentStigma) return;
        const parentLevel = parentStigma.level || 0;

        const stigmas =
          build.stigmas?.map((s) => {
            if (s.stigmaId !== skillId) return s;
            return {
              ...s,
              selectedChainSkillIds: chainSkillIds,
            };
          }) || [];

        // Add or update chain skills with parent's level
        for (const chainSkillId of chainSkillIds) {
          const chainSkillIndex = stigmas.findIndex(
            (bs) => bs.stigmaId === chainSkillId
          );
          if (chainSkillIndex === -1) {
            // Chain skill not in build yet, add it with parent's level
            const chainClassStigma = build.class?.stigmas?.find(
              (cs) => cs.id === chainSkillId
            );
            if (chainClassStigma) {
              const maxLevel = ("maxLevel" in chainClassStigma
                ? chainClassStigma.maxLevel
                : 20) as number;
              const stigmaCost =
                ("baseCost" in chainClassStigma
                  ? chainClassStigma.baseCost
                  : 10) ?? 10;
              const newChainSkillStigma = {
                id: 0, // Will be set by the server
                buildId: build.id,
                stigmaId: chainSkillId,
                level: parentLevel,
                maxLevel,
                stigmaCost,
                activeSpecialtyChoiceIds: [],
                selectedChainSkillIds: [],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                build: build as any,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                stigma: chainClassStigma as any,
              } as BuildStigmaType;
              stigmas.push(newChainSkillStigma);
              
              // Sauvegarder la nouvelle chain skill
              try {
                const { addStigmaOnly } = await import("@/actions/buildActions");
                await addStigmaOnly(build.id, chainSkillId, parentLevel, maxLevel, stigmaCost, [], []);
              } catch (error) {
                console.error("Error adding chain skill:", error);
              }
            }
          } else {
            // Chain skill already in build, update its level to match parent
            stigmas[chainSkillIndex] = {
              ...stigmas[chainSkillIndex],
              level: parentLevel,
            };
            
            // Sauvegarder le niveau mis à jour
            try {
              const { updateStigmaLevelOnly } = await import("@/actions/buildActions");
              await updateStigmaLevelOnly(build.id, chainSkillId, parentLevel);
            } catch (error) {
              console.error("Error updating chain skill level:", error);
            }
          }
        }

        // Remove chain skills that are no longer selected (if they're not used elsewhere)
        const removedChainSkillIds = (
          parentStigma.selectedChainSkillIds || []
        ).filter((id) => !chainSkillIds.includes(id));
        for (const removedId of removedChainSkillIds) {
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
              
              // Sauvegarder la suppression
              try {
                const { removeStigmaOnly } = await import("@/actions/buildActions");
                await removeStigmaOnly(build.id, removedId);
              } catch (error) {
                console.error("Error removing chain skill:", error);
              }
            }
          }
        }

        // Mettre à jour localement immédiatement
        set((state) => ({
          build: state.build ? { ...state.build, stigmas } : null,
        }));

        // Sauvegarder les selectedChainSkillIds du parent
        try {
          const { updateStigmaChainSkillsOnly } = await import("@/actions/buildActions");
          await updateStigmaChainSkillsOnly(build.id, skillId, chainSkillIds);
        } catch (error) {
          console.error("Error saving chain skills:", error);
          // En cas d'erreur, fallback sur la sauvegarde complète
          get().updateBuild({ stigmas });
        }
      }
    },
  };
});
