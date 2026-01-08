/**
 * Unit tests for questlogDescriptionParser
 * Tests all placeholder types, cache functionality, and edge cases
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  parseQuestlogDescription,
  clearQuestlogCache,
  getCacheStats
} from '../questlogDescriptionParser';
import type { AbilityType } from '@/types/schema';

// Helper to create mock skill
const createMockSkill = (id: string, customPlaceholders?: Record<string, any>): AbilityType => {
  return {
    id,
    name: `Test Skill ${id}`,
    descriptionData: {
      access: ['None'],
      placeholders: {
        'se_dmg:12345:SkillUIMinDmgsum': {
          base: { values: ['100'] },
          levels: {
            '5': { values: ['150'] },
            '10': { values: ['200'] }
          }
        },
        'se_dmg:12345:SkillUIMaxDmgsum': {
          base: { values: ['200'] },
          levels: {
            '5': { values: ['250'] },
            '10': { values: ['300'] }
          }
        },
        'se_dmg:12345:SkillUIHPHealMin': {
          base: { values: ['50'] }
        },
        'se_dmg:12345:SkillUIHPHealMax': {
          base: { values: ['100'] }
        },
        'se:67890:effect_value02:time': {
          base: { values: ['10'] },
          levels: {
            '5': { values: ['15'] }
          }
        },
        'se:67890:effect_value02': {
          base: { values: ['5'] }
        },
        ...customPlaceholders
      }
    }
  } as unknown as AbilityType;
};

describe('questlogDescriptionParser', () => {
  beforeEach(() => {
    clearQuestlogCache();
  });

  afterEach(() => {
    clearQuestlogCache();
  });

  describe('Damage Placeholders', () => {
    it('should replace SkillUIMinDmgsum placeholder', () => {
      const skill = createMockSkill('test-1');
      const result = parseQuestlogDescription(
        'Deals {se_dmg:12345:SkillUIMinDmgsum} damage',
        skill,
        1
      );

      expect(result).toBe('Deals {{DMG_MIN}} damage');
    });

    it('should replace SkillUIMinDmgSum placeholder (capital S)', () => {
      const skill = createMockSkill('test-2');
      const result = parseQuestlogDescription(
        'Deals {se_dmg:12345:SkillUIMinDmgSum} damage',
        skill,
        1
      );

      expect(result).toBe('Deals {{DMG_MIN}} damage');
    });

    it('should replace SkillUIMaxDmgsum placeholder', () => {
      const skill = createMockSkill('test-3');
      const result = parseQuestlogDescription(
        'Deals {se_dmg:12345:SkillUIMaxDmgsum} damage',
        skill,
        1
      );

      expect(result).toBe('Deals {{DMG_MAX}} damage');
    });

    it('should handle multiple damage placeholders', () => {
      const skill = createMockSkill('test-4');
      const result = parseQuestlogDescription(
        'Deals {se_dmg:12345:SkillUIMinDmgsum} to {se_dmg:12345:SkillUIMaxDmgsum} damage',
        skill,
        1
      );

      expect(result).toBe('Deals {{DMG_MIN}} to {{DMG_MAX}} damage');
    });

    it('should be case insensitive', () => {
      const skill = createMockSkill('test-5');
      const result = parseQuestlogDescription(
        'Deals {SE_DMG:12345:SkillUIMinDmgsum} damage',
        skill,
        1
      );

      expect(result).toBe('Deals {{DMG_MIN}} damage');
    });
  });

  describe('Heal Placeholders', () => {
    it('should replace SkillUIHPHealMin placeholder', () => {
      const skill = createMockSkill('test-6');
      const result = parseQuestlogDescription(
        'Heals for {se_dmg:12345:SkillUIHPHealMin} HP',
        skill,
        1
      );

      expect(result).toBe('Heals for {{HEAL_MIN}} HP');
    });

    it('should replace SkillUIHPHealMax placeholder', () => {
      const skill = createMockSkill('test-7');
      const result = parseQuestlogDescription(
        'Heals for {se_dmg:12345:SkillUIHPHealMax} HP',
        skill,
        1
      );

      expect(result).toBe('Heals for {{HEAL_MAX}} HP');
    });

    it('should handle heal range', () => {
      const skill = createMockSkill('test-8');
      const result = parseQuestlogDescription(
        'Heals for {se_dmg:12345:SkillUIHPHealMin} to {se_dmg:12345:SkillUIHPHealMax} HP',
        skill,
        1
      );

      expect(result).toBe('Heals for {{HEAL_MIN}} to {{HEAL_MAX}} HP');
    });
  });

  describe('Duration Placeholders', () => {
    it('should replace effect_value02:time placeholder', () => {
      const skill = createMockSkill('test-9');
      const result = parseQuestlogDescription(
        'Stuns for {se:67890:effect_value02:time} seconds',
        skill,
        1
      );

      expect(result).toBe('Stuns for {{DURATION}} seconds');
    });

    it('should be case insensitive for duration', () => {
      const skill = createMockSkill('test-10');
      const result = parseQuestlogDescription(
        'Stuns for {SE:67890:EFFECT_VALUE02:TIME} seconds',
        skill,
        1
      );

      expect(result).toBe('Stuns for {{DURATION}} seconds');
    });
  });

  describe('Generic Placeholders', () => {
    it('should extract value from descriptionData for unknown placeholder', () => {
      const skill = createMockSkill('test-11');
      const result = parseQuestlogDescription(
        'Applies {se:67890:effect_value02} effect',
        skill,
        1
      );

      expect(result).toBe('Applies 5 effect');
    });

    it('should keep placeholder if no value found', () => {
      const skill = createMockSkill('test-12');
      const result = parseQuestlogDescription(
        'Applies {se:99999:unknown_placeholder} effect',
        skill,
        1
      );

      expect(result).toBe('Applies {se:99999:unknown_placeholder} effect');
    });

    it('should handle mixed known and unknown placeholders', () => {
      const skill = createMockSkill('test-13');
      const result = parseQuestlogDescription(
        'Deals {se_dmg:12345:SkillUIMinDmgsum} damage and applies {se:67890:effect_value02} effect',
        skill,
        1
      );

      expect(result).toBe('Deals {{DMG_MIN}} damage and applies 5 effect');
    });
  });

  describe('HTML Cleaning', () => {
    it('should remove span tags', () => {
      const skill = createMockSkill('test-14');
      const result = parseQuestlogDescription(
        '<span>Deals {se_dmg:12345:SkillUIMinDmgsum} damage</span>',
        skill,
        1
      );

      expect(result).toBe('Deals {{DMG_MIN}} damage');
    });

    it('should remove span tags with attributes', () => {
      const skill = createMockSkill('test-15');
      const result = parseQuestlogDescription(
        '<span class="test">Deals {se_dmg:12345:SkillUIMinDmgsum} damage</span>',
        skill,
        1
      );

      expect(result).toBe('Deals {{DMG_MIN}} damage');
    });

    it('should convert &quot; to quotes', () => {
      const skill = createMockSkill('test-16');
      const result = parseQuestlogDescription(
        'Deals &quot;{se_dmg:12345:SkillUIMinDmgsum}&quot; damage',
        skill,
        1
      );

      expect(result).toBe('Deals "{{DMG_MIN}}" damage');
    });
  });

  describe('Cache Functionality', () => {
    it('should cache parsed results', () => {
      const skill = createMockSkill('test-17');
      const description = 'Deals {se_dmg:12345:SkillUIMinDmgsum} damage';

      const result1 = parseQuestlogDescription(description, skill, 1);
      const stats1 = getCacheStats();

      const result2 = parseQuestlogDescription(description, skill, 1);
      const stats2 = getCacheStats();

      expect(result1).toBe(result2);
      expect(stats1.size).toBe(1);
      expect(stats2.size).toBe(1);
    });

    it('should handle different levels separately', () => {
      const skill = createMockSkill('test-18');
      const description = 'Deals {se_dmg:12345:SkillUIMinDmgsum} damage';

      parseQuestlogDescription(description, skill, 1);
      parseQuestlogDescription(description, skill, 5);
      parseQuestlogDescription(description, skill, 10);

      const stats = getCacheStats();
      expect(stats.size).toBe(3);
    });

    it('should handle different skills separately', () => {
      const skill1 = createMockSkill('skill-1');
      const skill2 = createMockSkill('skill-2');
      const description = 'Deals {se_dmg:12345:SkillUIMinDmgsum} damage';

      parseQuestlogDescription(description, skill1, 1);
      parseQuestlogDescription(description, skill2, 1);

      const stats = getCacheStats();
      expect(stats.size).toBe(2);
    });

    it('should clear cache when requested', () => {
      const skill = createMockSkill('test-19');
      const description = 'Deals {se_dmg:12345:SkillUIMinDmgsum} damage';

      parseQuestlogDescription(description, skill, 1);
      expect(getCacheStats().size).toBe(1);

      clearQuestlogCache();
      expect(getCacheStats().size).toBe(0);
    });

    it('should report max cache size correctly', () => {
      const stats = getCacheStats();
      expect(stats.maxSize).toBe(500);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty description', () => {
      const skill = createMockSkill('test-20');
      const result = parseQuestlogDescription('', skill, 1);

      expect(result).toBe('');
    });

    it('should handle description with no placeholders', () => {
      const skill = createMockSkill('test-21');
      const result = parseQuestlogDescription('Simple damage ability', skill, 1);

      expect(result).toBe('Simple damage ability');
    });

    it('should handle description with only HTML', () => {
      const skill = createMockSkill('test-22');
      const result = parseQuestlogDescription('<span>Test</span>', skill, 1);

      expect(result).toBe('Test');
    });

    it('should trim whitespace', () => {
      const skill = createMockSkill('test-23');
      const result = parseQuestlogDescription(
        '  Deals {se_dmg:12345:SkillUIMinDmgsum} damage  ',
        skill,
        1
      );

      expect(result).toBe('Deals {{DMG_MIN}} damage');
    });

    it('should handle special characters in description', () => {
      const skill = createMockSkill('test-24');
      const result = parseQuestlogDescription(
        'Deals {se_dmg:12345:SkillUIMinDmgsum} damage! @#$%',
        skill,
        1
      );

      expect(result).toBe('Deals {{DMG_MIN}} damage! @#$%');
    });

    it('should handle multiple consecutive placeholders', () => {
      const skill = createMockSkill('test-25');
      const result = parseQuestlogDescription(
        '{se_dmg:12345:SkillUIMinDmgsum}{se_dmg:12345:SkillUIMaxDmgsum}',
        skill,
        1
      );

      expect(result).toBe('{{DMG_MIN}}{{DMG_MAX}}');
    });

    it('should handle newline characters', () => {
      const skill = createMockSkill('test-26');
      const result = parseQuestlogDescription(
        'Deals {se_dmg:12345:SkillUIMinDmgsum} damage\nAnd heals {se_dmg:12345:SkillUIHPHealMin} HP',
        skill,
        1
      );

      expect(result).toBe('Deals {{DMG_MIN}} damage\nAnd heals {{HEAL_MIN}} HP');
    });

    it('should handle tab characters', () => {
      const skill = createMockSkill('test-27');
      const result = parseQuestlogDescription(
        'Deals {se_dmg:12345:SkillUIMinDmgsum} damage\tCrit',
        skill,
        1
      );

      expect(result).toBe('Deals {{DMG_MIN}} damage\tCrit');
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle complex real-world description', () => {
      const skill = createMockSkill('test-28');
      const result = parseQuestlogDescription(
        '<span>Deals {se_dmg:12345:SkillUIMinDmgsum} to {se_dmg:12345:SkillUIMaxDmgsum} physical damage, ' +
        'heals for {se_dmg:12345:SkillUIHPHealMin} to {se_dmg:12345:SkillUIHPHealMax} HP, ' +
        'and stuns target for {se:67890:effect_value02:time}s. ' +
        'Additional {se:67890:effect_value02} effect applied.</span>',
        skill,
        5
      );

      expect(result).toBe(
        'Deals {{DMG_MIN}} to {{DMG_MAX}} physical damage, ' +
        'heals for {{HEAL_MIN}} to {{HEAL_MAX}} HP, ' +
        'and stuns target for {{DURATION}}s. ' +
        'Additional 5 effect applied.'
      );
    });

    it('should handle description with numbered lists', () => {
      const skill = createMockSkill('test-29');
      const result = parseQuestlogDescription(
        '1. Deals {se_dmg:12345:SkillUIMinDmgsum} damage\n' +
        '2. Heals {se_dmg:12345:SkillUIHPHealMin} HP\n' +
        '3. Stuns for {se:67890:effect_value02:time}s',
        skill,
        1
      );

      expect(result).toBe(
        '1. Deals {{DMG_MIN}} damage\n' +
        '2. Heals {{HEAL_MIN}} HP\n' +
        '3. Stuns for {{DURATION}}s'
      );
    });
  });

  describe('Level-Specific Values', () => {
    it('should use base values for level 1', () => {
      const skill = createMockSkill('test-30');
      const result = parseQuestlogDescription(
        'Duration: {se:67890:effect_value02:time}s',
        skill,
        1
      );

      expect(result).toBe('Duration: {{DURATION}}s');
    });

    it('should handle different skill levels', () => {
      const skill = createMockSkill('test-31');

      const result1 = parseQuestlogDescription(
        'Deals {se_dmg:12345:SkillUIMinDmgsum} damage',
        skill,
        1
      );
      const result5 = parseQuestlogDescription(
        'Deals {se_dmg:12345:SkillUIMinDmgsum} damage',
        skill,
        5
      );
      const result10 = parseQuestlogDescription(
        'Deals {se_dmg:12345:SkillUIMinDmgsum} damage',
        skill,
        10
      );

      // All should convert to placeholder regardless of level
      expect(result1).toBe('Deals {{DMG_MIN}} damage');
      expect(result5).toBe('Deals {{DMG_MIN}} damage');
      expect(result10).toBe('Deals {{DMG_MIN}} damage');
    });
  });
});
