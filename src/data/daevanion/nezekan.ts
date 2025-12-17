import { DaevanionRune } from "@/types/daevanion.type";

// Schéma Daevanion pour Nezekan basé sur l'image
// Grille 11x11 (index 0-based: lignes 0-10, colonnes 0-10)
// Le slotId est calculé comme: row * 11 + col + 1 (pour commencer à 1)
// Certains slots sont vides (null) - pas de rune à ces positions

export const nezekanRunes: (DaevanionRune | null)[] = [];

// Fonction helper pour créer une rune
const createRune = (
  row: number,
  col: number,
  rarity: "common" | "rare" | "legend" | "unique" | "start",
  stats: DaevanionRune["stats"] = {}
): DaevanionRune => {
  const slotId = row * 11 + col + 1;
  return {
    id: slotId,
    slotId,
    path: "nezekan",
    rarity: rarity === "start" ? "common" : rarity, // Start est traité comme common pour le type
    name: `Nezekan Rune ${slotId}`,
    description: `Rune ${slotId} du chemin Nezekan (${rarity})`,
    stats,
    position: { x: col, y: row },
    prerequisites: getPrerequisites(row, col),
  };
};

// Fonction pour déterminer les prérequis
// Les runes adjacentes au start peuvent être activées directement
// Les autres runes nécessitent qu'au moins une rune adjacente soit activée
const getPrerequisites = (row: number, col: number): number[] | undefined => {
  // Le nœud central (5,5) n'a pas de prérequis - c'est le point de départ
  if (row === 5 && col === 5) return undefined;
  
  // Les runes directement adjacentes au start (haut, bas, gauche, droite) n'ont pas de prérequis
  // Elles peuvent être activées directement depuis le start
  if (
    (row === 4 && col === 5) || // Haut du start
    (row === 6 && col === 5) || // Bas du start
    (row === 5 && col === 4) || // Gauche du start
    (row === 5 && col === 6)    // Droite du start
  ) {
    return undefined; // Pas de prérequis, peut être activée directement
  }
  
  // Pour les autres runes, elles nécessitent qu'au moins une rune adjacente soit activée
  const prereqs: number[] = [];
  
  // Les runes adjacentes (haut, bas, gauche, droite) sont des prérequis possibles
  if (row > 0) prereqs.push((row - 1) * 11 + col + 1); // Haut
  if (row < 10) prereqs.push((row + 1) * 11 + col + 1); // Bas
  if (col > 0) prereqs.push(row * 11 + (col - 1) + 1); // Gauche
  if (col < 10) prereqs.push(row * 11 + (col + 1) + 1); // Droite
  
  // Si c'est une rune au bord, elle peut avoir moins de prérequis
  return prereqs.length > 0 ? prereqs : undefined;
};

// Stats par défaut pour chaque type
const commonStats: DaevanionRune["stats"] = {
  mp: 50,
  maxHP: 100,
  criticalHit: 10,
  defense: 50,
  criticalHitResist: 5,
  attack: 5,
};

const rareStats: DaevanionRune["stats"] = {
  passiveLevelBoost: 1,
};

const legendStats: DaevanionRune["stats"] = {
  activeSkillLevelBoost: 1,
};

// Stats uniques (4 uniques selon le schéma)
const uniqueStatsList: DaevanionRune["stats"][] = [
  { cooldownReduction: 250 },      // (0,0) - Unique
  { combatSpeed: 250 },             // (0,10) - Unique
  { damageBoost: 500 },             // (10,0) - Unique
  { damageTolerance: 500 },         // (10,10) - Unique
];

// Grille 11x11 selon le schéma fourni ligne par ligne
// Ligne 1 (row 0): Unique common common vide rare common legend vide rare common unique
nezekanRunes.push(createRune(0, 0, "unique", uniqueStatsList[1])); // (0,0) - Unique
nezekanRunes.push(createRune(0, 1, "common", { attack: commonStats.attack })); // (0,1) - Common
nezekanRunes.push(createRune(0, 2, "common", {criticalHitResist: commonStats.criticalHitResist })); // (0,2) - Common
nezekanRunes.push(null); // (0,3) - Vide
nezekanRunes.push(createRune(0, 4, "rare", rareStats)); // (0,4) - Rare
nezekanRunes.push(createRune(0, 5, "common", {criticalHitResist: commonStats.criticalHitResist })); // (0,5) - Common
nezekanRunes.push(createRune(0, 6, "legend", legendStats)); // (0,6) - Legend
nezekanRunes.push(null); // (0,7) - Vide
nezekanRunes.push(createRune(0, 8, "rare", rareStats)); // (0,8) - Rare
nezekanRunes.push(createRune(0, 9, "common", {criticalHit: commonStats.criticalHit })); // (0,9) - Common
nezekanRunes.push(createRune(0, 10, "unique", uniqueStatsList[0])); // (0,10) - Unique

