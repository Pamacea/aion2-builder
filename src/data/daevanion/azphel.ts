import { createRune } from "@/lib/daevanionUtils";
import { DaevanionRune } from "@/types/daevanion.type";

/**
 * ============================================
 * SCHÉMA DAEVANION - AZPHEL
 * ============================================
 * 
 * Configuration de la grille Daevanion pour le chemin Azphel.
 * 
 * INFORMATIONS GÉNÉRALES:
 * - Grille: 15x15 (15 lignes × 15 colonnes)
 * - Index: 0-based (lignes 0-14, colonnes 0-14)
 * - Calcul slotId: row * 15 + col + 1
 * - Start Node: Position (7,7) - slotId 113
 * 
 * TYPES DE RUNES:
 * - Common (Gris): Stats de base (+50 MP, +100 HP, +10 Critical Hit, +50 Defense, +5 Critical Hit Resist, +5 Attack)
 * - Rare (Vert): Stats spéciales PvP (PvP Critical Hit/Resist, PvP Accuracy/Evasion, PvP Attack/Defense)
 * - Legend (Bleu): Stats spéciales Status (Status Effect Chance +100, Status Effect Resist +100)
 * - Unique (Orange): Stats spéciales (Cooldown Reduction, Combat Speed, Damage Boost, Damage Tolerance)
 * - Start (Blanc): Nœud de départ, aucune stats, toujours activé
 * 
 * NOTES IMPORTANTES:
 * - Les slots vides sont représentés par `null`
 * - EXCEPTION: Pour Azphel, les nodes Rare et Legend donnent des STATS au lieu d'augmenter des IDs
 * - Les nodes Rare peuvent avoir différentes combinaisons de stats
 * - Les nodes Legend donnent toujours Status Effect Chance +100 et Status Effect Resist +100
 */

export const azphelRunes: (DaevanionRune | null)[] = [];

/**
 * Helper pour créer une rune Azphel
 * Wrapper autour de createRune avec le path "azphel" et gridSize 15 par défaut
 */
const createAzphelRune = (
  row: number,
  col: number,
  rarity: "common" | "rare" | "legend" | "unique" | "start",
  statsOrId?: DaevanionRune["stats"] | number,
  abilityId?: number
): DaevanionRune => {
  return createRune(row, col, "azphel", rarity, statsOrId, abilityId, 15);
};

/**
 * Stats pour les nodes Common (Azphel)
 * Chaque node Common donne une de ces stats
 * NOTE: Les nodes Common d'Azphel donnent des stats PvP au lieu des stats de base standard
 */
const commonStatsList: DaevanionRune["stats"][] = [
  { pvpAttack: 5 },            // PvP Attack +5
  { pvpEvasion: 10 },          // PvP Evasion +10
  { pvpDefense: 50 },          // PvP Defense +50
  { pvpCriticalHit: 5 },       // PvP Critical Hit +5
  { maxHP: 100 },              // HP +100
  { pvpAccuracy: 10 },         // PvP Accuracy +10
  { pvpCriticalHitResist: 5 }, // PvP Critical Hit Resist +5
];

/**
 * Stats pour les nodes Legend (Azphel)
 * Chaque node Legend donne ces stats Status
 */
const legendStats: DaevanionRune["stats"] = {
  statusEffectChance: 100,
  statusEffectResist: 100,
};

/**
 * Stats pour les nodes Rare (Azphel)
 * Différentes combinaisons possibles
 */
const rareStatsList: DaevanionRune["stats"][] = [
  { pvpCriticalHit: 5, pvpCriticalHitResist: 5 },  // Option 1
  { pvpAccuracy: 10, pvpEvasion: 10 },              // Option 2
  { pvpAttack: 5, pvpDefense: 50 },                 // Option 3
];

/**
 * Stats pour les nodes Unique
 * Chaque node Unique donne une stat spéciale unique
 */
const uniqueStatsList: DaevanionRune["stats"][] = [
  { pvpDamageBoost: 250 },
  { pvpDamageTolerance: 250 },
];

/**
 * ============================================
 * PLACEMENT DES RUNES - LIGNE PAR LIGNE
 * ============================================
 * 
 * Chaque ligne représente une rangée de la grille 15x15.
 * Format: (row, col) - Type - Description
 */

