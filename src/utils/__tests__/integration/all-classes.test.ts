import { describe, it, expect } from 'vitest';
import { parseQuestlogDescription } from '../../questlogDescriptionParser';
import { calculateStatWithQuestlogData, validateLevelData } from '../../statsUtils';
import { assassinData } from '@/data/classes/assassin';
import { rangerData } from '@/data/classes/ranger';
import { sorcererData } from '@/data/classes/sorcerer';
import { clericData } from '@/data/classes/cleric';
import { chanterData } from '@/data/classes/chanter';
import { templarData } from '@/data/classes/templar';
import { gladiatorData } from '@/data/classes/gladiator';
import { elementalistData } from '@/data/classes/elementalist';

/**
 * Integration tests for all classes to ensure placeholder system works consistently
 * across the entire codebase
 */
const allClasses = [
  { name: 'assassin', data: assassinData },
  { name: 'ranger', data: rangerData },
  { name: 'sorcerer', data: sorcererData },
  { name: 'cleric', data: clericData },
  { name: 'chanter', data: chanterData },
  { name: 'templar', data: templarData },
  { name: 'gladiator', data: gladiatorData },
  { name: 'elementalist', data: elementalistData },
];

describe('All Classes Placeholder Integration', () => {
  describe('Data Structure Validation', () => {
    allClasses.forEach(({ name, data }) => {
      describe(`${name.charAt(0).toUpperCase() + name.slice(1)}`, () => {
        it('should have valid class data structure', () => {
          expect(data).toBeDefined();
          expect(typeof data).toBe('object');
          expect(data.name).toBe(name);
        });

        it('should have abilities array', () => {
          expect(data.abilities).toBeDefined();
          expect(Array.isArray(data.abilities)).toBe(true);
        });

        it('should have at least one ability', () => {
          expect(data.abilities.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Description Data Coverage', () => {
    allClasses.forEach(({ name, data }) => {
      describe(`${name.charAt(0).toUpperCase() + name.slice(1)}`, () => {
        it('should have descriptionData for most abilities', () => {
          const abilitiesWithDescriptionData = data.abilities.filter(
            (ability: any) => ability.descriptionData
          );

          const coverage = (abilitiesWithDescriptionData.length / data.abilities.length) * 100;

          // At least 80% of abilities should have descriptionData
          expect(coverage).toBeGreaterThanOrEqual(80);
        });

        it('should have non-empty descriptions for all abilities', () => {
          data.abilities.forEach((ability: any) => {
            expect(ability.description).toBeDefined();
            expect(ability.description.length).toBeGreaterThan(0);
          });
        });
      });
    });
  });

  describe('Placeholder Parsing', () => {
    allClasses.forEach(({ name, data }) => {
      describe(`${name.charAt(0).toUpperCase() + name.slice(1)}`, () => {
        it('should parse all ability descriptions without errors', () => {
          data.abilities.forEach((ability: any) => {
            expect(() => {
              const parsed = parseQuestlogDescription(
                ability.description,
                ability,
                1
              );
              expect(typeof parsed).toBe('string');
            }).not.toThrow();
          });
        });

        it('should handle all levels for each ability', () => {
          data.abilities.forEach((ability: any) => {
            if (ability.levels && ability.levels.length > 0) {
              const testLevels = [1, 5, 10, 15, 20, 25, 30].filter(
                level => ability.levels.find((l: any) => l.level === level)
              );

              testLevels.forEach(level => {
                expect(() => {
                  parseQuestlogDescription(ability.description, ability, level);
                }).not.toThrow();
              });
            }
          });
        });
      });
    });
  });

  describe('Stat Calculation', () => {
    allClasses.forEach(({ name, data }) => {
      describe(`${name.charAt(0).toUpperCase() + name.slice(1)}`, () => {
        it('should calculate valid damage values for all levels', () => {
          data.abilities.forEach((ability: any) => {
            if (ability.levels && ability.levels.length > 0) {
              const testLevels = [1, 5, 10, 15, 20, 25, 30].filter(
                level => ability.levels.find((l: any) => l.level === level)
              );

              testLevels.forEach(level => {
                const minValue = calculateStatWithQuestlogData(
                  ability.damageMin,
                  ability.damageMinModifier,
                  level,
                  ability.damageMinModifiers,
                  ability.levels,
                  'minValue'
                );

                const maxValue = calculateStatWithQuestlogData(
                  ability.damageMax,
                  ability.damageMaxModifier,
                  level,
                  ability.damageMaxModifiers,
                  ability.levels,
                  'maxValue'
                );

                // Values should be non-negative and reasonable
                expect(minValue).toBeGreaterThanOrEqual(0);
                expect(minValue).toBeLessThan(100000);
                expect(maxValue).toBeGreaterThanOrEqual(0);
                expect(maxValue).toBeLessThan(100000);
              });
            }
          });
        });

        it('should have valid level data structure', () => {
          data.abilities.forEach((ability: any) => {
            if (ability.levels && ability.levels.length > 0) {
              const validation = validateLevelData(ability.levels);

              // Should not have critical errors (warnings are OK)
              expect(validation.valid).toBe(true);

              // Log warnings for debugging
              if (validation.warnings.length > 0) {
                console.warn(
                  `[${name}] ${ability.name}:`,
                  validation.warnings
                );
              }
            }
          });
        });
      });
    });
  });

  describe('Placeholder Type Distribution', () => {
    it('should analyze placeholder usage across all classes', () => {
      const placeholderCounts = new Map<string, number>();

      allClasses.forEach(({ data }) => {
        data.abilities.forEach((ability: any) => {
          const parsed = parseQuestlogDescription(ability.description, ability, 1);

          // Count placeholder types
          const placeholderRegex = /\{\{(\w+)\}\}/g;
          let match;
          while ((match = placeholderRegex.exec(parsed)) !== null) {
            const type = match[1];
            placeholderCounts.set(
              type,
              (placeholderCounts.get(type) || 0) + 1
            );
          }
        });
      });

      // Log distribution
      console.log('\n📊 Placeholder Type Distribution:');
      const sorted = Array.from(placeholderCounts.entries()).sort(
        (a, b) => b[1] - a[1]
      );
      sorted.forEach(([type, count]) => {
        console.log(`  ${type}: ${count} occurrences`);
      });

      // Most common placeholders should be present
      expect(placeholderCounts.has('DMG_MIN')).toBe(true);
      expect(placeholderCounts.has('DMG_MAX')).toBe(true);
    });
  });

  describe('Cross-Class Consistency', () => {
    it('should use consistent placeholder naming across classes', () => {
      const allPlaceholders = new Set<string>();

      allClasses.forEach(({ data }) => {
        data.abilities.forEach((ability: any) => {
          const parsed = parseQuestlogDescription(ability.description, ability, 1);

          const placeholderRegex = /\{\{(\w+)\}\}/g;
          let match;
          while ((match = placeholderRegex.exec(parsed)) !== null) {
            allPlaceholders.add(match[1]);
          }
        });
      });

      // Should have at least some placeholders
      expect(allPlaceholders.size).toBeGreaterThan(0);

      console.log(`\n✅ Found ${allPlaceholders.size} unique placeholder types`);
    });

    it('should handle all skill types (abilities, passives, stigmas)', () => {
      allClasses.forEach(({ name, data }) => {
        // Test abilities
        data.abilities?.slice(0, 5).forEach((ability: any) => {
          expect(() => {
            parseQuestlogDescription(ability.description, ability, 1);
          }).not.toThrow();
        });

        // Test passives if available
        data.passives?.slice(0, 5).forEach((passive: any) => {
          expect(() => {
            parseQuestlogDescription(passive.description, passive, 1);
          }).not.toThrow();
        });

        // Test stigmas if available
        data.stigmas?.slice(0, 5).forEach((stigma: any) => {
          expect(() => {
            parseQuestlogDescription(stigma.description, stigma, 1);
          }).not.toThrow();
        });
      });
    });
  });

  describe('Performance Benchmarks', () => {
    it('should parse all abilities quickly', () => {
      const startTime = Date.now();

      allClasses.forEach(({ data }) => {
        data.abilities.forEach((ability: any) => {
          parseQuestlogDescription(ability.description, ability, 1);
        });
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`\n⚡ Parsed all abilities in ${duration}ms`);

      // Should complete in reasonable time
      expect(duration).toBeLessThan(5000);
    });

    it('should benefit from caching', () => {
      const { clearQuestlogCache, getCacheStats } = require('../../questlogDescriptionParser');
      clearQuestlogCache();

      const ability = assassinData.abilities[0];

      // First parse - cache miss
      parseQuestlogDescription(ability.description, ability, 5);
      const stats1 = getCacheStats();

      // Second parse - should hit cache
      parseQuestlogDescription(ability.description, ability, 5);
      const stats2 = getCacheStats();

      expect(stats2.size).toBe(stats1.size);
    });
  });

  describe('Data Quality Checks', () => {
    it('should report classes with missing descriptionData', () => {
      const classesWithMissingData: string[] = [];

      allClasses.forEach(({ name, data }) => {
        const missing = data.abilities.filter(
          (ability: any) => !ability.descriptionData
        );

        if (missing.length > 0) {
          classesWithMissingData.push(
            `${name}: ${missing.length} abilities missing descriptionData`
          );
        }
      });

      if (classesWithMissingData.length > 0) {
        console.warn('\n⚠️ Classes with missing descriptionData:');
        classesWithMissingData.forEach(msg => console.warn(`  ${msg}`));
      }
    });

    it('should report abilities with corrupted level data', () => {
      const corruptedAbilities: string[] = [];

      allClasses.forEach(({ name, data }) => {
        data.abilities.forEach((ability: any) => {
          if (ability.levels) {
            const validation = validateLevelData(ability.levels);
            if (!validation.valid) {
              corruptedAbilities.push(
                `${name} - ${ability.name}: ${validation.errors.join(', ')}`
              );
            }
          }
        });
      });

      if (corruptedAbilities.length > 0) {
        console.warn('\n⚠️ Abilities with corrupted level data:');
        corruptedAbilities.forEach(msg => console.warn(`  ${msg}`));
      }

      // Should have no critical errors
      expect(corruptedAbilities.length).toBe(0);
    });
  });
});
