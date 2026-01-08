"use client";

import { AbilityType, PassiveType, StigmaType } from "@/types/schema";
import { SkillDescProps } from "@/types/skill.type";
import { SkillLevel } from "@/data/classes/types";
import { calculateStatWithQuestlogData } from "@/utils/statsUtils";
import { parseQuestlogDescription } from "@/utils/questlogDescriptionParser";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Types de placeholders pour le coloriage syntaxique
 */
type PlaceholderType = "damage" | "heal" | "duration" | "percentage" | "flat" | "unknown";

/**
 * Configuration des couleurs par type de placeholder
 */
const PLACEHOLDER_STYLES: Record<PlaceholderType, { className: string; label: string }> = {
  damage: {
    className: "text-orange-500 font-semibold cursor-help border-b border-orange-500/30 hover:border-orange-500 transition-colors",
    label: "Damage",
  },
  heal: {
    className: "text-green-500 font-semibold cursor-help border-b border-green-500/30 hover:border-green-500 transition-colors",
    label: "Heal",
  },
  duration: {
    className: "text-blue-500 font-semibold cursor-help border-b border-blue-500/30 hover:border-blue-500 transition-colors",
    label: "Duration",
  },
  percentage: {
    className: "text-purple-500 font-semibold cursor-help border-b border-purple-500/30 hover:border-purple-500 transition-colors",
    label: "Percentage",
  },
  flat: {
    className: "text-gray-500 font-semibold cursor-help border-b border-gray-500/30 hover:border-gray-500 transition-colors",
    label: "Flat Value",
  },
  unknown: {
    className: "text-red-500 font-semibold cursor-help border-b border-red-500/30 hover:border-red-500 transition-colors",
    label: "Unknown",
  },
};

/**
 * Mapping des placeholders vers leur type
 */
const PLACEHOLDER_TYPES: Record<string, PlaceholderType> = {
  DMG_MIN: "damage",
  MIN_DMG: "damage",
  DMG_MAX: "damage",
  DAMAGE_PER_SECOND: "damage",
  HEAL_MIN: "heal",
  HEAL_MAX: "heal",
  HEAL_BOOST_PERCENTAGE: "heal",
  DURATION: "duration",
  ATTACK_PERCENTAGE: "percentage",
  MAX_HP_PERCENTAGE: "percentage",
  DEFENSE_PERCENTAGE: "percentage",
  INCOMING_HEAL_PERCENTAGE: "percentage",
  DAMAGE_BOOST_PERCENTAGE: "percentage",
  SMITE_PERCENTAGE: "percentage",
  IMPACT_TYPE_CHANCE_PERCENTAGE: "percentage",
  MAX_MP_FLAT: "flat",
  MAX_HP: "flat",
  CRITICAL_HIT_RESIST: "flat",
  BLOCK_DAMAGE: "flat",
  STATUS_EFFECT_RESIST: "flat",
  IMPACT_TYPE_RESIST: "flat",
  DAMAGE_TOLERANCE: "flat",
  ENMITY: "flat",
  PROTECTIVE_SHIELD: "flat",
  MP: "flat",
};

