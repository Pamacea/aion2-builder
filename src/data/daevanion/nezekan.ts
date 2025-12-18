import { createRune } from "@/lib/daevanionUtils";
import { DaevanionRune } from "@/types/daevanion.type";

/**
 * ============================================
 * SCHÉMA DAEVANION - NEZEKAN
 * ============================================
 * 
 * Configuration de la grille Daevanion pour le chemin Nezekan.
 * 
 * INFORMATIONS GÉNÉRALES:
 * - Grille: 11x11 (11 lignes × 11 colonnes)
 * - Index: 0-based (lignes 0-10, colonnes 0-10)
 * - Calcul slotId: row * 11 + col + 1
 * - Start Node: Position (5,5) - slotId 61
 * 
 * TYPES DE RUNES:
 * - Common (Gris): Stats de base (+50 MP, +100 HP, +10 Critical Hit, +50 Defense, +5 Critical Hit Resist, +5 Attack)
 * - Rare (Vert): Augmente le niveau d'un passif spécifique (passiveId)
 * - Legend (Bleu): Augmente le niveau d'un sort actif spécifique (abilityId)
 * - Unique (Orange): Stats spéciales (Cooldown Reduction, Combat Speed, Damage Boost, Damage Tolerance)
 * - Start (Blanc): Nœud de départ, aucune stats, toujours activé
 * 
 * NOTES:
 * - Les slots vides sont représentés par `null`
 * - Les nodes Rare et Legend utilisent passiveId/abilityId au lieu de stats génériques
 */

export const nezekanRunes: (DaevanionRune | null)[] = [];

/**
 * Helper pour créer une rune Nezekan
 * Wrapper autour de createRune avec le path "nezekan" et gridSize 11 par défaut
 */
const createNezekanRune = (
  row: number,
  col: number,
  rarity: "common" | "rare" | "legend" | "unique" | "start",
  statsOrId?: DaevanionRune["stats"] | number,
  abilityId?: number
): DaevanionRune => {
  return createRune(row, col, "nezekan", rarity, statsOrId, abilityId, 11);
};

/**
 * Stats par défaut pour les nodes Common
 * Chaque node Common donne une de ces stats
 */
const commonStats: DaevanionRune["stats"] = {
  mp: 50,
  maxHP: 100,
  criticalHit: 10,
  defense: 50,
  criticalHitResist: 5,
  attack: 5,
};

/**
 * Stats pour les nodes Unique
 * Chaque node Unique donne une stat spéciale unique
 */
const uniqueStatsList: DaevanionRune["stats"][] = [
  { cooldownReduction: 250 },      // (0,0) et (0,10)
  { combatSpeed: 250 },             // (10,0) et (10,10)
  { damageBoost: 500 },             // Utilisé pour certains uniques
  { damageTolerance: 500 },         // Utilisé pour certains uniques
];

/**
 * ============================================
 * PLACEMENT DES RUNES - LIGNE PAR LIGNE
 * ============================================
 * 
 * Chaque ligne représente une rangée de la grille 11x11.
 * Format: (row, col) - Type - Description
 * 
 * Ligne 1 (row 0): Unique common common vide rare common legend vide rare common unique
 */
nezekanRunes.push(createNezekanRune(0, 0, "unique", uniqueStatsList[1])); // (0,0) - Unique
nezekanRunes.push(createNezekanRune(0, 1, "common", { attack: commonStats.attack })); // (0,1) - Common
nezekanRunes.push(createNezekanRune(0, 2, "common", {criticalHitResist: commonStats.criticalHitResist })); // (0,2) - Common
nezekanRunes.push(null); // (0,3) - Vide
nezekanRunes.push(createNezekanRune(0, 4, "rare", {}, 2)); // (0,4) - Rare - Passive ID 2
nezekanRunes.push(createNezekanRune(0, 5, "common", {criticalHitResist: commonStats.criticalHitResist })); // (0,5) - Common
nezekanRunes.push(createNezekanRune(0, 6, "legend", 10)); // (0,6) - Legend - Ability ID 10
nezekanRunes.push(null); // (0,7) - Vide
nezekanRunes.push(createNezekanRune(0, 8, "rare", 3)); // (0,8) - Rare - Passive ID 3
nezekanRunes.push(createNezekanRune(0, 9, "common", {criticalHit: commonStats.criticalHit })); // (0,9) - Common
nezekanRunes.push(createNezekanRune(0, 10, "unique", uniqueStatsList[0])); // (0,10) - Unique

