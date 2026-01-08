"use client";

import { AbilityType, PassiveType, StigmaType } from "@/types/schema";
import { SkillDescProps } from "@/types/skill.type";
import { calculateStat, calculateStatWithQuestlogData } from "@/utils/statsUtils";
import { parseQuestlogDescription } from "@/utils/questlogDescriptionParser";
import React from "react";

/**
 * Remplace les placeholders dans la description par les valeurs calculées avec style orange
 * Placeholders supportés:
 * - {{DMG_MIN}} ou {{MIN_DMG}} -> damageMin calculé
 * - {{DMG_MAX}} -> damageMax calculé
 * - {{DAMAGE_PER_SECOND}} -> damagePerSecond calculé
 * - {{ATTACK_PERCENTAGE}} -> attack calculé (en pourcentage)
 * - {{MAX_HP_PERCENTAGE}} -> maxHP calculé (en pourcentage)
 * - {{MAX_MP_FLAT}} -> maxMP calculé (en flat)
 * - {{HEAL_MIN}} -> healMin calculé
 * - {{HEAL_MAX}} -> healMax calculé
 * - {{HEAL_BOOST_PERCENTAGE}} -> healBoost calculé (en pourcentage)
 * - {{DEFENSE_PERCENTAGE}} -> defense calculé (en pourcentage)
 * - {{CRITICAL_HIT_RESIST}} -> criticalHitResist calculé
 * - {{INCOMING_HEAL_PERCENTAGE}} -> incomingHeal calculé (en pourcentage)
 * - {{BLOCK_DAMAGE}} -> blockDamage calculé
 * - {{DAMAGE_BOOST_PERCENTAGE}} -> damageBoost calculé (en pourcentage)
 * - {{STATUS_EFFECT_RESIST}} -> statusEffectResist calculé
 * - {{IMPACT_TYPE_RESIST}} -> impactTypeResist calculé
 * - {{DAMAGE_TOLERANCE}} -> damageTolerance calculé
 * - {{DURATION}} -> duration calculé
 * - {{ENMITY}} -> enmity calculé
 * - {{PROTECTIVE_SHIELD}} -> protectiveShield calculé
 * - {{MP}} -> minMP calculé
 * - {{SMITE_PERCENTAGE}} -> smite calculé (en pourcentage)
 * - {{IMPACT_TYPE_CHANCE_PERCENTAGE}} -> impactTypeChance calculé (en pourcentage)
 * - {{MAX_HP}} -> maxHP calculé (en flat)
 */
