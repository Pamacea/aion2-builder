import type { AbilityData, PassiveData, StigmaData } from '@/data/classes/types';

type SkillWithDataLevels = AbilityData | PassiveData | StigmaData;

export function parseSkillDescription(
  skill: SkillWithDataLevels,
  characterLevel: number = 1
): string {
  let description = skill.description || '';

  if (!skill.levels || skill.levels.length === 0) {
    return description;
  }

  const levelData = skill.levels.find(l => l.level === characterLevel);
  if (!levelData) {
    return description;
  }

  description = description.replace(/\{se_dmg:[^:]+:SkillUIMinDmg[^\}]*\}/g, () => {
    const val = levelData.minValue;
    return val && val !== 'FALSE' ? val : '[value]';
  });

  description = description.replace(/\{se_dmg:[^:]+:SkillUIMaxDmg[^\}]*\}/g, () => {
    const val = levelData.maxValue;
    return val && val !== 'FALSE' ? val : '[value]';
  });

  description = description.replace(/\{se:[^:]+:[^:]+:effect_value\d+[^\}]*\}/g, (match) => {
    const timeMatch = match.match(/time/);
    return timeMatch ? match : '[value]';
  });

  description = description.replace(/\{abe:[^:]+:[^:]+:[^:]+\}/g, '[value]');
  description = description.replace(/\{se_abe:[^:]+:[^:]+:[^:]+\}/g, '[value]');
  description = description.replace(/\{[^}]+\}/g, '[value]');

  description = description.replace(/<span[^>]*>/g, '');
  description = description.replace(/<\/span>/g, '');

  description = description.replace(/&quot;/g, '"');
  description = description.replace(/&nbsp;/g, ' ');

  return description.trim();
}

export function formatSkillDescription(skill: SkillWithDataLevels, level: number): string {
  const parsed = parseSkillDescription(skill, level);

  const damageRange = getSkillDamageRange(skill, level);
  if (damageRange.min !== null && damageRange.max !== null) {
    const damageText = damageRange.min === damageRange.max
      ? `${damageRange.min}`
      : `${damageRange.min}-${damageRange.max}`;

    return parsed.replace(/\[value\]/g, damageText);
  }

  return parsed.replace(/\[value\]/g, '???');
}

function getSkillDamageRange(skill: SkillWithDataLevels, characterLevel: number) {
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

export function getSkillLevelDescription(skill: SkillWithDataLevels, level: number): string {
  const baseDesc = formatSkillDescription(skill, level);
  const parts = [baseDesc];

  if (skill.manaCost && skill.manaCost !== 0) {
    parts.push(skill.manaCost > 0 ? `Costs ${skill.manaCost} MP` : `Restores ${Math.abs(skill.manaCost)} MP`);
  }

  if (skill.cooldown && skill.cooldown !== 'Instant Cast') {
    parts.push(`Cooldown: ${skill.cooldown}`);
  }

  if (skill.range) {
    parts.push(`Range: ${skill.range}m`);
  }

  if (skill.staggerDamage) {
    parts.push(`${skill.staggerDamage} Stagger Damage`);
  }

  return parts.filter(Boolean).join('\n') + '\n';
}
