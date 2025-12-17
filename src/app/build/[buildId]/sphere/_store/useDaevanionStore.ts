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
        
        // Trouver toutes les runes qui ont encore un chemin valide vers le start node
        const allRunes = await getRunesForPath(path);
        const startNodeId = path === "nezekan" ? 61 : null;
        
        if (startNodeId && newPathRunes.includes(startNodeId)) {
          // Fonction pour trouver toutes les runes connectées au start node (approche récursive)
          // Une rune est connectée si :
          // 1. C'est le start node
          // 2. Elle n'a pas de prérequis (adjacente au start)
          // 3. Au moins un de ses prérequis est connecté (récursivement)
          const findConnectedRunes = (activeRunes: number[]): number[] => {
            const connected = new Set<number>();
            const checked = new Set<number>(); // Pour éviter les boucles infinies
            
            // Fonction récursive pour vérifier si une rune est connectée
            const isRuneConnected = (runeId: number): boolean => {
              // Si déjà vérifiée, retourner le résultat
              if (checked.has(runeId)) {
                return connected.has(runeId);
              }
              
              checked.add(runeId);
              
              // Le start node est toujours connecté
              if (runeId === startNodeId) {
                connected.add(runeId);
                return true;
              }
              
              // Si la rune n'est pas active, elle n'est pas connectée
              if (!activeRunes.includes(runeId)) {
                return false;
              }
              
              const rune = allRunes.find(r => r?.slotId === runeId);
              if (!rune) {
                return false;
              }
              
              // Si la rune n'a pas de prérequis, elle est adjacente au start et donc connectée
              if (!rune.prerequisites || rune.prerequisites.length === 0) {
                connected.add(runeId);
                return true;
              }
              
              // Une rune est connectée si au moins un de ses prérequis est connecté
              const hasConnectedPrereq = rune.prerequisites.some(prereqId => {
                return isRuneConnected(prereqId);
              });
              
              if (hasConnectedPrereq) {
                connected.add(runeId);
                return true;
              }
              
              return false;
            };
            
            // Vérifier toutes les runes actives
            activeRunes.forEach(runeId => {
              isRuneConnected(runeId);
            });
            
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
        } else {
          // Pas de start node ou start node désactivé, désactiver toutes les runes
          // Toujours lire l'état le plus récent avant de mettre à jour
          const currentState = get();
          set({
            daevanionBuild: {
              ...currentState.daevanionBuild,
              [path]: startNodeId ? [startNodeId] : [],
            },
          });
        }
        
        scheduleSave();
      } else {
        // Activer la rune
        // Toujours lire l'état le plus récent avant de mettre à jour
        const currentState = get();
        const currentPathRunes = currentState.daevanionBuild[path] || [];
        // Vérifier que la rune n'est pas déjà active (au cas où elle aurait été activée entre temps)
        if (!currentPathRunes.includes(slotId)) {
          set({
            daevanionBuild: {
              ...currentState.daevanionBuild,
              [path]: [...currentPathRunes, slotId],
            },
          });
          scheduleSave();
        }
      }
    },

  getTotalStats: async (path) => {
    const state = get();
    const activeRunes = state.daevanionBuild[path] || [];
    
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
    };

    // Charger toutes les runes en parallèle
    const runePromises = activeRunes.map((slotId) => getRuneData(path, slotId));
    const runes = await Promise.all(runePromises);

    runes.forEach((rune) => {
      // Ignorer le start node (slotId 61 pour Nezekan) - il ne donne aucune stats
      if (rune && rune.slotId === 61 && rune.path === "nezekan") {
        return; // Skip le start node
      }
      if (rune && rune.stats && Object.keys(rune.stats).length > 0) {
        Object.entries(rune.stats).forEach(([key, value]) => {
          if (value !== undefined && value !== 0 && key in stats) {
            stats[key as keyof DaevanionStats] += value;
          }
        });
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