// Ligne 1 (row 0): unique commun commun legend vide rare commun unique vide rare commun legend commun commun unique
azphelRunes.push(createAzphelRune(0, 0, "unique", uniqueStatsList[1])); // (0,0) - Unique pvp damage tolerance
azphelRunes.push(createAzphelRune(0, 1, "common", commonStatsList[0])); // (0,1) - Common pvp attack
azphelRunes.push(createAzphelRune(0, 2, "common", commonStatsList[2])); // (0,2) - Common pvp defense
azphelRunes.push(createAzphelRune(0, 3, "legend", legendStats)); // (0,3) - Legend status effect chance
azphelRunes.push(null); // (0,4) - Vide
azphelRunes.push(createAzphelRune(0, 5, "rare", rareStatsList[0])); // (0,5) - Rare pvp crithit & crit resist
azphelRunes.push(createAzphelRune(0, 6, "common", commonStatsList[5])); // (0,6) - Common pvp acuracy
azphelRunes.push(createAzphelRune(0, 7, "unique", uniqueStatsList[1])); // (0,7) - Unique pvp damage tolerance
azphelRunes.push(null); // (0,8) - Vide
azphelRunes.push(createAzphelRune(0, 9, "rare", rareStatsList[0])); // (0,9) - Rare pvp crithit & crit resist
azphelRunes.push(createAzphelRune(0, 10, "common", commonStatsList[1])); // (0,10) - Common pvp evasion
azphelRunes.push(createAzphelRune(0, 11, "legend", legendStats)); // (0,11) - Legend status effect resist
azphelRunes.push(createAzphelRune(0, 12, "common", commonStatsList[6])); // (0,12) - Common pvp crit resist
azphelRunes.push(createAzphelRune(0, 13, "common", commonStatsList[0])); // (0,13) - Common pvp attack
azphelRunes.push(createAzphelRune(0, 14, "unique", uniqueStatsList[0])); // (0,14) - Unique pvp damage boost

// Ligne 2 (row 1): commun vide vide commun commun commun vide commun vide commun vide vide commun vide commun
azphelRunes.push(createAzphelRune(1, 0, "common", commonStatsList[3])); // (1,0) - Common pvp crit hit
azphelRunes.push(null); // (1,1) - Vide
azphelRunes.push(null); // (1,2) - Vide
azphelRunes.push(createAzphelRune(1, 3, "common", commonStatsList[1])); // (1,3) - Common pvp evasion
azphelRunes.push(createAzphelRune(1, 4, "common", commonStatsList[0])); // (1,4) - Common pvp attack
azphelRunes.push(createAzphelRune(1, 5, "common", commonStatsList[2])); // (1,5) - Common pvp defense
azphelRunes.push(null); // (1,6) - Vide
azphelRunes.push(createAzphelRune(1, 7, "common", commonStatsList[1])); // (1,7) - Common pvp evasion
azphelRunes.push(null); // (1,8) - Vide
azphelRunes.push(createAzphelRune(1, 9, "common", commonStatsList[5])); // (1,9) - Common pvp acuracy
azphelRunes.push(null); // (1,10) - Vide
azphelRunes.push(null); // (1,11) - Vide
azphelRunes.push(createAzphelRune(1, 12, "common", commonStatsList[2])); // (1,12) - Common pvp defense
azphelRunes.push(null); // (1,13) - Vide
azphelRunes.push(createAzphelRune(1, 14, "common", commonStatsList[5])); // (1,14) - Common pvp acuracy