// Ligne 2 (row 1): common vide legend common common vide common common vide common
nezekanRunes.push(createRune(1, 0, "common", {criticalHit: commonStats.criticalHit })); // (1,0) - Common
nezekanRunes.push(null); // (1,1) - Vide
nezekanRunes.push(createRune(1, 2, "legend", legendStats)); // (1,2) - Legend
nezekanRunes.push(createRune(1, 3, "common", { mp: commonStats.mp })); // (1,3) - Common
nezekanRunes.push(createRune(1, 4, "common", { defense: commonStats.defense })); // (1,4) - Common
nezekanRunes.push(null); // (1,5) - Vide
nezekanRunes.push(createRune(1, 6, "common", {mp: commonStats.mp })); // (1,6) - Common
nezekanRunes.push(createRune(1, 7, "common", {defense: commonStats.defense })); // (1,7) - Common
nezekanRunes.push(createRune(1, 8, "common", {criticalHitResist: commonStats.criticalHitResist })); // (1,9) - Common
nezekanRunes.push(null); // (1,9) - Vide
nezekanRunes.push(createRune(1, 10, "common", {mp: commonStats.mp })); // (1,10) - Common

// Ligne 3 (row 2): rare common common vide common legend common vide legend common rare
nezekanRunes.push(createRune(2, 0, "rare", rareStats)); // (2,0) - Rare
nezekanRunes.push(createRune(2, 1, "common", {defense: commonStats.defense })); // (2,1) - Common
nezekanRunes.push(createRune(2, 2, "common", {maxHP: commonStats.maxHP })); // (2,2) - Common
nezekanRunes.push(null); // (2,3) - Vide
nezekanRunes.push(createRune(2, 4, "common", {criticalHit: commonStats.criticalHit })); // (2,4) - Common
nezekanRunes.push(createRune(2, 5, "legend", legendStats)); // (2,5) - Legend
nezekanRunes.push(createRune(2, 6, "common", {maxHP: commonStats.maxHP })); // (2,6) - Common
nezekanRunes.push(null); // (2,7) - Vide
nezekanRunes.push(createRune(2, 8, "legend", legendStats)); // (2,8) - Legend
nezekanRunes.push(createRune(2, 9, "common", {maxHP: commonStats.maxHP })); // (2,9) - Common
nezekanRunes.push(createRune(2, 10, "rare", rareStats)); // (2,10) - Rare

// Ligne 4 (row 3): vide common vide vide common vide common vide common vide common
nezekanRunes.push(null); // (3,0) - Vide
nezekanRunes.push(createRune(3, 1, "common", {maxHP: commonStats.maxHP })); // (3,1) - Common
nezekanRunes.push(null); // (3,2) - Vide
nezekanRunes.push(null); // (3,3) - Vide
nezekanRunes.push(createRune(3, 4, "common", {criticalHitResist: commonStats.criticalHitResist })); // (3,4) - Common
nezekanRunes.push(null); // (3,5) - Vide
nezekanRunes.push(createRune(3, 6, "common", {defense: commonStats.defense })); // (3,6) - Common
nezekanRunes.push(null); // (3,7) - Vide
nezekanRunes.push(createRune(3, 8, "common", {attack: commonStats.attack })); // (3,8) - Common
nezekanRunes.push(null); // (3,9) - Vide
nezekanRunes.push(createRune(3, 10, "common", {defense: commonStats.defense })); // (3,10) - Common

