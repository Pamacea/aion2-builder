import { createRune } from "@/lib/daevanionUtils";
import { DaevanionRune } from "@/types/daevanion.type";

/**
 * ============================================
 * SCHÉMA DAEVANION - ARIEL
 * ============================================
 * 
 * Configuration de la grille Daevanion pour le chemin Ariel.
 * 
 * INFORMATIONS GÉNÉRALES:
 * - Grille: 15x15 (15 lignes × 15 colonnes)
 * - Index: 0-based (lignes 0-14, colonnes 0-14)
 * - Calcul slotId: row * 15 + col + 1
 * - Start Node: Position (7,7) - slotId 113
 * 
 * TYPES DE RUNES:
 * - Common (Gris): Stats de base (+50 MP, +100 HP, +10 Critical Hit, +50 Defense, +5 Critical Hit Resist, +5 Attack)
 * - Rare (Vert): Stats spéciales PvE/Boss (PvE Accuracy/Evasion, Boss Attack/Defense, PvE Attack/Defense)
 * - Legend (Bleu): Stats spéciales Boss (Boss Damage Tolerance +100, Boss Damage Boost +100)
 * - Unique (Orange): Stats spéciales (Cooldown Reduction, Combat Speed, Damage Boost, Damage Tolerance)
 * - Start (Blanc): Nœud de départ, aucune stats, toujours activé
 * 
 * NOTES IMPORTANTES:
 * - Les slots vides sont représentés par `null`
 * - EXCEPTION: Pour Ariel, les nodes Rare et Legend donnent des STATS au lieu d'augmenter des IDs
 * - Les nodes Rare peuvent avoir différentes combinaisons de stats
 * - Les nodes Legend donnent toujours Boss Damage Tolerance +100 et Boss Damage Boost +100
 */

export const arielRunes: (DaevanionRune | null)[] = [];

/**
 * Helper pour créer une rune Ariel
 * Wrapper autour de createRune avec le path "ariel" et gridSize 15 par défaut
 */
const createArielRune = (
  row: number,
  col: number,
  rarity: "common" | "rare" | "legend" | "unique" | "start",
  statsOrId?: DaevanionRune["stats"] | number,
  abilityId?: number
): DaevanionRune => {
  return createRune(row, col, "ariel", rarity, statsOrId, abilityId, 15);
};

/**
 * Stats pour les nodes Common (Ariel)
 * Chaque node Common donne une de ces stats
 * NOTE: Les nodes Common d'Ariel donnent des stats PvE/Boss au lieu des stats de base standard
 */
const commonStatsList: DaevanionRune["stats"][] = [
  { pveAttack: 5 },           // PvE Attack +5
  { bossAttack: 5 },           // Boss Attack +5
  { pveAccuracy: 10 },        // PvE Accuracy +10
  { bossDefense: 50 },         // Boss Defense +50
  { pveEvasion: 10 },          // PvE Evasion +10
  { mp: 50 },                  // MP +50
  { maxHP: 100 },              // HP +100
  { pveDefense: 50 },          // PvE Defense +50
];

/**
 * Stats pour les nodes Legend (Ariel)
 * Chaque node Legend donne ces stats Boss
 */
const legendStats: DaevanionRune["stats"] = {
  bossDamageTolerance: 100,
  bossDamageBoost: 100,
};

/**
 * Stats pour les nodes Rare (Ariel)
 * Différentes combinaisons possibles
 */
const rareStatsList: DaevanionRune["stats"][] = [
  { pveAccuracy: 10, pveEvasion: 10 },           // Option 1
  { bossAttack: 5, bossDefense: 50 },              // Option 2
  { pveAttack: 5, pveDefense: 50 },               // Option 3
];

/**
 * Stats pour les nodes Unique
 * Chaque node Unique donne une stat spéciale unique
 */
const uniqueStatsList: DaevanionRune["stats"][] = [
  { pveDamageBoost: 250 },
  { pveDamageTolerance: 250 },
];

