import { createRune } from "@/lib/daevanionUtils";
import { DaevanionRune } from "@/types/daevanion.type";

/**
 * ============================================
 * SCHÉMA DAEVANION - VAIZEL
 * ============================================
 * 
 * Configuration de la grille Daevanion pour le chemin Vaizel.
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

export const vaizelRunes: (DaevanionRune | null)[] = [];

/**
 * Helper pour créer une rune Vaizel
 * Wrapper autour de createRune avec le path "vaizel" et gridSize 11 par défaut
 */
const createVaizelRune = (
  row: number,
  col: number,
  rarity: "common" | "rare" | "legend" | "unique" | "start",
  statsOrId?: DaevanionRune["stats"] | number,
  abilityId?: number
): DaevanionRune => {
  return createRune(row, col, "vaizel", rarity, statsOrId, abilityId, 11);
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
 * Ligne 1 (row 0): unique commun rare vide commun legend commun rare commun commun commun commun unique
 * Note: Il y a 12 éléments dans la description mais seulement 11 colonnes (0-10). Le dernier "unique" remplace le dernier "commun".
 */
vaizelRunes.push(createVaizelRune(0, 0, "unique", uniqueStatsList[2])); // (0,0) - Unique
vaizelRunes.push(createVaizelRune(0, 1, "common", { criticalHitResist: commonStats.criticalHitResist })); // (0,1) - Common
vaizelRunes.push(createVaizelRune(0, 2, "rare", 1)); // (0,2) - Rare - Passive ID 1
vaizelRunes.push(null); // (0,3) - Vide
vaizelRunes.push(createVaizelRune(0, 4, "common", { criticalHitResist: commonStats.criticalHitResist })); // (0,4) - Common
vaizelRunes.push(createVaizelRune(0, 5, "legend", 6)); // (0,5) - Legend - Ability ID 1
vaizelRunes.push(createVaizelRune(0, 6, "common", { attack: commonStats.attack })); // (0,6) - Common
vaizelRunes.push(createVaizelRune(0, 7, "rare", 3)); // (0,7) - Rare - Passive ID 2
vaizelRunes.push(createVaizelRune(0, 8, "common", { criticalHitResist: commonStats.criticalHitResist })); // (0,8) - Common
vaizelRunes.push(createVaizelRune(0, 9, "common", { maxHP: commonStats.maxHP })); // (0,9) - Common
vaizelRunes.push(createVaizelRune(0, 10, "unique", uniqueStatsList[3])); // (0,10) - Unique

// Ligne 2 (row 1): commun vide commun commun commun vide commun vide commun vide commun
vaizelRunes.push(createVaizelRune(1, 0, "common", { criticalHit: commonStats.criticalHit })); // (1,0) - Common
vaizelRunes.push(null); // (1,1) - Vide
vaizelRunes.push(createVaizelRune(1, 2, "common", { attack: commonStats.attack })); // (1,2) - Common
vaizelRunes.push(createVaizelRune(1, 3, "common", { criticalHit: commonStats.criticalHit })); // (1,3) - Common
vaizelRunes.push(createVaizelRune(1, 4, "common", { mp: commonStats.mp })); // (1,4) - Common
vaizelRunes.push(null); // (1,5) - Vide
vaizelRunes.push(createVaizelRune(1, 6, "common", { defense: commonStats.defense })); // (1,6) - Common
vaizelRunes.push(null); // (1,7) - Vide
vaizelRunes.push(createVaizelRune(1, 8, "common", { defense: commonStats.defense })); // (1,8) - Common
vaizelRunes.push(null); // (1,9) - Vide
vaizelRunes.push(createVaizelRune(1, 10, "common", { mp: commonStats.mp })); // (1,10) - Common

// Ligne 3 (row 2): commun legend commun vide legend commun commun commun legend commun rare
vaizelRunes.push(createVaizelRune(2, 0, "common", { defense: commonStats.defense })); // (2,0) - Common
vaizelRunes.push(createVaizelRune(2, 1, "legend", 3)); // (2,1) - Legend - Ability ID 2
vaizelRunes.push(createVaizelRune(2, 2, "common", { maxHP: commonStats.maxHP })); // (2,2) - Common
vaizelRunes.push(null); // (2,3) - Vide
vaizelRunes.push(createVaizelRune(2, 4, "legend", 10)); // (2,4) - Legend - Ability ID 3
vaizelRunes.push(createVaizelRune(2, 5, "common", { criticalHit: commonStats.criticalHit })); // (2,5) - Common
vaizelRunes.push(createVaizelRune(2, 6, "common", { mp: commonStats.mp })); // (2,6) - Common
vaizelRunes.push(createVaizelRune(2, 7, "common", { maxHP: commonStats.maxHP })); // (2,7) - Common
vaizelRunes.push(createVaizelRune(2, 8, "legend", 9)); // (2,8) - Legend - Ability ID 4
vaizelRunes.push(createVaizelRune(2, 9, "common", { attack: commonStats.attack })); // (2,9) - Common
vaizelRunes.push(createVaizelRune(2, 10, "rare", 5)); // (2,10) - Rare - Passive ID 3

// Ligne 4 (row 3): vide commun vide vide commun vide rare vide vide commun vide
vaizelRunes.push(null); // (3,0) - Vide
vaizelRunes.push(createVaizelRune(3, 1, "common", { criticalHit: commonStats.criticalHit })); // (3,1) - Common
vaizelRunes.push(null); // (3,2) - Vide
vaizelRunes.push(null); // (3,3) - Vide
vaizelRunes.push(createVaizelRune(3, 4, "common", { criticalHit: commonStats.criticalHit })); // (3,4) - Common
vaizelRunes.push(null); // (3,5) - Vide
vaizelRunes.push(createVaizelRune(3, 6, "rare", 8)); // (3,6) - Rare - Passive ID 4
vaizelRunes.push(null); // (3,7) - Vide
vaizelRunes.push(null); // (3,8) - Vide
vaizelRunes.push(createVaizelRune(3, 9, "common", { criticalHitResist: commonStats.criticalHitResist })); // (3,9) - Common
vaizelRunes.push(null); // (3,10) - Vide

// Ligne 5 (row 4): commun commun commun rare commun commun commun commun legend commun commun
vaizelRunes.push(createVaizelRune(4, 0, "common", { attack: commonStats.attack })); // (4,0) - Common
vaizelRunes.push(createVaizelRune(4, 1, "common", { mp: commonStats.mp })); // (4,1) - Common
vaizelRunes.push(createVaizelRune(4, 2, "common", { defense: commonStats.defense })); // (4,2) - Common
vaizelRunes.push(createVaizelRune(4, 3, "rare", 9)); // (4,3) - Rare - Passive ID 5
vaizelRunes.push(createVaizelRune(4, 4, "common", { maxHP: commonStats.maxHP })); // (4,4) - Common
vaizelRunes.push(createVaizelRune(4, 5, "common", { attack: commonStats.attack })); // (4,5) - Common
vaizelRunes.push(createVaizelRune(4, 6, "common", { criticalHitResist: commonStats.criticalHitResist })); // (4,6) - Common
vaizelRunes.push(createVaizelRune(4, 7, "common", { defense: commonStats.defense })); // (4,7) - Common
vaizelRunes.push(createVaizelRune(4, 8, "legend", 5)); // (4,8) - Legend - Ability ID 5
vaizelRunes.push(createVaizelRune(4, 9, "common", { maxHP: commonStats.maxHP })); // (4,9) - Common
vaizelRunes.push(createVaizelRune(4, 10, "common", { criticalHit: commonStats.criticalHit })); // (4,10) - Common

// Ligne 6 (row 5): legend vide vide commun vide START vide commun vide vide legend
vaizelRunes.push(createVaizelRune(5, 0, "legend", 7)); // (5,0) - Legend - Ability ID 6
vaizelRunes.push(null); // (5,1) - Vide
vaizelRunes.push(null); // (5,2) - Vide
vaizelRunes.push(createVaizelRune(5, 3, "common", { mp: commonStats.mp })); // (5,3) - Common
vaizelRunes.push(null); // (5,4) - Vide
// (5,5) - Nœud central START - Position centrale de la grille
// IMPORTANT: Ce nœud est toujours activé par défaut et ne peut pas être désactivé
vaizelRunes.push({
  id: 61,
  slotId: 61,
  path: "vaizel",
  rarity: "common",
  name: "Vaizel Start Node",
  description: "Nœud de départ du chemin Vaizel",
  stats: {}, // AUCUNE stats pour le start node
  position: { x: 5, y: 5 },
  prerequisites: undefined, // Pas de prérequis pour le nœud de départ
});
vaizelRunes.push(null); // (5,6) - Vide
vaizelRunes.push(createVaizelRune(5, 7, "common", { maxHP: commonStats.maxHP })); // (5,7) - Common
vaizelRunes.push(null); // (5,8) - Vide
vaizelRunes.push(null); // (5,9) - Vide
vaizelRunes.push(createVaizelRune(5, 10, "legend", 1)); // (5,10) - Legend - Ability ID 7

// Ligne 7 (row 6): commun commun legend commun commun commun commun rare commun commun commun
vaizelRunes.push(createVaizelRune(6, 0, "common", { criticalHitResist: commonStats.criticalHitResist })); // (6,0) - Common
vaizelRunes.push(createVaizelRune(6, 1, "common", { mp: commonStats.mp })); // (6,1) - Common
vaizelRunes.push(createVaizelRune(6, 2, "legend", 11)); // (6,2) - Legend - Ability ID 8
vaizelRunes.push(createVaizelRune(6, 3, "common", { attack: commonStats.attack })); // (6,3) - Common
vaizelRunes.push(createVaizelRune(6, 4, "common", { criticalHit: commonStats.criticalHit })); // (6,4) - Common
vaizelRunes.push(createVaizelRune(6, 5, "common", { defense: commonStats.defense })); // (6,5) - Common
vaizelRunes.push(createVaizelRune(6, 6, "common", { mp: commonStats.mp })); // (6,6) - Common
vaizelRunes.push(createVaizelRune(6, 7, "rare", 10)); // (6,7) - Rare - Passive ID 6
vaizelRunes.push(createVaizelRune(6, 8, "common", { attack: commonStats.attack })); // (6,8) - Common
vaizelRunes.push(createVaizelRune(6, 9, "common", { maxHP: commonStats.maxHP })); // (6,9) - Common
vaizelRunes.push(createVaizelRune(6, 10, "common", { defense: commonStats.defense })); // (6,10) - Common

// Ligne 8 (row 7): vide commun vide vide rare vide commun vide vide commun vide
vaizelRunes.push(null); // (7,0) - Vide
vaizelRunes.push(createVaizelRune(7, 1, "common", { criticalHit: commonStats.criticalHit })); // (7,1) - Common
vaizelRunes.push(null); // (7,2) - Vide
vaizelRunes.push(null); // (7,3) - Vide
vaizelRunes.push(createVaizelRune(7, 4, "rare", 6)); // (7,4) - Rare - Passive ID 7
vaizelRunes.push(null); // (7,5) - Vide
vaizelRunes.push(createVaizelRune(7, 6, "common", { criticalHitResist: commonStats.criticalHitResist })); // (7,6) - Common
vaizelRunes.push(null); // (7,7) - Vide
vaizelRunes.push(null); // (7,8) - Vide
vaizelRunes.push(createVaizelRune(7, 9, "common", { criticalHit: commonStats.criticalHit })); // (7,9) - Common
vaizelRunes.push(null); // (7,10) - Vide

// Ligne 9 (row 8): rare commun legend commun commun commun legend vide commun legend commun
vaizelRunes.push(createVaizelRune(8, 0, "rare", 7)); // (8,0) - Rare - Passive ID 8
vaizelRunes.push(createVaizelRune(8, 1, "common", { defense: commonStats.defense })); // (8,1) - Common
vaizelRunes.push(createVaizelRune(8, 2, "legend", 2)); // (8,2) - Legend - Ability ID 9
vaizelRunes.push(createVaizelRune(8, 3, "common", { criticalHitResist: commonStats.criticalHitResist })); // (8,3) - Common
vaizelRunes.push(createVaizelRune(8, 4, "common", { maxHP: commonStats.maxHP })); // (8,4) - Common
vaizelRunes.push(createVaizelRune(8, 5, "common", { mp: commonStats.mp })); // (8,5) - Common
vaizelRunes.push(createVaizelRune(8, 6, "legend", 4)); // (8,6) - Legend - Ability ID 10
vaizelRunes.push(null); // (8,7) - Vide
vaizelRunes.push(createVaizelRune(8, 8, "common", { mp: commonStats.mp })); // (8,8) - Common
vaizelRunes.push(createVaizelRune(8, 9, "legend", 9)); // (8,9) - Legend - Ability ID 11
vaizelRunes.push(createVaizelRune(8, 10, "common", { attack: commonStats.attack })); // (8,10) - Common

// Ligne 10 (row 9): commun vide commun vide commun vide commun commun commun vide commun
vaizelRunes.push(createVaizelRune(9, 0, "common", { maxHP: commonStats.maxHP })); // (9,0) - Common
vaizelRunes.push(null); // (9,1) - Vide
vaizelRunes.push(createVaizelRune(9, 2, "common", { attack: commonStats.attack })); // (9,2) - Common
vaizelRunes.push(null); // (9,3) - Vide
vaizelRunes.push(createVaizelRune(9, 4, "common", { attack: commonStats.attack })); // (9,4) - Common
vaizelRunes.push(null); // (9,5) - Vide
vaizelRunes.push(createVaizelRune(9, 6, "common", { maxHP: commonStats.maxHP })); // (9,6) - Common
vaizelRunes.push(createVaizelRune(9, 7, "common", { criticalHitResist: commonStats.criticalHitResist })); // (9,7) - Common
vaizelRunes.push(createVaizelRune(9, 8, "common", { defense: commonStats.defense })); // (9,8) - Common
vaizelRunes.push(null); // (9,9) - Vide
vaizelRunes.push(createVaizelRune(9, 10, "common", { criticalHitResist: commonStats.criticalHitResist })); // (9,10) - Common

// Ligne 11 (row 10): unique commun commun rare commun legend commun vide rare commun unique
vaizelRunes.push(createVaizelRune(10, 0, "unique", uniqueStatsList[3])); // (10,0) - Unique
vaizelRunes.push(createVaizelRune(10, 1, "common", { mp: commonStats.mp })); // (10,1) - Common
vaizelRunes.push(createVaizelRune(10, 2, "common", { criticalHitResist: commonStats.criticalHitResist })); // (10,2) - Common
vaizelRunes.push(createVaizelRune(10, 3, "rare", 4)); // (10,3) - Rare - Passive ID 9
vaizelRunes.push(createVaizelRune(10, 4, "common", { defense: commonStats.defense })); // (10,4) - Common
vaizelRunes.push(createVaizelRune(10, 5, "legend", 12)); // (10,5) - Legend - Ability ID 12
vaizelRunes.push(createVaizelRune(10, 6, "common", { criticalHit: commonStats.criticalHit })); // (10,6) - Common
vaizelRunes.push(null); // (10,7) - Vide
vaizelRunes.push(createVaizelRune(10, 8, "rare", 2)); // (10,8) - Rare - Passive ID 10
vaizelRunes.push(createVaizelRune(10, 9, "common", { criticalHit: commonStats.criticalHit })); // (10,9) - Common
vaizelRunes.push(createVaizelRune(10, 10, "unique", uniqueStatsList[2])); // (10,10) - Unique
