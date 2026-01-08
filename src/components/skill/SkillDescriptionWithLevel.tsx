'use client';

import { useMemo } from 'react';
import type { AbilityData, PassiveData, StigmaData } from '@/data/classes/types';
import { parseSkillDescription, formatSkillDescription, getSkillLevelDescription } from '@/utils/skillDescriptionUtils';

type SkillWithDataLevels = AbilityData | PassiveData | StigmaData;

interface SkillDescriptionWithLevelProps {
  skill: SkillWithDataLevels;
  level: number;
  showRaw?: boolean;
  className?: string;
}

export function SkillDescriptionWithLevel({
  skill,
  level,
  showRaw = false,
  className = ''
}: SkillDescriptionWithLevelProps) {
  const parsedDescription = useMemo(() => {
    return formatSkillDescription(skill, level);
  }, [skill, level]);

  const levelDescription = useMemo(() => {
    return getSkillLevelDescription(skill, level);
  }, [skill, level]);

  const damageRange = useMemo(() => {
    if (!skill.levels || skill.levels.length === 0) {
      return {
        min: skill.damageMin || null,
        max: skill.damageMax || null,
      };
    }

    const levelData = skill.levels.find((l) => l.level === level);
    if (!levelData) {
      return {
        min: skill.damageMin || null,
        max: skill.damageMax || null,
      };
    }

    const min = levelData.minValue === 'FALSE' ? null : parseFloat(levelData.minValue || '0');
    const max = levelData.maxValue === 'FALSE' ? null : parseFloat(levelData.maxValue || '0');

    return { min, max };
  }, [skill, level]);

  return (
    <div className={`skill-description ${className}`}>
      <div className="skill-description-text whitespace-pre-wrap">{levelDescription}</div>

      {damageRange.min !== null && damageRange.max !== null && (
        <div className="skill-damage-range mt-2 text-sm font-semibold text-orange-400">
          Damage: {damageRange.min === damageRange.max ? damageRange.min : `${damageRange.min} - ${damageRange.max}`}
        </div>
      )}

      {skill.levels && skill.levels.length > 0 && (
        <div className="skill-level-info mt-2 text-xs text-gray-400">
          Level {level} of {skill.maxLevel || skill.levels.length}
        </div>
      )}

      {showRaw && (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-300">
            Raw Description
          </summary>
          <pre className="mt-1 text-xs bg-gray-800 p-2 rounded overflow-x-auto">
            {skill.description}
          </pre>
        </details>
      )}
    </div>
  );
}
