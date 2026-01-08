import type { AbilityData, PassiveData, StigmaData, SkillLevel } from '@/data/classes/types';

type SkillWithDataLevels = AbilityData | PassiveData | StigmaData;

export function getSkillLevel(
  skill: SkillWithDataLevels,
  characterLevel: number
): number | null {
  if (!skill.levels || skill.levels.length === 0) {
    return null;
  }

  const levelData = skill.levels.find(l => l.level === characterLevel);
  if (!levelData) {
    return null;
  }

  const minValue = levelData.minValue === 'FALSE' ? null : parseFloat(levelData.minValue || '0');
  const maxValue = levelData.maxValue === 'FALSE' ? null : parseFloat(levelData.maxValue || '0');

  if (minValue !== null && maxValue !== null) {
    return (minValue + maxValue) / 2;
  }

  return minValue || maxValue || null;
}

export function getSkillDamageRange(
  skill: SkillWithDataLevels,
  characterLevel: number
): { min: number | null; max: number | null } {
  if (!skill.levels || skill.levels.length === 0) {
    return {
      min: skill.damageMin || null,
      max: skill.damageMax || null,
    };
  }

  const levelData = skill.levels.find(l => l.level === characterLevel);
  if (!levelData) {
    return {
      min: skill.damageMin || null,
      max: skill.damageMax || null,
    };
  }

  const min = levelData.minValue === 'FALSE' ? null : parseFloat(levelData.minValue || '0');
  const max = levelData.maxValue === 'FALSE' ? null : parseFloat(levelData.maxValue || '0');

  return { min, max };
}

export function getAllSkillLevels(skill: SkillWithDataLevels): SkillLevel[] {
  return skill.levels || [];
}

export function getMaxSkillLevel(skill: SkillWithDataLevels): number {
  if (skill.maxLevel) {
    return skill.maxLevel;
  }

  if (skill.levels && skill.levels.length > 0) {
    return Math.max(...skill.levels.map(l => l.level));
  }

  return 1;
}