/**
 * ============================================
 * PLACEMENT DES RUNES - LIGNE PAR LIGNE
 * ============================================
 * 
 * Chaque ligne représente une rangée de la grille 15x15.
 * Format: (row, col) - Type - Description
 */

// Ligne 1 (row 0): unique commun rare vide vide vide commun unique commun vide rare commun commun commun unique
arielRunes.push(createArielRune(0, 0, "unique", uniqueStatsList[0])); // (0,0) - Unique
arielRunes.push(createArielRune(0, 1, "common", commonStatsList[1])); // (0,1) - Common
arielRunes.push(createArielRune(0, 2, "rare", rareStatsList[2])); // (0,2) - Rare
arielRunes.push(null); // (0,3) - Vide
arielRunes.push(null); // (0,4) - Vide
arielRunes.push(null); // (0,5) - Vide
arielRunes.push(createArielRune(0, 6, "common", commonStatsList[2])); // (0,6) - Common
arielRunes.push(createArielRune(0, 7, "unique", uniqueStatsList[0])); // (0,7) - Unique
arielRunes.push(createArielRune(0, 8, "common", commonStatsList[6])); // (0,8) - Common
arielRunes.push(null); // (0,9) - Vide
arielRunes.push(createArielRune(0, 10, "rare", rareStatsList[0])); // (0,10) - Rare
arielRunes.push(createArielRune(0, 11, "common", commonStatsList[3])); // (0,11) - Common
arielRunes.push(createArielRune(0, 12, "common", commonStatsList[4])); // (0,12) - Common
arielRunes.push(createArielRune(0, 13, "common", commonStatsList[7])); // (0,13) - Common
arielRunes.push(createArielRune(0, 14, "unique", uniqueStatsList[1])); // (0,14) - Unique

// Ligne 2 (row 1): commun vide commun commun commun legend commun vide rare vide commun vide legend vide commun
arielRunes.push(createArielRune(1, 0, "common", commonStatsList[2])); // (1,0) - Common -> pve accuracy
arielRunes.push(null); // (1,1) - Vide
arielRunes.push(createArielRune(1, 2, "common", commonStatsList[3])); // (1,2) - Common boss defense
arielRunes.push(createArielRune(1, 3, "common", commonStatsList[4])); // (1,3) - Common pve evasion
arielRunes.push(createArielRune(1, 4, "common", commonStatsList[7])); // (1,4) - Common pve defense
arielRunes.push(createArielRune(1, 5, "legend", legendStats)); // (1,5) - Legend boss damage tolerance
arielRunes.push(createArielRune(1, 6, "common", commonStatsList[0])); // (1,6) - Common pve attack
arielRunes.push(null); // (1,7) - Vide
arielRunes.push(createArielRune(1, 8, "rare", rareStatsList[1])); // (1,8) - Rare boss attack & defense
arielRunes.push(null); // (1,9) - Vide
arielRunes.push(createArielRune(1, 10, "common", commonStatsList[1])); // (1,10) - Common boss attack
arielRunes.push(null); // (1,11) - Vide
arielRunes.push(createArielRune(1, 12, "legend", legendStats)); // (1,12) - Legend boss damage boost
arielRunes.push(null); // (1,13) - Vide
arielRunes.push(createArielRune(1, 14, "common", commonStatsList[1])); // (1,14) - Common boss attack