// Ligne 3 (row 2): rare commun commun rare vide commun rare commun commun legend commun commun rare commun rare
azphelRunes.push(createAzphelRune(2, 0, "rare", rareStatsList[1])); // (2,0) - Rare pvp acuracy & evasion
azphelRunes.push(createAzphelRune(2, 1, "common", commonStatsList[6])); // (2,1) - Common pvp crit hit resist
azphelRunes.push(createAzphelRune(2, 2, "common", commonStatsList[5])); // (2,2) - Common pvp acuracy
azphelRunes.push(createAzphelRune(2, 3, "rare", rareStatsList[2])); // (2,3) - Rare pvp attack & defense
azphelRunes.push(null); // (2,4) - Vide
azphelRunes.push(createAzphelRune(2, 5, "common", commonStatsList[6])); // (2,5) - Common pvp crit resist
azphelRunes.push(createAzphelRune(2, 6, "rare", rareStatsList[1])); // (2,6) - Rare pvp acuracy & evasion
azphelRunes.push(createAzphelRune(2, 7, "common", commonStatsList[4])); // (2,7) - Common mp
azphelRunes.push(createAzphelRune(2, 8, "common", commonStatsList[2])); // (2,8) - Common pvp defense
azphelRunes.push(createAzphelRune(2, 9, "legend", legendStats)); // (2,9) - Legend status effect chance
azphelRunes.push(createAzphelRune(2, 10, "common", commonStatsList[3])); // (2,10) - Common pvp crit hit
azphelRunes.push(createAzphelRune(2, 11, "common", commonStatsList[4])); // (2,11) - Common hp
azphelRunes.push(createAzphelRune(2, 12, "rare", rareStatsList[1])); // (2,12) - Rare pvp acuracy & evasion
azphelRunes.push(createAzphelRune(2, 13, "common", commonStatsList[3])); // (2,13) - Common pvp crit hit
azphelRunes.push(createAzphelRune(2, 14, "rare", rareStatsList[2])); // (2,14) - Rare pvp attack & defense

// Ligne 4 (row 3): vide vide commun vide vide vide commun vide commun vide commun vide commun vide vide
azphelRunes.push(null); // (3,0) - Vide
azphelRunes.push(null); // (3,1) - Vide
azphelRunes.push(createAzphelRune(3, 2, "common", commonStatsList[2])); // (3,2) - Common pvp defense
azphelRunes.push(null); // (3,3) - Vide
azphelRunes.push(null); // (3,4) - Vide
azphelRunes.push(null); // (3,5) - Vide
azphelRunes.push(createAzphelRune(3, 6, "common", commonStatsList[3])); // (3,6) - Common pvp crit hit
azphelRunes.push(null); // (3,7) - Vide
azphelRunes.push(createAzphelRune(3, 8, "common", commonStatsList[1])); // (3,8) - Common pvp evasion
azphelRunes.push(null); // (3,9) - Vide
azphelRunes.push(createAzphelRune(3, 10, "common", commonStatsList[0])); // (3,10) - Common pvp attack
azphelRunes.push(null); // (3,11) - Vide
azphelRunes.push(createAzphelRune(3, 12, "common", commonStatsList[6])); // (3,12) - Common pvp crit hit resist
azphelRunes.push(null); // (3,13) - Vide
azphelRunes.push(null); // (3,14) - Vide

// Ligne 5 (row 4): legend commun commun vide legend commun commun legend commun rare commun commun legend vide vide
azphelRunes.push(createAzphelRune(4, 0, "legend", legendStats)); // (4,0) - Legend status effect chance
azphelRunes.push(createAzphelRune(4, 1, "common", commonStatsList[0])); // (4,1) - Common pvp attack
azphelRunes.push(createAzphelRune(4, 2, "common", commonStatsList[1])); // (4,2) - Common pvp evasion
azphelRunes.push(null); // (4,3) - Vide
azphelRunes.push(createAzphelRune(4, 4, "legend", legendStats)); // (4,4) - Legend status effect resist
azphelRunes.push(createAzphelRune(4, 5, "common", commonStatsList[6])); // (4,5) - Common pvp crit resist
azphelRunes.push(createAzphelRune(4, 6, "common", commonStatsList[2])); // (4,6) - Common pvp defense
azphelRunes.push(createAzphelRune(4, 7, "legend", legendStats)); // (4,7) - Legend status effect chance
azphelRunes.push(createAzphelRune(4, 8, "common", commonStatsList[6])); // (4,8) - Common pvp crit hit resist
azphelRunes.push(createAzphelRune(4, 9, "rare", rareStatsList[2])); // (4,9) - Rare pvp attack & defense
azphelRunes.push(createAzphelRune(4, 10, "common", commonStatsList[1])); // (4,10) - Common pvp evasion
azphelRunes.push(createAzphelRune(4, 11, "common", commonStatsList[2])); // (4,11) - Common pvp defense
azphelRunes.push(createAzphelRune(4, 12, "legend", legendStats)); // (4,12) - Legend status effect resist
azphelRunes.push(null); // (4,13) - Vide
azphelRunes.push(null); // (4,14) - Vide

