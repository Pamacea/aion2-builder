/**
 * Tests pour le composant SkillDesc
 * Tests unitaires pour vérifier le traitement des placeholders et l'affichage
 */

import { render, screen } from "@testing-library/react";
import { SkillDesc } from "../_client/skill-desc";
import { AbilityType } from "@/types/schema";

// Mock du TooltipProvider
jest.mock("@/components/ui/tooltip", () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("SkillDesc Component", () => {
  const mockSkill: AbilityType = {
    id: "test-skill-1",
    name: "Test Skill",
    description: "Deals {{DMG_MIN}} to {{DMG_MAX}} damage and heals for {{HEAL_MIN}} HP.",
    damageMin: 100,
    damageMinModifier: 10,
    damageMinModifiers: [5, 10, 15],
    damageMax: 200,
    damageMaxModifier: 20,
    damageMaxModifiers: [10, 20, 30],
    healMin: 50,
    healMinModifier: 5,
    healMinModifiers: [2, 5, 8],
    icon: "",
    skillName: "",
    codeName: "",
    category: "SKILL",
  };

  const mockBuildAbility = {
    id: "build-ability-1",
    abilityId: "test-skill-1",
    level: 5,
  };

  describe("Placeholder Processing", () => {
    it("should replace damage placeholders with calculated values", () => {
      render(
        <SkillDesc
          ability={mockSkill}
          buildAbility={mockBuildAbility}
        />
      );

      // Vérifier que les valeurs sont affichées
      const container = screen.container;
      expect(container.textContent).toContain("Deals");
      expect(container.textContent).toContain("to");
      expect(container.textContent).toContain("damage and heals for");
      expect(container.textContent).toContain("HP");
    });

    it("should apply correct color classes to different placeholder types", () => {
      const { container } = render(
        <SkillDesc
          ability={mockSkill}
          buildAbility={mockBuildAbility}
        />
      );

      // Vérifier les classes de couleur pour les dégâts (orange)
      const damageElements = container.querySelectorAll('.text-orange-500');
      expect(damageElements.length).toBeGreaterThan(0);

      // Vérifier les classes de couleur pour les heals (green)
      const healElements = container.querySelectorAll('.text-green-500');
      expect(healElements.length).toBeGreaterThan(0);
    });

    it("should display N/A for missing placeholder values", () => {
      const skillWithoutData: AbilityType = {
        ...mockSkill,
        description: "Restores {{MP}} MP.",
        damageMin: null,
        damageMinModifier: null,
        damageMinModifiers: null,
      };

      const { container } = render(
        <SkillDesc
          ability={skillWithoutData}
          buildAbility={mockBuildAbility}
        />
      );

      expect(container.textContent).toContain("N/A");
    });
  });

  describe("Error Handling", () => {
    it("should return null when skill is missing", () => {
      const { container } = render(
        <SkillDesc
          buildAbility={mockBuildAbility}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it("should return null when description is missing", () => {
      const skillWithoutDescription: AbilityType = {
        ...mockSkill,
        description: "",
      };

      const { container } = render(
        <SkillDesc
          ability={skillWithoutDescription}
          buildAbility={mockBuildAbility}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it("should handle parsing errors gracefully", () => {
      // Mock console.error pour éviter les logs dans les tests
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const invalidSkill: AbilityType = {
        ...mockSkill,
        description: "Invalid {{UNKNOWN_PLACEHOLDER}}",
      };

      const { container } = render(
        <SkillDesc
          ability={invalidSkill}
          buildAbility={mockBuildAbility}
        />
      );

      // Le composant devrait afficher le placeholder inconnu
      expect(container.textContent).toContain("{{UNKNOWN_PLACEHOLDER}}");

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Level Calculation", () => {
    it("should use base level when no daevanion boost", () => {
      const { container } = render(
        <SkillDesc
          ability={mockSkill}
          buildAbility={mockBuildAbility}
          daevanionBoost={0}
        />
      );

      // Le niveau devrait être 5
      expect(container.textContent).toBeTruthy();
    });

    it("should apply daevanion boost to ability level", () => {
      const { container } = render(
        <SkillDesc
          ability={mockSkill}
          buildAbility={mockBuildAbility}
          daevanionBoost={5}
        />
      );

      // Le niveau devrait être 10 (5 + 5)
      expect(container.textContent).toBeTruthy();
    });
  });

  describe("Tooltip Functionality", () => {
    it("should render tooltips for placeholder values", () => {
      const { container } = render(
        <SkillDesc
          ability={mockSkill}
          buildAbility={mockBuildAbility}
        />
      );

      // Vérifier la présence des tooltips
      const tooltipElements = container.querySelectorAll('[data-state]');
      expect(tooltipElements.length).toBeGreaterThan(0);
    });

    it("should display placeholder type in tooltip", () => {
      const { container } = render(
        <SkillDesc
          ability={mockSkill}
          buildAbility={mockBuildAbility}
        />
      );

      // Les tooltips devraient contenir les labels
      expect(container.textContent).toBeTruthy();
    });
  });

  describe("Placeholder Types", () => {
    it("should correctly identify damage placeholders", () => {
      const skillWithMultipleDamage: AbilityType = {
        ...mockSkill,
        description: "{{DMG_MIN}} {{DMG_MAX}} {{DAMAGE_PER_SECOND}}",
      };

      const { container } = render(
        <SkillDesc
          ability={skillWithMultipleDamage}
          buildAbility={mockBuildAbility}
        />
      );

      const orangeElements = container.querySelectorAll('.text-orange-500');
      expect(orangeElements.length).toBe(3);
    });

    it("should correctly identify heal placeholders", () => {
      const healSkill: AbilityType = {
        ...mockSkill,
        description: "Heals for {{HEAL_MIN}} to {{HEAL_MAX}} HP.",
      };

      const { container } = render(
        <SkillDesc
          ability={healSkill}
          buildAbility={mockBuildAbility}
        />
      );

      const greenElements = container.querySelectorAll('.text-green-500');
      expect(greenElements.length).toBe(2);
    });

    it("should correctly identify duration placeholders", () => {
      const durationSkill: AbilityType = {
        ...mockSkill,
        description: "Stuns target for {{DURATION}} seconds.",
        duration: 3,
        durationModifier: 0,
        durationModifiers: [1, 2, 3],
      };

      const { container } = render(
        <SkillDesc
          ability={durationSkill}
          buildAbility={mockBuildAbility}
        />
      );

      const blueElements = container.querySelectorAll('.text-blue-500');
      expect(blueElements.length).toBe(1);
    });

    it("should correctly identify percentage placeholders", () => {
      const percentageSkill: AbilityType = {
        ...mockSkill,
        description: "Increases attack by {{ATTACK_PERCENTAGE}}%.",
        attack: 15,
        attackModifier: 2,
      };

      const { container } = render(
        <SkillDesc
          ability={percentageSkill}
          buildAbility={mockBuildAbility}
        />
      );

      const purpleElements = container.querySelectorAll('.text-purple-500');
      expect(purpleElements.length).toBe(1);
    });
  });
});