// Ligne 3 (row 2): commun legend vide rare vide vide commun commun commun commun commun commun commun commun rare
arielRunes.push(createArielRune(2, 0, "common", commonStatsList[7])); // (2,0) - Common pve defense
arielRunes.push(createArielRune(2, 1, "legend", legendStats)); // (2,1) - Legend boss damage boost
arielRunes.push(null); // (2,2) - Vide
arielRunes.push(createArielRune(2, 3, "rare", rareStatsList[1])); // (2,3) - Rare boss attack & defense
arielRunes.push(null); // (2,4) - Vide
arielRunes.push(null); // (2,5) - Vide
arielRunes.push(createArielRune(2, 6, "common", commonStatsList[1])); // (2,6) - Common boss attack
arielRunes.push(createArielRune(2, 7, "common", commonStatsList[4])); // (2,7) - Common pve evasion
arielRunes.push(createArielRune(2, 8, "common", commonStatsList[2])); // (2,8) - Common pve acuracy
arielRunes.push(createArielRune(2, 9, "common", commonStatsList[3])); // (2,9) - Common boss defense
arielRunes.push(createArielRune(2, 10, "common", commonStatsList[0])); // (2,10) - Common pve attack
arielRunes.push(createArielRune(2, 11, "common", commonStatsList[4])); // (2,11) - Common pve evasion
arielRunes.push(createArielRune(2, 12, "common", commonStatsList[7])); // (2,12) - Common pve defense 
arielRunes.push(createArielRune(2, 13, "common", commonStatsList[2])); // (2,13) - Common pve acuracy
arielRunes.push(createArielRune(2, 14, "rare", rareStatsList[2])); // (2,14) - Rare pve attack & defense

// Ligne 4 (row 3): vide commun vide commun commun commun rare vide vide legend vide rare vide commun vide
arielRunes.push(null); // (3,0) - Vide
arielRunes.push(createArielRune(3, 1, "common", commonStatsList[0])); // (3,1) - Common pve attack
arielRunes.push(null); // (3,2) - Vide
arielRunes.push(createArielRune(3, 3, "common", commonStatsList[2])); // (3,3) - Common pve acuracy
arielRunes.push(createArielRune(3, 4, "common", commonStatsList[0])); // (3,4) - Common pve attack
arielRunes.push(createArielRune(3, 5, "common", commonStatsList[3])); // (3,5) - Common boss defense
arielRunes.push(createArielRune(3, 6, "rare", rareStatsList[0])); // (3,6) - Rare pve acuracy & evasion
arielRunes.push(null); // (3,7) - Vide
arielRunes.push(null); // (3,8) - Vide
arielRunes.push(createArielRune(3, 9, "legend", legendStats)); // (3,9) - Legend boss damage tolerance
arielRunes.push(null); // (3,10) - Vide
arielRunes.push(createArielRune(3, 11, "rare", rareStatsList[1])); // (3,11) - Rare boss attack & defense
arielRunes.push(null); // (3,12) - Vide
arielRunes.push(createArielRune(3, 13, "common", commonStatsList[4])); // (3,13) - Common pve evasion
arielRunes.push(null); // (3,14) - Vide

// Ligne 5 (row 4): rare commun commun legend vide vide commun vide vide commun vide commun commun legend vide
arielRunes.push(createArielRune(4, 0, "rare", rareStatsList[0])); // (4,0) - Rare pve acuracy & evasion
arielRunes.push(createArielRune(4, 1, "common", commonStatsList[3])); // (4,1) - Common boss defense
arielRunes.push(createArielRune(4, 2, "common", commonStatsList[1])); // (4,2) - Common boss attack
arielRunes.push(createArielRune(4, 3, "legend", legendStats)); // (4,3) - Legend boss damage tolerance
arielRunes.push(null); // (4,4) - Vide
arielRunes.push(null); // (4,5) - Vide
arielRunes.push(createArielRune(4, 6, "common", commonStatsList[7])); // (4,6) - Common pve defense
arielRunes.push(null); // (4,7) - Vide
arielRunes.push(null); // (4,8) - Vide
arielRunes.push(createArielRune(4, 9, "common", commonStatsList[7])); // (4,9) - Common pve defense
arielRunes.push(null); // (4,10) - Vide
arielRunes.push(createArielRune(4, 11, "common", commonStatsList[2])); // (4,11) - Common pve acuracy
arielRunes.push(createArielRune(4, 12, "common", commonStatsList[3])); // (4,12) - Common boss defense
arielRunes.push(createArielRune(4, 13, "legend", legendStats)); // (4,13) - Legend boss damage boost
arielRunes.push(null); // (4,14) - Vide

