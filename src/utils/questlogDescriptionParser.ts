import type { AbilityType, PassiveType, StigmaType } from "@/types/schema";
import { calculateStatFromLevels } from "./statsUtils";

type SkillWithDataLevels = AbilityType | PassiveType | StigmaType;

/**
 * Parse les descriptions Questlog et convertit les placeholders au format standard
 * Nettoie le HTML et convertit les placeholders Questlog en {{DMG_MIN}}/{{DMG_MAX}}
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

  // Convertir les placeholders Questlog en placeholders standard
  // {se_dmg:XXXX:SkillUIMinDmgsum} -> {{DMG_MIN}}
  cleaned = cleaned.replace(/\{se_dmg:[^:]+:SkillUIMinDmg[^\}]*\}/gi, '{{DMG_MIN}}');
  cleaned = cleaned.replace(/\{se_dmg:[^:]+:SkillUIMaxDmg[^\}]*\}/gi, '{{DMG_MAX}}');

  return cleaned.trim();
}
