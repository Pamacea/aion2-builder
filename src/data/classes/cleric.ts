import type { ClassData } from "./types";

export const clericData: ClassData = {
  name: "cleric",
  iconUrl: "IC_CLass_Clericx.webp",
  bannerUrl: "BA_Cleric.webp",
  characterURL: "CH_Cleric.webp",
  description:
    "Primary healer with potent recovery, barriers, and group-saving utility.",
  tags: ["distance", "heal", "buff"],

  // ==========================
  // Abilities
  // ==========================
  abilities: [
    // ABILITY 1(auto-attack)
    {
      name: "Earth's Retribution",
      iconUrl: "EarthsRetribution.webp",
      description:
        "Deals {{DMG_MIN}} - {{DMG_MAX}} Earth Damage to a target within 20m and restores 110MP.",
      condition: ["Mobile"],
      damageMin: 371,
      damageMinModifier: undefined,
      damageMinModifiers: [18, 18, 17, 27, 34, 41, 34, 34, 33, 34],
      damageMax: 390,
      damageMaxModifier: undefined,
      damageMaxModifiers: [18, 18, 17, 27, 34, 41, 34, 34, 33, 34],
      staggerDamage: 100,
      manaCost: 0,
      manaRegen: 0,
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Single Target",
      spellTag: ["Earth", "Attack", "Magic"],
      specialtyChoices: [
        {
          description: "+20% MP restored",
          unlockLevel: 8,
          abilityId: 1,
        },
        {
          description: " +15% [Discharge] Chain Skill",
          unlockLevel: 8,
          abilityId: 1,
        },
        {
          description: "+50% Multi-hit on hit",
          unlockLevel: 8,
          abilityId: 1,
        },
        {
          description: "-7s [Bolt] cooldown on Landing [Discharge]",
          unlockLevel: 12,
          abilityId: 1,
        },
        {
          description: "Change [Discharge] to AoE Skill",
          unlockLevel: 16,
          abilityId: 1,
        },
      ],
      // Chain Skills
      chainSkills: ["Earth's Retribution Chain"],

      // Attach to Class
      classId: 1,
    },
    // ABILITY 2
    {
      name: "Judgement Thunder",
      iconUrl: "JudgementThunder.webp",
      description:
        "Deals {{DMG_MIN}} - {{DMG_MAX}} Wind damage to up to 4 ennemies within 4m of the target.",
      condition: ["Mobile"],

      // Stats
      damageMin: 701,
      damageMinModifier: 1,
      damageMinModifiers: undefined,
      damageMax: 738,
      damageMaxModifier: undefined,
      damageMaxModifiers: undefined,
      staggerDamage: 2,

      manaCost: 0,
      manaRegen: 0,

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Single Target",
      spellTag: ["Wind", "Attack", "Magic"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "-20% MP consumed",
          unlockLevel: 8,
          abilityId: 1,
        },
        {
          description: "Max +12% damage when there are less target",
          unlockLevel: 8,
          abilityId: 1,
        },
        {
          description: "-10% ennemy Combat Speed for 5s",
          unlockLevel: 8,
          abilityId: 1,
        },
        {
          description:
            "10% Chance to inflict Root for 2s on Landing Discharge.",
          unlockLevel: 12,
          abilityId: 1,
        },
        {
          description: "Activates [Divine Punishement] 1 extra time",
          unlockLevel: 16,
          abilityId: 1,
        },
      ],
      classId: 1,
    },
    // ABILITY 3
    {
      name: "Debilitating Mark",
      iconUrl: "DebilitatingMark.webp",
      description:
        "X",
        condition: ["Nontarget Skill"],

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Single Target",
      spellTag: ["Wind", "Attack", "Magic"],

      classId: 1,
    },
    // ABILITY 4
    {
      name: "Divine Aura",
      iconUrl: "DivineAura.webp",
      description:
        "X",
        condition: ["Nontarget Skill"],

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Single Target",
      spellTag: ["Wind", "Attack", "Magic"],

      classId: 1,
    },
    // ABILITY 5
    {
      name: "Chain of Torment",
      iconUrl: "ChainOfTorment.webp",
      description:
        "X",
        condition: ["Nontarget Skill"],

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Single Target",
      spellTag: ["Wind", "Attack", "Magic"],

      classId: 1,
    },
    // ABILITY 6
    {
      name: "Lighting Strike Scattershot",
      iconUrl: "LightingStrikeScattershot.webp",
      description:
        "X",
        condition: ["Nontarget Skill"],

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Single Target",
      spellTag: ["Wind", "Attack", "Magic"],

      classId: 1,
    },
    // ABILITY 7
    {
      name: "Light of Regeneration",
      iconUrl: "LightOfRegeneration.webp",
      description:
        "X",
        condition: ["Nontarget Skill"],

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Single Target",
      spellTag: ["Wind", "Attack", "Magic"],

      classId: 1,
    },
    // ABILITY 8
    {
      name: "Condemnation",
      iconUrl: "Condemnation.webp",
      description:
        "X",
        condition: ["Nontarget Skill"],

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Single Target",
      spellTag: ["Wind", "Attack", "Magic"],

      classId: 1,
    },
    // ABILITY 9
    {
      name: "Healing Light",
      iconUrl: "HealingLight.webp",
      description:
        "X",
        condition: ["Nontarget Skill"],

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Single Target",
      spellTag: ["Wind", "Attack", "Magic"],

      classId: 1,
    },
    // ABILITY 10
    {
      name: "Radiant Recovery",
      iconUrl: "RadiantRecovery.webp",
      description:
        "X",
        condition: ["Nontarget Skill"],

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Single Target",
      spellTag: ["Wind", "Attack", "Magic"],

      classId: 1,
    },
    // ABILITY 11
    {
      name: "Bolt",
      iconUrl: "Bolt.webp",
      description:
        "X",
        condition: ["Nontarget Skill"],

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Single Target",
      spellTag: ["Wind", "Attack", "Magic"],

      classId: 1,
    },
    // ABILITY 12
    {
      name: "Defiance",
      iconUrl: "Defiance.webp",
      description:
        "X",
        condition: ["Nontarget Skill"],

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Single Target",
      spellTag: ["Wind", "Attack", "Magic"],

      classId: 1,
    },

    // ==========================
    // Chain Skills
    // ==========================
    // CHAIN SKILL 1 (Earth's Retribution Ability)
    {
      name: "Earth's Retribution Chain",
      iconUrl: "EarthsRetribution.webp",
      description:
        "Deals {{DMG_MIN}} - {{DMG_MAX}} Earth Damage to a target within 20m and restores 110MP.",
      condition: ["Mobile"],

      // Stats
      damageMin: 371,
      damageMinModifier: undefined,
      damageMinModifiers: [18, 18, 17, 27, 34, 41, 34, 34, 33, 34],
      damageMax: 390,
      damageMaxModifier: undefined,
      damageMaxModifiers: [18, 18, 17, 27, 34, 41, 34, 34, 33, 34],
      staggerDamage: 100,

      manaCost: 0,
      manaRegen: 0,

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Single Target",
      spellTag: ["Earth", "Attack", "Magic"],
      classId: 1,
    },
    // CHAIN SKILL 2 (Parent  Ability)
  ],
  // ==========================
  // Passives
  // ==========================
  passives: [
    // PASSIVE 1
    {
      name: "Warm Benediction",
      iconUrl: "WarmBenediction.webp",
      description:
        "Increase the caster's max HP by {{MAX_HP_PERCENTAGE}}% and MAX MP by {{MAX_MP_FLAT}}.",

      // Stats
      maxHP: 6,
      maxHPModifier: 1,
      maxMP: 7,
      maxMPModifier: 2,

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Caster",
      spellTag: ["Magic", "Buff"],

      classId: 1,
    },
    // PASSIVE 2
    {
      name: "Empyrean Lords",
      iconUrl: "EmpyreanLords.webp",
      description:
        "Restores caster's block by 200 and restores {{HEAL_MIN}} - {{HEAL_MAX}} HP on a sucessful Block.",

      // Stats
      healMin: 53,
      healMinModifier: 6,
      healMinModifiers: undefined,
      healMax: 64,
      healMaxModifier: 6,
      healMaxModifiers: undefined,

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Caster",
      spellTag: ["Magic", "Buff"],

      classId: 1,
    },
    // PASSIVE 3
    {
      name: "Empyrean Lord's Grace",
      iconUrl: "EmpyreanLordsGrace.webp",
      description:
        "Has a 50% chance to deal {{DMG_MIN}} - {{DMG_MAX}} extra damage on langing an attack on a target taking Damage over Time.",

      // Stats
      damageMin: 208,
      damageMinModifier: undefined,
      damageMinModifiers: undefined,
      damageMax: 218,
      damageMaxModifier: undefined,
      damageMaxModifiers: undefined,

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Caster",
      spellTag: ["Magic", "Buff"],

      classId: 1,
    },
    // PASSIVE 4
    {
      name: "Healing Enhancement",
      iconUrl: "HealingEnhancement.webp",
      description:
        "Increases the caster's Heal Boost by {{HEAL_BOOST_PERCENTAGE}}%.",

      // Stats
      healBoost: 10,
      healBoostModifier: 2,
      healBoostModifiers: undefined,

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Caster",
      spellTag: ["Magic", "Buff"],

      classId: 1,
    },
    // PASSIVE 5
    {
      name: "Immortal Veil",
      iconUrl: "ImmortalVeil.webp",
      description:
        "Increases the caster's Defense by {{DEFENSE_PERCENTAGE}}% and Critical hit Resist by {{CRITICAL_HIT_RESIST}}.",

      // Stats
      defense: 2,
      defenseModifier: 2,

      criticalHitResist: 100,
      criticalHitResistModifier: 10,

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Caster",
      spellTag: ["Magic", "Buff"],

      classId: 1,
    },
    // PASSIVE 6
    {
      name: "Heal Block",
      iconUrl: "HealBlock.webp",
      description:
        "Has a 7% chance to reduce the target's Incoming Heal by {{INCOMING_HEAL_PERCENTAGE}}% for 5s on landing an attack",

      // Stats
      incomingHeal: 32,
      incomingHealModifier: 2,
      incomingHealModifiers: undefined,

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Caster",
      spellTag: ["Magic", "Buff"],

      classId: 1,
    },
    // PASSIVE 7
    {
      name: "Prayer of Concentration",
      iconUrl: "PrayerOfConcentration.webp",
      description:
        "Forms a protective Shield wich blocks {{BLOCK_DAMAGE}} damage and increases the caster's Heal boost by {{HEAL_BOOST_PERCENTAGE}}% for 30s when HP is 50% or less.",

      // Stats
      healBoost: 20,
      healBoostModifier: undefined,
      healBoostModifiers: undefined,

      blockDamage: 424,
      blockDamageModifier: 28,
      blockDamageModifiers: undefined,

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Caster",
      spellTag: ["Magic", "Buff"],

      classId: 1,
    },
    // PASSIVE 8
    {
      name: "Earth's Grace",
      iconUrl: "EarthsGrace.webp",
      description:
        "Increases Damage Boost of the caster and party members within 40m by {{DAMAGE_BOOST_PERCENTAGE}}% for 5s on landing an attack while HP is 75% or more.",

      // Stats
      damageBoost: 11,
      damageBoostModifier: 1,
      damageBoostModifiers: undefined,

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Caster",
      spellTag: ["Magic", "Buff"],

      classId: 1,
    },
    // PASSIVE 9
    {
      name: "Survival Willpower",
      iconUrl: "SurvivalWillpower.webp",
      description:
        "Increases the caster's Status Effect Resist by {{STATUS_EFFECT_RESIST}}%. Increases Impact-Type Resist and Damage Tolerance by {{IMPACT_TYPE_RESIST}}% and {{DAMAGE_TOLERANCE}}% for 5s when afflicted with an Impact-type status.",

      // Stats
      damageTolerance: 14,
      damageToleranceModifier: 2,
      damageToleranceModifiers: undefined,

      impactTypeResist: 12,
      impactTypeResistModifier: 2,

      statusEffectResist: 16.5,
      statusEffectResistModifier: 1.5,

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Caster",
      spellTag: ["Magic", "Buff"],

      classId: 1,
    },
    // PASSIVE 10
    {
      name: "Radiant Benediction",
      iconUrl: "RadiantBenediction.webp",
      description:
        "Has a 7% chance to resto x-x HP to the caster and party members within 40m on landing an attack.",

      // Stats
      healMin: 480,
      healMinModifier: 10,
      healMinModifiers: undefined,
      healMax: 576,
      healMaxModifier: 10,
      healMaxModifiers: undefined,

      // Meta
      range: 20,
      area: 4,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Caster & Party Members",
      spellTag: ["Magic", "Buff"],

      classId: 1,
    },
  ],
  // ==========================
  // Stigmas
  // ==========================
  stigmas: [
    // STIGMA 1
    {
      name: "Power Burst",
      iconUrl: "PowerBurst.webp",
      description:
        "Deals {{DMG_MIN}} - {{DMG_MAX}} Earth Damage to a target within 20m.",

      // Stats
      damageMin: 788,
      damageMinModifier: undefined,
      damageMinModifiers: [18, 18, 17, 27, 34, 41, 34, 34, 33, 34],
      damageMax: 871,
      damageMaxModifier: undefined,
      damageMaxModifiers: [18, 18, 17, 27, 34, 41, 34, 34, 33, 34],
      staggerDamage: 50,

      manaCost: 200,
      manaRegen: 0,

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Single Target",
      spellTag: ["Earth", "Attack", "Magic"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "+20% Skill Speed",
          unlockLevel: 5,
          stigmaId: 1,
        },
        {
          description: "Guaranteed Crit on Hit",
          unlockLevel: 10,
          stigmaId: 1,
        },
        {
          description: "75% chance to inflict Knock Back",
          unlockLevel: 15,
          stigmaId: 1,
        },
        {
          description: "75% chance to inflict Stun for 3s",
          unlockLevel: 20,
          stigmaId: 1,
        },
      ],
      classId: 1,
    },
    // STIGMA 2
    {
      name: "Absolution",
      iconUrl: "Absolution.webp",
      description:
        "Removes up to 2 debuffs from the caster and party members within 25m and restores {{HEAL_MIN}} - {{HEAL_MAX}} HP.",
      condition: ["Nontarget Skill"],

      // Stats
      healMin: 100,
      healMinModifier: 10,
      healMinModifiers: undefined,
      healMax: 120,
      healMaxModifier: 10,
      healMaxModifiers: undefined,

      staggerDamage: 50,

      manaCost: 200,
      manaRegen: 0,

      // Meta
      area: 25,
      castingDuration: "Instant Cast",
      cooldown: "1 MIN",
      target: "Single Target",
      spellTag: ["Regen", "Magic"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "-30s cooldown",
          unlockLevel: 5,
          stigmaId: 1,
        },
        {
          description: "Removes up to 5 debuffs",
          unlockLevel: 10,
          stigmaId: 1,
        },
        {
          description:
            "Restores extra 10% of max Hp of the caster and party members",
          unlockLevel: 15,
          stigmaId: 1,
        },
        {
          description: "Removes all debuffs",
          unlockLevel: 20,
          stigmaId: 1,
        },
      ],
      classId: 1,
    },
    // STIGMA 3
    {
      name: "Healing Aura",
      iconUrl: "HealingAura.webp",
      description:
        "Summons a Healing Aura that lasts for 15 seconds near the caster. The Aura is stationary and periodically heals the caster and party members within 7m by {{HEAL_MIN}} - {{HEAL_MAX}} HP.",
      condition: ["Nontarget Skill"],

      // Stats
      healMin: 100,
      healMinModifier: 10,
      healMinModifiers: undefined,
      healMax: 120,
      healMaxModifier: 10,
      healMaxModifiers: undefined,

      manaCost: 0,
      manaRegen: 0,

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "1 MIN 30s",
      target: "Caster",
      spellTag: ["Regen", "Summon", "Magic"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "+3m [Healing Aura] healing radius",
          unlockLevel: 5,
          stigmaId: 1,
        },
        {
          description: "+10% Defense",
          unlockLevel: 10,
          stigmaId: 1,
        },
        {
          description: "+10% Atack",
          unlockLevel: 15,
          stigmaId: 1,
        },
        {
          description: "+10% Combat Speed",
          unlockLevel: 20,
          stigmaId: 1,
        },
      ],
      classId: 1,
    },
    // STIGMA 4
    {
      name: "",
      iconUrl: "PowerBurst.webp",
      description: "Increases Attack by {{ATTACK_PERCENTAGE}}% for 10s.",
      condition: ["Nontarget Skill", "Mobile"],

      // Stats
      attack: 20,
      attackModifier: undefined,

      manaCost: 0,
      manaRegen: 0,

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "1 MIN",
      target: "Caster",
      spellTag: ["Buff", "Magic"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "-30s cooldown",
          unlockLevel: 5,
          stigmaId: 1,
        },
        {
          description: "x1.5 [Empyrean Lord's Grace] effect for the duration",
          unlockLevel: 10,
          stigmaId: 1,
        },
        {
          description: "x1.5 [Earth's Grace] effect for the duration",
          unlockLevel: 15,
          stigmaId: 1,
        },
        {
          description: "+5% additionnal Attack effect",
          unlockLevel: 20,
          stigmaId: 1,
        },
      ],
      classId: 1,
    },
    // STIGMA 5
    {
      name: "Summon Ressurection",
      iconUrl: "SummonRessurection.webp",
      description: "Ressurect a fallen party member within 40m near the caster",
      condition: ["Nontarget Skill"],

      // Meta
      castingDuration: "2s",
      cooldown: "2 MIN",
      target: "Caster",
      spellTag: ["Buff", "Magic"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "-1s casting time",
          unlockLevel: 5,
          stigmaId: 1,
        },
        {
          description: "Invincible for 3s after res",
          unlockLevel: 10,
          stigmaId: 1,
        },
        {
          description: "Restores 20% of Max HP",
          unlockLevel: 15,
          stigmaId: 1,
        },
        {
          description: "Invincible for 5s after res",
          unlockLevel: 20,
          stigmaId: 1,
        },
      ],
      classId: 1,
    },
    // STIGMA 6
    {
      name: "Earth Punishment",
      iconUrl: "EarthPunishment.webp",
      description:
        "Deals {{DMG_MIN}} - {{DMG_MAX}} Earth Damage to a target within 20m and {{DAMAGE_PER_SECOND}} damage every 1s for 10s.",
      condition: ["Nontarget Skill", "Mobile"],

      // Stats
      damageMin: 788,
      damageMinModifier: 18,
      damageMax: 871,
      damageMaxModifier: 18,
      damagePerSecond: 10,
      damagePerSecondModifier: 10,
      damagePerSecondModifiers: undefined,

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "1 MIN",
      target: "Single Target",
      spellTag: ["Earth", "Attack", "Magic", "Debuff"],

      // Specialty Choices
      specialtyChoices: [
        {
          description:
            "[Condemnation] lands as Guaranteed Crit on Earth Punishment",
          unlockLevel: 5,
          stigmaId: 1,
        },
        {
          description: "-100 ennemy Block, -100 ennemy Evasion",
          unlockLevel: 10,
          stigmaId: 1,
        },
        {
          description: "-10% ennemy Attack, -10% ennemy Defense",
          unlockLevel: 15,
          stigmaId: 1,
        },
        {
          description: "+10s Earth Punishment duration",
          unlockLevel: 20,
          stigmaId: 1,
        },
      ],
      classId: 1,
    },
    // STIGMA 7
    {
      name: "Salvation",
      iconUrl: "Salvation.webp",
      description:
        "Nullifies all damage and resists new status effects for 5s. Some powerful attacks cannont be blocked.",
      condition: ["Nontarget Skill"],

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "2 MIN 30s",
      target: "Caster",
      spellTag: ["Buff", "Magic"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "+100% incoming Heal",
          unlockLevel: 5,
          stigmaId: 1,
        },
        {
          description: "Restores 20% of Max HP at the end of [Salvation]",
          unlockLevel: 10,
          stigmaId: 1,
        },
        {
          description: "Grants [Salvation] base effect to the party members",
          unlockLevel: 15,
          stigmaId: 1,
        },
        {
          description:
            "Activate [Salvation] when afflicted with impact-type status effect",
          unlockLevel: 20,
          stigmaId: 1,
        },
      ],
      classId: 1,
    },
    // STIGMA 8
    {
      name: "Root",
      iconUrl: "Root.webp",
      description:
        "Select a target within 20m and deal {{DMG_MIN}} Earth damage to up to 4 ennemies within 4m of the target with a 75% chance to inflict Root for 10s. 100% chance to inflict Root on NPC.",

      // Stats
      damageMin: 400,
      damageMinModifier: 24,
      damageMinModifiers: undefined,

      manaCost: 50,
      manaRegen: 0,

      // Meta
      range: 20,
      area: 4,
      castingDuration: "Instant Cast",
      cooldown: "1 MIN",
      target: "UP TO 4 ENEMIES",
      spellTag: ["Earth", "Attack", "Magic", "Debuff"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "Changes to mobile skill",
          unlockLevel: 5,
          stigmaId: 1,
        },
        {
          description: "+2s Root Duraction",
          unlockLevel: 10,
          stigmaId: 1,
        },
        {
          description: "+25% Root chance",
          unlockLevel: 15,
          stigmaId: 1,
        },
        {
          description: "x2 Damage over Time on Root target",
          unlockLevel: 20,
          stigmaId: 1,
        },
      ],
      classId: 1,
    },
    // STIGMA 9
    {
      name: "Light of Protection",
      iconUrl: "LightOfProtection.webp",
      description:
        "Increases Max Hp by x for 5 min and immediately restores X HP for the caster and the party within 40m.",
      condition: ["Nontarget Skill"],

      // Stats
      healMin: 100,
      healMinModifier: 10,
      healMinModifiers: undefined,
      healMax: 120,
      healMaxModifier: 10,
      healMaxModifiers: undefined,

      // Meta
      area: 40,
      castingDuration: "Instant Cast",
      cooldown: "3 MIN",
      target: "Caster & Party Members",
      spellTag: ["Buff", "Magic"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "+5% incoming Heal",
          unlockLevel: 5,
          stigmaId: 1,
        },
        {
          description: "+5% Move Speed",
          unlockLevel: 10,
          stigmaId: 1,
        },
        {
          description: "+100 Combat HP Regen",
          unlockLevel: 15,
          stigmaId: 1,
        },
        {
          description: "+5% Impact-type, Mental-ype, Ailment-Type",
          unlockLevel: 20,
          stigmaId: 1,
        },
      ],
      classId: 1,
    },
    // STIGMA 10
    {
      name: "Yustiel's Power",
      iconUrl: "YustielsPower.webp",
      description:
        "Increases Damage Tolerance by {{DAMAGE_TOLERANCE}}% for 10s for the caster and party members within 40m.",
      condition: ["Nontarget Skill"],

      // Stats
      damageTolerance: 20,
      damageToleranceModifier: undefined,
      damageToleranceModifiers: undefined,

      manaCost: 200,
      manaRegen: 0,

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "1 MIN 30s",
      target: "Caster & Party Members",
      spellTag: ["Buff", "Magic"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "10% Max HP Protective Shield",
          unlockLevel: 5,
          stigmaId: 1,
        },
        {
          description: "+100 Block and Evasion",
          unlockLevel: 10,
          stigmaId: 1,
        },
        {
          description: "+5% additional Damage Tolerance increase",
          unlockLevel: 15,
          stigmaId: 1,
        },
        {
          description: "+10% Impact-type, Mental-ype, Ailment-Type",
          unlockLevel: 20,
          stigmaId: 1,
        },
      ],
      classId: 1,
    },
    // STIGMA 11
    {
      name: "Voice of Doom",
      iconUrl: "VoiceOfDoom.webp",
      description:
        "Select a target within 20m an deal {{MIN_DMG}} Earth Damagee to up 4 ennemies within 4m of the target. Deals {{DAMAGE_PER_SECOND}} damage every 1s for 10S and reduces ennemy incoming Heal by 60%.",

      // Stats
      damageMin: 322,
      damageMinModifier: 12,
      damageMinModifiers: undefined,
      
      damagePerSecond: 4,
      damagePerSecondModifier: 2,
      damagePerSecondModifiers: undefined,

      manaCost: 100,
      manaRegen: 0,

      // Meta
      range: 20,
      area: 4,
      castingDuration: "Instant Cast",
      cooldown: "1 MIN 30s",
      target: "UP TO 4 ENEMIES",
      spellTag: ["Earth", "Attack", "Magic", "Debuff"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "Max +20% damage when more targets hit",
          unlockLevel: 5,
          stigmaId: 1,
        },
        {
          description: "Remove Protective Shields on hit",
          unlockLevel: 10,
          stigmaId: 1,
        },
        {
          description: "Additional -20% ennemy incoming Heal",
          unlockLevel: 15,
          stigmaId: 1,
        },
        {
          description: "-50% Damage over Time intervals",
          unlockLevel: 20,
          stigmaId: 1,
        },
      ],
      classId: 1,
    },
    // STIGMA 12
    {
      name: "Power Burst",
      iconUrl: "PowerBurst.webp",
      description:
        "Select a target within 20m and deal {{MIN_DMG}} damage to up 4 ennemies within 4m of the target with a 30% chance to inflict Root. 100% chance to inflict Root on NPC. Increases Defense by {{DEFENSE_PERCENTAGE}}%, max 20% proportional to hit targets.",
      condition: ["Avaible only when gliding"],

      // Stats
      damageMin: 482,
      damageMinModifier: 46,
      damageMinModifiers: undefined,

      defense: 2,
      defenseModifier: 2,

      // Meta
      range: 20,
      area: 4,
      castingDuration: "Instant Cast",
      cooldown: "2 MIN",
      target: "UP TO 4 ENEMIES",
      spellTag: ["Buff", "Attack", "Magic"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "+20% Attack for 5s on hit*",
          unlockLevel: 5,
          stigmaId: 1,
        },
        {
          description: "500MP damage on hit",
          unlockLevel: 10,
          stigmaId: 1,
        },
        {
          description: "+10m Range",
          unlockLevel: 15,
          stigmaId: 1,
        },
        {
          description: "+20% Root chance",
          unlockLevel: 20,
          stigmaId: 1,
        },
      ],
      classId: 1,
    },
  ],
};
