'use client';

import { useMemo } from 'react';
import type { AbilityData, PassiveData, StigmaData } from '@/data/classes/types';

type SkillWithDataLevels = AbilityData | PassiveData | StigmaData;

interface SkillLevelsTableProps {
  skill: SkillWithDataLevels;
  currentLevel?: number;
  className?: string;
}

export function SkillLevelsTable({ skill, currentLevel, className = '' }: SkillLevelsTableProps) {
  const levels = useMemo(() => {
    if (!skill.levels || skill.levels.length === 0) {
      return null;
    }

    return skill.levels
      .filter((l, i, arr) => arr.findIndex(l2 => l2.level === l.level) === i)
      .sort((a, b) => a.level - b.level);
  }, [skill.levels]);

  if (!levels || levels.length === 0) {
    return (
      <div className={`text-sm text-gray-400 ${className}`}>
        No level data available for this skill.
      </div>
    );
  }

  return (
    <div className={`skill-levels-table ${className}`}>
      <h3 className="text-lg font-bold mb-3">Skill Progression</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-2 px-3">Level</th>
              <th className="text-left py-2 px-3">Min Value</th>
              <th className="text-left py-2 px-3">Max Value</th>
              {currentLevel && levels.find(l => l.level === currentLevel) && (
                <th className="text-left py-2 px-3">Status</th>
              )}
            </tr>
          </thead>
          <tbody>
            {levels.map((levelData) => {
              const isCurrentLevel = levelData.level === currentLevel;
              const minValue = levelData.minValue === 'FALSE' ? 'N/A' : levelData.minValue || 'N/A';
              const maxValue = levelData.maxValue === 'FALSE' ? 'N/A' : levelData.maxValue || 'N/A';

              return (
                <tr
                  key={levelData.level}
                  className={`border-b border-gray-800 ${
                    isCurrentLevel ? 'bg-blue-900/30 font-semibold' : ''
                  }`}
                >
                  <td className="py-2 px-3">{levelData.level}</td>
                  <td className="py-2 px-3 text-orange-400">{minValue}</td>
                  <td className="py-2 px-3 text-orange-400">{maxValue}</td>
                  {currentLevel && (
                    <td className="py-2 px-3">
                      {isCurrentLevel && (
                        <span className="text-xs bg-blue-600 px-2 py-1 rounded">Current</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {skill.damageMinModifiers && skill.damageMinModifiers.length > 0 && (
        <div className="mt-4 p-3 bg-gray-800 rounded">
          <p className="text-xs text-gray-400 mb-2">Damage Modifiers (per level):</p>
          <div className="flex flex-wrap gap-1">
            {skill.damageMinModifiers.map((modifier, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-700 px-2 py-1 rounded"
              >
                Lv{idx + 2}: {modifier}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
