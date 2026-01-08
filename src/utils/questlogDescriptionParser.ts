import type { AbilityType, PassiveType, StigmaType } from "@/types/schema";
import { calculateStatFromLevels } from "./statsUtils";

type SkillWithDataLevels = AbilityType | PassiveType | StigmaType;

/**
 * Parse les descriptions Questlog et remplace les placeholders par les vraies valeurs
 * Supporte les formats:
 * - {{DMG_MIN}} / {{DMG_MAX}} (format actuel)
 * - {{VALUE}} (détecte automatiquement quelle stat utiliser)
 */
export function parseQuestlogDescription(
  description: string,
  skill: SkillWithDataLevels,
  level: number
): string {
  let parsed = description;

  // Nettoyer le HTML si présent
  parsed = parsed.replace(/<span[^>]*>/g, '');
  parsed = parsed.replace(/<\/span>/g, '');
  parsed = parsed.replace(/&quot;/g, '"');

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

  // Remplacer {{DMG_MIN}} et {{DMG_MAX}}
  const dmgMin = getValue('damageMin', 'minValue');
  const dmgMax = getValue('damageMax', 'maxValue');

  parsed = parsed.replace(/\{\{DMG_MIN\}\}/g, dmgMin !== null ? String(dmgMin) : '???');
  parsed = parsed.replace(/\{\{DMG_MAX\}\}/g, dmgMax !== null ? String(dmgMax) : '???');
  parsed = parsed.replace(/\{\{MIN_DMG\}\}/g, dmgMin !== null ? String(dmgMin) : '???');

  // Remplacer {{HEAL_MIN}} et {{HEAL_MAX}}
  const healMin = getValue('healMin', 'minValue');
  const healMax = getValue('healMax', 'maxValue');

  parsed = parsed.replace(/\{\{HEAL_MIN\}\}/g, healMin !== null ? String(healMin) : '???');
  parsed = parsed.replace(/\{\{HEAL_MAX\}\}/g, healMax !== null ? String(healMax) : '???');

  // Remplacer {{VALUE}} intelligemment
  // Si on a des dégâts, utiliser ceux-ci
  if (dmgMin !== null && dmgMax !== null) {
    const value = dmgMin === dmgMax ? String(dmgMin) : `${dmgMin}-${dmgMax}`;
    parsed = parsed.replace(/\{\{VALUE\}\}/g, value);
  } else if (healMin !== null && healMax !== null) {
    const value = healMin === healMax ? String(healMin) : `${healMin}-${healMax}`;
    parsed = parsed.replace(/\{\{VALUE\}\}/g, value);
  }

  // Autres remplacements
  parsed = parsed.replace(/\{\{TIME\}\}/g, 'X');
  parsed = parsed.replace(/\{\{PERCENT\}\}/g, 'X%');

  return parsed.trim();
}