// Ligne 6 (row 5): commun vide vide commun vide legend commun commun rare commun vide commun vide commun vide
arielRunes.push(createArielRune(5, 0, "common", commonStatsList[7])); // (5,0) - Common pve defense
arielRunes.push(null); // (5,1) - Vide
arielRunes.push(null); // (5,2) - Vide
arielRunes.push(createArielRune(5, 3, "common", commonStatsList[4])); // (5,3) - Common pve evasion
arielRunes.push(null); // (5,4) - Vide
arielRunes.push(createArielRune(5, 5, "legend", legendStats)); // (5,5) - Legend boss damage boost
arielRunes.push(createArielRune(5, 6, "common", commonStatsList[4])); // (5,6) - Common pve evasion
arielRunes.push(createArielRune(5, 7, "common", commonStatsList[6])); // (5,7) - Common hp
arielRunes.push(createArielRune(5, 8, "rare", rareStatsList[2])); // (5,8) - Rare pve attack & defense
arielRunes.push(createArielRune(5, 9, "common", commonStatsList[1])); // (5,9) - Common boss attack
arielRunes.push(null); // (5,10) - Vide
arielRunes.push(createArielRune(5, 11, "common", commonStatsList[0])); // (5,11) - Common pve attack
arielRunes.push(null); // (5,12) - Vide
arielRunes.push(createArielRune(5, 13, "common", commonStatsList[1])); // (5,13) - Common boss attack
arielRunes.push(null); // (5,14) - Vide

// Ligne 7 (row 6): commun rare commun rare commun commun vide commun vide commun legend commun commun rare commun
arielRunes.push(createArielRune(6, 0, "common", commonStatsList[5])); // (6,0) - Commo mpn
arielRunes.push(createArielRune(6, 1, "rare", rareStatsList[1])); // (6,1) - Rare boss attack & defense
arielRunes.push(createArielRune(6, 2, "common", commonStatsList[2])); // (6,2) - Common pve acuracy
arielRunes.push(createArielRune(6, 3, "rare", rareStatsList[0])); // (6,3) - Rare pve acuracy & defense
arielRunes.push(createArielRune(6, 4, "common", commonStatsList[3])); // (6,4) - Common boss defense
arielRunes.push(createArielRune(6, 5, "common", commonStatsList[1])); // (6,5) - Common boss attack
arielRunes.push(null); // (6,6) - Vide
arielRunes.push(createArielRune(6, 7, "common", commonStatsList[0])); // (6,7) - Common pve attack
arielRunes.push(null); // (6,8) - Vide
arielRunes.push(createArielRune(6, 9, "common", commonStatsList[3])); // (6,9) - Common boss defense
arielRunes.push(createArielRune(6, 10, "legend", legendStats)); // (6,10) - Legend boss damage tolerance
arielRunes.push(createArielRune(6, 11, "common", commonStatsList[4])); // (6,11) - Common pve evasion
arielRunes.push(createArielRune(6, 12, "common", commonStatsList[7])); // (6,12) - Common pve defense
arielRunes.push(createArielRune(6, 13, "rare", rareStatsList[0])); // (6,13) - Rare pve acuracy & evasion
arielRunes.push(createArielRune(6, 14, "common", commonStatsList[0])); // (6,14) - Common pve attack

// Ligne 8 (row 7): Unique vide commun vide vide commun commun START commun commun vide vide commun vide Unique
arielRunes.push(createArielRune(7, 0, "unique", uniqueStatsList[1])); // (7,0) - Unique pve damage tolerance
arielRunes.push(null); // (7,1) - Vide
arielRunes.push(createArielRune(7, 2, "common", commonStatsList[6])); // (7,2) - Common hp
arielRunes.push(null); // (7,3) - Vide
arielRunes.push(null); // (7,4) - Vide
arielRunes.push(createArielRune(7, 5, "common", commonStatsList[2])); // (7,5) - Common pve acuracy 
arielRunes.push(createArielRune(7, 6, "common", commonStatsList[7])); // (7,6) - Common pve defense
// (7,7) - Nœud central START - Position centrale de la grille 15x15
// IMPORTANT: Ce nœud est toujours activé par défaut et ne peut pas être désactivé
// Calcul slotId: 7 * 15 + 7 + 1 = 105 + 7 + 1 = 113
arielRunes.push({
  id: 113,
  slotId: 113,
  path: "ariel",
  rarity: "common",
  name: "Ariel Start Node",
  description: "Nœud de départ du chemin Ariel",
  stats: {}, // AUCUNE stats pour le start node
  position: { x: 7, y: 7 },
  prerequisites: undefined, // Pas de prérequis pour le nœud de départ
});
arielRunes.push(createArielRune(7, 8, "common", commonStatsList[7])); // (7,8) - Common pve defense
arielRunes.push(createArielRune(7, 9, "common", commonStatsList[2])); // (7,9) - Common pve acuracy
arielRunes.push(null); // (7,10) - Vide
arielRunes.push(null); // (7,11) - Vide
arielRunes.push(createArielRune(7, 12, "common", commonStatsList[5])); // (7,12) - Common mp
arielRunes.push(null); // (7,13) - Vide
arielRunes.push(createArielRune(7, 14, "unique", uniqueStatsList[1])); // (7,14) - Unique pve damage tolerance