function processDescription(
  description: string,
  skill: AbilityType | PassiveType | StigmaType,
  level: number
): (string | React.ReactElement)[] {
  const parts: (string | React.ReactElement)[] = [];
  let currentIndex = 0;

  // Fonction helper pour calculer une valeur
  const getCalculatedValue = (
    baseKey: string,
    modifierKey: string,
    modifiersKey: string
  ): number => {
    type SkillWithKeys = AbilityType | PassiveType | StigmaType;
    const skillRecord = skill as SkillWithKeys & Record<string, unknown>;
    const base =
      baseKey in skillRecord
        ? (skillRecord[baseKey] as number | null | undefined)
        : null;
    const modifier =
      modifierKey in skillRecord
        ? (skillRecord[modifierKey] as number | null | undefined)
        : null;
    const modifiersValue =
      modifiersKey in skillRecord ? skillRecord[modifiersKey] : null;
    const modifiers =
      modifiersValue && Array.isArray(modifiersValue)
        ? (modifiersValue as number[])
        : null;

    // Utiliser les données Questlog si disponibles
    const levels = 'levels' in skillRecord ? (skillRecord.levels as any) : undefined;
    const valueKey = baseKey.includes('Min') ? 'minValue' as const : 'maxValue' as const;

    return calculateStatWithQuestlogData(base, modifier, level, modifiers, levels, valueKey);
  };

  // Regex pour trouver tous les placeholders
  const placeholderRegex = /\{\{(\w+)\}\}/g;
  let match;
  let keyCounter = 0;

  while ((match = placeholderRegex.exec(description)) !== null) {
    // Ajouter le texte avant le placeholder
    if (match.index > currentIndex) {
      parts.push(description.substring(currentIndex, match.index));
    }

    // Calculer la valeur selon le placeholder
    const placeholder = match[1];
    let value: number;

    switch (placeholder) {
      case "DMG_MIN":
      case "MIN_DMG":
        value = getCalculatedValue(
          "damageMin",
          "damageMinModifier",
          "damageMinModifiers"
        );
        break;
      case "DMG_MAX":
        value = getCalculatedValue(
          "damageMax",
          "damageMaxModifier",
          "damageMaxModifiers"
        );
        break;
      case "DAMAGE_PER_SECOND":
        value = getCalculatedValue(
          "damagePerSecond",
          "damagePerSecondModifier",
          "damagePerSecondModifiers"
        );
        break;
      case "ATTACK_PERCENTAGE":
        // attack n'a pas de attackModifiers, seulement attackModifier
        value = getCalculatedValue("attack", "attackModifier", "");
        break;
      case "MAX_HP_PERCENTAGE":
        value = getCalculatedValue("maxHP", "maxHPModifier", "maxHPModifiers");
        break;
      case "MAX_MP_FLAT":
        value = getCalculatedValue("maxMP", "maxMPModifier", "maxMPModifiers");
        break;
      case "HEAL_MIN":
        value = getCalculatedValue(
          "healMin",
          "healMinModifier",
          "healMinModifiers"
        );
        break;
      case "HEAL_MAX":
        value = getCalculatedValue(
          "healMax",
          "healMaxModifier",
          "healMaxModifiers"
        );
        break;
      case "HEAL_BOOST_PERCENTAGE":
        value = getCalculatedValue(
          "healBoost",
          "healBoostModifier",
          "healBoostModifiers"
        );
        break;
      case "DEFENSE_PERCENTAGE":
        value = getCalculatedValue(
          "defense",
          "defenseModifier",
          "defenseModifiers"
        );
        break;
      case "CRITICAL_HIT_RESIST":
        value = getCalculatedValue(
          "criticalHitResist",
          "criticalHitResistModifier",
          "criticalHitResistModifiers"
        );
        break;
      case "INCOMING_HEAL_PERCENTAGE":
        value = getCalculatedValue(
          "incomingHeal",
          "incomingHealModifier",
          "incomingHealModifiers"
        );
        break;
      case "BLOCK_DAMAGE":
        value = getCalculatedValue(
          "blockDamage",
          "blockDamageModifier",
          "blockDamageModifiers"
        );
        break;
      case "DAMAGE_BOOST_PERCENTAGE":
        value = getCalculatedValue(
          "damageBoost",
          "damageBoostModifier",
          "damageBoostModifiers"
        );
        break;
      case "STATUS_EFFECT_RESIST":
        value = getCalculatedValue(
          "statusEffectResist",
          "statusEffectResistModifier",
          "statusEffectResistModifiers"
        );
        break;
      case "IMPACT_TYPE_RESIST":
        value = getCalculatedValue(
          "impactTypeResist",
          "impactTypeResistModifier",
          "impactTypeResistModifiers"
        );
        break;
      case "DAMAGE_TOLERANCE":
        value = getCalculatedValue(
          "damageTolerance",
          "damageToleranceModifier",
          "damageToleranceModifiers"
        );
        break;
      case "DURATION":
        value = getCalculatedValue(
          "duration",
          "durationModifier",
          "durationModifiers"
        );
        break;
      case "ENMITY":
        value = getCalculatedValue(
          "enmity",
          "enmityModifier",
          "enmityModifiers"
        );
        break;
      case "PROTECTIVE_SHIELD":
        value = getCalculatedValue(
          "protectiveShield",
          "protectiveShieldModifier",
          "protectiveShieldModifiers"
        );
        break;
      case "MP":
        value = getCalculatedValue(
          "minMP",
          "minMPModifier",
          "minMPModifiers"
        );
        break;
      case "SMITE_PERCENTAGE":
        value = getCalculatedValue(
          "smite",
          "smiteModifier",
          "smiteModifiers"
        );
        break;
      case "IMPACT_TYPE_CHANCE_PERCENTAGE":
        value = getCalculatedValue(
          "impactTypeChance",
          "impactTypeChanceModifier",
          "impactTypeChanceModifiers"
        );
        break;
      case "MAX_HP":
        value = getCalculatedValue("maxHP", "maxHPModifier", "maxHPModifiers");
        break;
      default:
        // Si le placeholder n'est pas reconnu, garder le texte original
        parts.push(match[0]);
        currentIndex = match.index + match[0].length;
        continue;
    }

    // Ajouter la valeur en orange
    parts.push(
      <span
        key={`value-${keyCounter++}`}
        className="text-orange-500 font-semibold"
      >
        {value}
      </span>
    );

    currentIndex = match.index + match[0].length;
  }

  // Ajouter le reste du texte
  if (currentIndex < description.length) {
    parts.push(description.substring(currentIndex));
  }

  return parts.length > 0 ? parts : [description];
}

//=============================
// COMPONENT
//=============================
export const SkillDesc = ({
  ability,
  passive,
  stigma,
  buildAbility,
  buildPassive,
  buildStigma,
  daevanionBoost = 0,
  className = "",
}: SkillDescProps & { daevanionBoost?: number }) => {
  const skill = ability || passive || stigma;
  const description = skill?.description;
  const baseLevel =
    buildAbility?.level || buildPassive?.level || buildStigma?.level || 1;

  // Utiliser le niveau effectif (base + boost Daevanion) pour le calcul des stats
  const level = baseLevel + (buildAbility || buildPassive ? daevanionBoost : 0);

  if (!description || !skill) {
    return null;
  }

  // D'abord, parser et normaliser les descriptions Questlog
  const normalizedDescription = parseQuestlogDescription(description, skill, level);

  // Puis traiter tous les placeholders avec le système existant (qui affiche en orange)
  const processedDescription = processDescription(normalizedDescription, skill, level);

  return (
    <div className={className}>
      <p className="text-sm text-foreground/80 pt-4 border-t-2 border-secondary">
        {processedDescription}
      </p>
    </div>
  );
};