// Ligne 2 (row 1): common vide legend common common vide common common vide common
nezekanRunes.push(createNezekanRune(1, 0, "common", {criticalHit: commonStats.criticalHit })); // (1,0) - Common
nezekanRunes.push(null); // (1,1) - Vide
nezekanRunes.push(createNezekanRune(1, 2, "legend", 5)); // (1,2) - Legend - Ability ID 5
nezekanRunes.push(createNezekanRune(1, 3, "common", { mp: commonStats.mp })); // (1,3) - Common
nezekanRunes.push(createNezekanRune(1, 4, "common", { defense: commonStats.defense })); // (1,4) - Common
nezekanRunes.push(null); // (1,5) - Vide
nezekanRunes.push(createNezekanRune(1, 6, "common", {mp: commonStats.mp })); // (1,6) - Common
nezekanRunes.push(createNezekanRune(1, 7, "common", {defense: commonStats.defense })); // (1,7) - Common
nezekanRunes.push(createNezekanRune(1, 8, "common", {criticalHitResist: commonStats.criticalHitResist })); // (1,9) - Common
nezekanRunes.push(null); // (1,9) - Vide
nezekanRunes.push(createNezekanRune(1, 10, "common", {mp: commonStats.mp })); // (1,10) - Common

// Ligne 3 (row 2): rare common common vide common legend common vide legend common rare
nezekanRunes.push(createNezekanRune(2, 0, "rare", 1)); // (2,0) - Rare - Passive ID 1
nezekanRunes.push(createNezekanRune(2, 1, "common", {defense: commonStats.defense })); // (2,1) - Common
nezekanRunes.push(createNezekanRune(2, 2, "common", {maxHP: commonStats.maxHP })); // (2,2) - Common
nezekanRunes.push(null); // (2,3) - Vide
nezekanRunes.push(createNezekanRune(2, 4, "common", {criticalHit: commonStats.criticalHit })); // (2,4) - Common
nezekanRunes.push(createNezekanRune(2, 5, "legend", 3)); // (2,5) - Legend - Ability ID 3
nezekanRunes.push(createNezekanRune(2, 6, "common", {maxHP: commonStats.maxHP })); // (2,6) - Common
nezekanRunes.push(null); // (2,7) - Vide
nezekanRunes.push(createNezekanRune(2, 8, "legend", 8)); // (2,8) - Legend - Ability ID 8
nezekanRunes.push(createNezekanRune(2, 9, "common", {maxHP: commonStats.maxHP })); // (2,9) - Common
nezekanRunes.push(createNezekanRune(2, 10, "rare", 4)); // (2,10) - Rare - Passive ID 4

// Ligne 4 (row 3): vide common vide vide common vide common vide common vide common
nezekanRunes.push(null); // (3,0) - Vide
nezekanRunes.push(createNezekanRune(3, 1, "common", {maxHP: commonStats.maxHP })); // (3,1) - Common
nezekanRunes.push(null); // (3,2) - Vide
nezekanRunes.push(null); // (3,3) - Vide
nezekanRunes.push(createNezekanRune(3, 4, "common", {criticalHitResist: commonStats.criticalHitResist })); // (3,4) - Common
nezekanRunes.push(null); // (3,5) - Vide
nezekanRunes.push(createNezekanRune(3, 6, "common", {defense: commonStats.defense })); // (3,6) - Common
nezekanRunes.push(null); // (3,7) - Vide
nezekanRunes.push(createNezekanRune(3, 8, "common", {attack: commonStats.attack })); // (3,8) - Common
nezekanRunes.push(null); // (3,9) - Vide
nezekanRunes.push(createNezekanRune(3, 10, "common", {defense: commonStats.defense })); // (3,10) - Common

// Ligne 5 (row 4): common common legend common common common common rare common common common
nezekanRunes.push(createNezekanRune(4, 0, "common", {mp: commonStats.mp })); // (4,0) - Common
nezekanRunes.push(createNezekanRune(4, 1, "common", {attack: commonStats.attack })); // (4,1) - Common
nezekanRunes.push(createNezekanRune(4, 2, "legend", 2)); // (4,2) - Legend - Ability ID 2
nezekanRunes.push(createNezekanRune(4, 3, "common", {maxHP: commonStats.maxHP })); // (4,3) - Common
nezekanRunes.push(createNezekanRune(4, 4, "common", {mp: commonStats.mp })); // (4,4) - Common
nezekanRunes.push(createNezekanRune(4, 5, "common", {attack: commonStats.attack })); // (4,5) - Common (adjacent haut du start)
nezekanRunes.push(createNezekanRune(4, 6, "common", {criticalHitResist: commonStats.criticalHitResist })); // (4,6) - Common
nezekanRunes.push(createNezekanRune(4, 7, "rare", 5)); // (4,7) - Rare - Passive ID 5
nezekanRunes.push(createNezekanRune(4, 8, "common", {mp: commonStats.mp })); // (4,7) - Common
nezekanRunes.push(createNezekanRune(4, 9, "common", {criticalHit: commonStats.criticalHit })); // (4,9) - Common
nezekanRunes.push(createNezekanRune(4, 10, "common", {criticalHitResist: commonStats.criticalHitResist })); // (4,10) - Common