// Ligne 9 (row 8): commun rare commun commun legend commun vide commun vide commun commun rare commun rare commun
arielRunes.push(createArielRune(8, 0, "common", commonStatsList[0])); // (8,0) - Common pve attack
arielRunes.push(createArielRune(8, 1, "rare", rareStatsList[0])); // (8,1) - Rare pve acuracy & evasion
arielRunes.push(createArielRune(8, 2, "common", commonStatsList[7])); // (8,2) - Common pve defense
arielRunes.push(createArielRune(8, 3, "common", commonStatsList[4])); // (8,3) - Common pve evasion
arielRunes.push(createArielRune(8, 4, "legend", legendStats)); // (8,4) - Legend boss damage tolerance
arielRunes.push(createArielRune(8, 5, "common", commonStatsList[3])); // (8,5) - Common boss defense
arielRunes.push(null); // (8,6) - Vide
arielRunes.push(createArielRune(8, 7, "common", commonStatsList[0])); // (8,7) - Common pve attack
arielRunes.push(null); // (8,8) - Vide
arielRunes.push(createArielRune(8, 9, "common", commonStatsList[1])); // (8,9) - Common boss attack
arielRunes.push(createArielRune(8, 10, "common", commonStatsList[3])); // (8,10) - Common boss defense
arielRunes.push(createArielRune(8, 11, "rare", rareStatsList[1])); // (8,11) - Rare boos attack & defense
arielRunes.push(createArielRune(8, 12, "common", commonStatsList[2])); // (8,12) - Common pve acuracy
arielRunes.push(createArielRune(8, 13, "rare", rareStatsList[2])); // (8,13) - Rare pve attack & defense
arielRunes.push(createArielRune(8, 14, "common", commonStatsList[6])); // (8,14) - Common hp

// Ligne 10 (row 9): vide commun vide commun vide commun rare commun commun legend vide commun vide vide commun
arielRunes.push(null); // (9,0) - Vide
arielRunes.push(createArielRune(9, 1, "common", commonStatsList[1])); // (9,1) - Common boss attack
arielRunes.push(null); // (9,2) - Vide
arielRunes.push(createArielRune(9, 3, "common", commonStatsList[0])); // (9,3) - Common pve attack
arielRunes.push(null); // (9,4) - Vide
arielRunes.push(createArielRune(9, 5, "common", commonStatsList[1])); // (9,5) - Common boss attack
arielRunes.push(createArielRune(9, 6, "rare", rareStatsList[1])); // (9,6) - Rare boss attack & defense
arielRunes.push(createArielRune(9, 7, "common", commonStatsList[5])); // (9,7) - Common mp
arielRunes.push(createArielRune(9, 8, "common", commonStatsList[4])); // (9,8) - Common pve evasion
arielRunes.push(createArielRune(9, 9, "legend", legendStats)); // (9,9) - Legend pve damage boost
arielRunes.push(null); // (9,10) - Vide
arielRunes.push(createArielRune(9, 11, "common", commonStatsList[4])); // (9,11) - Common pve evasion
arielRunes.push(null); // (9,12) - Vide
arielRunes.push(null); // (9,13) - Vide
arielRunes.push(createArielRune(9, 14, "common", commonStatsList[7])); // (9,14) - Common pve defense