// Ligne 6 (row 5): commun vide rare commun commun vide commun vide vide commun vide vide commun commun rare
azphelRunes.push(createAzphelRune(5, 0, "common", commonStatsList[4])); // (5,0) - Common pvp crit hit resist
azphelRunes.push(null); // (5,1) - Vide
azphelRunes.push(createAzphelRune(5, 2, "rare", rareStatsList[2])); // (5,2) - Rare pvp crit hit & crit resist
azphelRunes.push(createAzphelRune(5, 3, "common", commonStatsList[2])); // (5,3) - Common pvp acuracy
azphelRunes.push(createAzphelRune(5, 4, "common", commonStatsList[4])); // (5,4) - Common pvp crit hit
azphelRunes.push(null); // (5,5) - Vide
azphelRunes.push(createAzphelRune(5, 6, "common", commonStatsList[0])); // (5,6) - Common pvp acuracy
azphelRunes.push(null); // (5,7) - Vide
azphelRunes.push(null); // (5,8) - Vide
azphelRunes.push(createAzphelRune(5, 9, "common", commonStatsList[3])); // (5,9) - Common pvp acuracy 
azphelRunes.push(null); // (5,10) - Vide
azphelRunes.push(null); // (5,11) - Vide
azphelRunes.push(createAzphelRune(5, 12, "common", commonStatsList[6])); // (5,12) - Common pvp crit hit
azphelRunes.push(createAzphelRune(5, 13, "common", commonStatsList[4])); // (5,13) - Common pvp acuracy
azphelRunes.push(createAzphelRune(5, 14, "rare", rareStatsList[0])); // (5,14) - Rare pvp crit hit & crit resist

// Ligne 7 (row 6): commun vide vide vide commun commun rare commun commun legend commun commun rare vide commun
azphelRunes.push(createAzphelRune(6, 0, "common", commonStatsList[3])); // (6,0) - Common pvp crit hit
azphelRunes.push(null); // (6,1) - Vide
azphelRunes.push(null); // (6,2) - Vide
azphelRunes.push(null); // (6,3) - Vide
azphelRunes.push(createAzphelRune(6, 4, "common", commonStatsList[0])); // (6,4) - Common pvp attack
azphelRunes.push(createAzphelRune(6, 5, "common", commonStatsList[1])); // (6,5) - Common pvp evasion
azphelRunes.push(createAzphelRune(6, 6, "rare", rareStatsList[2])); // (6,6) - Rare pvp attack & defense
azphelRunes.push(createAzphelRune(6, 7, "common", commonStatsList[4])); // (6,7) - Common hp
azphelRunes.push(createAzphelRune(6, 8, "common", commonStatsList[0])); // (6,8) - Common pvp attack
azphelRunes.push(createAzphelRune(6, 9, "legend", legendStats)); // (6,9) - Legend status effect resist
azphelRunes.push(createAzphelRune(6, 10, "common", commonStatsList[2])); // (6,10) - Common pvp defense
azphelRunes.push(createAzphelRune(6, 11, "common", commonStatsList[4])); // (6,11) - Common mp
azphelRunes.push(createAzphelRune(6, 12, "rare", rareStatsList[1])); // (6,12) - Rare pvp acuracy & evasion
azphelRunes.push(null); // (6,13) - Vide
azphelRunes.push(createAzphelRune(6, 14, "common", commonStatsList[1])); // (6,14) - Common pvp evasion

// Ligne 8 (row 7): unique commun commun vide vide commun vide START vide commun vide vide commun commun unique
azphelRunes.push(createAzphelRune(7, 0, "unique", uniqueStatsList[0])); // (7,0) - Unique pvp damage boost
azphelRunes.push(createAzphelRune(7, 1, "common", commonStatsList[0])); // (7,1) - Common pvp attack
azphelRunes.push(createAzphelRune(7, 2, "common", commonStatsList[6])); // (7,2) - Common pvp crit hit resist
azphelRunes.push(null); // (7,3) - Vide
azphelRunes.push(null); // (7,4) - Vide
azphelRunes.push(createAzphelRune(7, 5, "common", commonStatsList[3])); // (7,5) - Common pvp crithit 
azphelRunes.push(null); // (7,6) - Vide
// (7,7) - Nœud central START - Position centrale de la grille 15x15
// IMPORTANT: Ce nœud est toujours activé par défaut et ne peut pas être désactivé
// Calcul slotId: 7 * 15 + 7 + 1 = 105 + 7 + 1 = 113
azphelRunes.push({
  id: 113,
  slotId: 113,
  path: "azphel",
  rarity: "common",
  name: "Azphel Start Node",
  description: "Nœud de départ du chemin Azphel",
  stats: {}, // AUCUNE stats pour le start node
  position: { x: 7, y: 7 },
  prerequisites: undefined, // Pas de prérequis pour le nœud de départ
});
azphelRunes.push(null); // (7,8) - Vide
azphelRunes.push(createAzphelRune(7, 9, "common", commonStatsList[3])); // (7,9) - Common pvp crit hit
azphelRunes.push(null); // (7,10) - Vide
azphelRunes.push(null); // (7,11) - Vide
azphelRunes.push(createAzphelRune(7, 12, "common", commonStatsList[6])); // (7,12) - Common pvp crit resist
azphelRunes.push(createAzphelRune(7, 13, "common", commonStatsList[0])); // (7,13) - Common pvp attack
azphelRunes.push(createAzphelRune(7, 14, "unique", uniqueStatsList[0])); // (7,14) - Unique pvp damage boost