// Ligne 5 (row 4): common common legend common common common common rare common common common
nezekanRunes.push(createRune(4, 0, "common", {mp: commonStats.mp })); // (4,0) - Common
nezekanRunes.push(createRune(4, 1, "common", {attack: commonStats.attack })); // (4,1) - Common
nezekanRunes.push(createRune(4, 2, "legend", legendStats)); // (4,2) - Legend
nezekanRunes.push(createRune(4, 3, "common", {maxHP: commonStats.maxHP })); // (4,3) - Common
nezekanRunes.push(createRune(4, 4, "common", {mp: commonStats.mp })); // (4,4) - Common
nezekanRunes.push(createRune(4, 5, "common", {attack: commonStats.attack })); // (4,5) - Common (adjacent haut du start)
nezekanRunes.push(createRune(4, 6, "common", {criticalHitResist: commonStats.criticalHitResist })); // (4,6) - Common
nezekanRunes.push(createRune(4, 7, "rare", rareStats)); // (4,8) - Rare
nezekanRunes.push(createRune(4, 8, "common", {mp: commonStats.mp })); // (4,7) - Common
nezekanRunes.push(createRune(4, 9, "common", {criticalHit: commonStats.criticalHit })); // (4,9) - Common
nezekanRunes.push(createRune(4, 10, "common", {criticalHitResist: commonStats.criticalHitResist })); // (4,10) - Common

// Ligne 6 (row 5) - CENTRE avec nœud Start: legend vide vide common vide start vide common vide vide legend
nezekanRunes.push(createRune(5, 0, "legend", legendStats)); // (5,0) - Legend
nezekanRunes.push(null); // (5,1) - Vide
nezekanRunes.push(null); // (5,2) - Vide
nezekanRunes.push(createRune(5, 3, "common", {defense: commonStats.defense })); // (5,3) - Common
nezekanRunes.push(null); // (5,4) - Vide
// (5,5) - Nœud central START - AUCUNE STATS
nezekanRunes.push({
  id: 61,
  slotId: 61,
  path: "nezekan",
  rarity: "common",
  name: "Nezekan Start Node",
  description: "Nœud de départ du chemin Nezekan",
  stats: {}, // AUCUNE stats pour le start
  position: { x: 5, y: 5 },
  prerequisites: undefined, // Pas de prérequis pour le nœud de départ
});
nezekanRunes.push(createRune(5, 6, "common", {attack: commonStats.attack })); // (5,6) - Common (adjacent droite du start)
nezekanRunes.push(null); // (5,7) - Vide
nezekanRunes.push(null); // (5,8) - Vide
nezekanRunes.push(null); // (5,9) - Vide
nezekanRunes.push(createRune(5, 10, "legend", legendStats)); // (5,10) - Legend

// Ligne 7 (row 6): common common common rare common common common common legend common common
nezekanRunes.push(createRune(6, 0, "common", {criticalHit: commonStats.criticalHit })); // (6,0) - Common
nezekanRunes.push(createRune(6, 1, "common", {criticalHitResist: commonStats.criticalHitResist })); // (6,1) - Common
nezekanRunes.push(createRune(6, 2, "common", {maxHP: commonStats.maxHP })); // (6,2) - Common
nezekanRunes.push(createRune(6, 3, "rare", rareStats)); // (6,3) - Rare
nezekanRunes.push(createRune(6, 4, "common", {criticalHit: commonStats.criticalHit })); // (6,4) - Common (adjacent bas du start)
nezekanRunes.push(createRune(6, 5, "common", {defense: commonStats.defense })); // (6,5) - Common
nezekanRunes.push(createRune(6, 6, "common", {maxHP: commonStats.maxHP })); // (6,6) - Common
nezekanRunes.push(createRune(6, 7, "common", {mp: commonStats.mp })); // (6,7) - Common
nezekanRunes.push(createRune(6, 8, "legend", legendStats)); // (6,8) - Legend
nezekanRunes.push(createRune(6, 9, "common", {defense: commonStats.defense })); // (6,9) - Common
nezekanRunes.push(createRune(6, 10, "common", {maxHP: commonStats.maxHP })); // (6,10) - Common

