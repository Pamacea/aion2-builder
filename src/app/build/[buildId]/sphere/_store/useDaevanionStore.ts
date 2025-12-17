"use client";

import { useBuildStore } from "@/store/useBuildEditor";
import { DaevanionBuild, DaevanionPath, DaevanionRune, DaevanionStats } from "@/types/daevanion.type";
import { create } from "zustand";

interface DaevanionStore {
  daevanionBuild: DaevanionBuild;
  toggleRune: (path: DaevanionPath, slotId: number) => Promise<void>;
  getTotalStats: (path: DaevanionPath) => Promise<DaevanionStats>;
  getPointsUsed: (path: DaevanionPath) => Promise<number>;
  getPointsType: (path: DaevanionPath) => string;
  resetPath: (path: DaevanionPath) => void;
  resetAll: () => void;
  activateAllRunes: (path: DaevanionPath) => Promise<void>;
  loadFromBuild: (daevanion: DaevanionBuild | null | undefined) => void;
}

// Helper pour charger les runes d'un chemin
const getRunesForPath = async (path: DaevanionPath): Promise<(DaevanionRune | null)[]> => {
  if (path === "nezekan") {
    const { nezekanRunes } = await import("@/data/daevanion/nezekan");
    return nezekanRunes;
  }
  if (path === "zikel") {
    const { zikelRunes } = await import("@/data/daevanion/zikel");
    return zikelRunes;
  }
  // Pour les autres chemins, retourner un tableau vide pour l'instant
  return [];
};

// Charger les données d'une rune spécifique
const getRuneData = async (path: DaevanionPath, slotId: number): Promise<DaevanionRune | null> => {
  const allRunes = await getRunesForPath(path);
  // Trouver la rune avec le slotId correspondant (ignorer les null)
  const rune = allRunes.find((r) => r !== null && r.slotId === slotId);
  return rune || null;
};

// Obtenir le coût d'une rune selon sa rareté
const getRuneCost = (rarity: string): number => {
  switch (rarity.toLowerCase()) {
    case "common":
      return 1;
    case "rare":
      return 2;
    case "legend":
      return 3;
    case "unique":
      return 4;
    default:
      return 0;
  }
};

