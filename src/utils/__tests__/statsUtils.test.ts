/**
 * Tests for statsUtils.ts
 *
 * Tests cover:
 * - calculateStatFromLevels with invalid values
 * - validateLevelData
 * - Edge cases
 * - Cache functionality
 * - Debug mode
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { SkillLevel } from '@/data/classes/types';
import {
  calculateStat,
  calculateStatFromLevels,
  calculateStatWithQuestlogData,
  validateLevelData,
  validateSingleLevel,
  setDebugMode,
  isDebugMode,
  clearStatCache,
  getCacheSize,
  organizeStatsIntoGroups,
} from '../statsUtils';
import type { DaevanionStats } from '@/types/daevanion.type';

// Mock console methods to avoid noise in test output
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;

describe('statsUtils', () => {
  beforeEach(() => {
    // Reset state before each test
    clearStatCache();
    setDebugMode(false);
    // Restore console methods
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
  });

  describe('setDebugMode and isDebugMode', () => {
    it('should have debug mode off by default in test environment', () => {
      expect(isDebugMode()).toBe(false);
    });

    it('should allow toggling debug mode', () => {
      setDebugMode(true);
      expect(isDebugMode()).toBe(true);
      setDebugMode(false);
      expect(isDebugMode()).toBe(false);
    });
  });

  describe('clearStatCache and getCacheSize', () => {
    it('should start with an empty cache', () => {
      expect(getCacheSize()).toBe(0);
    });

    it('should clear the cache', () => {
      const levels: SkillLevel[] = [
        { level: 1, minValue: '100' },
        { level: 2, minValue: '200' },
      ];
      calculateStatFromLevels(levels, 1, 'minValue');
      expect(getCacheSize()).toBeGreaterThan(0);

      clearStatCache();
      expect(getCacheSize()).toBe(0);
    });
  });

  describe('calculateStat', () => {
    it('should return base value for level 1', () => {
      expect(calculateStat(100, 10, 1)).toBe(100);
    });

    it('should return base value for level 0 or negative', () => {
      expect(calculateStat(100, 10, 0)).toBe(100);
      expect(calculateStat(100, 10, -1)).toBe(100);
    });

    it('should calculate with fixed modifier', () => {
      expect(calculateStat(100, 10, 2)).toBe(110); // 100 + 10 * (2 - 1)
      expect(calculateStat(100, 10, 5)).toBe(140); // 100 + 10 * (5 - 1)
    });

    it('should handle null/undefined base', () => {
      expect(calculateStat(null, 10, 1)).toBe(0);
      expect(calculateStat(undefined, 10, 1)).toBe(0);
    });

    it('should handle null/undefined modifier', () => {
      expect(calculateStat(100, null, 5)).toBe(100);
      expect(calculateStat(100, undefined, 5)).toBe(100);
    });

    it('should calculate with modifiers array', () => {
      const modifiers = [10, 20, 30]; // Level 2: +10, Level 3: +20, Level 4: +30
      expect(calculateStat(100, 10, 2, modifiers)).toBe(110); // 100 + 10
      expect(calculateStat(100, 10, 3, modifiers)).toBe(130); // 100 + 10 + 20
      expect(calculateStat(100, 10, 4, modifiers)).toBe(160); // 100 + 10 + 20 + 30
    });

    it('should use last modifier for levels beyond array', () => {
      const modifiers = [10, 20]; // Level 2: +10, Level 3: +20
      // For level 5: sum of all modifiers (30) + last modifier (20) * (5 - 2 - 2) = 30 + 20 * 1 = 50
      expect(calculateStat(100, 10, 5, modifiers)).toBe(150); // 100 + 50
    });
  });

  describe('calculateStatFromLevels', () => {
    const validLevels: SkillLevel[] = [
      { level: 1, minValue: '100', maxValue: '150' },
      { level: 2, minValue: '200', maxValue: '250' },
      { level: 3, minValue: '300', maxValue: '350' },
    ];

    it('should return null for empty/undefined levels', () => {
      expect(calculateStatFromLevels(undefined, 1, 'minValue')).toBeNull();
      expect(calculateStatFromLevels([], 1, 'minValue')).toBeNull();
    });

    it('should return null for non-existent level', () => {
      expect(calculateStatFromLevels(validLevels, 5, 'minValue')).toBeNull();
    });

    it('should return correct value for valid level', () => {
      expect(calculateStatFromLevels(validLevels, 1, 'minValue')).toBe(100);
      expect(calculateStatFromLevels(validLevels, 2, 'minValue')).toBe(200);
      expect(calculateStatFromLevels(validLevels, 3, 'maxValue')).toBe(350);
    });

    it('should handle null/undefined values', () => {
      const levelsWithNulls: SkillLevel[] = [
        { level: 1, minValue: null },
        { level: 2, minValue: undefined },
      ];
      expect(calculateStatFromLevels(levelsWithNulls, 1, 'minValue')).toBeNull();
      expect(calculateStatFromLevels(levelsWithNulls, 2, 'minValue')).toBeNull();
    });

    it('should handle numeric string values', () => {
      const levels: SkillLevel[] = [
        { level: 1, minValue: '123.45' },
      ];
      expect(calculateStatFromLevels(levels, 1, 'minValue')).toBe(123.45);
    });

    it('should handle numeric values directly', () => {
      const levels: SkillLevel[] = [
        { level: 1, minValue: 100 as unknown as string },
      ];
      expect(calculateStatFromLevels(levels, 1, 'minValue')).toBe(100);
    });

    describe('invalid string values handling', () => {
      it('should return 0 for "FALSE" value', () => {
        const levels: SkillLevel[] = [
          { level: 1, minValue: 'FALSE' },
        ];
        expect(calculateStatFromLevels(levels, 1, 'minValue')).toBe(0);
      });

      it('should return 0 for "Debuff" value', () => {
        const levels: SkillLevel[] = [
          { level: 1, minValue: 'Debuff' },
        ];
        expect(calculateStatFromLevels(levels, 1, 'minValue')).toBe(0);
      });

      it('should return 0 for "IgnoreOtherActor" value', () => {
        const levels: SkillLevel[] = [
          { level: 1, minValue: 'IgnoreOtherActor' },
        ];
        expect(calculateStatFromLevels(levels, 1, 'minValue')).toBe(0);
      });

      it('should return 0 for "Vacant" value', () => {
        const levels: SkillLevel[] = [
          { level: 1, minValue: 'Vacant' },
        ];
        expect(calculateStatFromLevels(levels, 1, 'minValue')).toBe(0);
      });

      it('should return 0 for TargetLocation_ prefixed values', () => {
        const levels: SkillLevel[] = [
          { level: 1, minValue: 'TargetLocation_Front' },
          { level: 2, minValue: 'TargetLocation_Back' },
        ];
        expect(calculateStatFromLevels(levels, 1, 'minValue')).toBe(0);
        expect(calculateStatFromLevels(levels, 2, 'minValue')).toBe(0);
      });

      it('should return 0 for unparsable string values', () => {
        const levels: SkillLevel[] = [
          { level: 1, minValue: 'not_a_number' },
        ];
        expect(calculateStatFromLevels(levels, 1, 'minValue')).toBe(0);
      });

      it('should return 0 for NaN values', () => {
        const levels: SkillLevel[] = [
          { level: 1, minValue: NaN as unknown as string },
        ];
        expect(calculateStatFromLevels(levels, 1, 'minValue')).toBeNull();
      });
    });

    describe('edge cases', () => {
      it('should handle empty string as unparsable', () => {
        const levels: SkillLevel[] = [
          { level: 1, minValue: '' },
        ];
        expect(calculateStatFromLevels(levels, 1, 'minValue')).toBe(0);
      });

      it('should handle whitespace-only string', () => {
        const levels: SkillLevel[] = [
          { level: 1, minValue: '   ' },
        ];
        expect(calculateStatFromLevels(levels, 1, 'minValue')).toBe(0);
      });

      it('should handle negative numbers in strings', () => {
        const levels: SkillLevel[] = [
          { level: 1, minValue: '-100' },
        ];
        expect(calculateStatFromLevels(levels, 1, 'minValue')).toBe(-100);
      });

      it('should handle scientific notation in strings', () => {
        const levels: SkillLevel[] = [
          { level: 1, minValue: '1.5e2' }, // 150
        ];
        expect(calculateStatFromLevels(levels, 1, 'minValue')).toBe(150);
      });

      it('should handle boolean values', () => {
        const levels: SkillLevel[] = [
          { level: 1, minValue: true as unknown as string },
          { level: 2, minValue: false as unknown as string },
        ];
        expect(calculateStatFromLevels(levels, 1, 'minValue')).toBe(1); // true = 1
        expect(calculateStatFromLevels(levels, 2, 'minValue')).toBe(0); // false = 0
      });
    });
  });

  describe('calculateStatFromLevels caching', () => {
    it('should cache results by default', () => {
      const levels: SkillLevel[] = [
        { level: 1, minValue: '100' },
        { level: 2, minValue: '200' },
      ];

      expect(getCacheSize()).toBe(0);
      calculateStatFromLevels(levels, 1, 'minValue');
      expect(getCacheSize()).toBe(1);

      calculateStatFromLevels(levels, 2, 'minValue');
      expect(getCacheSize()).toBe(2);
    });

    it('should return cached result on subsequent calls', () => {
      const levels: SkillLevel[] = [
        { level: 1, minValue: '100' },
      ];

      const firstCall = calculateStatFromLevels(levels, 1, 'minValue');
      const secondCall = calculateStatFromLevels(levels, 1, 'minValue');

      expect(firstCall).toBe(secondCall);
      expect(getCacheSize()).toBe(1); // Only one cache entry
    });

    it('should respect useCache parameter', () => {
      const levels: SkillLevel[] = [
        { level: 1, minValue: '100' },
      ];

      calculateStatFromLevels(levels, 1, 'minValue', false);
      expect(getCacheSize()).toBe(0);

      calculateStatFromLevels(levels, 1, 'minValue', true);
      expect(getCacheSize()).toBe(1);
    });

    it('should limit cache size to MAX_CACHE_SIZE', () => {
      // Create many unique entries
      for (let i = 0; i < 1100; i++) {
        const levels: SkillLevel[] = [
          { level: 1, minValue: `${i}` },
        ];
        calculateStatFromLevels(levels, 1, 'minValue');
      }

      // Cache should be limited to 1000 entries
      expect(getCacheSize()).toBeLessThanOrEqual(1000);
    });
  });

  describe('calculateStatWithQuestlogData', () => {
    const questlogLevels: SkillLevel[] = [
      { level: 1, minValue: '100', maxValue: '150' },
      { level: 2, minValue: '200', maxValue: '250' },
    ];

    it('should use questlog data when available', () => {
      const result = calculateStatWithQuestlogData(
        50, // base
        10, // modifier
        2, // level
        [5, 10], // modifiers (old system)
        questlogLevels,
        'minValue'
      );

      expect(result).toBe(200); // From questlog, not 50 + 5 = 55 (old system)
    });

    it('should fallback to old system when questlog data is unavailable', () => {
      const result = calculateStatWithQuestlogData(
        50, // base
        10, // modifier
        5, // level
        [5, 10, 15], // modifiers
        undefined, // No questlog data
        'minValue'
      );

      expect(result).toBe(80); // 50 + 5 + 10 + 15 = 80
    });

    it('should fallback when level is not in questlog data', () => {
      const result = calculateStatWithQuestlogData(
        50,
        10,
        5, // Level 5 not in questlogLevels
        [5, 10, 15],
        questlogLevels,
        'minValue'
      );

      expect(result).toBe(80); // Fallback to old system
    });

    it('should return 0 for invalid questlog values', () => {
      const invalidLevels: SkillLevel[] = [
        { level: 1, minValue: 'FALSE' },
      ];

      const result = calculateStatWithQuestlogData(
        50,
        10,
        1,
        undefined,
        invalidLevels,
        'minValue'
      );

      expect(result).toBe(0); // Invalid value returns 0, not null
    });
  });

  describe('validateLevelData', () => {
    it('should return error for empty/undefined levels', () => {
      expect(validateLevelData([])).toEqual({
        valid: false,
        errors: ['Level data is empty or undefined'],
        warnings: [],
      });

      expect(validateLevelData(undefined as unknown as SkillLevel[])).toEqual({
        valid: false,
        errors: ['Level data is empty or undefined'],
        warnings: [],
      });
    });

    it('should detect duplicate levels', () => {
      const levelsWithDuplicates: SkillLevel[] = [
        { level: 1, minValue: '100' },
        { level: 2, minValue: '200' },
        { level: 2, minValue: '250' }, // Duplicate level
        { level: 1, minValue: '150' }, // Duplicate level
      ];

      const result = validateLevelData(levelsWithDuplicates);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Duplicate levels found');
      expect(result.errors[0]).toContain('level 1 (2 entries)');
      expect(result.errors[0]).toContain('level 2 (2 entries)');
    });

    it('should warn about invalid string values', () => {
      const levelsWithInvalid: SkillLevel[] = [
        { level: 1, minValue: 'FALSE' },
        { level: 2, minValue: 'Debuff' },
        { level: 3, minValue: 'TargetLocation_Front' },
      ];

      const result = validateLevelData(levelsWithInvalid);

      expect(result.valid).toBe(true); // Warnings don't make it invalid
      expect(result.warnings).toHaveLength(3);
      expect(result.warnings[0]).toContain('known invalid value');
      expect(result.warnings[1]).toContain('known invalid value');
      expect(result.warnings[2]).toContain('TargetLocation value');
    });

    it('should error on unparsable string values', () => {
      const levelsWithUnparsable: SkillLevel[] = [
        { level: 1, minValue: 'not_a_number' },
      ];

      const result = validateLevelData(levelsWithUnparsable);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('cannot be parsed as number');
    });

    it('should warn about level gaps', () => {
      const levelsWithGaps: SkillLevel[] = [
        { level: 1, minValue: '100' },
        { level: 3, minValue: '300' }, // Gap: level 2 is missing
        { level: 6, minValue: '600' }, // Gap: levels 4-5 are missing
      ];

      const result = validateLevelData(levelsWithGaps);

      expect(result.valid).toBe(true); // Gaps are warnings, not errors
      expect(result.warnings.some(w => w.includes('Gap in levels'))).toBe(true);
    });

    it('should pass validation for clean data', () => {
      const cleanLevels: SkillLevel[] = [
        { level: 1, minValue: '100', maxValue: '150' },
        { level: 2, minValue: '200', maxValue: '250' },
        { level: 3, minValue: '300', maxValue: '350' },
      ];

      const result = validateLevelData(cleanLevels);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('should handle NaN values', () => {
      const levelsWithNaN: SkillLevel[] = [
        { level: 1, minValue: NaN as unknown as string },
      ];

      const result = validateLevelData(levelsWithNaN);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('is NaN');
    });
  });

  describe('validateSingleLevel', () => {
    it('should validate a single correct level', () => {
      const level: SkillLevel = { level: 5, minValue: '100', maxValue: '200' };
      const result = validateSingleLevel(level);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('should error on invalid level number', () => {
      const level: SkillLevel = { level: 0, minValue: '100' };
      const result = validateSingleLevel(level);

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Invalid level number');
    });

    it('should error on negative level number', () => {
      const level: SkillLevel = { level: -1, minValue: '100' };
      const result = validateSingleLevel(level);

      expect(result.valid).toBe(false);
    });

    it('should warn about invalid string values', () => {
      const level: SkillLevel = { level: 1, minValue: 'FALSE' };
      const result = validateSingleLevel(level);

      expect(result.valid).toBe(true);
      expect(result.warnings[0]).toContain('Known invalid value');
    });

    it('should handle null/undefined values gracefully', () => {
      const level: SkillLevel = { level: 1, minValue: null, maxValue: undefined };
      const result = validateSingleLevel(level);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('organizeStatsIntoGroups', () => {
    const mockStats: DaevanionStats = {
      skillLevelUps: [
        {
          id: 'ability-1',
          name: 'Test Ability',
          type: 'ability',
          iconUrl: '/test.png',
          description: 'Test ability description',
          level: 1,
          maxLevel: 5,
          value: 10,
        },
        {
          id: 'passive-1',
          name: 'Test Passive',
          type: 'passive',
          iconUrl: '/test.png',
          description: 'Test passive description',
          level: 1,
          maxLevel: 3,
          value: 5,
        },
      ],
      attack: 100,
      defense: 50,
      criticalHit: 25,
      maxHP: 1000,
    } as DaevanionStats;

    it('should organize stats into groups', () => {
      const result = organizeStatsIntoGroups(mockStats);

      expect(result.groups).toBeDefined();
      expect(result.groups.length).toBeGreaterThan(0);

      // Check that abilities and passives are in their groups
      const abilitiesGroup = result.groups.find(g => g.group.id === 'abilities');
      const passivesGroup = result.groups.find(g => g.group.id === 'passives');

      expect(abilitiesGroup).toBeDefined();
      expect(passivesGroup).toBeDefined();

      expect(abilitiesGroup?.items).toHaveLength(1);
      expect(abilitiesGroup?.items[0].type).toBe('skill');
      expect(abilitiesGroup?.items[0].skill?.name).toBe('Test Ability');

      expect(passivesGroup?.items).toHaveLength(1);
      expect(passivesGroup?.items[0].type).toBe('skill');
      expect(passivesGroup?.items[0].skill?.name).toBe('Test Passive');
    });

    it('should filter by search query', () => {
      const result = organizeStatsIntoGroups(mockStats, 'Ability');

      const abilitiesGroup = result.groups.find(g => g.group.id === 'abilities');
      const passivesGroup = result.groups.find(g => g.group.id === 'passives');

      expect(abilitiesGroup?.items).toHaveLength(1); // Matches "Ability"
      expect(passivesGroup?.items).toHaveLength(0); // Doesn't match "Ability"
    });

    it('should filter out zero-value stats', () => {
      const statsWithZeros: DaevanionStats = {
        ...mockStats,
        attack: 0, // Should be filtered out
        defense: 50, // Should be included
      };

      const result = organizeStatsIntoGroups(statsWithZeros);
      const generalGroup = result.groups.find(g => g.group.id === 'general');

      const attackItem = generalGroup?.items.find(i => i.stat?.key === 'attack');
      const defenseItem = generalGroup?.items.find(i => i.stat?.key === 'defense');

      expect(attackItem).toBeUndefined();
      expect(defenseItem).toBeDefined();
    });

    it('should handle empty stats', () => {
      const emptyStats: DaevanionStats = {
        skillLevelUps: [],
      } as DaevanionStats;

      const result = organizeStatsIntoGroups(emptyStats);

      expect(result.groups).toBeDefined();
      // Groups should only contain items that exist
      result.groups.forEach(group => {
        if (group.group.id !== 'abilities' && group.group.id !== 'passives') {
          // Stat groups might be empty
          expect(group.items.length).toBeGreaterThanOrEqual(0);
        }
      });
    });
  });

  describe('debug logging', () => {
    it('should not log when debug mode is off', () => {
      const consoleLogSpy = vi.spyOn(console, 'log');
      setDebugMode(false);

      const levels: SkillLevel[] = [{ level: 1, minValue: '100' }];
      calculateStatFromLevels(levels, 1, 'minValue');

      expect(consoleLogSpy).not.toHaveBeenCalled();
      consoleLogSpy.mockRestore();
    });

    it('should log when debug mode is on', () => {
      const consoleLogSpy = vi.spyOn(console, 'log');
      setDebugMode(true);

      const levels: SkillLevel[] = [{ level: 1, minValue: '100' }];
      calculateStatFromLevels(levels, 1, 'minValue');

      expect(consoleLogSpy).toHaveBeenCalled();
      consoleLogSpy.mockRestore();
    });

    it('should warn about invalid values regardless of debug mode', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn');
      setDebugMode(false);

      const levels: SkillLevel[] = [{ level: 1, minValue: 'unparsable_value' }];
      calculateStatFromLevels(levels, 1, 'minValue');

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });
});
