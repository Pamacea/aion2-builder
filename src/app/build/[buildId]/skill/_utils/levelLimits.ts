// Maximum level achievable through skill points (SP/STP)
// Even though abilities and passives have maxLevel 20, players can only level them to 10 via points
export const MAX_LEVEL_WITH_POINTS = 10;

// Get the effective max level for a skill type
export const getEffectiveMaxLevel = (
  skillType: "ability" | "passive" | "stigma",
  actualMaxLevel: number
): number => {
  // Abilities and passives are limited to 10 even if their maxLevel is 20
  if (skillType === "ability" || skillType === "passive") {
    return Math.min(MAX_LEVEL_WITH_POINTS, actualMaxLevel);
  }
  // Stigmas can use their full maxLevel
  return actualMaxLevel;
};

