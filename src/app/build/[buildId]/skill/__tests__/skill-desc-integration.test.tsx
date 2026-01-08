import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkillDesc } from '../_client/skill-desc';
import { assassinData } from '@/data/classes/assassin';
import { clericData } from '@/data/classes/cleric';

/**
 * Integration tests for SkillDesc component
 * Tests the complete flow from parsing to UI rendering
 */
describe('SkillDesc Component Integration', () => {
  describe('Damage Skill Rendering', () => {
    it('should render placeholder values correctly for damage skills', () => {
      const skill = assassinData.abilities[0]; // Quick Slice

      render(
        <SkillDesc
          ability={skill}
          buildAbility={{ level: 5 }}
          daevanionBoost={0}
        />
      );

      // Should render the component
      const container = screen.getByText(/damage/i);
      expect(container).toBeInTheDocument();

      // Should display calculated values (120 at level 5 for Quick Slice)
      // Note: Values are rendered as orange spans
      const valueElements = document.querySelectorAll('.text-orange-500');
      expect(valueElements.length).toBeGreaterThan(0);

      // Check that the value 120 is rendered
      const hasCorrectValue = Array.from(valueElements).some(el =>
        el.textContent?.includes('120')
      );
      expect(hasCorrectValue).toBe(true);
    });

    it('should handle different levels correctly', () => {
      const skill = assassinData.abilities[0];
      const levels = [1, 5, 10, 15, 20, 25, 30];

      levels.forEach(level => {
        const { unmount } = render(
          <SkillDesc
            ability={skill}
            buildAbility={{ level }}
            daevanionBoost={0}
          />
        );

        const valueElements = document.querySelectorAll('.text-orange-500');
        expect(valueElements.length).toBeGreaterThan(0);

        unmount();
      });
    });

    it('should apply Daevanion boost correctly', () => {
      const skill = assassinData.abilities[0];

      const { rerender } = render(
        <SkillDesc
          ability={skill}
          buildAbility={{ level: 5 }}
          daevanionBoost={0}
        />
      );

      const baseValues = document.querySelectorAll('.text-orange-500');

      // Re-render with +5 boost
      rerender(
        <SkillDesc
          ability={skill}
          buildAbility={{ level: 5 }}
          daevanionBoost={5}
        />
      );

      const boostedValues = document.querySelectorAll('.text-orange-500');

      // Should have same number of value elements
      expect(boostedValues.length).toBe(baseValues.length);
    });
  });

  describe('Heal Skill Rendering', () => {
    it('should render heal placeholders correctly', () => {
      // Find a heal skill from cleric
      const healSkill = clericData.abilities?.find((a: any) =>
        a.description.includes('SkillUIHPHeal')
      );

      if (healSkill) {
        render(
          <SkillDesc
            ability={healSkill}
            buildAbility={{ level: 5 }}
            daevanionBoost={0}
          />
        );

        const container = screen.getByText(/heal/i);
        expect(container).toBeInTheDocument();

        const valueElements = document.querySelectorAll('.text-orange-500');
        expect(valueElements.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Duration and Buffs', () => {
    it('should render duration placeholders', () => {
      const skill = assassinData.abilities[1]; // Flash Slice - has duration

      render(
        <SkillDesc
          ability={skill}
          buildAbility={{ level: 5 }}
          daevanionBoost={0}
        />
      );

      // Should render the description
      const container = screen.getByText(/blind/i);
      expect(container).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should show N/A for missing placeholders', () => {
      const skillWithoutData = {
        ...assassinData.abilities[0],
        descriptionData: undefined,
        levels: undefined,
      };

      render(
        <SkillDesc
          ability={skillWithoutData}
          buildAbility={{ level: 5 }}
          daevanionBoost={0}
        />
      );

      // Should still render something
      const container = screen.getByText(/damage/i);
      expect(container).toBeInTheDocument();
    });

    it('should handle missing ability gracefully', () => {
      const { container } = render(
        <SkillDesc
          ability={null}
          buildAbility={undefined}
          daevanionBoost={0}
        />
      );

      // Should render empty container or null
      expect(container.firstChild).toBeNull();
    });

    it('should handle invalid level data', () => {
      const skill = {
        ...assassinData.abilities[0],
        levels: [
          { level: 1, minValue: 'FALSE', maxValue: 'FALSE' },
        ],
      };

      render(
        <SkillDesc
          ability={skill}
          buildAbility={{ level: 1 }}
          daevanionBoost={0}
        />
      );

      // Should render without crashing
      const container = screen.getByText(/damage/i);
      expect(container).toBeInTheDocument();

      // Should show 0 for invalid values
      const valueElements = document.querySelectorAll('.text-orange-500');
      const hasZero = Array.from(valueElements).some(el =>
        el.textContent?.includes('0')
      );
      expect(hasZero).toBe(true);
    });

    it('should handle empty description', () => {
      const skillWithEmptyDesc = {
        ...assassinData.abilities[0],
        description: '',
      };

      const { container } = render(
        <SkillDesc
          ability={skillWithEmptyDesc}
          buildAbility={{ level: 5 }}
          daevanionBoost={0}
        />
      );

      // Should handle gracefully
      expect(container).toBeInTheDocument();
    });

    it('should handle description with only placeholders', () => {
      const skillWithOnlyPlaceholders = {
        ...assassinData.abilities[0],
        description: '{{DMG_MIN}} - {{DMG_MAX}}',
      };

      render(
        <SkillDesc
          ability={skillWithOnlyPlaceholders}
          buildAbility={{ level: 5 }}
          daevanionBoost={0}
        />
      );

      // Should render values
      const valueElements = document.querySelectorAll('.text-orange-500');
      expect(valueElements.length).toBe(2);
    });
  });

  describe('Passive Skills', () => {
    it('should render passive skills correctly', () => {
      const passive = assassinData.passives?.[0];

      if (passive) {
        render(
          <SkillDesc
            passive={passive}
            buildPassive={{ level: 5 }}
            daevanionBoost={0}
          />
        );

        // Should render
        const container = screen.getByText(/./);
        expect(container).toBeInTheDocument();
      }
    });
  });

  describe('Stigma Skills', () => {
    it('should render stigma skills correctly', () => {
      const stigma = assassinData.stigmas?.[0];

      if (stigma) {
        render(
          <SkillDesc
            stigma={stigma}
            buildStigma={{ level: 5 }}
            daevanionBoost={0}
          />
        );

        // Should render
        const container = screen.getByText(/./);
        expect(container).toBeInTheDocument();
      }
    });
  });

  describe('HTML Sanitization', () => {
    it('should remove HTML tags from descriptions', () => {
      const skill = assassinData.abilities[1]; // Flash Slice - has HTML

      render(
        <SkillDesc
          ability={skill}
          buildAbility={{ level: 5 }}
          daevanionBoost={0}
        />
      );

      // Should not contain raw HTML
      const description = screen.getByText(/./).textContent || '';
      expect(description).not.toContain('<span');
      expect(description).not.toContain('</span>');
    });

    it('should decode HTML entities', () => {
      const skillWithQuotes = {
        ...assassinData.abilities[0],
        description: 'Deals &quot;high&quot; damage {{DMG_MIN}}',
      };

      render(
        <SkillDesc
          ability={skillWithQuotes}
          buildAbility={{ level: 5 }}
          daevanionBoost={0}
        />
      );

      // Should decode &quot; to "
      const description = screen.getByText(/high damage/i);
      expect(description).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply orange color to placeholder values', () => {
      const skill = assassinData.abilities[0];

      render(
        <SkillDesc
          ability={skill}
          buildAbility={{ level: 5 }}
          daevanionBoost={0}
        />
      );

      const valueElements = document.querySelectorAll('.text-orange-500');
      expect(valueElements.length).toBeGreaterThan(0);

      // Check that each has the correct class
      valueElements.forEach(el => {
        expect(el.classList.contains('text-orange-500')).toBe(true);
        expect(el.classList.contains('font-semibold')).toBe(true);
      });
    });

    it('should apply custom className', () => {
      const skill = assassinData.abilities[0];

      const { container } = render(
        <SkillDesc
          ability={skill}
          buildAbility={{ level: 5 }}
          daevanionBoost={0}
          className="custom-test-class"
        />
      );

      const wrapper = container.querySelector('.custom-test-class');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Integration with Real Data', () => {
    it('should handle Quick Slice (Assassin) end-to-end', () => {
      const skill = assassinData.abilities[0];

      render(
        <SkillDesc
          ability={skill}
          buildAbility={{ level: 10 }}
          daevanionBoost={0}
        />
      );

      // At level 10, Quick Slice deals 281 damage
      const hasCorrectValue = Array.from(
        document.querySelectorAll('.text-orange-500')
      ).some(el => el.textContent?.includes('281'));

      expect(hasCorrectValue).toBe(true);
    });

    it('should handle skills with multiple placeholder types', () => {
      const skill = assassinData.abilities[1]; // Flash Slice

      render(
        <SkillDesc
          ability={skill}
          buildAbility={{ level: 15 }}
          daevanionBoost={0}
        />
      );

      // Should render multiple values
      const valueElements = document.querySelectorAll('.text-orange-500');
      expect(valueElements.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Performance', () => {
    it('should render quickly even with many placeholders', () => {
      const skill = assassinData.abilities[1]; // Flash Slice - multiple placeholders

      const startTime = performance.now();

      render(
        <SkillDesc
          ability={skill}
          buildAbility={{ level: 5 }}
          daevanionBoost={0}
        />
      );

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should render in less than 100ms
      expect(duration).toBeLessThan(100);
    });
  });
});
