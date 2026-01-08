import type { AbilityType, PassiveType, StigmaType } from "@/types/schema";

type SkillWithDataLevels = AbilityType | PassiveType | StigmaType;

/**
 * Parse les descriptions Questlog et convertit TOUS les placeholders au format standard
 * Convertit les placeholders Questlog complexes en {{PLACEHOLDER}} simples
 * Pour les placeholders inconnus, extrait directement la valeur depuis descriptionData.placeholders
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

  // Fonction helper pour extraire une valeur depuis descriptionData.placeholders
  const getQuestlogPlaceholderValue = (placeholderKey: string): string | null => {
    type SkillWithKeys = AbilityType | PassiveType | StigmaType;
    const skillRecord = skill as SkillWithKeys & Record<string, unknown>;

    const descriptionData = skillRecord.descriptionData as {
      placeholders?: Record<string, {
        base?: { values?: string[] };
        levels?: Record<string, { values?: string[] }>;
      }>;
    } | undefined;

    if (!descriptionData?.placeholders) {
      return null;
    }

    const placeholder = descriptionData.placeholders[placeholderKey];
    if (!placeholder) {
      return null;
    }

    let values: string[] | undefined;
    if (level === 1) {
      values = placeholder.base?.values;
    } else if (placeholder.levels) {
      values = placeholder.levels[level.toString()]?.values;
    }

    if (!values || values.length === 0) {
      return null;
    }

    return values[0];
  };

  // ==================== DÉGÂTS ====================
  // {se_dmg:XXXX:SkillUIMinDmgsum} ou {se_dmg:XXXX:SkillUIMinDmgSum} -> {{DMG_MIN}}
  cleaned = cleaned.replace(/\{se_dmg:[^}]+:SkillUIMinDmg[^\}]*\}/gi, '{{DMG_MIN}}');
  cleaned = cleaned.replace(/\{se_dmg:[^}]+:SkillUIMaxDmg[^\}]*\}/gi, '{{DMG_MAX}}');

  // ==================== HEALS ====================
  // {se_dmg:XXXX:SkillUIHPHealMin} -> {{HEAL_MIN}}
  cleaned = cleaned.replace(/\{se_dmg:[^}]+:SkillUIHPHealMin\}/gi, '{{HEAL_MIN}}');
  cleaned = cleaned.replace(/\{se_dmg:[^}]+:SkillUIHPHealMax\}/gi, '{{HEAL_MAX}}');

  // ==================== DURÉES ====================
  // {se:XXXX:effect_value02:time} -> {{DURATION}}
  cleaned = cleaned.replace(/\{se:[^}]+:effect_value02:time\}/gi, '{{DURATION}}');

  // ==================== TOUS LES AUTRES PLACEHOLDERS ====================
  // Pour les placeholders inconnus, on extrait directement la valeur depuis descriptionData
  // Pattern: {se:XXXX:effect_value02} ou {se_abe:XXXX:XXXX:value02} ou {abe:XXXX:value02} etc.
  cleaned = cleaned.replace(/\{([a-z_]+):[^}]+\}/gi, (match, type) => {
    // Try to get value from Questlog data
    const value = getQuestlogPlaceholderValue(match);

    if (value !== null) {
      // Retourner la valeur directement (elle sera affichée en texte normal)
      return value;
    }

    // Si pas de valeur trouvée, garder le placeholder tel quel (pour le débogage)
    return match;
  });

  return cleaned.trim();
}