// Ligne 6 (row 5) - CENTRE avec nœud Start: legend vide vide common vide start vide common vide vide legend
nezekanRunes.push(createNezekanRune(5, 0, "legend", 2)); // (5,0) - Legend - Ability ID 2
nezekanRunes.push(null); // (5,1) - Vide
nezekanRunes.push(null); // (5,2) - Vide
nezekanRunes.push(createNezekanRune(5, 3, "common", {defense: commonStats.defense })); // (5,3) - Common
nezekanRunes.push(null); // (5,4) - Vide
// (5,5) - Nœud central START - Position centrale de la grille
// IMPORTANT: Ce nœud est toujours activé par défaut et ne peut pas être désactivé
nezekanRunes.push({
  id: 61,
  slotId: 61,
  path: "nezekan",
  rarity: "common",
  name: "Nezekan Start Node",
  description: "Nœud de départ du chemin Nezekan",
  stats: {}, // AUCUNE stats pour le start node
  position: { x: 5, y: 5 },
  prerequisites: undefined, // Pas de prérequis pour le nœud de départ
});
nezekanRunes.push(null); // (5,6) - Vide
nezekanRunes.push(createNezekanRune(5, 7, "common", {attack: commonStats.attack })); // (5,6) - Common (adjacent droite du start)
nezekanRunes.push(null); // (5,8) - Vide
nezekanRunes.push(null); // (5,9) - Vide
nezekanRunes.push(createNezekanRune(5, 10, "legend", 6)); // (5,10) - Legend - Ability ID 6

// Ligne 7 (row 6): common common common rare common common common common legend common common
nezekanRunes.push(createNezekanRune(6, 0, "common", {criticalHit: commonStats.criticalHit })); // (6,0) - Common
nezekanRunes.push(createNezekanRune(6, 1, "common", {criticalHitResist: commonStats.criticalHitResist })); // (6,1) - Common
nezekanRunes.push(createNezekanRune(6, 2, "common", {maxHP: commonStats.maxHP })); // (6,2) - Common
nezekanRunes.push(createNezekanRune(6, 3, "rare", 4)); // (6,3) - Rare - Passive ID 4
nezekanRunes.push(createNezekanRune(6, 4, "common", {criticalHit: commonStats.criticalHit })); // (6,4) - Common (adjacent bas du start)
nezekanRunes.push(createNezekanRune(6, 5, "common", {defense: commonStats.defense })); // (6,5) - Common
nezekanRunes.push(createNezekanRune(6, 6, "common", {maxHP: commonStats.maxHP })); // (6,6) - Common
nezekanRunes.push(createNezekanRune(6, 7, "common", {mp: commonStats.mp })); // (6,7) - Common
nezekanRunes.push(createNezekanRune(6, 8, "legend", 1)); // (6,8) - Legend - Ability ID 1
nezekanRunes.push(createNezekanRune(6, 9, "common", {defense: commonStats.defense })); // (6,9) - Common
nezekanRunes.push(createNezekanRune(6, 10, "common", {maxHP: commonStats.maxHP })); // (6,10) - Common

// Ligne 8 (row 7): common vide common vide common vide common vide vide common vide
nezekanRunes.push(createNezekanRune(7, 0, "common", {attack: commonStats.attack })); // (7,0) - Common
nezekanRunes.push(null); // (7,1) - Vide
nezekanRunes.push(createNezekanRune(7, 2, "common", {defense: commonStats.defense })); // (7,2) - Common
nezekanRunes.push(null); // (7,3) - Vide
nezekanRunes.push(createNezekanRune(7, 4, "common", {attack: commonStats.attack })); // (7,4) - Common
nezekanRunes.push(null); // (7,5) - Vide
nezekanRunes.push(createNezekanRune(7, 6, "common", {criticalHit: commonStats.criticalHit })); // (7,6) - Common
nezekanRunes.push(null); // (7,7) - Vide
nezekanRunes.push(null); // (7,8) - Vide
nezekanRunes.push(createNezekanRune(7, 9, "common", {mp: commonStats.mp })); // (7,9) - Common
nezekanRunes.push(null); // (7,10) - Vide