// Ligne 9 (row 8): commun vide rare commun commun legend commun commun rare commun commun vide vide vide commun
azphelRunes.push(createAzphelRune(8, 0, "common", commonStatsList[0])); // (8,0) - Common
azphelRunes.push(null); // (8,1) - Vide
azphelRunes.push(createAzphelRune(8, 2, "rare", rareStatsList[1])); // (8,2) - Rare pvp evasion
azphelRunes.push(createAzphelRune(8, 3, "common", commonStatsList[5])); // (8,3) - Common pvp acuracy & evasion
azphelRunes.push(createAzphelRune(8, 4, "common", commonStatsList[4])); // (8,4) - Common hp 
azphelRunes.push(createAzphelRune(8, 5, "legend", legendStats)); // (8,5) - Legend status effect resist
azphelRunes.push(createAzphelRune(8, 6, "common", commonStatsList[0])); // (8,6) - Common pvp attack
azphelRunes.push(createAzphelRune(8, 7, "common", commonStatsList[4])); // (8,7) - Common mp
azphelRunes.push(createAzphelRune(8, 8, "rare", rareStatsList[0])); // (8,8) - Rare pvp crithit & crit resist
azphelRunes.push(createAzphelRune(8, 9, "common", commonStatsList[1])); // (8,9) - Common pvp evasion
azphelRunes.push(createAzphelRune(8, 10, "common", commonStatsList[0])); // (8,10) - Common pvp attack
azphelRunes.push(null); // (8,11) - Vide
azphelRunes.push(null); // (8,12) - Vide
azphelRunes.push(null); // (8,13) - Vide
azphelRunes.push(createAzphelRune(8, 14, "common", commonStatsList[3])); // (8,14) - Common pvp crit hit

// Ligne 10 (row 9): rare commun commun vide vide commun vide vide commun vide commun commun rare vide commun
azphelRunes.push(createAzphelRune(9, 0, "rare", rareStatsList[0])); // (9,0) - Rare  pvp crithit & crit resist
azphelRunes.push(createAzphelRune(9, 1, "common", commonStatsList[5])); // (9,1) - Common pvp acurcacy
azphelRunes.push(createAzphelRune(9, 2, "common", commonStatsList[3])); // (9,2) - Common pvp crit hit
azphelRunes.push(null); // (9,3) - Vide
azphelRunes.push(null); // (9,4) - Vide
azphelRunes.push(createAzphelRune(9, 5, "common", commonStatsList[5])); // (9,5) - Common pvp acuracy
azphelRunes.push(null); // (9,6) - Vide
azphelRunes.push(null); // (9,7) - Vide
azphelRunes.push(createAzphelRune(9, 8, "common", commonStatsList[5])); // (9,8) - Common pvp acuracy
azphelRunes.push(null); // (9,9) - Vide
azphelRunes.push(createAzphelRune(9, 10, "common", commonStatsList[3])); // (9,10) - Common pvp crit hit
azphelRunes.push(createAzphelRune(9, 11, "common", commonStatsList[5])); // (9,11) - Common pvp acuracy
azphelRunes.push(createAzphelRune(9, 12, "rare", rareStatsList[2])); // (9,12) - Rare pvp attack & defense
azphelRunes.push(null); // (9,13) - Vide
azphelRunes.push(createAzphelRune(9, 14, "common", commonStatsList[6])); // (9,14) - Common pvp crit hit resist 

