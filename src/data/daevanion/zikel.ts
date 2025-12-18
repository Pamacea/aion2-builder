import { createRune } from "@/lib/daevanionUtils";
import { DaevanionRune } from "@/types/daevanion.type";

/**
 * ============================================
 * SCHÉMA DAEVANION - ZIKEL
 * ============================================
 * 
 * Configuration de la grille Daevanion pour le chemin Zikel.
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

export const zikelRunes: (DaevanionRune | null)[] = [];

/**
 * Helper pour créer une rune Zikel
 * Wrapper autour de createRune avec le path "zikel" et gridSize 11 par défaut
 */
const createZikelRune = (
  row: number,
  col: number,
  rarity: "common" | "rare" | "legend" | "unique" | "start",
  statsOrId?: DaevanionRune["stats"] | number,
  abilityId?: number
): DaevanionRune => {
  return createRune(row, col, "zikel", rarity, statsOrId, abilityId, 11);
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
  { damageTolerance: 500 },          // Utilisé pour certains uniques
];

/**
 * ============================================
 * PLACEMENT DES RUNES - LIGNE PAR LIGNE
 * ============================================
 * 
 * Chaque ligne représente une rangée de la grille 11x11.
 * Format: (row, col) - Type - Description
 * 
 * Ligne 1 (row 0): unique commun commun commun legend commun rare commun legend commun unique
 */
zikelRunes.push(createZikelRune(0, 0, "unique", uniqueStatsList[3])); // (0,0) - Unique
zikelRunes.push(createZikelRune(0, 1, "common", {criticalHit: commonStats.criticalHit})); // (0,1) - Common
zikelRunes.push(createZikelRune(0, 2, "common", { mp: commonStats.mp })); // (0,2) - Common
zikelRunes.push(createZikelRune(0, 3, "common", { criticalHitResist: commonStats.criticalHitResist })); // (0,3) - Common
zikelRunes.push(createZikelRune(0, 4, "legend", 6)); // (0,4) - Legend - Ability ID 1
zikelRunes.push(createZikelRune(0, 5, "common", { defense: commonStats.defense })); // (0,5) - Common
zikelRunes.push(createZikelRune(0, 6, "rare", 6)); // (0,6) - Rare - Passive ID 2
zikelRunes.push(createZikelRune(0, 7, "common", { attack: commonStats.attack })); // (0,7) - Common
zikelRunes.push(createZikelRune(0, 8, "legend", 11)); // (0,8) - Legend - Ability ID 3
zikelRunes.push(createZikelRune(0, 9, "common", { defense: commonStats.defense })); // (0,9) - Common
zikelRunes.push(createZikelRune(0, 10, "unique", uniqueStatsList[2])); // (0,10) - Unique

// Ligne 2 (row 1): commun vide rare vide commun vide vide commun vide vide commun
zikelRunes.push(createZikelRune(1, 0, "common", { attack: commonStats.attack })); // (1,0) - Common
zikelRunes.push(null); // (1,1) - Vide
zikelRunes.push(createZikelRune(1, 2, "rare", 10)); // (1,2) - Rare - Passive ID 4
zikelRunes.push(null); // (1,3) - Vide
zikelRunes.push(createZikelRune(1, 4, "common", {maxHP: commonStats.maxHP })); // (1,4) - Common
zikelRunes.push(null); // (1,5) - Vide
zikelRunes.push(null); // (1,6) - Vide
zikelRunes.push(createZikelRune(1, 7, "common", { maxHP: commonStats.maxHP })); // (1,7) - Common
zikelRunes.push(null); // (1,8) - Vide
zikelRunes.push(null); // (1,9) - Vide
zikelRunes.push(createZikelRune(1, 10, "common", { criticalHit: commonStats.criticalHit  })); // (1,10) - Common