// Ligne 9 (row 8): rare common legend vide common legend common vide common common rare
nezekanRunes.push(createNezekanRune(8, 0, "rare", 5)); // (8,0) - Rare - Passive ID 5
nezekanRunes.push(createNezekanRune(8, 1, "common", {mp: commonStats.mp })); // (8,1) - Common
nezekanRunes.push(createNezekanRune(8, 2, "rare", 3)); // (8,2) - Rare - Passive ID 3
nezekanRunes.push(null); // (8,3) - Vide
nezekanRunes.push(createNezekanRune(8, 4, "common", {mp: commonStats.mp })); // (8,4) - Common
nezekanRunes.push(createNezekanRune(8, 5, "legend", 11)); // (8,5) - Legend - Ability ID 11
nezekanRunes.push(createNezekanRune(8, 6, "common", {criticalHitResist: commonStats.criticalHitResist })); // (8,6) - Common
nezekanRunes.push(null); // (8,7) - Vide
nezekanRunes.push(createNezekanRune(8, 8, "common", {mp: commonStats.mp })); // (8,8) - Common
nezekanRunes.push(createNezekanRune(8, 9, "common", {attack: commonStats.attack })); // (8,9) - Common
nezekanRunes.push(createNezekanRune(8, 10, "rare", 2)); // (8,10) - Rare - Passive ID 2

// Ligne 10 (row 9): common vide rare common common vide common common legend rare common
nezekanRunes.push(createNezekanRune(9, 0, "common", {maxHP: commonStats.maxHP })); // (9,0) - Common
nezekanRunes.push(null); // (9,1) - Vide
nezekanRunes.push(createNezekanRune(9, 2, "rare", 3)); // (9,2) - Rare - Passive ID 3
nezekanRunes.push(createNezekanRune(9, 3, "common", {attack: commonStats.attack})); // (9,3) - Common
nezekanRunes.push(createNezekanRune(9, 4, "common", {maxHP: commonStats.maxHP})); // (9,4) - Common
nezekanRunes.push(null); // (9,5) - Vide
nezekanRunes.push(createNezekanRune(9, 6, "common", {attack: commonStats.attack})); // (9,6) - Common
nezekanRunes.push(createNezekanRune(9, 7, "common", {maxHP: commonStats.maxHP})); // (9,7) - Common
nezekanRunes.push(createNezekanRune(9, 8, "rare", 7)); // (9,9) - Rare - Passive ID 7
nezekanRunes.push(null); // (10,8) - Vide
nezekanRunes.push(createNezekanRune(9, 10, "common", {criticalHitResist: commonStats.criticalHitResist})); // (9,10) - Common

// Ligne 11 (row 10): Unique common rare vide legend common rare vide common common unique
nezekanRunes.push(createNezekanRune(10, 0, "unique", uniqueStatsList[0])); // (10,0) - Unique
nezekanRunes.push(createNezekanRune(10, 1, "common", {criticalHitResist: commonStats.criticalHitResist})); // (10,1) - Common
nezekanRunes.push(createNezekanRune(10, 2, "rare", 3)); // (10,2) - Rare - Passive ID 3 (à vérifier selon l'image)
nezekanRunes.push(null); // (10,3) - Vide
nezekanRunes.push(createNezekanRune(10, 4, "legend", 11)); // (10,4) - Legend - Ability ID 11 (à vérifier selon l'image)
nezekanRunes.push(createNezekanRune(10, 5, "common", {criticalHit: commonStats.criticalHit})); // (10,5) - Common
nezekanRunes.push(createNezekanRune(10, 6, "rare", 1)); // (10,6) - Rare - Passive ID 1 (à vérifier selon l'image)
nezekanRunes.push(null); // (10,7) - Vide
nezekanRunes.push(createNezekanRune(10, 8, "common", {criticalHit: commonStats.criticalHit})); // (10,8) - Common
nezekanRunes.push(createNezekanRune(10, 9, "common", {defense: commonStats.defense})); // (10,9) - Common
nezekanRunes.push(createNezekanRune(10, 10, "unique", uniqueStatsList[1])); // (10,10) - Unique
