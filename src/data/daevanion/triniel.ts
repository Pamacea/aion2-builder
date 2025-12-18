import { createRune } from "@/lib/daevanionUtils";
import { DaevanionRune } from "@/types/daevanion.type";

/**
 * ============================================
 * SCHÉMA DAEVANION - TRINIEL
 * ============================================
 * 
 * Configuration de la grille Daevanion pour le chemin Triniel.
 * 
 * INFORMATIONS GÉNÉRALES:
 * - Grille: 13x13 (13 lignes × 13 colonnes)
 * - Index: 0-based (lignes 0-12, colonnes 0-12)
 * - Calcul slotId: row * 13 + col + 1
 * - Start Node: Position (6,6) - slotId 85
 * 
 * TYPES DE RUNES:
 * - Common (Gris): Stats de base (+50 MP, +100 HP, +10 Critical Hit, +50 Defense, +5 Critical Hit Resist, +5 Attack)
 * - Rare (Vert): Augmente le niveau d'un passif spécifique (passiveId)
 * - Legend (Bleu): Augmente le niveau d'un sort actif spécifique (abilityId)
 * - Unique (Orange): Stats spéciales (Cooldown Reduction, Combat Speed, Damage Boost, Damage Tolerance, Multi Hit Resist/Chance)
 * - Start (Blanc): Nœud de départ, aucune stats, toujours activé
 * 
 * NOTES:
 * - Les slots vides sont représentés par `null`
 * - Les nodes Rare et Legend utilisent passiveId/abilityId au lieu de stats génériques
 * - Triniel a une grille plus grande (13x13) que les autres chemins (11x11)
 */

export const trinielRunes: (DaevanionRune | null)[] = [];

/**
 * Helper pour créer une rune Triniel
 * Wrapper autour de createRune avec le path "triniel" et gridSize 13 par défaut
 */