// Ligne 8 (row 7): common vide common vide common vide common vide vide common vide
nezekanRunes.push(createRune(7, 0, "common", {attack: commonStats.attack })); // (7,0) - Common
nezekanRunes.push(null); // (7,1) - Vide
nezekanRunes.push(createRune(7, 2, "common", {defense: commonStats.defense })); // (7,2) - Common
nezekanRunes.push(null); // (7,3) - Vide
nezekanRunes.push(createRune(7, 4, "common", {attack: commonStats.attack })); // (7,4) - Common
nezekanRunes.push(null); // (7,5) - Vide
nezekanRunes.push(createRune(7, 6, "common", {criticalHit: commonStats.criticalHit })); // (7,6) - Common
nezekanRunes.push(null); // (7,7) - Vide
nezekanRunes.push(null); // (7,8) - Vide
nezekanRunes.push(createRune(7, 9, "common", {mp: commonStats.mp })); // (7,9) - Common
nezekanRunes.push(null); // (7,10) - Vide

// Ligne 9 (row 8): rare common legend vide common legend common vide common common rare
nezekanRunes.push(createRune(8, 0, "rare", rareStats)); // (8,0) - Rare
nezekanRunes.push(createRune(8, 1, "common", {mp: commonStats.mp })); // (8,1) - Common
nezekanRunes.push(createRune(8, 2, "legend", legendStats)); // (8,2) - Legend
nezekanRunes.push(null); // (8,3) - Vide
nezekanRunes.push(createRune(8, 4, "common", {mp: commonStats.mp })); // (8,4) - Common
nezekanRunes.push(createRune(8, 5, "legend", legendStats)); // (8,5) - Legend
nezekanRunes.push(createRune(8, 6, "common", {criticalHitResist: commonStats.criticalHitResist })); // (8,6) - Common
nezekanRunes.push(null); // (8,7) - Vide
nezekanRunes.push(createRune(8, 8, "common", {mp: commonStats.mp })); // (8,8) - Common
nezekanRunes.push(createRune(8, 9, "common", {attack: commonStats.attack })); // (8,9) - Common
nezekanRunes.push(createRune(8, 10, "rare", rareStats)); // (8,10) - Rare

// Ligne 10 (row 9): common vide common common c
// ommon vide common common legend vide common
nezekanRunes.push(createRune(9, 0, "common", {maxHP: commonStats.maxHP })); // (9,0) - Common
nezekanRunes.push(null); // (9,1) - Vide
nezekanRunes.push(createRune(9, 2, "common",  {criticalHit: commonStats.criticalHit})); // (9,2) - Common
nezekanRunes.push(createRune(9, 3, "common", {attack: commonStats.attack})); // (9,3) - Common
nezekanRunes.push(createRune(9, 4, "common", {maxHP: commonStats.maxHP})); // (9,4) - Common
nezekanRunes.push(null); // (9,5) - Vide
nezekanRunes.push(createRune(9, 6, "common", {attack: commonStats.attack})); // (9,6) - Common
nezekanRunes.push(createRune(9, 7, "common", {maxHP: commonStats.maxHP})); // (9,7) - Common
nezekanRunes.push(createRune(9, 8, "legend", legendStats)); // (9,8) - Legend
nezekanRunes.push(null); // (9,9) - Vide
nezekanRunes.push(createRune(9, 10, "common", {criticalHitResist: commonStats.criticalHitResist})); // (9,10) - Common

// Ligne 11 (row 10): Unique common rare vide legend common rare vide common common unique
nezekanRunes.push(createRune(10, 0, "unique", uniqueStatsList[0])); // (10,0) - Unique
nezekanRunes.push(createRune(10, 1, "common", {criticalHitResist: commonStats.criticalHitResist})); // (10,1) - Common
nezekanRunes.push(createRune(10, 2, "rare", rareStats)); // (10,2) - Rare
nezekanRunes.push(null); // (10,3) - Vide
nezekanRunes.push(createRune(10, 4, "legend", legendStats)); // (10,4) - Legend
nezekanRunes.push(createRune(10, 5, "common", {criticalHit: commonStats.criticalHit})); // (10,5) - Common
nezekanRunes.push(createRune(10, 6, "rare", rareStats)); // (10,6) - Rare
nezekanRunes.push(null); // (10,7) - Vide
nezekanRunes.push(createRune(10, 8, "common", {criticalHit: commonStats.criticalHit})); // (10,8) - Common
nezekanRunes.push(createRune(10, 9, "common", {defense: commonStats.defense})); // (10,9) - Common
nezekanRunes.push(createRune(10, 10, "unique", uniqueStatsList[1])); // (10,10) - Unique