/**
 * Remplace les placeholders dans la description par les valeurs calculées avec style coloré
 * Placeholders supportés:
 * - {{DMG_MIN}} ou {{MIN_DMG}} -> damageMin calculé (orange)
 * - {{DMG_MAX}} -> damageMax calculé (orange)
 * - {{DAMAGE_PER_SECOND}} -> damagePerSecond calculé (orange)
 * - {{ATTACK_PERCENTAGE}} -> attack calculé (purple)
 * - {{MAX_HP_PERCENTAGE}} -> maxHP calculé (purple)
 * - {{MAX_MP_FLAT}} -> maxMP calculé (gray)
 * - {{HEAL_MIN}} -> healMin calculé (green)
 * - {{HEAL_MAX}} -> healMax calculé (green)
 * - {{HEAL_BOOST_PERCENTAGE}} -> healBoost calculé (green)
 * - {{DEFENSE_PERCENTAGE}} -> defense calculé (purple)
 * - {{CRITICAL_HIT_RESIST}} -> criticalHitResist calculé (gray)
 * - {{INCOMING_HEAL_PERCENTAGE}} -> incomingHeal calculé (purple)
 * - {{BLOCK_DAMAGE}} -> blockDamage calculé (gray)
 * - {{DAMAGE_BOOST_PERCENTAGE}} -> damageBoost calculé (purple)
 * - {{STATUS_EFFECT_RESIST}} -> statusEffectResist calculé (gray)
 * - {{IMPACT_TYPE_RESIST}} -> impactTypeResist calculé (gray)
 * - {{DAMAGE_TOLERANCE}} -> damageTolerance calculé (gray)
 * - {{DURATION}} -> duration calculé (blue)
 * - {{ENMITY}} -> enmity calculé (gray)
 * - {{PROTECTIVE_SHIELD}} -> protectiveShield calculé (gray)
 * - {{MP}} -> minMP calculé (gray)
 * - {{SMITE_PERCENTAGE}} -> smite calculé (purple)
 * - {{IMPACT_TYPE_CHANCE_PERCENTAGE}} -> impactTypeChance calculé (purple)
 * - {{MAX_HP}} -> maxHP calculé (gray)
 *
 * @returns Array de strings et React elements avec tooltips et couleurs
 */