// Ligne 11 (row 10): vide legend commun commun vide commun vide vide commun vide vide legend commun commun rare
arielRunes.push(null); // (10,0) - Vide
arielRunes.push(createArielRune(10, 1, "legend", legendStats)); // (10,1) - Legend boss damage boost
arielRunes.push(createArielRune(10, 2, "common", commonStatsList[3])); // (10,2) - Common boss defense
arielRunes.push(createArielRune(10, 3, "common", commonStatsList[2])); // (10,3) - Common pve acuracy
arielRunes.push(null); // (10,4) - Vide
arielRunes.push(createArielRune(10, 5, "common", commonStatsList[7])); // (10,5) - Common pve defense
arielRunes.push(null); // (10,6) - Vide
arielRunes.push(null); // (10,7) - Vide
arielRunes.push(createArielRune(10, 8, "common", commonStatsList[7])); // (10,8) - Common pve defense
arielRunes.push(null); // (10,9) - Vide
arielRunes.push(null); // (10,10) - Vide
arielRunes.push(createArielRune(10, 11, "legend", legendStats)); // (10,11) - Legend boss damage tolerance
arielRunes.push(createArielRune(10, 12, "common", commonStatsList[1])); // (10,12) - Common boss attack
arielRunes.push(createArielRune(10, 13, "common", commonStatsList[3])); // (10,13) - Common boss defense
arielRunes.push(createArielRune(10, 14, "rare", rareStatsList[0])); // (10,14) - Rare pve acuracy & evasion

// Ligne 12 (row 11): vide commun vide rare vide legend vide vide rare commun commun commun vide commun vide
arielRunes.push(null); // (11,0) - Vide
arielRunes.push(createArielRune(11, 1, "common", commonStatsList[4])); // (11,1) - Common pve evasion
arielRunes.push(null); // (11,2) - Vide
arielRunes.push(createArielRune(11, 3, "rare", rareStatsList[2])); // (11,3) - Rare pve attack & defense
arielRunes.push(null); // (11,4) - Vide
arielRunes.push(createArielRune(11, 5, "legend", legendStats)); // (11,5) - Legend boss damage tolerance
arielRunes.push(null); // (11,6) - Vide
arielRunes.push(null); // (11,7) - Vide
arielRunes.push(createArielRune(11, 8, "rare", rareStatsList[0])); // (11,8) - Rare pve acuracy & evasion
arielRunes.push(createArielRune(11, 9, "common", commonStatsList[3])); // (11,9) - Common boss defense
arielRunes.push(createArielRune(11, 10, "common", commonStatsList[0])); // (11,10) - Common pve attack
arielRunes.push(createArielRune(11, 11, "common", commonStatsList[2])); // (11,11) - Common pve acuracy
arielRunes.push(null); // (11,12) - Vide
arielRunes.push(createArielRune(11, 13, "common", commonStatsList[0])); // (11,13) - Common pve attack
arielRunes.push(null); // (11,14) - Vide

// Ligne 13 (row 12): rare commun commun commun commun commun commun commun commun vide vide rare vide legend commun
arielRunes.push(createArielRune(12, 0, "rare", rareStatsList[2])); // (12,0) - Rare pve attack & defense
arielRunes.push(createArielRune(12, 1, "common", commonStatsList[2])); // (12,1) - Common pve acuracy
arielRunes.push(createArielRune(12, 2, "common", commonStatsList[7])); // (12,2) - Common pve defense
arielRunes.push(createArielRune(12, 3, "common", commonStatsList[2])); // (12,3) - Common pve acuracy
arielRunes.push(createArielRune(12, 4, "common", commonStatsList[0])); // (12,4) - Common pve attack
arielRunes.push(createArielRune(12, 5, "common", commonStatsList[3])); // (12,5) - Common boss defense
arielRunes.push(createArielRune(12, 6, "common", commonStatsList[2])); // (12,6) - Common pve acuracy
arielRunes.push(createArielRune(12, 7, "common", commonStatsList[4])); // (12,7) - Common pve evasion
arielRunes.push(createArielRune(12, 8, "common", commonStatsList[1])); // (12,8) - Common boss attack
arielRunes.push(null); // (12,9) - Vide
arielRunes.push(null); // (12,10) - Vide
arielRunes.push(createArielRune(12, 11, "rare", rareStatsList[2])); // (12,11) - Rare pve attack & defense
arielRunes.push(null); // (12,12) - Vide
arielRunes.push(createArielRune(12, 13, "legend", legendStats)); // (12,13) - Legend boss damage boost
arielRunes.push(createArielRune(12, 14, "common", commonStatsList[7])); // (12,14) - Common pve defense

