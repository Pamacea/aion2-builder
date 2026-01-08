import { describe, it, expect } from 'vitest';
import { parseQuestlogDescription, getCacheStats, clearQuestlogCache } from '../../questlogDescriptionParser';
import { calculateStatWithQuestlogData, calculateStatFromLevels } from '../../statsUtils';
import { assassinData } from '@/data/classes/assassin';
import { clericData } from '@/data/classes/cleric';

/**
 * Integration tests for the complete placeholder flow:
 * 1. Parse Questlog descriptions with placeholders
 * 2. Calculate stat values from level data
 * 3. Verify proper integration between parser and calculator
 */
describe('Placeholder Integration Flow', () => {
  describe('Damage Placeholders', () => {
    it('should parse and calculate damage placeholders correctly', () => {
      const skill = assassinData.abilities[0]; // Quick Slice
      const description = skill.description;
      const level = 5;

      // 1. Parser la description
      const parsed = parseQuestlogDescription(description, skill, level);
      expect(parsed).toContain('{{DMG_MIN}}');
      expect(parsed).toContain('{{DMG_MAX}}');

      // 2. Calculer les valeurs
      const minValue = calculateStatWithQuestlogData(
        skill.damageMin,
        skill.damageMinModifier,
        level,
        skill.damageMinModifiers,
        skill.levels,
        'minValue'
      );

      const maxValue = calculateStatWithQuestlogData(
        skill.damageMax,
        skill.damageMaxModifier,
        level,
        skill.damageMaxModifiers,
        skill.levels,
        'maxValue'
      );

      // 3. Vérifier les valeurs attendues au niveau 5
      expect(minValue).toBe(120);
      expect(maxValue).toBe(120);
    });

    it('should handle damage across all levels', () => {
      const skill = assassinData.abilities[0];
      const testLevels = [1, 5, 10, 15, 20, 25, 30];

      testLevels.forEach(level => {
        const minValue = calculateStatWithQuestlogData(
          skill.damageMin,
          skill.damageMinModifier,
          level,
          skill.damageMinModifiers,
          skill.levels,
          'minValue'
        );

        expect(minValue).toBeGreaterThan(0);
        expect(minValue).toBeLessThan(10000);
      });
    });

    it('should remove HTML from descriptions', () => {
      const skill = assassinData.abilities[1]; // Flash Slice - has HTML
      const parsed = parseQuestlogDescription(skill.description, skill, 1);

      expect(parsed).not.toContain('<span');
      expect(parsed).not.toContain('</span>');
      expect(parsed).not.toContain('&quot;');
    });
  });

  describe('Duration Placeholders', () => {
    it('should parse duration placeholders correctly', () => {
      const skill = assassinData.abilities[1]; // Flash Slice - has duration
      const level = 5;

      const parsed = parseQuestlogDescription(skill.description, skill, level);

      // Should contain DURATION placeholder
      expect(parsed).toContain('{{DURATION}}');
    });

    it('should handle missing duration gracefully', () => {
      const skill = assassinData.abilities[0]; // Quick Slice - no duration
      const level = 5;

      const parsed = parseQuestlogDescription(skill.description, skill, level);

      // Should not contain DURATION placeholder
      expect(parsed).not.toContain('{{DURATION}}');
    });
  });

  describe('Heal Placeholders', () => {
    it('should parse heal placeholders correctly', () => {
      // Test with a healer class skill
      const healSkill = clericData.abilities?.find((a: any) =>
        a.description.includes('SkillUIHPHeal')
      );

      if (healSkill) {
        const level = 5;
        const parsed = parseQuestlogDescription(healSkill.description, healSkill, level);

        expect(parsed).toContain('{{HEAL_MIN}}');
        expect(parsed).toContain('{{HEAL_MAX}}');
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing descriptionData gracefully', () => {
      const skill = { ...assassinData.abilities[0] };
      delete (skill as any).descriptionData;

      const parsed = parseQuestlogDescription(skill.description, skill, 5);

      // Should return original description
      expect(parsed).toBeTruthy();
      expect(typeof parsed).toBe('string');
    });

    it('should handle corrupted level data', () => {
      const skill = assassinData.abilities[0];

      // Test with invalid level
      const minValue = calculateStatWithQuestlogData(
        skill.damageMin,
        skill.damageMinModifier,
        999, // Invalid level
        skill.damageMinModifiers,
        skill.levels,
        'minValue'
      );

      // Should return 0 or null for invalid level
      expect(minValue).toBeGreaterThanOrEqual(0);
    });

    it('should handle empty levels array', () => {
      const skill = assassinData.abilities[0];

      const minValue = calculateStatWithQuestlogData(
        skill.damageMin,
        skill.damageMinModifier,
        5,
        skill.damageMinModifiers,
        [], // Empty levels
        'minValue'
      );

      // Should fall back to base/modifier calculation
      expect(typeof minValue).toBe('number');
    });

    it('should handle null base values', () => {
      const minValue = calculateStatWithQuestlogData(
        null,
        null,
        5,
        null,
        undefined,
        'minValue'
      );

      // Should return 0
      expect(minValue).toBe(0);
    });

    it('should handle string "FALSE" values in level data', () => {
      // Create mock level data with string "FALSE"
      const levels = [
        { level: 1, minValue: '100', maxValue: '150' },
        { level: 2, minValue: 'FALSE', maxValue: 'FALSE' },
      ];

      // Should handle string "FALSE" gracefully
      const result = calculateStatFromLevels(levels, 2, 'minValue');
      expect(result).toBe(0);
    });

    it('should cache parsed descriptions', () => {
      const skill = assassinData.abilities[0];
      const level = 5;

      clearQuestlogCache();

      // First call - cache miss
      parseQuestlogDescription(skill.description, skill, level);
      const stats1 = getCacheStats();
      expect(stats1.size).toBe(1);

      // Second call - cache hit
      parseQuestlogDescription(skill.description, skill, level);
      const stats2 = getCacheStats();
      expect(stats2.size).toBe(1);
    });
  });

  describe('Integration with Real Data', () => {
    it('should handle Quick Slice (Assassin) correctly', () => {
      const skill = assassinData.abilities[0];
      const level = 10;

      const parsed = parseQuestlogDescription(skill.description, skill, level);

      expect(parsed).toContain('{{DMG_MIN}}');
      expect(parsed).toContain('{{DMG_MAX}}');

      const minValue = calculateStatWithQuestlogData(
        skill.damageMin,
        skill.damageMinModifier,
        level,
        skill.damageMinModifiers,
        skill.levels,
        'minValue'
      );

      expect(minValue).toBe(281); // Known value at level 10
    });

    it('should handle Flash Slice (Assassin) with multiple placeholders', () => {
      const skill = assassinData.abilities[1];
      const level = 15;

      const parsed = parseQuestlogDescription(skill.description, skill, level);

      // Should contain damage, duration, and percentage placeholders
      expect(parsed).toContain('{{DMG_MIN}}');
      expect(parsed).toContain('{{DMG_MAX}}');
      expect(parsed).toContain('{{DURATION}}');
    });
  });

  describe('Placeholder Types Coverage', () => {
    it('should support all documented placeholder types', () => {
      const skill = assassinData.abilities[0];
      const level = 5;

      // Test that the system can handle various placeholder types
      const placeholders = [
        '{{DMG_MIN}}',
        '{{DMG_MAX}}',
        '{{DAMAGE_PER_SECOND}}',
        '{{HEAL_MIN}}',
        '{{HEAL_MAX}}',
        '{{DURATION}}',
        '{{ATTACK_PERCENTAGE}}',
        '{{DEFENSE_PERCENTAGE}}',
      ];

      // Verify parser doesn't crash on known placeholders
      placeholders.forEach(placeholder => {
        const testDesc = `Test ${placeholder} value`;
        const parsed = parseQuestlogDescription(testDesc, skill, level);
        expect(typeof parsed).toBe('string');
      });
    });
  });
});
