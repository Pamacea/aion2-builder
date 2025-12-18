"use client";

import { getPointsType, getRuneCost, getRuneData, getRunesForPath, invalidateDaevanionQueries, updateSkillLevelsFromRunes } from "@/lib/daevanionUtils";
import { useBuildStore } from "@/store/useBuildEditor";
import { DaevanionBuild, DaevanionPath, DaevanionRune, DaevanionStats, DaevanionStore } from "@/types/daevanion.type";
import { create } from "zustand";

const initialBuild: DaevanionBuild = {
  nezekan: [61],  // Start node (slotId 61) toujours activé par défaut - grille 11x11, position (5,5)
  zikel: [61],    // Start node (slotId 61) toujours activé par défaut - grille 11x11, position (5,5)
  vaizel: [61],   // Start node (slotId 61) toujours activé par défaut - grille 11x11, position (5,5)
  triniel: [85],  // Start node (slotId 85) toujours activé par défaut - grille 13x13, position (6,6)
  ariel: [113],   // Start node (slotId 113) toujours activé par défaut - grille 15x15, position (7,7)
  azphel: [113],  // Start node (slotId 113) toujours activé par défaut - grille 15x15, position (7,7)
};

export const useDaevanionStore = create<DaevanionStore>((set, get) => {
  let saveTimeout: ReturnType<typeof setTimeout> | null = null;

  const autoSave = async () => {
    // Toujours lire l'état le plus récent au moment de la sauvegarde
    const daevanionBuild = get().daevanionBuild;
    const buildStore = useBuildStore.getState();
    const build = buildStore.build;

    if (!build || !daevanionBuild) return;

    // Prevent saving starter builds
    const { isStarterBuild } = await import("@/utils/buildUtils");
    if (isStarterBuild(build)) {
      return;
    }

    // Prevent saving if user is not the owner
    const { isBuildOwner } = await import("@/utils/buildUtils");
    if (!isBuildOwner(build, buildStore.currentUserId)) {
      return;
    }

    try {
      // Use dynamic import to avoid bundling server actions in client
      const { saveBuildAction } = await import("actions/buildActions");
      
      const savedBuild = await saveBuildAction(build.id, {
        ...build,
        daevanion: {
          id: build.daevanion?.id || 0,
          buildId: build.id,
          nezekan: daevanionBuild.nezekan || [],
          zikel: daevanionBuild.zikel || [],
          vaizel: daevanionBuild.vaizel || [],
          triniel: daevanionBuild.triniel || [],
          ariel: daevanionBuild.ariel || [],
          azphel: daevanionBuild.azphel || [],
        },
      });
      
      // Mettre à jour le build dans le store avec la réponse du serveur pour synchroniser les données
      // Cela garantit que les autres pages (comme /skill) ont les données à jour
      if (savedBuild) {
        const buildStore = useBuildStore.getState();
        buildStore.setBuild(savedBuild);
      }
      
      // Invalider toutes les queries TanStack Query pour forcer le rechargement des données
      // On invalide tous les chemins car la sauvegarde affecte potentiellement tous les chemins
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("daevanion-invalidate-all"));
      }
    } catch (error) {
      console.error("Error saving daevanion:", error);
    }
  };

  const scheduleSave = () => {
    if (saveTimeout) clearTimeout(saveTimeout);
    // Augmenter le délai à 1000ms pour réduire le nombre de requêtes
    // et permettre de collecter plusieurs modifications avant de sauvegarder
    saveTimeout = setTimeout(autoSave, 1000);
  };

  return {
    daevanionBuild: initialBuild,

    loadFromBuild: (daevanion) => {
      const currentState = get();
      const currentBuild = currentState.daevanionBuild;
      
      if (daevanion) {
        // S'assurer que les start nodes sont toujours activés pour chaque chemin
        const nezekanRunes = daevanion.nezekan || [];
        if (!nezekanRunes.includes(61)) {
          nezekanRunes.push(61);
        }
        
        const zikelRunes = daevanion.zikel || [];
        if (!zikelRunes.includes(61)) {
          zikelRunes.push(61);
        }
        
        const vaizelRunes = daevanion.vaizel || [];
        if (!vaizelRunes.includes(61)) {
          vaizelRunes.push(61);
        }
        
        const trinielRunes = daevanion.triniel || [];
        if (!trinielRunes.includes(85)) {
          trinielRunes.push(85);
        }
        
        const arielRunes = daevanion.ariel || [];
        if (!arielRunes.includes(113)) {
          arielRunes.push(113);
        }
        
        const azphelRunes = daevanion.azphel || [];
        if (!azphelRunes.includes(113)) {
          azphelRunes.push(113);
        }
        
        // Comparer les données pour éviter les rechargements inutiles
        const newBuild = {
          ...daevanion,
          nezekan: nezekanRunes,
          zikel: zikelRunes,
          vaizel: vaizelRunes,
          triniel: trinielRunes,
          ariel: arielRunes,
          azphel: azphelRunes,
        };
        
        // Vérifier si les données ont vraiment changé
        const hasChanged = 
          JSON.stringify(currentBuild.nezekan?.sort()) !== JSON.stringify(newBuild.nezekan?.sort()) ||
          JSON.stringify(currentBuild.zikel?.sort()) !== JSON.stringify(newBuild.zikel?.sort()) ||
          JSON.stringify(currentBuild.vaizel?.sort()) !== JSON.stringify(newBuild.vaizel?.sort()) ||
          JSON.stringify(currentBuild.triniel?.sort()) !== JSON.stringify(newBuild.triniel?.sort()) ||
          JSON.stringify(currentBuild.ariel?.sort()) !== JSON.stringify(newBuild.ariel?.sort()) ||
          JSON.stringify(currentBuild.azphel?.sort()) !== JSON.stringify(newBuild.azphel?.sort());
        
        // Ne mettre à jour que si les données ont changé
        if (hasChanged) {
          set({ 
            daevanionBuild: newBuild
          });
        }
      } else {
        // Initialiser avec le start node activé seulement si ce n'est pas déjà fait
        if (JSON.stringify(currentBuild.nezekan?.sort()) !== JSON.stringify([61])) {
          set({ 
            daevanionBuild: {
              ...initialBuild,
              nezekan: [61], // Start node (slotId 61) toujours activé
            }
          });
        }
      }
    },

    toggleRune: async (path, slotId) => {
      // Vérifier que l'utilisateur est propriétaire du build
      const buildStore = useBuildStore.getState();
      const build = buildStore.build;
      if (!build) return;
      
      const { isBuildOwner } = await import("@/utils/buildUtils");
      if (!isBuildOwner(build, buildStore.currentUserId)) {
        console.warn("Cannot modify Daevanion planner: user is not the owner");
        return;
      }
      
      // Le start node (slotId 61) ne peut pas être désactivé
      if (path === "nezekan" && slotId === 61) {
        return; // Ne peut pas désactiver le start node
      }

      const state = get();
      const pathRunes = state.daevanionBuild[path] || [];
      const isActive = pathRunes.includes(slotId);

      if (isActive) {
        // Désactiver la rune
        const newPathRunes = pathRunes.filter((id) => id !== slotId);
        
        // Trouver toutes les runes qui ont encore un chemin valide vers le start node
        const allRunes = await getRunesForPath(path);
        const startNodeId = path === "nezekan" ? 61 : null;
        
        if (startNodeId && newPathRunes.includes(startNodeId)) {
          // Fonction pour trouver toutes les runes connectées au start node (approche BFS)
          // On part du start node et on propage la connexion vers toutes les runes accessibles
          const findConnectedRunes = (activeRunes: number[]): number[] => {
            if (!startNodeId || !activeRunes.includes(startNodeId)) {
              return [];
            }
            
            const connected = new Set<number>();
            const queue: number[] = [startNodeId];
            connected.add(startNodeId);
            
            // Créer un index inverse : pour chaque rune, quelles runes l'ont comme prérequis
            const reverseIndex = new Map<number, number[]>();
            allRunes.forEach(rune => {
              if (!rune) return;
              
              // Les runes sans prérequis sont directement accessibles depuis le start
              if (!rune.prerequisites || rune.prerequisites.length === 0) {
                if (!reverseIndex.has(startNodeId!)) {
                  reverseIndex.set(startNodeId!, []);
                }
                reverseIndex.get(startNodeId!)!.push(rune.slotId);
              } else {
                // Pour chaque prérequis, ajouter cette rune à la liste des runes qui en dépendent
                rune.prerequisites.forEach(prereqId => {
                  if (!reverseIndex.has(prereqId)) {
                    reverseIndex.set(prereqId, []);
                  }
                  reverseIndex.get(prereqId)!.push(rune.slotId);
                });
              }
            });
            
            // BFS : partir du start node et explorer toutes les runes accessibles
            while (queue.length > 0) {
              const currentRuneId = queue.shift()!;
              
              // Trouver toutes les runes qui ont currentRuneId comme prérequis
              const dependentRunes = reverseIndex.get(currentRuneId) || [];
              
              dependentRunes.forEach(dependentRuneId => {
                // Ignorer si déjà connectée
                if (connected.has(dependentRuneId)) {
                  return;
                }
                
                // Ignorer si la rune n'est pas active
                if (!activeRunes.includes(dependentRuneId)) {
                  return;
                }
                
                const dependentRune = allRunes.find(r => r?.slotId === dependentRuneId);
                if (!dependentRune) {
                  return;
                }
                
                // Si la rune n'a pas de prérequis, elle est directement connectée au start
                if (!dependentRune.prerequisites || dependentRune.prerequisites.length === 0) {
                  connected.add(dependentRuneId);
                  queue.push(dependentRuneId);
                  return;
                }
                
                // Vérifier si au moins un prérequis de cette rune est connecté
                const hasConnectedPrereq = dependentRune.prerequisites.some(prereqId => {
                  return activeRunes.includes(prereqId) && connected.has(prereqId);
                });
                
                if (hasConnectedPrereq) {
                  connected.add(dependentRuneId);
                  queue.push(dependentRuneId);
                }
              });
            }
            
            return Array.from(connected);
          };
          
          // Trouver toutes les runes encore connectées au start après la désactivation
          const connectedRunes = findConnectedRunes(newPathRunes);
          
          // Debug: vérifier les runes qui seront désactivées
          const runesToDeactivate = newPathRunes.filter((id) => !connectedRunes.includes(id));
          if (runesToDeactivate.length > 0) {
            console.log(`[Daevanion] Désactivation de ${runesToDeactivate.length} runes après désactivation de ${slotId}:`, runesToDeactivate);
            console.log(`[Daevanion] Runes encore connectées (${connectedRunes.length}):`, connectedRunes);
            console.log(`[Daevanion] Runes actives avant filtrage (${newPathRunes.length}):`, newPathRunes);
            
            // Debug: vérifier pourquoi certaines runes ne sont pas connectées
            runesToDeactivate.forEach(runeId => {
              const rune = allRunes.find(r => r?.slotId === runeId);
              if (rune) {
                console.log(`[Daevanion] Rune ${runeId} non connectée. Prérequis:`, rune.prerequisites);
                const prereqsActive = rune.prerequisites?.filter(p => newPathRunes.includes(p)) || [];
                console.log(`[Daevanion] Prérequis actifs de ${runeId}:`, prereqsActive);
                const prereqsConnected = prereqsActive.filter(p => connectedRunes.includes(p));
                console.log(`[Daevanion] Prérequis connectés de ${runeId}:`, prereqsConnected);
              }
            });
          }
          
          // Ne garder que les runes qui ont encore un chemin vers le start
          const finalPathRunes = newPathRunes.filter((id) => connectedRunes.includes(id));
          
          // Toujours lire l'état le plus récent avant de mettre à jour
          const currentState = get();
          set({
            daevanionBuild: {
              ...currentState.daevanionBuild,
              [path]: finalPathRunes,
            },
          });
          
          // Mettre à jour les niveaux de skills/passifs après la désactivation
          await updateSkillLevelsFromRunes(path, finalPathRunes, pathRunes, () => useBuildStore.getState());
        } else {
          // Pas de start node ou start node désactivé, désactiver toutes les runes
          // Toujours lire l'état le plus récent avant de mettre à jour
          const currentState = get();
          const finalPathRunes = startNodeId ? [startNodeId] : [];
          set({
            daevanionBuild: {
              ...currentState.daevanionBuild,
              [path]: finalPathRunes,
            },
          });
          
          // Invalider les queries avant de mettre à jour les niveaux pour que l'UI se mette à jour
          invalidateDaevanionQueries(path);
          
          // Mettre à jour les niveaux de skills/passifs après la désactivation
          await updateSkillLevelsFromRunes(path, finalPathRunes, pathRunes, () => useBuildStore.getState());
        }
        
        scheduleSave();
      } else {
        // Activer la rune
        // Toujours lire l'état le plus récent avant de mettre à jour
        const currentState = get();
        const currentPathRunes = currentState.daevanionBuild[path] || [];
        // Vérifier que la rune n'est pas déjà active (au cas où elle aurait été activée entre temps)
        if (!currentPathRunes.includes(slotId)) {
          const newPathRunes = [...currentPathRunes, slotId];
          set({
            daevanionBuild: {
              ...currentState.daevanionBuild,
              [path]: newPathRunes,
            },
          });
          
          // Invalider les queries avant de mettre à jour les niveaux pour que l'UI se mette à jour
          invalidateDaevanionQueries(path);
          
          // Mettre à jour les niveaux de skills/passifs après l'activation
          await updateSkillLevelsFromRunes(path, newPathRunes, currentPathRunes, () => useBuildStore.getState());
          
          scheduleSave();
        }
      }
    },

  getTotalStats: async (path) => {
    const state = get();
    const activeRunes = state.daevanionBuild[path] || [];
    const buildStore = useBuildStore.getState();
    const build = buildStore.build;
    
    const stats: DaevanionStats = {
      // Stats de base
      attack: 0,
      criticalHit: 0,
      criticalHitResist: 0,
      mp: 0,
      maxHP: 0,
      defense: 0,
      
      // Stats spéciales
      cooldownReduction: 0,
      combatSpeed: 0,
      damageBoost: 0,
      damageTolerance: 0,
      criticalDamageTolerance: 0,
      criticalDamageBoost: 0,
      multiHitResist: 0,
      multiHitChance: 0,
      pveDamageTolerance: 0,
      pveDamageBoost: 0,
      pvpDamageBoost: 0,
      pvpDamageTolerance: 0,
      
      // Stats spéciales Ariel (Legend)
      bossDamageTolerance: 0,
      bossDamageBoost: 0,
      
      // Stats spéciales Ariel (Rare)
      pveAccuracy: 0,
      pveEvasion: 0,
      bossAttack: 0,
      bossDefense: 0,
      pveAttack: 0,
      pveDefense: 0,
      
      // Stats spéciales Azphel (Legend)
      statusEffectChance: 0,
      statusEffectResist: 0,
      
      // Stats spéciales Azphel (Rare)
      pvpCriticalHit: 0,
      pvpCriticalHitResist: 0,
      pvpAccuracy: 0,
      pvpEvasion: 0,
      pvpAttack: 0,
      pvpDefense: 0,
      
      // Augmentations de niveau
      passiveLevelBoost: 0,
      activeSkillLevelBoost: 0,
      
      // Liste des skills/passives augmentés
      skillLevelUps: [],
    };

    // Charger toutes les runes en parallèle
    const runePromises = activeRunes.map((slotId) => getRuneData(path, slotId));
    const runes = await Promise.all(runePromises);

    // Récupérer les abilities et passives triés par ID pour l'indexation
    const sortedAbilities = build?.class?.abilities
      ? [...build.class.abilities].sort((a, b) => a.id - b.id)
      : [];
    const sortedPassives = build?.class?.passives
      ? [...build.class.passives].sort((a, b) => a.id - b.id)
      : [];

    // Définir les start nodes pour tous les chemins
    const startNodeSlotIds: Record<string, number> = {
      nezekan: 61,
      zikel: 61,
      vaizel: 61,
      triniel: 85,
      ariel: 113,
      azphel: 113,
    };

    runes.forEach((rune) => {
      if (!rune) return;
      
      // Ignorer les start nodes - ils ne donnent aucune stats
      if (rune.slotId === startNodeSlotIds[rune.path]) {
        return; // Skip le start node
      }
      
      // EXCEPTION: Pour Ariel et Azphel, les rare/legend donnent des stats, pas des IDs
      const isArielOrAzphel = rune.path === "ariel" || rune.path === "azphel";
      
      // Traiter les stats de base (et les stats des rare/legend d'Ariel/Azphel)
      if (rune.stats && Object.keys(rune.stats).length > 0) {
        Object.entries(rune.stats).forEach(([key, value]) => {
          if (value !== undefined && value !== 0 && key in stats && key !== "skillLevelUps") {
            const statKey = key as keyof DaevanionStats;
            if (typeof stats[statKey] === "number" && typeof value === "number") {
              (stats[statKey] as number) += value;
            }
          }
        });
      }
      
      // Traiter les nodes rare (passiveId) - seulement si ce n'est pas Ariel/Azphel
      if (rune.rarity === "rare" && rune.passiveId && !isArielOrAzphel) {
        // L'ID est 1-based, donc on utilise index = passiveId - 1
        const passiveIndex = rune.passiveId - 1;
        if (passiveIndex >= 0 && passiveIndex < sortedPassives.length) {
          const passive = sortedPassives[passiveIndex];
          stats.skillLevelUps.push({
            name: passive.name,
            type: "passive",
            id: passive.id,
          });
        }
      }
      
      // Traiter les nodes legend (abilityId) - seulement si ce n'est pas Ariel/Azphel
      if (rune.rarity === "legend" && rune.abilityId && !isArielOrAzphel) {
        // L'ID est 1-based, donc on utilise index = abilityId - 1
        const abilityIndex = rune.abilityId - 1;
        if (abilityIndex >= 0 && abilityIndex < sortedAbilities.length) {
          const ability = sortedAbilities[abilityIndex];
          stats.skillLevelUps.push({
            name: ability.name,
            type: "ability",
            id: ability.id,
          });
        }
      }
    });

    return stats;
  },

  getPointsUsed: async (path) => {
    const state = get();
    const pointsType = getPointsType(path);
    
    // Si c'est un chemin qui utilise Daevanion_Common_Points, calculer pour tous les chemins partagés
    if (pointsType === "Daevanion_Common_Points") {
      const commonPaths: DaevanionPath[] = ["nezekan", "zikel", "vaizel", "triniel"];
      let totalPoints = 0;
      
      for (const commonPath of commonPaths) {
        const activeRunes = state.daevanionBuild[commonPath] || [];
        const runePromises = activeRunes.map((slotId) => getRuneData(commonPath, slotId));
        const runes = await Promise.all(runePromises);
        
        // Définir les start nodes pour tous les chemins
        const startNodeSlotIds: Record<string, number> = {
          nezekan: 61,
          zikel: 61,
          vaizel: 61,
          triniel: 85,
          ariel: 113,
          azphel: 113,
        };
        
        runes.forEach((rune) => {
          if (rune) {
            // Ignorer les start nodes - ils ne coûtent pas de points
            if (rune.slotId === startNodeSlotIds[rune.path]) {
              return; // Skip le start node
            }
            totalPoints += getRuneCost(rune.rarity);
          }
        });
      }
      
      return totalPoints;
    } else {
      // Pour Ariel et Azphel, calculer uniquement pour leur chemin
      const activeRunes = state.daevanionBuild[path] || [];
      const runePromises = activeRunes.map((slotId) => getRuneData(path, slotId));
      const runes = await Promise.all(runePromises);
      
      let totalPoints = 0;
      runes.forEach((rune) => {
        if (rune) {
          totalPoints += getRuneCost(rune.rarity);
        }
      });
      
      return totalPoints;
    }
  },

  getPointsType: (path) => {
    return getPointsType(path);
  },

  resetPath: async (path) => {
    // Vérifier que l'utilisateur est propriétaire du build
    const buildStore = useBuildStore.getState();
    const build = buildStore.build;
    if (!build) return;
    
    const { isBuildOwner } = await import("@/utils/buildUtils");
    if (!isBuildOwner(build, buildStore.currentUserId)) {
      console.warn("Cannot reset Daevanion path: user is not the owner");
      return;
    }
    
    set((state) => {
      const newDaevanionBuild = {
        ...state.daevanionBuild,
        [path]: [],
      };
      scheduleSave();
      return { daevanionBuild: newDaevanionBuild };
    });
  },

  resetAll: async () => {
    set({ daevanionBuild: initialBuild });
    scheduleSave();
    return Promise.resolve();
  },

  activateAllRunes: async (path) => {
    const allRunes = await getRunesForPath(path);
    // Filtrer les null et récupérer tous les slotIds
    const allSlotIds = allRunes
      .filter((rune): rune is DaevanionRune => rune !== null)
      .map((rune) => rune.slotId);
    
    set((state) => {
      const newDaevanionBuild = {
        ...state.daevanionBuild,
        [path]: allSlotIds,
      };
      invalidateDaevanionQueries(path);
      scheduleSave();
      return { daevanionBuild: newDaevanionBuild };
    });
  },

  getDaevanionBoostForSkill: async (skillId, type) => {
    const state = get();
    const buildStore = useBuildStore.getState();
    const build = buildStore.build;
    if (!build) return 0;

    // Récupérer les abilities et passives triés par ID pour l'indexation
    const sortedAbilities = build?.class?.abilities
      ? [...build.class.abilities].sort((a, b) => a.id - b.id)
      : [];
    const sortedPassives = build?.class?.passives
      ? [...build.class.passives].sort((a, b) => a.id - b.id)
      : [];

    let totalBoost = 0;

    // Parcourir tous les chemins Daevanion en parallèle pour améliorer les performances
    const paths: DaevanionPath[] = ["nezekan", "zikel", "vaizel", "triniel", "ariel", "azphel"];
    
    // Charger toutes les runes en parallèle
    const runePromises = paths.map(path => getRunesForPath(path));
    const allRunesArrays = await Promise.all(runePromises);
    
    // Créer un map pour accès rapide : path -> runes
    const runesByPath = new Map<DaevanionPath, (DaevanionRune | null)[]>();
    paths.forEach((path, index) => {
      runesByPath.set(path, allRunesArrays[index]);
    });

    // Parcourir tous les chemins Daevanion
    for (const path of paths) {
      const activeRunes = state.daevanionBuild[path] || [];
      const allRunes = runesByPath.get(path) || [];

      // Définir les start nodes pour tous les chemins
      const startNodeSlotIds: Record<string, number> = {
        nezekan: 61,
        zikel: 61,
        vaizel: 61,
        triniel: 85,
        ariel: 113,
        azphel: 113,
      };

      for (const slotId of activeRunes) {
        const rune = allRunes.find((r) => r?.slotId === slotId);
        if (!rune) continue;

        // Ignorer les start nodes
        if (rune.slotId === startNodeSlotIds[rune.path]) continue;
        
        // EXCEPTION: Pour Ariel et Azphel, les rare/legend donnent des stats, pas des IDs
        const isArielOrAzphel = rune.path === "ariel" || rune.path === "azphel";

        if (type === "ability" && rune.rarity === "legend" && rune.abilityId && !isArielOrAzphel) {
          // L'ID est 1-based, donc on utilise index = abilityId - 1
          const abilityIndex = rune.abilityId - 1;
          if (abilityIndex >= 0 && abilityIndex < sortedAbilities.length) {
            const ability = sortedAbilities[abilityIndex];
            if (ability.id === skillId) {
              totalBoost += 1;
            }
          }
        } else if (type === "passive" && rune.rarity === "rare" && rune.passiveId && !isArielOrAzphel) {
          // L'ID est 1-based, donc on utilise index = passiveId - 1
          const passiveIndex = rune.passiveId - 1;
          if (passiveIndex >= 0 && passiveIndex < sortedPassives.length) {
            const passive = sortedPassives[passiveIndex];
            if (passive.id === skillId) {
              totalBoost += 1;
            }
          }
        }
      }
    }

    return totalBoost;
  },

    findShortestPath: async (path, targetSlotId) => {
      const state = get();
      const activeRunes = state.daevanionBuild[path] || [];
      
      // Si la rune cible est déjà active, retourner un chemin vide
      if (activeRunes.includes(targetSlotId)) {
        return [];
      }

      // Obtenir toutes les runes du path
      const allRunes = await getRunesForPath(path);
      const targetRune = allRunes.find(r => r?.slotId === targetSlotId);
      
      if (!targetRune) {
        return []; // Rune cible introuvable
      }

      // Déterminer le start node pour ce path
      const startNodeSlotIds: Record<string, number> = {
        nezekan: 61,
        zikel: 61,
        vaizel: 61,
        triniel: 85,
        ariel: 113,
        azphel: 113,
      };
      const startNodeId = startNodeSlotIds[path];

      // Construire un graphe inverse : pour chaque rune, quelles runes peuvent être activées après elle
      // (c'est-à-dire les runes qui ont cette rune dans leurs prerequisites)
      const graph = new Map<number, number[]>();
      allRunes.forEach(rune => {
        if (!rune) return;
        
        // Si la rune n'a pas de prerequisites, elle est accessible depuis le start node
        if (!rune.prerequisites || rune.prerequisites.length === 0) {
          if (!graph.has(startNodeId)) {
            graph.set(startNodeId, []);
          }
          graph.get(startNodeId)!.push(rune.slotId);
        } else {
          // Sinon, elle est accessible depuis ses prerequisites
          rune.prerequisites.forEach(prereqId => {
            if (!graph.has(prereqId)) {
              graph.set(prereqId, []);
            }
            graph.get(prereqId)!.push(rune.slotId);
          });
        }
      });

      // BFS pour trouver le chemin le plus court depuis les runes actives jusqu'à la cible
      const queue: { slotId: number; path: number[] }[] = [];
      const visited = new Set<number>();
      
      // Initialiser la queue avec toutes les runes actives
      activeRunes.forEach(slotId => {
        queue.push({ slotId, path: [slotId] });
        visited.add(slotId);
      });

      while (queue.length > 0) {
        const { slotId, path: currentPath } = queue.shift()!;
        
        // Si on a atteint la cible, retourner le chemin complet (incluant la cible)
        if (slotId === targetSlotId) {
          // Retourner le chemin sans les runes déjà actives (garder seulement celles à activer)
          const pathToActivate = currentPath.filter(id => !activeRunes.includes(id));
          console.log(`[Daevanion] Chemin trouvé vers ${targetSlotId}:`, pathToActivate);
          return pathToActivate;
        }

        // Explorer les runes accessibles depuis cette rune
        const nextRunes = graph.get(slotId) || [];
        for (const nextSlotId of nextRunes) {
          if (!visited.has(nextSlotId)) {
            visited.add(nextSlotId);
            queue.push({ 
              slotId: nextSlotId, 
              path: [...currentPath, nextSlotId] 
            });
          }
        }
      }

      console.warn(`[Daevanion] Aucun chemin trouvé vers ${targetSlotId} depuis les runes actives:`, activeRunes);

      // Aucun chemin trouvé
      return [];
    },

    activatePath: async (path, slotIds) => {
      // Vérifier que l'utilisateur est propriétaire du build
      const buildStore = useBuildStore.getState();
      const build = buildStore.build;
      if (!build) return;
      
      const { isBuildOwner } = await import("@/utils/buildUtils");
      if (!isBuildOwner(build, buildStore.currentUserId)) {
        console.warn("Cannot modify Daevanion planner: user is not the owner");
        return;
      }

      const state = get();
      const currentPathRunes = state.daevanionBuild[path] || [];
      
      // Activer toutes les runes du chemin qui ne sont pas déjà actives
      const runesToActivate = slotIds.filter(slotId => !currentPathRunes.includes(slotId));
      
      if (runesToActivate.length === 0) {
        return; // Toutes les runes sont déjà actives
      }

      // Activer les runes une par une dans l'ordre du chemin
      const newPathRunes = [...currentPathRunes, ...runesToActivate];

      // Toujours lire l'état le plus récent avant de mettre à jour
      const currentState = get();
      set({
        daevanionBuild: {
          ...currentState.daevanionBuild,
          [path]: newPathRunes,
        },
      });

      // Invalider les queries avant de mettre à jour les niveaux pour que l'UI se mette à jour
      invalidateDaevanionQueries(path);

      // Mettre à jour les niveaux de skills/passifs après l'activation
      await updateSkillLevelsFromRunes(path, newPathRunes, currentPathRunes, () => useBuildStore.getState());

      scheduleSave();
    },
  }
});