// Ligne 3 (row 2): legend commun commun vide commun commun legend commun commun rare commun
zikelRunes.push(createZikelRune(2, 0, "legend", 1)); // (2,0) - Legend - Ability ID 4
zikelRunes.push(createZikelRune(2, 1, "common", { maxHP: commonStats.maxHP })); // (2,1) - Common
zikelRunes.push(createZikelRune(2, 2, "common", { defense: commonStats.defense })); // (2,2) - Common
zikelRunes.push(null); // (2,3) - Vide
zikelRunes.push(createZikelRune(2, 4, "common", { attack: commonStats.attack })); // (2,4) - Common
zikelRunes.push(createZikelRune(2, 5, "common", { mp: commonStats.mp })); // (2,5) - Common
zikelRunes.push(createZikelRune(2, 6, "legend", 3)); // (2,6) - Legend - Ability ID 5
zikelRunes.push(createZikelRune(2, 7, "common", { criticalHitResist: commonStats.criticalHitResist })); // (2,7) - Common
zikelRunes.push(createZikelRune(2, 8, "common", { mp: commonStats.mp })); // (2,8) - Common
zikelRunes.push(createZikelRune(2, 9, "rare", 9)); // (2,9) - Rare - Passive ID 6
zikelRunes.push(createZikelRune(2, 10, "common", { attack: commonStats.attack })); // (2,10) - Common

// Ligne 4 (row 3): commun vide commun commun rare vide commun vide commun vide commun
zikelRunes.push(createZikelRune(3, 0, "common", { criticalHit: commonStats.criticalHit })); // (3,0) - Common
zikelRunes.push(null); // (3,1) - Vide
zikelRunes.push(createZikelRune(3, 2, "common", { mp: commonStats.mp })); // (3,2) - Common
zikelRunes.push(createZikelRune(3, 3, "common", { criticalHitResist: commonStats.criticalHitResist })); // (3,3) - Common
zikelRunes.push(createZikelRune(3, 4, "rare", 8)); // (3,4) - Rare - Passive ID 7
zikelRunes.push(null); // (3,5) - Vide
zikelRunes.push(createZikelRune(3, 6, "common", { criticalHit: commonStats.criticalHit })); // (3,6) - Common
zikelRunes.push(null); // (3,7) - Vide
zikelRunes.push(createZikelRune(3, 8, "common", { criticalHit: commonStats.criticalHit })); // (3,8) - Common
zikelRunes.push(null); // (3,9) - Vide
zikelRunes.push(createZikelRune(3, 10, "common", { criticalHitResist: commonStats.criticalHitResist })); // (3,10) - Common

// Ligne 5 (row 4): commun commun legend vide commun vide commun rare commun commun legend
zikelRunes.push(createZikelRune(4, 0, "common", { defense: commonStats.defense })); // (4,0) - Common
zikelRunes.push(createZikelRune(4, 1, "common", { maxHP: commonStats.maxHP })); // (4,1) - Common
zikelRunes.push(createZikelRune(4, 2, "legend", 4)); // (4,2) - Legend - Ability ID 6
zikelRunes.push(null); // (4,3) - Vide
zikelRunes.push(createZikelRune(4, 4, "common", { criticalHit: commonStats.criticalHit })); // (4,4) - Common
zikelRunes.push(null); // (4,5) - Vide
zikelRunes.push(createZikelRune(4, 6, "common", { mp: commonStats.mp })); // (4,6) - Common
zikelRunes.push(createZikelRune(4, 7, "rare", 7)); // (4,7) - Rare - Passive ID 8
zikelRunes.push(createZikelRune(4, 8, "common", { maxHP: commonStats.maxHP })); // (4,8) - Common
zikelRunes.push(createZikelRune(4, 9, "common", { attack: commonStats.attack })); // (4,9) - Common
zikelRunes.push(createZikelRune(4, 10, "legend", 2)); // (4,10) - Legend - Ability ID 7

