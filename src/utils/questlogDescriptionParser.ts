import type { AbilityType, PassiveType, StigmaType } from "@/types/schema";
import { calculateStatFromLevels } from "./statsUtils";

type SkillWithDataLevels = AbilityType | PassiveType | StigmaType;

/**
 * Parse les descriptions Questlog et convertit les placeholders au format standard
 * Nettoie le HTML et convertit {{VALUE}} en {{DMG_MIN}}-{{DMG_MAX}}
 * Retourne une string qui sera ensuite traitée par processDescription
 */
export function parseQuestlogDescription(
  description: string,
  skill: SkillWithDataLevels,
  level: number
): string {
  let cleaned = description;

  // Nettoyer le HTML si présent
  cleaned = cleaned.replace(/<span[^>]*>/g, '');
  cleaned = cleaned.replace(/<\/span>/g, '');
  cleaned = cleaned.replace(/&quot;/g, '"');

  // Helper pour récupérer une valeur depuis les levels Questlog ou les stats classiques
  const getValue = (
    baseKey: 'damageMin' | 'damageMax' | 'healMin' | 'healMax' | 'minMP' | 'maxHP',
    valueKey: 'minValue' | 'maxValue'
  ): number | null => {
    type SkillWithKeys = SkillWithDataLevels & Record<string, unknown>;
    const skillRecord = skill as SkillWithKeys;

    // Essayer les données Questlog d'abord
    const levels = skillRecord.levels as any;
    const questlogValue = calculateStatFromLevels(levels, level, valueKey);

    if (questlogValue !== null) {
      return questlogValue;
    }

    // Fallback sur les stats classiques
    const base = skillRecord[baseKey] as number | null | undefined;
    const modifier = skillRecord[`${baseKey}Modifier` as keyof typeof skillRecord] as number | null | undefined;
    const modifiers = skillRecord[`${baseKey}Modifiers` as keyof typeof skillRecord] as number[] | null | undefined;

    if (base !== null && base !== undefined) {
      let result = base;

      if (level > 1 && modifiers && modifiers.length > 0) {
        const index = Math.min(level - 2, modifiers.length - 1);
        let total = 0;
        for (let i = 0; i <= index; i++) {
          total += modifiers[i] ?? 0;
        }
        result += total;
      } else if (level > 1 && modifier) {
        result += modifier * (level - 1);
      }

      return result;
    }

    return null;
  };

  // Calculer les valeurs
  const dmgMin = getValue('damageMin', 'minValue');
  const dmgMax = getValue('damageMax', 'maxValue');
  const healMin = getValue('healMin', 'minValue');
  const healMax = getValue('healMax', 'maxValue');

  // Remplacer {{VALUE}} par le bon format (dégâts ou heal)
  if (dmgMin !== null && dmgMax !== null) {
    cleaned = cleaned.replace(/\{\{VALUE\}\}/g, dmgMin === dmgMax ? '{{DMG_MIN}}' : '{{DMG_MIN}}-{{DMG_MAX}}');
  } else if (healMin !== null && healMax !== null) {
    cleaned = cleaned.replace(/\{\{VALUE\}\}/g, healMin === healMax ? '{{HEAL_MIN}}' : '{{HEAL_MIN}}-{{HEAL_MAX}}');
  }

  // Remplacer {{DMG_MIN}} s'il n'y a pas de valeur
  if (dmgMin === null) {
    cleaned = cleaned.replace(/\{\{DMG_MIN\}\}/g, '???');
    cleaned = cleaned.replace(/\{\{MIN_DMG\}\}/g, '???');
  }

  if (dmgMax === null) {
    cleaned = cleaned.replace(/\{\{DMG_MAX\}\}/g, '???');
  }

  if (healMin === null) {
    cleaned = cleaned.replace(/\{\{HEAL_MIN\}\}/g, '???');
  }

  if (healMax === null) {
    cleaned = cleaned.replace(/\{\{HEAL_MAX\}\}/g, '???');
  }

  // Autres placeholders génériques - on les laisse pour le système existant
  cleaned = cleaned.replace(/\{\{TIME\}\}/g, 'X');
  cleaned = cleaned.replace(/\{\{PERCENT\}\}/g, 'X%');

  return cleaned.trim();
}
