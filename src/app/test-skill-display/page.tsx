'use client';

import { useState } from 'react';
import { gladiatorData } from '@/data/classes';
import { SkillDescriptionWithLevel, SkillLevelsTable } from '@/components/skill';
import { getSkillDamageRange } from '@/utils/skillLevelUtils';

export default function TestSkillDisplayPage() {
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0);
  const [level, setLevel] = useState(25);
  const [showTable, setShowTable] = useState(false);

  const skill = gladiatorData.abilities?.[selectedSkillIndex];
  const damage = skill ? getSkillDamageRange(skill, level) : { min: null, max: null };

  if (!skill) {
    return <div className="p-8">No skill data available</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Skill Display Test - Questlog Integration</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Skill Selection</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Skill</label>
                <select
                  value={selectedSkillIndex}
                  onChange={(e) => setSelectedSkillIndex(parseInt(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                >
                  {gladiatorData.abilities?.map((ability, idx) => (
                    <option key={ability.id} value={idx}>
                      {ability.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Character Level: {level}
                </label>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={level}
                  onChange={(e) => setLevel(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1</span>
                  <span>60</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showTable"
                  checked={showTable}
                  onChange={(e) => setShowTable(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="showTable" className="text-sm">
                  Show full progression table
                </label>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Current Stats (Level {level})</h2>

            <div className="space-y-3">
              <div>
                <span className="text-gray-400">Skill:</span>
                <span className="ml-2 font-semibold">{skill.name}</span>
              </div>

              <div>
                <span className="text-gray-400">Damage:</span>
                <span className="ml-2 font-semibold text-orange-400">
                  {damage.min !== null && damage.max !== null
                    ? damage.min === damage.max
                      ? damage.min
                      : `${damage.min} - ${damage.max}`
                    : 'N/A'}
                </span>
              </div>

              {skill.manaCost && (
                <div>
                  <span className="text-gray-400">MP Cost:</span>
                  <span className="ml-2 font-semibold">
                    {skill.manaCost > 0 ? `-${skill.manaCost}` : `+${Math.abs(skill.manaCost)}`}
                  </span>
                </div>
              )}

              {skill.cooldown && (
                <div>
                  <span className="text-gray-400">Cooldown:</span>
                  <span className="ml-2">{skill.cooldown}</span>
                </div>
              )}

              {skill.range && (
                <div>
                  <span className="text-gray-400">Range:</span>
                  <span className="ml-2">{skill.range}m</span>
                </div>
              )}

              {skill.staggerDamage && (
                <div>
                  <span className="text-gray-400">Stagger:</span>
                  <span className="ml-2">{skill.staggerDamage}</span>
                </div>
              )}

              <div>
                <span className="text-gray-400">Max Level:</span>
                <span className="ml-2">{skill.maxLevel || skill.levels?.length || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Skill Description</h2>
            <SkillDescriptionWithLevel skill={skill} level={level} showRaw={false} />
          </div>

          {showTable && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <SkillLevelsTable skill={skill} currentLevel={level} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Raw Skill Data</h2>
        <pre className="text-xs bg-gray-900 p-4 rounded overflow-x-auto">
          {JSON.stringify(skill, null, 2)}
        </pre>
      </div>
    </div>
  );
}