// Ligne 14 (row 13): commun vide legend vide commun vide rare vide commun legend commun commun commun vide commun
arielRunes.push(createArielRune(13, 0, "common", commonStatsList[1])); // (13,0) - Common boss attack
arielRunes.push(null); // (13,1) - Vide
arielRunes.push(createArielRune(13, 2, "legend", legendStats)); // (13,2) - Legend boss damage boost
arielRunes.push(null); // (13,3) - Vide
arielRunes.push(createArielRune(13, 4, "common", commonStatsList[1])); // (13,4) - Common boss attack
arielRunes.push(null); // (13,5) - Vide
arielRunes.push(createArielRune(13, 6, "rare", rareStatsList[2])); // (13,6) - Rare pve attack & defense
arielRunes.push(null); // (13,7) - Vide
arielRunes.push(createArielRune(13, 8, "common", commonStatsList[0])); // (13,8) - Common pve attack
arielRunes.push(createArielRune(13, 9, "legend", legendStats)); // (13,9) - Legend boss damage tolerance
arielRunes.push(createArielRune(13, 10, "common", commonStatsList[7])); // (13,10) - Common pve defense
arielRunes.push(createArielRune(13, 11, "common", commonStatsList[4])); // (13,11) - Common pve evasion
arielRunes.push(createArielRune(13, 12, "common", commonStatsList[3])); // (13,12) - Common boss defense
arielRunes.push(null); // (13,13) - Vide
arielRunes.push(createArielRune(13, 14, "common", commonStatsList[2])); // (13,14) - Common pve acuracy

// Ligne 15 (row 14): unique commun commun commun rare vide commun unique commun vide vide vide rare commun unique
arielRunes.push(createArielRune(14, 0, "unique", uniqueStatsList[1])); // (14,0) - Unique pve damage tolerance
arielRunes.push(createArielRune(14, 1, "common", commonStatsList[0])); // (14,1) - Common pve attack
arielRunes.push(createArielRune(14, 2, "common", commonStatsList[4])); // (14,2) - Common pve evasion
arielRunes.push(createArielRune(14, 3, "common", commonStatsList[3])); // (14,3) - Common boss defense
arielRunes.push(createArielRune(14, 4, "rare", rareStatsList[0])); // (14,4) - Rare pve acuracy & evasion
arielRunes.push(null); // (14,5) - Vide
arielRunes.push(createArielRune(14, 6, "common", commonStatsList[5])); // (14,6) - Common mp 
arielRunes.push(createArielRune(14, 7, "unique", uniqueStatsList[0])); // (14,7) - Unique pve damage boost
arielRunes.push(createArielRune(14, 8, "common", commonStatsList[2])); // (14,8) - Common pve acuracy
arielRunes.push(null); // (14,9) - Vide
arielRunes.push(null); // (14,10) - Vide
arielRunes.push(null); // (14,11) - Vide
arielRunes.push(createArielRune(14, 12, "rare", rareStatsList[1])); // (14,12) - Rare boss attack & defense
arielRunes.push(createArielRune(14, 13, "common", commonStatsList[1])); // (14,13) - Common boss attack
arielRunes.push(createArielRune(14, 14, "unique", uniqueStatsList[0])); // (14,14) - Unique pve damage boost