// Helper pour mettre à jour les niveaux de skills/passifs basés sur les runes activées
// Cette fonction recalcule tous les boosts et ajuste les niveaux en conséquence
const updateSkillLevelsFromRunes = async (
  path: DaevanionPath,
  activeRunes: number[],
  previousActiveRunes: number[] = []
) => {
  const buildStore = useBuildStore.getState();
  const build = buildStore.build;
  if (!build) return;

  console.log(`[Daevanion Skill Update] Début - activeRunes:`, activeRunes, `previousActiveRunes:`, previousActiveRunes);

  // Récupérer toutes les runes du chemin
  const allRunes = await getRunesForPath(path);
  
  // Les abilities et passives de la classe ne changent pas, on peut les récupérer une fois
  const sortedAbilities = build.class?.abilities
    ? [...build.class.abilities].sort((a, b) => a.id - b.id)
    : [];
  const sortedPassives = build.class?.passives
    ? [...build.class.passives].sort((a, b) => a.id - b.id)
    : [];

  // Compter les boosts actuels
  const currentAbilityBoosts = new Map<number, number>();
  const currentPassiveBoosts = new Map<number, number>();

  activeRunes.forEach((slotId) => {
    const rune = allRunes.find((r) => r?.slotId === slotId);
    if (!rune) return;

    // Ignorer le start node
    if (rune.slotId === 61 && rune.path === "nezekan") return;

    // Traiter les nodes rare (passiveId)
    if (rune.rarity === "rare" && rune.passiveId) {
      const passiveIndex = rune.passiveId - 1;
      if (passiveIndex >= 0 && passiveIndex < sortedPassives.length) {
        const passive = sortedPassives[passiveIndex];
        currentPassiveBoosts.set(passive.id, (currentPassiveBoosts.get(passive.id) || 0) + 1);
      }
    }

    // Traiter les nodes legend (abilityId)
    if (rune.rarity === "legend" && rune.abilityId) {
      const abilityIndex = rune.abilityId - 1;
      if (abilityIndex >= 0 && abilityIndex < sortedAbilities.length) {
        const ability = sortedAbilities[abilityIndex];
        currentAbilityBoosts.set(ability.id, (currentAbilityBoosts.get(ability.id) || 0) + 1);
      }
    }
  });

  // Compter les boosts précédents
  const previousAbilityBoosts = new Map<number, number>();
  const previousPassiveBoosts = new Map<number, number>();

  previousActiveRunes.forEach((slotId) => {
    const rune = allRunes.find((r) => r?.slotId === slotId);
    if (!rune) return;

    // Ignorer le start node
    if (rune.slotId === 61 && rune.path === "nezekan") return;

    // Traiter les nodes rare (passiveId)
    if (rune.rarity === "rare" && rune.passiveId) {
      const passiveIndex = rune.passiveId - 1;
      if (passiveIndex >= 0 && passiveIndex < sortedPassives.length) {
        const passive = sortedPassives[passiveIndex];
        previousPassiveBoosts.set(passive.id, (previousPassiveBoosts.get(passive.id) || 0) + 1);
      }
    }

    // Traiter les nodes legend (abilityId)
    if (rune.rarity === "legend" && rune.abilityId) {
      const abilityIndex = rune.abilityId - 1;
      if (abilityIndex >= 0 && abilityIndex < sortedAbilities.length) {
        const ability = sortedAbilities[abilityIndex];
        previousAbilityBoosts.set(ability.id, (previousAbilityBoosts.get(ability.id) || 0) + 1);
      }
    }
  });

  // Pour chaque ability, calculer le niveau de base (sans les boosts Daevanion) et ajouter les boosts actuels
  const allAbilityIds = new Set([...currentAbilityBoosts.keys(), ...previousAbilityBoosts.keys()]);
  for (const abilityId of allAbilityIds) {
    const currentBoost = currentAbilityBoosts.get(abilityId) || 0;
    const previousBoost = previousAbilityBoosts.get(abilityId) || 0;
    const boostDiff = currentBoost - previousBoost;

    if (boostDiff === 0) continue; // Pas de changement

    console.log(`[Daevanion Skill Update] Ability ${abilityId}: currentBoost=${currentBoost}, previousBoost=${previousBoost}, boostDiff=${boostDiff}`);

    // Récupérer le build à jour
    const currentBuild = buildStore.build;
    if (!currentBuild) continue;

    const buildAbility = currentBuild.abilities?.find((a) => a.abilityId === abilityId);
    
    if (buildAbility) {
      // Calculer le niveau de base en soustrayant les boosts précédents
      const baseLevel = buildAbility.level - previousBoost;
      // Le nouveau niveau = niveau de base + boosts actuels
      const newLevel = Math.max(0, Math.min(baseLevel + currentBoost, buildAbility.maxLevel));
      
      console.log(`[Daevanion Skill Update] Ability ${abilityId}: buildAbility.level=${buildAbility.level}, baseLevel=${baseLevel}, newLevel=${newLevel}`);
      
      if (newLevel !== buildAbility.level) {
        buildStore.updateAbilityLevel(abilityId, newLevel);
        // Attendre que le store soit mis à jour
        await new Promise(resolve => setTimeout(resolve, 50));
      } else {
        console.log(`[Daevanion Skill Update] Ability ${abilityId} level unchanged (${buildAbility.level})`);
      }
    } else if (currentBoost > 0) {
      // L'ability n'existe pas mais on a un boost positif, l'ajouter
      const classAbility = sortedAbilities.find((a) => a.id === abilityId);
      if (classAbility) {
        console.log(`[Daevanion Skill Update] Adding ability ${abilityId} with level ${Math.min(currentBoost, classAbility.maxLevel || 20)}`);
        buildStore.addAbility(abilityId, Math.min(currentBoost, classAbility.maxLevel || 20));
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } else {
      console.log(`[Daevanion Skill Update] Ability ${abilityId} not in build and currentBoost is 0, skipping`);
    }
  }

  // Pour chaque passive, calculer le niveau de base (sans les boosts Daevanion) et ajouter les boosts actuels
  const allPassiveIds = new Set([...currentPassiveBoosts.keys(), ...previousPassiveBoosts.keys()]);
  for (const passiveId of allPassiveIds) {
    const currentBoost = currentPassiveBoosts.get(passiveId) || 0;
    const previousBoost = previousPassiveBoosts.get(passiveId) || 0;
    const boostDiff = currentBoost - previousBoost;

    if (boostDiff === 0) continue; // Pas de changement

    console.log(`[Daevanion Skill Update] Passive ${passiveId}: currentBoost=${currentBoost}, previousBoost=${previousBoost}, boostDiff=${boostDiff}`);

    // Récupérer le build à jour
    const currentBuild = buildStore.build;
    if (!currentBuild) continue;

    const buildPassive = currentBuild.passives?.find((p) => p.passiveId === passiveId);
    
    if (buildPassive) {
      // Calculer le niveau de base en soustrayant les boosts précédents
      const baseLevel = buildPassive.level - previousBoost;
      // Le nouveau niveau = niveau de base + boosts actuels
      const newLevel = Math.max(0, Math.min(baseLevel + currentBoost, buildPassive.maxLevel));
      
      console.log(`[Daevanion Skill Update] Passive ${passiveId}: buildPassive.level=${buildPassive.level}, baseLevel=${baseLevel}, newLevel=${newLevel}`);
      
      if (newLevel !== buildPassive.level) {
        buildStore.updatePassiveLevel(passiveId, newLevel);
        // Attendre que le store soit mis à jour
        await new Promise(resolve => setTimeout(resolve, 50));
      } else {
        console.log(`[Daevanion Skill Update] Passive ${passiveId} level unchanged (${buildPassive.level})`);
      }
    } else if (currentBoost > 0) {
      // Le passive n'existe pas mais on a un boost positif, l'ajouter
      const classPassive = sortedPassives.find((p) => p.id === passiveId);
      if (classPassive) {
        console.log(`[Daevanion Skill Update] Adding passive ${passiveId} with level ${Math.min(currentBoost, classPassive.maxLevel || 10)}`);
        buildStore.addPassive(passiveId, Math.min(currentBoost, classPassive.maxLevel || 10));
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } else {
      console.log(`[Daevanion Skill Update] Passive ${passiveId} not in build and currentBoost is 0, skipping`);
    }
  }
};

// Obtenir le type de points selon le chemin
const getPointsType = (path: DaevanionPath): string => {
  switch (path) {
    case "nezekan":
    case "zikel":
    case "vaizel":
    case "triniel":
      return "Daevanion_Common_Points";
    case "ariel":
      return "Daevanion_PvE_Points";
    case "azphel":
      return "Daevanion_Pvp_Points";
    default:
      return "Daevanion_Common_Points";
  }
};

const initialBuild: DaevanionBuild = {
  nezekan: [61], // Start node (slotId 61) toujours activé par défaut
  zikel: [],
  vaizel: [],
  triniel: [],
  ariel: [],
  azphel: [],
};

export const useDaevanionStore = create<DaevanionStore>((set, get) => {
  let saveTimeout: ReturnType<typeof setTimeout> | null = null;

  const autoSave = async () => {
    // Toujours lire l'état le plus récent au moment de la sauvegarde
    const daevanionBuild = get().daevanionBuild;
    const buildStore = useBuildStore.getState();
    const build = buildStore.build;

    if (!build) return;

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
      
      // Log pour debug
      const totalRunes = 
        (daevanionBuild.nezekan?.length || 0) +
        (daevanionBuild.zikel?.length || 0) +
        (daevanionBuild.vaizel?.length || 0) +
        (daevanionBuild.triniel?.length || 0) +
        (daevanionBuild.ariel?.length || 0) +
        (daevanionBuild.azphel?.length || 0);
      console.log(`[Daevanion] Sauvegarde de ${totalRunes} runes actives:`, {
        nezekan: daevanionBuild.nezekan?.length || 0,
        zikel: daevanionBuild.zikel?.length || 0,
        vaizel: daevanionBuild.vaizel?.length || 0,
        triniel: daevanionBuild.triniel?.length || 0,
        ariel: daevanionBuild.ariel?.length || 0,
        azphel: daevanionBuild.azphel?.length || 0,
      });
      
      await saveBuildAction(build.id, {
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
      
      console.log(`[Daevanion] Sauvegarde réussie`);
      
      // Ne pas mettre à jour le build dans le store après la sauvegarde
      // car les données locales sont déjà à jour et cela éviterait un rechargement inutile
      // qui causerait un flash visuel. Le build sera mis à jour au prochain chargement de page.
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
        // S'assurer que le start node (slotId 61) est toujours activé pour Nezekan
        const nezekanRunes = daevanion.nezekan || [];
        if (!nezekanRunes.includes(61)) {
          nezekanRunes.push(61);
        }
        
        // Comparer les données pour éviter les rechargements inutiles
        const newBuild = {
          ...daevanion,
          nezekan: nezekanRunes,
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
        
        console.log(`[Daevanion] Désactivation de la rune ${slotId}`);
        console.log(`[Daevanion] Runes avant désactivation:`, pathRunes);
        console.log(`[Daevanion] Runes après filtrage initial:`, newPathRunes);
        
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
          
          console.log(`[Daevanion] Runes finales après cascade:`, finalPathRunes);
          console.log(`[Daevanion] Appel updateSkillLevelsFromRunes avec:`);
          console.log(`  - activeRunes (finalPathRunes):`, finalPathRunes);
          console.log(`  - previousActiveRunes (pathRunes):`, pathRunes);
          
          // Toujours lire l'état le plus récent avant de mettre à jour
          const currentState = get();
          set({
            daevanionBuild: {
              ...currentState.daevanionBuild,
              [path]: finalPathRunes,
            },
          });
          
          // Mettre à jour les niveaux de skills/passifs après la désactivation
          await updateSkillLevelsFromRunes(path, finalPathRunes, pathRunes);
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
          
          // Mettre à jour les niveaux de skills/passifs après la désactivation
          await updateSkillLevelsFromRunes(path, finalPathRunes, pathRunes);
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
          
          // Mettre à jour les niveaux de skills/passifs après l'activation
          await updateSkillLevelsFromRunes(path, newPathRunes, currentPathRunes);
          
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

    runes.forEach((rune) => {
      if (!rune) return;
      
      // Ignorer le start node (slotId 61 pour Nezekan) - il ne donne aucune stats
      if (rune.slotId === 61 && rune.path === "nezekan") {
        return; // Skip le start node
      }
      
      // Traiter les stats de base
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
      
      // Traiter les nodes rare (passiveId)
      if (rune.rarity === "rare" && rune.passiveId) {
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
      
      // Traiter les nodes legend (abilityId)
      if (rune.rarity === "legend" && rune.abilityId) {
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
        
        runes.forEach((rune) => {
          if (rune) {
            // Ignorer le start node (slotId 61 pour Nezekan) - il ne coûte pas de points
            if (rune.slotId === 61 && rune.path === "nezekan") {
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

  resetPath: (path) => {
    set((state) => {
      const newDaevanionBuild = {
        ...state.daevanionBuild,
        [path]: [],
      };
      scheduleSave();
      return { daevanionBuild: newDaevanionBuild };
    });
  },

  resetAll: () => {
    set({ daevanionBuild: initialBuild });
    scheduleSave();
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
      scheduleSave();
      return { daevanionBuild: newDaevanionBuild };
    });
  },
  }
});