// Ligne 11 (row 10): vide vide legend commun commun rare commun legend commun commun legend vide commun commun legend
azphelRunes.push(null); // (10,0) - Vide
azphelRunes.push(null); // (10,1) - Vide
azphelRunes.push(createAzphelRune(10, 2, "legend", legendStats)); // (10,2) - Legend status effect resist
azphelRunes.push(createAzphelRune(10, 3, "common", commonStatsList[2])); // (10,3) - Common pvp defense
azphelRunes.push(createAzphelRune(10, 4, "common", commonStatsList[1])); // (10,4) - Common pvp evasion
azphelRunes.push(createAzphelRune(10, 5, "rare", rareStatsList[2])); // (10,5) - Rare pvp attack & defense
azphelRunes.push(createAzphelRune(10, 6, "common", commonStatsList[6])); // (10,6) - Common pvp crit hit resist
azphelRunes.push(createAzphelRune(10, 7, "legend", legendStats)); // (10,7) - Legend status effect chance
azphelRunes.push(createAzphelRune(10, 8, "common", commonStatsList[2])); // (10,8) - Common pvp defense
azphelRunes.push(createAzphelRune(10, 9, "common", commonStatsList[6])); // (10,9) - Common pvp crit hit resist
azphelRunes.push(createAzphelRune(10, 10, "legend", legendStats)); // (10,10) - Legend status effect resist
azphelRunes.push(null); // (10,11) - Vide
azphelRunes.push(createAzphelRune(10, 12, "common", commonStatsList[1])); // (10,12) - Common pvp evasion
azphelRunes.push(createAzphelRune(10, 13, "common", commonStatsList[0])); // (10,13) - Common pvp attack
azphelRunes.push(createAzphelRune(10, 14, "legend", legendStats)); // (10,14) - Legend status effect chance

// Ligne 12 (row 11): vide vide commun vide commun vide commun vide commun vide vide vide commun vide vide
azphelRunes.push(null); // (11,0) - Vide
azphelRunes.push(null); // (11,1) - Vide
azphelRunes.push(createAzphelRune(11, 2, "common", commonStatsList[6])); // (11,2) - Common pvp crit hit resist
azphelRunes.push(null); // (11,3) - Vide
azphelRunes.push(createAzphelRune(11, 4, "common", commonStatsList[0])); // (11,4) - Common pvp attack
azphelRunes.push(null); // (11,5) - Vide
azphelRunes.push(createAzphelRune(11, 6, "common", commonStatsList[1])); // (11,6) - Common pvp evasion
azphelRunes.push(null); // (11,7) - Vide
azphelRunes.push(createAzphelRune(11, 8, "common", commonStatsList[3])); // (11,8) - Common pvp crit hit
azphelRunes.push(null); // (11,9) - Vide
azphelRunes.push(null); // (11,10) - Vide
azphelRunes.push(null); // (11,11) - Vide
azphelRunes.push(createAzphelRune(11, 12, "common", commonStatsList[2])); // (11,12) - Common pvp defense
azphelRunes.push(null); // (11,13) - Vide
azphelRunes.push(null); // (11,14) - Vide

// Ligne 13 (row 12): rare commun rare commun commun legend commun commun rare commun vide rare commun commun rare
azphelRunes.push(createAzphelRune(12, 0, "rare", rareStatsList[2])); // (12,0) - Rare pvp attack & defense
azphelRunes.push(createAzphelRune(12, 1, "common", commonStatsList[3])); // (12,1) - Common pvp crit hit
azphelRunes.push(createAzphelRune(12, 2, "rare", rareStatsList[1])); // (12,2) - Rare pvp acuracy & evasion
azphelRunes.push(createAzphelRune(12, 3, "common", commonStatsList[4])); // (12,3) - Common mp
azphelRunes.push(createAzphelRune(12, 4, "common", commonStatsList[3])); // (12,4) - Common pvp crit hit
azphelRunes.push(createAzphelRune(12, 5, "legend", legendStats)); // (12,5) - Legend status effect chance
azphelRunes.push(createAzphelRune(12, 6, "common", commonStatsList[2])); // (12,6) - Common pvp defense
azphelRunes.push(createAzphelRune(12, 7, "common", commonStatsList[4])); // (12,7) - Common hp
azphelRunes.push(createAzphelRune(12, 8, "rare", rareStatsList[1])); // (12,8) - Rare pvp acuracy & evasion
azphelRunes.push(createAzphelRune(12, 9, "common", commonStatsList[6])); // (12,9) - Common pvp crit hit resist
azphelRunes.push(null); // (12,10) - Vide
azphelRunes.push(createAzphelRune(12, 11, "rare", rareStatsList[0])); // (12,11) - Rare pvp crithit & crit resist
azphelRunes.push(createAzphelRune(12, 12, "common", commonStatsList[5])); // (12,12) - Common pvp acuracy
azphelRunes.push(createAzphelRune(12, 13, "common", commonStatsList[6])); // (12,13) - Common pvp crit hit resist
azphelRunes.push(createAzphelRune(12, 14, "rare", rareStatsList[1])); // (12,14) - Rare pvp acuracy & evasion

