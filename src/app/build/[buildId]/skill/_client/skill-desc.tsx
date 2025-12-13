"use client";

import {
  AbilityType,
  BuildAbilityType,
  BuildPassiveType,
  BuildStigmaType,
  PassiveType,
  StigmaType,
} from "@/types/schema";
import { calculateStat } from "@/utils/statsUtils";
import React from "react";

type SkillDescProps = {
  ability?: AbilityType;
  passive?: PassiveType;
  stigma?: StigmaType;
  buildAbility?: BuildAbilityType;
  buildPassive?: BuildPassiveType;
  buildStigma?: BuildStigmaType;
  className?: string;
};

/**
 * Remplace les placeholders dans la description par les valeurs calculées avec style orange
 * Placeholders supportés:
 * - {{DMG_MIN}} -> damageMin calculé
 * - {{DMG_MAX}} -> damageMax calculé
 * - {{MAX_HP_PERCENTAGE}} -> maxHP calculé (en pourcentage)
 * - {{MAX_MP_FLAT}} -> maxMP calculé (en flat)
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
    const base = baseKey in skillRecord ? (skillRecord[baseKey] as number | null | undefined) : null;
    const modifier = modifierKey in skillRecord ? (skillRecord[modifierKey] as number | null | undefined) : null;
    const modifiersValue = modifiersKey in skillRecord ? skillRecord[modifiersKey] : null;
    const modifiers = modifiersValue && Array.isArray(modifiersValue)
      ? (modifiersValue as number[])
      : null;
    return calculateStat(base, modifier, level, modifiers);
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
        value = getCalculatedValue("damageMin", "damageMinModifier", "damageMinModifiers");
        break;
      case "DMG_MAX":
        value = getCalculatedValue("damageMax", "damageMaxModifier", "damageMaxModifiers");
        break;
      case "MAX_HP_PERCENTAGE":
        value = getCalculatedValue("maxHP", "maxHPModifier", "maxHPModifiers");
        break;
      case "MAX_MP_FLAT":
        value = getCalculatedValue("maxMP", "maxMPModifier", "maxMPModifiers");
        break;
      default:
        // Si le placeholder n'est pas reconnu, garder le texte original
        parts.push(match[0]);
        currentIndex = match.index + match[0].length;
        continue;
    }

    // Ajouter la valeur en orange
    parts.push(
      <span key={`value-${keyCounter++}`} className="text-orange-500 font-semibold">
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

export const SkillDesc = ({
  ability,
  passive,
  stigma,
  buildAbility,
  buildPassive,
  buildStigma,
  className = "",
}: SkillDescProps) => {
  const skill = ability || passive || stigma;
  const description = skill?.description;
  const level = buildAbility?.level || buildPassive?.level || buildStigma?.level || 1;

  if (!description || !skill) {
    return null;
  }

  const processedDescription = processDescription(description, skill, level);

  return (
    <div className={className}>
      <p className="text-sm text-foreground/80 pt-4 border-t-2 border-background/40">
        {processedDescription}
      </p>
    </div>
  );
};