// Ligne 6 (row 5): vide commun vide vide commun START commun vide vide commun vide
zikelRunes.push(null); // (5,0) - Vide
zikelRunes.push(createZikelRune(5, 1, "common", { attack: commonStats.attack })); // (5,1) - Common
zikelRunes.push(null); // (5,2) - Vide
zikelRunes.push(null); // (5,3) - Vide
zikelRunes.push(createZikelRune(5, 4, "common", { defense: commonStats.defense })); // (5,4) - Common
// (5,5) - Nœud central START - Position centrale de la grille
// IMPORTANT: Ce nœud est toujours activé par défaut et ne peut pas être désactivé
zikelRunes.push({
  id: 61,
  slotId: 61,
  path: "zikel",
  rarity: "common",
  name: "Zikel Start Node",
  description: "Nœud de départ du chemin Zikel",
  stats: {}, // AUCUNE stats pour le start node
  position: { x: 5, y: 5 },
  prerequisites: undefined, // Pas de prérequis pour le nœud de départ
});
zikelRunes.push(createZikelRune(5, 6, "common", { attack: commonStats.attack })); // (5,6) - Common
zikelRunes.push(null); // (5,7) - Vide
zikelRunes.push(null); // (5,8) - Vide
zikelRunes.push(createZikelRune(5, 9, "common", { attack: commonStats.attack })); // (5,9) - Common
zikelRunes.push(null); // (5,10) - Vide

// Ligne 7 (row 6): legend commun commun rare commun vide commun vide legend commun commun
zikelRunes.push(createZikelRune(6, 0, "legend", 8)); // (6,0) - Legend - Ability ID 8
zikelRunes.push(createZikelRune(6, 1, "common", { defense: commonStats.defense })); // (6,1) - Common
zikelRunes.push(createZikelRune(6, 2, "common", { mp: commonStats.mp })); // (6,2) - Common
zikelRunes.push(createZikelRune(6, 3, "rare", 9)); // (6,3) - Rare - Passive ID 9
zikelRunes.push(createZikelRune(6, 4, "common", { maxHP: commonStats.maxHP })); // (6,4) - Common
zikelRunes.push(null); // (6,5) - Vide
zikelRunes.push(createZikelRune(6, 6, "common", { criticalHitResist: commonStats.criticalHitResist })); // (6,6) - Common
zikelRunes.push(null); // (6,7) - Vide
zikelRunes.push(createZikelRune(6, 8, "legend", 10)); // (6,8) - Legend - Ability ID 9
zikelRunes.push(createZikelRune(6, 9, "common", { mp: commonStats.mp })); // (6,9) - Common
zikelRunes.push(createZikelRune(6, 10, "common", { attack: commonStats.attack })); // (6,10) - Common

// Ligne 8 (row 7): commun vide commun vide commun vide rare commun commun vide commun
zikelRunes.push(createZikelRune(7, 0, "common", { criticalHit: commonStats.criticalHit })); // (7,0) - Common
zikelRunes.push(null); // (7,1) - Vide
zikelRunes.push(createZikelRune(7, 2, "common", { criticalHitResist: commonStats.criticalHitResist })); // (7,2) - Common
zikelRunes.push(null); // (7,3) - Vide
zikelRunes.push(createZikelRune(7, 4, "common", { criticalHitResist: commonStats.criticalHitResist })); // (7,4) - Common
zikelRunes.push(null); // (7,5) - Vide
zikelRunes.push(createZikelRune(7, 6, "rare", 10)); // (7,6) - Rare - Passive ID 10
zikelRunes.push(createZikelRune(7, 7, "common", { criticalHit: commonStats.criticalHit })); // (7,7) - Common
zikelRunes.push(createZikelRune(7, 8, "common", { maxHP: commonStats.maxHP })); // (7,8) - Common
zikelRunes.push(null); // (7,9) - Vide
zikelRunes.push(createZikelRune(7, 10, "common", { criticalHitResist: commonStats.criticalHitResist })); // (7,10) - Common