function processDescription(
  description: string,
  skill: AbilityType | PassiveType | StigmaType,
  level: number
): (string | React.ReactElement)[] {
  const parts: (string | React.ReactElement)[] = [];
  let currentIndex = 0;

  // Fonction helper pour calculer une valeur avec ses détails pour le tooltip
  const getCalculatedValue = (
    baseKey: string,
    modifierKey: string,
    modifiersKey: string
  ): { value: number; base: number | null | undefined; modifier: number | null | undefined; level: number } => {
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
    const levels = 'levels' in skillRecord ? (skillRecord.levels as SkillLevel[] | Record<string, unknown>) : undefined;
    // Convert Record<string, unknown> to SkillLevel[] if needed
    const questlogLevels = Array.isArray(levels) ? levels as SkillLevel[] : undefined;
    const valueKey = baseKey.includes('Min') ? 'minValue' as const : 'maxValue' as const;

    const calculatedValue = calculateStatWithQuestlogData(base, modifier, level, modifiers, questlogLevels, valueKey);

    return {
      value: calculatedValue,
      base,
      modifier,
      level,
    };
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
    const placeholderType = PLACEHOLDER_TYPES[placeholder] || "unknown";
    const style = PLACEHOLDER_STYLES[placeholderType];

    let result: { value: number; base: number | null | undefined; modifier: number | null | undefined; level: number };

    switch (placeholder) {
      case "DMG_MIN":
      case "MIN_DMG":
        result = getCalculatedValue(
          "damageMin",
          "damageMinModifier",
          "damageMinModifiers"
        );
        break;
      case "DMG_MAX":
        result = getCalculatedValue(
          "damageMax",
          "damageMaxModifier",
          "damageMaxModifiers"
        );
        break;
      case "DAMAGE_PER_SECOND":
        result = getCalculatedValue(
          "damagePerSecond",
          "damagePerSecondModifier",
          "damagePerSecondModifiers"
        );
        break;
      case "ATTACK_PERCENTAGE":
        // attack n'a pas de attackModifiers, seulement attackModifier
        result = getCalculatedValue("attack", "attackModifier", "");
        break;
      case "MAX_HP_PERCENTAGE":
        result = getCalculatedValue("maxHP", "maxHPModifier", "maxHPModifiers");
        break;
      case "MAX_MP_FLAT":
        result = getCalculatedValue("maxMP", "maxMPModifier", "maxMPModifiers");
        break;
      case "HEAL_MIN":
        result = getCalculatedValue(
          "healMin",
          "healMinModifier",
          "healMinModifiers"
        );
        break;
      case "HEAL_MAX":
        result = getCalculatedValue(
          "healMax",
          "healMaxModifier",
          "healMaxModifiers"
        );
        break;
      case "HEAL_BOOST_PERCENTAGE":
        result = getCalculatedValue(
          "healBoost",
          "healBoostModifier",
          "healBoostModifiers"
        );
        break;
      case "DEFENSE_PERCENTAGE":
        result = getCalculatedValue(
          "defense",
          "defenseModifier",
          "defenseModifiers"
        );
        break;
      case "CRITICAL_HIT_RESIST":
        result = getCalculatedValue(
          "criticalHitResist",
          "criticalHitResistModifier",
          "criticalHitResistModifiers"
        );
        break;
      case "INCOMING_HEAL_PERCENTAGE":
        result = getCalculatedValue(
          "incomingHeal",
          "incomingHealModifier",
          "incomingHealModifiers"
        );
        break;
      case "BLOCK_DAMAGE":
        result = getCalculatedValue(
          "blockDamage",
          "blockDamageModifier",
          "blockDamageModifiers"
        );
        break;
      case "DAMAGE_BOOST_PERCENTAGE":
        result = getCalculatedValue(
          "damageBoost",
          "damageBoostModifier",
          "damageBoostModifiers"
        );
        break;
      case "STATUS_EFFECT_RESIST":
        result = getCalculatedValue(
          "statusEffectResist",
          "statusEffectResistModifier",
          "statusEffectResistModifiers"
        );
        break;
      case "IMPACT_TYPE_RESIST":
        result = getCalculatedValue(
          "impactTypeResist",
          "impactTypeResistModifier",
          "impactTypeResistModifiers"
        );
        break;
      case "DAMAGE_TOLERANCE":
        result = getCalculatedValue(
          "damageTolerance",
          "damageToleranceModifier",
          "damageToleranceModifiers"
        );
        break;
      case "DURATION":
        result = getCalculatedValue(
          "duration",
          "durationModifier",
          "durationModifiers"
        );
        break;
      case "ENMITY":
        result = getCalculatedValue(
          "enmity",
          "enmityModifier",
          "enmityModifiers"
        );
        break;
      case "PROTECTIVE_SHIELD":
        result = getCalculatedValue(
          "protectiveShield",
          "protectiveShieldModifier",
          "protectiveShieldModifiers"
        );
        break;
      case "MP":
        result = getCalculatedValue(
          "minMP",
          "minMPModifier",
          "minMPModifiers"
        );
        break;
      case "SMITE_PERCENTAGE":
        result = getCalculatedValue(
          "smite",
          "smiteModifier",
          "smiteModifiers"
        );
        break;
      case "IMPACT_TYPE_CHANCE_PERCENTAGE":
        result = getCalculatedValue(
          "impactTypeChance",
          "impactTypeChanceModifier",
          "impactTypeChanceModifiers"
        );
        break;
      case "MAX_HP":
        result = getCalculatedValue("maxHP", "maxHPModifier", "maxHPModifiers");
        break;
      default:
        // Si le placeholder n'est pas reconnu, afficher le placeholder original en rouge
        parts.push(
          <Tooltip key={`unknown-${keyCounter++}`}>
            <TooltipTrigger>
              <span className={style.className}>{match[0]}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold">Unknown Placeholder</p>
              <p className="text-xs text-muted-foreground">Type: {placeholder}</p>
            </TooltipContent>
          </Tooltip>
        );
        currentIndex = match.index + match[0].length;
        continue;
    }

    // Gérer les valeurs manquantes ou nulles
    if (result.value === 0 && result.base === null && !('descriptionData' in skill)) {
      // Placeholder non disponible
      parts.push(
        <Tooltip key={`missing-${keyCounter++}`}>
          <TooltipTrigger>
            <span className="text-gray-400 italic cursor-help border-b border-gray-400/30 hover:border-gray-400 transition-colors">
              N/A
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-semibold">Value Not Available</p>
            <p className="text-xs text-muted-foreground">Placeholder: {placeholder}</p>
            <p className="text-xs text-muted-foreground">Level: {level}</p>
          </TooltipContent>
        </Tooltip>
      );
    } else {
      // Ajouter la valeur avec style et tooltip
      parts.push(
        <Tooltip key={`value-${keyCounter++}`}>
          <TooltipTrigger>
            <span className={style.className}>{result.value}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-semibold">{style.label}</p>
            <div className="mt-1 space-y-0.5 text-xs">
              <p>Value: <span className="font-mono">{result.value}</span></p>
              {result.base !== null && <p>Base: <span className="font-mono">{result.base}</span></p>}
              {result.modifier !== null && <p>Modifier: <span className="font-mono">{result.modifier}</span></p>}
              <p>Level: <span className="font-mono">{result.level}</span></p>
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }

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

  // Mode debug pour développement
  const showDebug = process.env.NODE_ENV === 'development';

  if (!description || !skill) {
    return null;
  }

  try {
    // D'abord, parser et normaliser les descriptions Questlog
    const normalizedDescription = parseQuestlogDescription(description, skill, level);

    // Puis traiter tous les placeholders avec le système amélioré
    const processedDescription = processDescription(normalizedDescription, skill, level);

    return (
      <TooltipProvider>
        <div className={className}>
          <p className="text-sm text-foreground/80 pt-4 border-t-2 border-secondary">
            {processedDescription}
          </p>

          {/* Debug mode en développement */}
          {showDebug && 'descriptionData' in skill && (skill as any).descriptionData && (
            <details className="mt-2 text-xs bg-muted/50 p-2 rounded border">
              <summary className="cursor-pointer font-semibold text-muted-foreground hover:text-foreground transition-colors">
                Debug Info (dev only)
              </summary>
              <div className="mt-2 space-y-2">
                <div>
                  <p className="font-semibold text-muted-foreground">Raw Description:</p>
                  <pre className="whitespace-pre-wrap break-words text-[10px] text-gray-600 dark:text-gray-400 overflow-x-auto">
                    {description}
                  </pre>
                </div>
                <div>
                  <p className="font-semibold text-muted-foreground">Normalized Description:</p>
                  <pre className="whitespace-pre-wrap break-words text-[10px] text-gray-600 dark:text-gray-400 overflow-x-auto">
                    {String(normalizedDescription)}
                  </pre>
                </div>
                <div>
                  <p className="font-semibold text-muted-foreground">Description Data:</p>
                  <pre className="whitespace-pre-wrap break-words text-[10px] text-gray-600 dark:text-gray-400 overflow-x-auto">
                    {JSON.stringify((skill as any).descriptionData, null, 2)}
                  </pre>
                </div>
                <div>
                  <p className="font-semibold text-muted-foreground">Skill Level:</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Base: {baseLevel} | Boost: {daevanionBoost} | Total: {level}
                  </p>
                </div>
              </div>
            </details>
          )}
        </div>
      </TooltipProvider>
    );
  } catch (error) {
    // Gestion d'erreur graceful
    console.error('Error processing skill description:', error, {
      skillId: skill.id,
      skillName: skill.name,
      level,
      description: description.substring(0, 100) + '...',
    });

    return (
      <div className={className}>
        <p className="text-sm text-foreground/80 pt-4 border-t-2 border-secondary">
          {description}
        </p>
        {showDebug && (
          <details className="mt-2 text-xs bg-destructive/10 p-2 rounded border border-destructive/20">
            <summary className="cursor-pointer font-semibold text-destructive">
              Error Processing Description
            </summary>
            <pre className="mt-2 whitespace-pre-wrap break-words text-[10px] text-destructive/80 overflow-x-auto">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </details>
        )}
      </div>
    );
  }
};