// Ligne 14 (row 13): commun vide commun vide vide commun vide commun vide commun commun commun vide vide commun
azphelRunes.push(createAzphelRune(13, 0, "common", commonStatsList[5])); // (13,0) - Common pvp acuracy
azphelRunes.push(null); // (13,1) - Vide
azphelRunes.push(createAzphelRune(13, 2, "common", commonStatsList[2])); // (13,2) - Common pvp defense
azphelRunes.push(null); // (13,3) - Vide
azphelRunes.push(null); // (13,4) - Vide
azphelRunes.push(createAzphelRune(13, 5, "common", commonStatsList[5])); // (13,5) - Common pvp acuracy
azphelRunes.push(null); // (13,6) - Vide
azphelRunes.push(createAzphelRune(13, 7, "common", commonStatsList[1])); // (13,7) - Common pvp evasion 
azphelRunes.push(null); // (13,8) - Vide
azphelRunes.push(createAzphelRune(13, 9, "common", commonStatsList[2])); // (13,9) - Common pvp defense
azphelRunes.push(createAzphelRune(13, 10, "common", commonStatsList[0])); // (13,10) - Common pvp attack
azphelRunes.push(createAzphelRune(13, 11, "common", commonStatsList[1])); // (13,11) - Common pvp evasion
azphelRunes.push(null); // (13,12) - Vide
azphelRunes.push(null); // (13,13) - Vide
azphelRunes.push(createAzphelRune(13, 14, "common", commonStatsList[3])); // (13,14) - Common pvp crit hit

// Ligne 15 (row 14): unique commun commun legend commun rare vide unique commun rare vide legend commun commun unique
azphelRunes.push(createAzphelRune(14, 0, "unique", uniqueStatsList[0])); // (14,0) - Unique pvp damage boost  
azphelRunes.push(createAzphelRune(14, 1, "common", commonStatsList[0])); // (14,1) - Common  pvp attack
azphelRunes.push(createAzphelRune(14, 2, "common", commonStatsList[6])); // (14,2) - Common pvp crit hit resist
azphelRunes.push(createAzphelRune(14, 3, "legend", legendStats)); // (14,3) - Legend status effect resist
azphelRunes.push(createAzphelRune(14, 4, "common", commonStatsList[1])); // (14,4) - Common pvp evasion
azphelRunes.push(createAzphelRune(14, 5, "rare", rareStatsList[0])); // (14,5) - Rare pvp crit hit & crit resist
azphelRunes.push(null); // (14,6) - Vide
azphelRunes.push(createAzphelRune(14, 7, "unique", uniqueStatsList[1])); // (14,7) - Unique pvp damage tolerance
azphelRunes.push(createAzphelRune(14, 8, "common", commonStatsList[5])); // (14,8) - Common pvp acuracy
azphelRunes.push(createAzphelRune(14, 9, "rare", rareStatsList[2])); // (14,9) - Rare pvp attack & defense
azphelRunes.push(null); // (14,10) - Vide
azphelRunes.push(createAzphelRune(14, 11, "legend", legendStats)); // (14,11) - Legend status effect chance
azphelRunes.push(createAzphelRune(14, 12, "common", commonStatsList[2])); // (14,12) - Common pvp defense
azphelRunes.push(createAzphelRune(14, 13, "common", commonStatsList[0])); // (14,13) - Common pvp attack
azphelRunes.push(createAzphelRune(14, 14, "unique", uniqueStatsList[1])); // (14,14) - Unique pvp damage tolerance