// Ligne 9 (row 8): commun rare commun commun legend commun commun vide commun commun legend
zikelRunes.push(createZikelRune(8, 0, "common", { defense: commonStats.defense })); // (8,0) - Common
zikelRunes.push(createZikelRune(8, 1, "rare", 7)); // (8,1) - Rare - Passive ID 11
zikelRunes.push(createZikelRune(8, 2, "common", { maxHP: commonStats.maxHP })); // (8,2) - Common
zikelRunes.push(createZikelRune(8, 3, "common", { criticalHit: commonStats.criticalHit })); // (8,3) - Common
zikelRunes.push(createZikelRune(8, 4, "legend", 9)); // (8,4) - Legend - Ability ID 10
zikelRunes.push(createZikelRune(8, 5, "common", { maxHP: commonStats.maxHP })); // (8,5) - Common
zikelRunes.push(createZikelRune(8, 6, "common", { defense: commonStats.defense })); // (8,6) - Common
zikelRunes.push(null); // (8,7) - Vide
zikelRunes.push(createZikelRune(8, 8, "common", { attack: commonStats.attack })); // (8,8) - Common
zikelRunes.push(createZikelRune(8, 9, "common", { mp: commonStats.mp })); // (8,9) - Common
zikelRunes.push(createZikelRune(8, 10, "legend", 7)); // (8,10) - Legend - Ability ID 11

// Ligne 10 (row 9): commun vide vide commun vide vide commun vide rare vide commun
zikelRunes.push(createZikelRune(9, 0, "common", { criticalHitResist: commonStats.criticalHitResist })); // (9,0) - Common
zikelRunes.push(null); // (9,1) - Vide
zikelRunes.push(null); // (9,2) - Vide
zikelRunes.push(createZikelRune(9, 3, "common", { mp: commonStats.mp })); // (9,3) - Common
zikelRunes.push(null); // (9,4) - Vide
zikelRunes.push(null); // (9,5) - Vide
zikelRunes.push(createZikelRune(9, 6, "common", { mp: commonStats.mp })); // (9,6) - Common
zikelRunes.push(null); // (9,7) - Vide
zikelRunes.push(createZikelRune(9, 8, "rare", 8)); // (9,8) - Rare - Passive ID 12
zikelRunes.push(null); // (9,9) - Vide
zikelRunes.push(createZikelRune(9, 10, "common", { defense: commonStats.defense })); // (9,10) - Common

// Ligne 11 (row 10): unique commun legend commun rare commun legend commun commun commun unique
zikelRunes.push(createZikelRune(10, 0, "unique", uniqueStatsList[2])); // (10,0) - Unique
zikelRunes.push(createZikelRune(10, 1, "common", { attack: commonStats.attack })); // (10,1) - Common
zikelRunes.push(createZikelRune(10, 2, "legend", 5)); // (10,2) - Legend - Ability ID 12
zikelRunes.push(createZikelRune(10, 3, "common", { defense: commonStats.defense })); // (10,3) - Common
zikelRunes.push(createZikelRune(10, 4, "rare", 6)); // (10,4) - Rare - Passive ID 1
zikelRunes.push(createZikelRune(10, 5, "common", { attack: commonStats.attack })); // (10,5) - Common
zikelRunes.push(createZikelRune(10, 6, "legend", 12)); // (10,6) - Legend - Ability ID 2
zikelRunes.push(createZikelRune(10, 7, "common", { criticalHit: commonStats.criticalHit })); // (10,7) - Common
zikelRunes.push(createZikelRune(10, 8, "common", { maxHP: commonStats.maxHP })); // (10,8) - Common
zikelRunes.push(createZikelRune(10, 9, "common", { criticalHitResist: commonStats.criticalHitResist })); // (10,9) - Common
zikelRunes.push(createZikelRune(10, 10, "unique", uniqueStatsList[3])); // (10,10) - Unique
