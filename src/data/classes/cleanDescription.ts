import type { ClassData } from "./types";

/**
 * Nettoie les descriptions Questlog pour les utiliser dans le builder
 * - Retire le HTML
 * - Convertit les placeholders Questlog au format {{PLACEHOLDER}}
 */
export function cleanQuestlogDescription(description: string): string {
  let cleaned = description;

  // Retirer tous les tags HTML <span>
  cleaned = cleaned.replace(/<span[^>]*>/g, '');
  cleaned = cleaned.replace(/<\/span>/g, '');

  // Convertir les placeholders Questlog en placeholders simples
  // {se_dmg:XXXX:SkillUIMinDmgsum} -> {{DMG_MIN}}
  cleaned = cleaned.replace(/\{se_dmg:[^:]+:SkillUIMinDmg[^\}]*\}/g, '{{DMG_MIN}}');
  cleaned = cleaned.replace(/\{se_dmg:[^:]+:SkillUIMaxDmg[^\}]*\}/g, '{{DMG_MAX}}');

  // Autres placeholders courants
  cleaned = cleaned.replace(/\{se:[^:]+:[^:]+:effect_value01\}/g, '{{VALUE}}');
  cleaned = cleaned.replace(/\{se:[^:]+:[^:]+:effect_value02\}/g, '{{TIME}}');
  cleaned = cleaned.replace(/\{se:[^:]+:[^:]+:effect_value05\}/g, '{{PERCENT}}');
  cleaned = cleaned.replace(/\{abe:[^:]+:[^:]+:[^:]+\}/g, '{{VALUE}}');
  cleaned = cleaned.replace(/\{[^}]+\}/g, '{{VALUE}}');

  // Nettoyer les sauts de ligne excessifs
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}

/**
 * Nettoie toutes les descriptions d'une classe
 */
export function cleanClassDescriptions(classData: ClassData): ClassData {
  const cleaned = { ...classData };

  // Nettoyer les abilities
  if (cleaned.abilities) {
    cleaned.abilities = cleaned.abilities.map(ability => ({
      ...ability,
      description: ability.description ? cleanQuestlogDescription(ability.description) : ability.description
    }));
  }

  // Nettoyer les passives
  if (cleaned.passives) {
    cleaned.passives = cleaned.passives.map(passive => ({
      ...passive,
      description: passive.description ? cleanQuestlogDescription(passive.description) : passive.description
    }));
  }

  // Nettoyer les stigmas
  if (cleaned.stigmas) {
    cleaned.stigmas = cleaned.stigmas.map(stigma => ({
      ...stigma,
      description: stigma.description ? cleanQuestlogDescription(stigma.description) : stigma.description
    }));
  }

  return cleaned;
}
