import type { AbilityType, PassiveType, StigmaType } from "@/types/schema";

type SkillWithDataLevels = AbilityType | PassiveType | StigmaType;

/**
 * Parse les descriptions Questlog et convertit TOUS les placeholders au format standard
 * Convertit les placeholders Questlog complexes en {{PLACEHOLDER}} simples
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

  // ==================== DÉGÂTS ====================
  // {se_dmg:XXXX:SkillUIMinDmgsum} ou {se_dmg:XXXX:SkillUIMinDmgSum} -> {{DMG_MIN}}
  cleaned = cleaned.replace(/\{se_dmg:[^}]+:SkillUIMinDmg[^\}]*\}/gi, '{{DMG_MIN}}');
  // {se_dmg:XXXX:SkillUIMaxDmgsum} ou {se_dmg:XXXX:SkillUIMaxDmgSum} -> {{DMG_MAX}}
  cleaned = cleaned.replace(/\{se_dmg:[^}]+:SkillUIMaxDmg[^\}]*\}/gi, '{{DMG_MAX}}');

  // ==================== HEALS ====================
  // {se_dmg:XXXX:SkillUIHPHealMin} -> {{HEAL_MIN}}
  cleaned = cleaned.replace(/\{se_dmg:[^}]+:SkillUIHPHealMin\}/gi, '{{HEAL_MIN}}');
  // {se_dmg:XXXX:SkillUIHPHealMax} -> {{HEAL_MAX}}
  cleaned = cleaned.replace(/\{se_dmg:[^}]+:SkillUIHPHealMax\}/gi, '{{HEAL_MAX}}');

  // ==================== DURÉES ====================
  // {se:XXXX:effect_value02:time} -> {{DURATION}}
  cleaned = cleaned.replace(/\{se:[^}]+:effect_value02:time\}/gi, '{{DURATION}}');

  // ==================== POURCENTAGES ET AUTRES VALEURS ====================
  // {se:XXXX:effect_value05:divide100} -> {{VALUE}}
  // {se_abe:XXXX:XXXX:value02:divide100} -> {{VALUE}}
  // {abe:XXXX:value02:divide100} -> {{VALUE}}
  // {se:XXXX:effect_value02} -> {{VALUE}}
  // {se_abe:XXXX:XXXX:value02} -> {{VALUE}}
  // {abe:XXXX:value02} -> {{VALUE}}
  // Tous les patterns se:XXX:value, se_abe:XXX:value, abe:XXX:value
  cleaned = cleaned.replace(/\{se_abe:[^}]+\}/gi, '{{VALUE}}');
  cleaned = cleaned.replace(/\{se:[^}]+:effect_value\d+\}/gi, '{{VALUE}}');
  cleaned = cleaned.replace(/\{abe:[^}]+\}/gi, '{{VALUE}}');

  // ==================== TARGET COUNT ====================
  // {sef:XXXX:target_count_max} -> {{VALUE}}
  cleaned = cleaned.replace(/\{sef:[^}]+\}/gi, '{{VALUE}}');

  // ==================== TOUT LE RESTE ====================
  // Tous les autres placeholders Questlog restants -> {{VALUE}}
  cleaned = cleaned.replace(/\{[a-z_]+:[^}]+\}/gi, '{{VALUE}}');

  return cleaned.trim();
}