const createTrinielRune = (
  row: number,
  col: number,
  rarity: "common" | "rare" | "legend" | "unique" | "start",
  statsOrId?: DaevanionRune["stats"] | number,
  abilityId?: number
): DaevanionRune => {
  return createRune(row, col, "triniel", rarity, statsOrId, abilityId, 13);
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
 * Note: Triniel peut avoir des stats Multi Hit en plus des stats standard
 */
const uniqueStatsList: DaevanionRune["stats"][] = [
  { cooldownReduction: 250 },      // Utilisé pour certains uniques
  { combatSpeed: 250 },             // Utilisé pour certains uniques
  { damageBoost: 500 },             // Utilisé pour certains uniques
  { damageTolerance: 500 },         // Utilisé pour certains uniques
  { multiHitResist: 300 },          // Stats spéciales Triniel
  { multiHitChance: 300 },          // Stats spéciales Triniel
];

/**
 * ============================================
 * PLACEMENT DES RUNES - LIGNE PAR LIGNE
 * ============================================
 * 
 * Chaque ligne représente une rangée de la grille 13x13.
 * Format: (row, col) - Type - Description
 * 
 * Ligne 1 (row 0): unique commun commun vide vide commun unique commun vide vide commun commun unique
 * Note: 12 éléments dans la description, complété à 13 colonnes. Le dernier "unique" est à (0,12)
 */
trinielRunes.push(createTrinielRune(0, 0, "unique", uniqueStatsList[4])); // (0,0) - Unique
trinielRunes.push(createTrinielRune(0, 1, "common", { attack: commonStats.attack })); // (0,1) - Common
trinielRunes.push(createTrinielRune(0, 2, "common", { criticalHitResist: commonStats.criticalHitResist })); // (0,2) - Common
trinielRunes.push(null); // (0,3) - Vide
trinielRunes.push(null); // (0,4) - Vide
trinielRunes.push(createTrinielRune(0, 5, "common", { attack: commonStats.attack })); // (0,5) - Common
trinielRunes.push(createTrinielRune(0, 6, "unique", uniqueStatsList[5])); // (0,6) - Unique
trinielRunes.push(createTrinielRune(0, 7, "common", { defense: commonStats.defense })); // (0,7) - Common
trinielRunes.push(null); // (0,8) - Vide
trinielRunes.push(null); // (0,9) - Vide
trinielRunes.push(createTrinielRune(0, 10, "common", { defense: commonStats.defense })); // (0,10) - Common
trinielRunes.push(createTrinielRune(0, 11, "common", { maxHP: commonStats.maxHP })); // (0,11) - Common
trinielRunes.push(createTrinielRune(0, 12, "unique", uniqueStatsList[4])); // (0,12) - Unique

// Ligne 2 (row 1): commun vide legend commun commun rare vide rare commun commun legend vide commun
// Note: 12 éléments, on doit en avoir 13. Ajout d'un élément vide à la fin
trinielRunes.push(createTrinielRune(1, 0, "common", { mp: commonStats.mp })); // (1,0) - Common
trinielRunes.push(null); // (1,1) - Vide
trinielRunes.push(createTrinielRune(1, 2, "legend", 4)); // (1,2) - Legend - Ability ID 1
trinielRunes.push(createTrinielRune(1, 3, "common", { mp: commonStats.mp })); // (1,3) - Common
trinielRunes.push(createTrinielRune(1, 4, "common", { maxHP: commonStats.maxHP })); // (1,4) - Common
trinielRunes.push(createTrinielRune(1, 5, "rare", 10)); // (1,5) - Rare - Passive ID 1
trinielRunes.push(null); // (1,6) - Vide
trinielRunes.push(createTrinielRune(1, 7, "rare", 6)); // (1,7) - Rare - Passive ID 2
trinielRunes.push(createTrinielRune(1, 8, "common", { mp: commonStats.mp })); // (1,8) - Common
trinielRunes.push(createTrinielRune(1, 9, "common", { criticalHit: commonStats.criticalHit })); // (1,9) - Common
trinielRunes.push(createTrinielRune(1, 10, "legend", 2)); // (1,10) - Legend - Ability ID 2
trinielRunes.push(null); // (1,11) - Vide
trinielRunes.push(createTrinielRune(1, 12, "common", { criticalHit: commonStats.criticalHit })); // (1,12) - Common

// Ligne 3 (row 2): commun vide commun vide vide commun commun commun vide vide commun vide commun
// Note: 13 éléments - parfait !
trinielRunes.push(createTrinielRune(2, 0, "common", { criticalHit: commonStats.criticalHit })); // (2,0) - Common
trinielRunes.push(null); // (2,1) - Vide
trinielRunes.push(createTrinielRune(2, 2, "common", { maxHP: commonStats.maxHP })); // (2,2) - Common
trinielRunes.push(null); // (2,3) - Vide
trinielRunes.push(null); // (2,4) - Vide
trinielRunes.push(createTrinielRune(2, 5, "common", { defense: commonStats.defense })); // (2,5) - Common
trinielRunes.push(createTrinielRune(2, 6, "common", { maxHP: commonStats.maxHP })); // (2,6) - Common
trinielRunes.push(createTrinielRune(2, 7, "common", { criticalHitResist: commonStats.criticalHitResist })); // (2,7) - Common
trinielRunes.push(null); // (2,8) - Vide
trinielRunes.push(null); // (2,9) - Vide
trinielRunes.push(createTrinielRune(2, 10, "common", { attack: commonStats.attack })); // (2,10) - Common
trinielRunes.push(null); // (2,11) - Vide
trinielRunes.push(createTrinielRune(2, 12, "common", { criticalHitResist: commonStats.criticalHitResist })); // (2,12) - Common

// Ligne 4 (row 3): legend commun commun rare commun commun vide commun legend commun commun commun rare
// Note: 12 éléments, on doit en avoir 13. Ajout d'un élément vide à la fin
trinielRunes.push(createTrinielRune(3, 0, "legend", 6)); // (3,0) - Legend - Ability ID 3
trinielRunes.push(createTrinielRune(3, 1, "common", { criticalHitResist: commonStats.criticalHitResist })); // (3,1) - Common
trinielRunes.push(createTrinielRune(3, 2, "common", { mp: commonStats.mp })); // (3,2) - Common
trinielRunes.push(createTrinielRune(3, 3, "rare", 2)); // (3,3) - Rare - Passive ID 3
trinielRunes.push(createTrinielRune(3, 4, "common", { criticalHitResist: commonStats.criticalHitResist })); // (3,4) - Common
trinielRunes.push(createTrinielRune(3, 5, "common", { attack: commonStats.attack })); // (3,5) - Common
trinielRunes.push(null); // (3,6) - Vide
trinielRunes.push(createTrinielRune(3, 7, "common", { defense: commonStats.defense })); // (3,7) - Common
trinielRunes.push(createTrinielRune(3, 8, "legend", 9)); // (3,8) - Legend - Ability ID 4
trinielRunes.push(createTrinielRune(3, 9, "common", { criticalHit: commonStats.criticalHit })); // (3,9) - Common
trinielRunes.push(createTrinielRune(3, 10, "common", { maxHP: commonStats.maxHP })); // (3,10) - Common
trinielRunes.push(createTrinielRune(3, 11, "common", { mp: commonStats.mp })); // (3,11) - Common
trinielRunes.push(createTrinielRune(3, 12, "rare", 4)); // (3,12) - Rare - Passive ID 4

// Ligne 5 (row 4): vide vide commun vide commun vide vide vide commun vide vide commun vide
// Note: 12 éléments, on doit en avoir 13. Ajout d'un élément vide à la fin
trinielRunes.push(null); // (4,0) - Vide
trinielRunes.push(null); // (4,1) - Vide
trinielRunes.push(createTrinielRune(4, 2, "common", { defense: commonStats.defense })); // (4,2) - Common
trinielRunes.push(null); // (4,3) - Vide
trinielRunes.push(createTrinielRune(4, 4, "common", { criticalHit: commonStats.criticalHit })); // (4,4) - Common
trinielRunes.push(null); // (4,5) - Vide
trinielRunes.push(null); // (4,6) - Vide
trinielRunes.push(null); // (4,7) - Vide
trinielRunes.push(createTrinielRune(4, 8, "common", { maxHP: commonStats.maxHP })); // (4,8) - Common
trinielRunes.push(null); // (4,9) - Vide
trinielRunes.push(null); // (4,10) - Vide
trinielRunes.push(createTrinielRune(4, 11, "common", { criticalHitResist: commonStats.criticalHitResist })); // (4,11) - Common
trinielRunes.push(null); // (4,12) - Vide

// Ligne 6 (row 5): commun commun commun commun legend commun commun commun commun commun rare commun commun
// Note: 13 éléments - parfait !
trinielRunes.push(createTrinielRune(5, 0, "common", { criticalHitResist: commonStats.criticalHitResist })); // (5,0) - Common
trinielRunes.push(createTrinielRune(5, 1, "common", { criticalHit: commonStats.criticalHit })); // (5,1) - Common
trinielRunes.push(createTrinielRune(5, 2, "common", { maxHP: commonStats.maxHP })); // (5,2) - Common
trinielRunes.push(createTrinielRune(5, 3, "common", { attack: commonStats.attack })); // (5,3) - Common
trinielRunes.push(createTrinielRune(5, 4, "legend", 8)); // (5,4) - Legend - Ability ID 5
trinielRunes.push(createTrinielRune(5, 5, "common", { mp: commonStats.mp })); // (5,5) - Common
trinielRunes.push(createTrinielRune(5, 6, "common", { defense: commonStats.defense })); // (5,6) - Common
trinielRunes.push(createTrinielRune(5, 7, "common", { criticalHitResist: commonStats.criticalHitResist })); // (5,7) - Common
trinielRunes.push(createTrinielRune(5, 8, "common", { mp: commonStats.mp })); // (5,8) - Common
trinielRunes.push(createTrinielRune(5, 9, "common", { criticalHit: commonStats.criticalHit })); // (5,9) - Common
trinielRunes.push(createTrinielRune(5, 10, "rare", 7)); // (5,10) - Rare - Passive ID 5
trinielRunes.push(createTrinielRune(5, 11, "common", { defense: commonStats.defense })); // (5,11) - Common
trinielRunes.push(createTrinielRune(5, 12, "common", {mp: commonStats.mp })); // (5,12) - Common

// Ligne 7 (row 6): legend vide commun vide commun vide START vide commun vide commun vide legend
// Note: 12 éléments dans la description, complété à 13 colonnes. START est à (6,6)
trinielRunes.push(createTrinielRune(6, 0, "legend", 10)); // (6,0) - Legend - Ability ID 6
trinielRunes.push(null); // (6,1) - Vide
trinielRunes.push(createTrinielRune(6, 2, "common", { defense: commonStats.defense })); // (6,2) - Common
trinielRunes.push(null); // (6,3) - Vide
trinielRunes.push(createTrinielRune(6, 4, "common", { defense: commonStats.defense })); // (6,4) - Common
trinielRunes.push(null); // (6,5) - Vide
// (6,6) - Nœud central START - Position centrale de la grille 13x13
// IMPORTANT: Ce nœud est toujours activé par défaut et ne peut pas être désactivé
// Calcul slotId: 6 * 13 + 6 + 1 = 78 + 6 + 1 = 85
trinielRunes.push({
  id: 85,
  slotId: 85,
  path: "triniel",
  rarity: "common",
  name: "Triniel Start Node",
  description: "Nœud de départ du chemin Triniel",
  stats: {}, // AUCUNE stats pour le start node
  position: { x: 6, y: 6 },
  prerequisites: undefined, // Pas de prérequis pour le nœud de départ
});
trinielRunes.push(null); // (6,7) - Vide
trinielRunes.push(createTrinielRune(6, 8, "common", { attack: commonStats.attack })); // (6,8) - Common
trinielRunes.push(null); // (6,9) - Vide
trinielRunes.push(createTrinielRune(6, 10, "common", { attack: commonStats.attack })); // (6,10) - Common
trinielRunes.push(null); // (6,11) - Vide
trinielRunes.push(createTrinielRune(6, 12, "legend", 11)); // (6,12) - Legend - Ability ID 7

// Ligne 8 (row 7): commun commun rare commun commun commun commun commun legend commun commun commun commun
// Note: 13 éléments - parfait !
trinielRunes.push(createTrinielRune(7, 0, "common", { maxHP: commonStats.maxHP })); // (7,0) - Common
trinielRunes.push(createTrinielRune(7, 1, "common", { attack: commonStats.attack })); // (7,1) - Common
trinielRunes.push(createTrinielRune(7, 2, "rare", 5)); // (7,2) - Rare - Passive ID 6
trinielRunes.push(createTrinielRune(7, 3, "common", { criticalHitResist: commonStats.criticalHitResist })); // (7,3) - Common
trinielRunes.push(createTrinielRune(7, 4, "common", { maxHP: commonStats.maxHP })); // (7,4) - Common
trinielRunes.push(createTrinielRune(7, 5, "common", { criticalHit: commonStats.criticalHit })); // (7,5) - Common
trinielRunes.push(createTrinielRune(7, 6, "common", { attack: commonStats.attack })); // (7,6) - Common
trinielRunes.push(createTrinielRune(7, 7, "common", { maxHP: commonStats.maxHP })); // (7,7) - Common
trinielRunes.push(createTrinielRune(7, 8, "legend", 5)); // (7,8) - Legend - Ability ID 8
trinielRunes.push(createTrinielRune(7, 9, "common", { defense: commonStats.defense })); // (7,9) - Common
trinielRunes.push(createTrinielRune(7, 10, "common", { mp: commonStats.mp })); // (7,10) - Common
trinielRunes.push(createTrinielRune(7, 11, "common", { criticalHitResist: commonStats.criticalHitResist })); // (7,11) - Common
trinielRunes.push(createTrinielRune(7, 12, "common", { criticalHit: commonStats.criticalHit })); // (7,12) - Common

// Ligne 9 (row 8): vide commun vide vide commun vide vide vide commun vide commun vide vide
// Note: 12 éléments, on doit en avoir 13. Ajout d'un élément vide à la fin
trinielRunes.push(null); // (8,0) - Vide
trinielRunes.push(createTrinielRune(8, 1, "common", { criticalHit: commonStats.criticalHit })); // (8,1) - Common
trinielRunes.push(null); // (8,2) - Vide
trinielRunes.push(null); // (8,3) - Vide
trinielRunes.push(createTrinielRune(8, 4, "common", { mp: commonStats.mp  })); // (8,4) - Common
trinielRunes.push(null); // (8,5) - Vide
trinielRunes.push(null); // (8,6) - Vide
trinielRunes.push(null); // (8,7) - Vide
trinielRunes.push(createTrinielRune(8, 8, "common", { criticalHitResist: commonStats.criticalHitResist })); // (8,8) - Common
trinielRunes.push(null); // (8,9) - Vide
trinielRunes.push(createTrinielRune(8, 10, "common", { attack: commonStats.attack })); // (8,10) - Common
trinielRunes.push(null); // (8,11) - Vide
trinielRunes.push(null); // (8,12) - Vide

// Ligne 10 (row 9): rare commun commun commun legend commun vide commun commun rare commun commun legend
// Note: 12 éléments, on doit en avoir 13. Ajout d'un élément vide à la fin
trinielRunes.push(createTrinielRune(9, 0, "rare", 3)); // (9,0) - Rare - Passive ID 7
trinielRunes.push(createTrinielRune(9, 1, "common", { maxHP: commonStats.maxHP })); // (9,1) - Common
trinielRunes.push(createTrinielRune(9, 2, "common", { mp: commonStats.mp })); // (9,2) - Common
trinielRunes.push(createTrinielRune(9, 3, "common", { criticalHitResist: commonStats.criticalHitResist })); // (9,3) - Common
trinielRunes.push(createTrinielRune(9, 4, "legend", 7)); // (9,4) - Legend - Ability ID 9
trinielRunes.push(createTrinielRune(9, 5, "common", { attack: commonStats.attack })); // (9,5) - Common
trinielRunes.push(null); // (9,6) - Vide
trinielRunes.push(createTrinielRune(9, 7, "common", { defense: commonStats.defense })); // (9,7) - Common
trinielRunes.push(createTrinielRune(9, 8, "common", { criticalHit: commonStats.criticalHit })); // (9,8) - Common
trinielRunes.push(createTrinielRune(9, 9, "rare", 1)); // (9,9) - Rare - Passive ID 8
trinielRunes.push(createTrinielRune(9, 10, "common", { maxHP: commonStats.maxHP })); // (9,10) - Common
trinielRunes.push(createTrinielRune(9, 11, "common", { criticalHit: commonStats. criticalHit})); // (9,11) - Common
trinielRunes.push(createTrinielRune(9, 12, "legend", 12)); // (9,12) - Legend - Ability ID 10

// Ligne 11 (row 10): commun vide commun vide vide commun commun commun vide vide commun vide commun
// Note: 13 éléments - parfait !
trinielRunes.push(createTrinielRune(10, 0, "common", { criticalHit: commonStats.criticalHit })); // (10,0) - Common
trinielRunes.push(null); // (10,1) - Vide
trinielRunes.push(createTrinielRune(10, 2, "common", { defense: commonStats.defense })); // (10,2) - Common
trinielRunes.push(null); // (10,3) - Vide
trinielRunes.push(null); // (10,4) - Vide
trinielRunes.push(createTrinielRune(10, 5, "common", { criticalHit: commonStats.criticalHit })); // (10,5) - Common
trinielRunes.push(createTrinielRune(10, 6, "common", { mp: commonStats.mp})); // (10,6) - Common
trinielRunes.push(createTrinielRune(10, 7, "common", { attack: commonStats.attack })); // (10,7) - Common
trinielRunes.push(null); // (10,8) - Vide
trinielRunes.push(null); // (10,9) - Vide
trinielRunes.push(createTrinielRune(10, 10, "common", { mp: commonStats.mp })); // (10,10) - Common
trinielRunes.push(null); // (10,11) - Vide
trinielRunes.push(createTrinielRune(10, 12, "common", { criticalHitResist: commonStats.criticalHitResist })); // (10,12) - Common

// Ligne 12 (row 11): commun vide legend commun commun rare vide rare commun commun legend vide commun
// Note: 12 éléments, on doit en avoir 13. Ajout d'un élément vide à la fin
trinielRunes.push(createTrinielRune(11, 0, "common", { criticalHitResist: commonStats.criticalHitResist })); // (11,0) - Common
trinielRunes.push(null); // (11,1) - Vide
trinielRunes.push(createTrinielRune(11, 2, "legend", 3)); // (11,2) - Legend - Ability ID 11
trinielRunes.push(createTrinielRune(11, 3, "common", { criticalHitResist: commonStats.criticalHitResist })); // (11,3) - Common
trinielRunes.push(createTrinielRune(11, 4, "common", { maxHP: commonStats.maxHP })); // (11,4) - Common
trinielRunes.push(createTrinielRune(11, 5, "rare", 8)); // (11,5) - Rare - Passive ID 9
trinielRunes.push(null); // (11,6) - Vide
trinielRunes.push(createTrinielRune(11, 7, "rare", 9)); // (11,7) - Rare - Passive ID 10
trinielRunes.push(createTrinielRune(11, 8, "common", { mp: commonStats.mp })); // (11,8) - Common
trinielRunes.push(createTrinielRune(11, 9, "common", { maxHP: commonStats.maxHP })); // (11,9) - Common
trinielRunes.push(createTrinielRune(11, 10, "legend", 1)); // (11,10) - Legend - Ability ID 12
trinielRunes.push(null); // (11,11) - Vide
trinielRunes.push(createTrinielRune(11, 12, "common", { maxHP: commonStats.maxHP })); // (11,12) - Common

// Ligne 13 (row 12): unique commun commun vide commun unique commun vide vide commun commun unique
// Note: 12 éléments, on doit en avoir 13. Le dernier "unique" est à (12,12)
trinielRunes.push(createTrinielRune(12, 0, "unique", uniqueStatsList[5])); // (12,0) - Unique
trinielRunes.push(createTrinielRune(12, 1, "common", { mp: commonStats.mp })); // (12,1) - Common
trinielRunes.push(createTrinielRune(12, 2, "common", { attack: commonStats.attack })); // (12,2) - Common
trinielRunes.push(null); // (12,3) - Vide
trinielRunes.push(null); // (12,3) - Vide
trinielRunes.push(createTrinielRune(12, 5, "common", { attack: commonStats.attack })); // (12,4) - Common
trinielRunes.push(createTrinielRune(12, 6, "unique", uniqueStatsList[4])); // (12,5) - Unique
trinielRunes.push(createTrinielRune(12, 7, "common", { defense: commonStats.defense })); // (12,6) - Common
trinielRunes.push(null); // (12,7) - Vide
trinielRunes.push(null); // (12,8) - Vide
trinielRunes.push(createTrinielRune(12, 10, "common", { criticalHitResist: commonStats.criticalHitResist })); // (12,10) - Common
trinielRunes.push(createTrinielRune(12, 11, "common", { mp: commonStats.mp })); // (12,11) - Common
trinielRunes.push(createTrinielRune(12, 12, "unique", uniqueStatsList[5])); // (12,12) - Unique
