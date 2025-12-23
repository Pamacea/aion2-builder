import type { ClassData } from "./types";

export const clericData: ClassData = {
  name: "cleric",
  iconUrl: "IC_Class_Cleric.webp",
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
      damageMin: 53,
      damageMinModifier: undefined,
      damageMinModifiers: [18, 18, 17, 27, 34, 41, 34, 34, 33],
      damageMax: undefined,
      damageMaxModifier: undefined,
      damageMaxModifiers: undefined,
      staggerDamage: 0,
      manaCost: 0,
      manaRegen: 110,
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
          description: "+15% [Discharge] Chain Skill",
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
      chainSkills: ["Thunder and Lighting", "Discharge"],

      // Attach to Class
      classId: 1,
    },
    // ABILITY 2
    {
      name: "Judgement Thunder",
      iconUrl: "JudgementThunder.webp",
      description:
        "Deals {{DMG_MIN}} Wind damage to up to 4 ennemies within 4m of the target.",
      condition: ["Mobile"],

      // Stats
      damageMin: 80,
      damageMinModifier: undefined,
      damageMinModifiers: [35, 35, 35, 52, 66, 80, 65, 66, 66],
      damageMax: undefined,
      damageMaxModifier: undefined,
      damageMaxModifiers: undefined,
      staggerDamage: 2,

      manaCost: 0,
      manaRegen: 0,

      // Meta
      range: 20,
      area: 4,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Single Target",
      spellTag: ["Wind", "Attack", "Magic"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "-20% MP consumed",
          unlockLevel: 8,
          abilityId: 2,
        },
        {
          description: "Max +12% damage when there are less target",
          unlockLevel: 8,
          abilityId: 2,
        },
        {
          description: "-10% ennemy Combat Speed for 5s",
          unlockLevel: 8,
          abilityId: 2,
        },
        {
          description:
            "10% Chance to inflict Root for 2s on Landing Discharge.",
          unlockLevel: 12,
          abilityId: 2,
        },
        {
          description: "Activates [Divine Punishment] 1 extra time",
          unlockLevel: 16,
          abilityId: 2,
        },
      ],
      chainSkills: ["Divine Punishment"],
      classId: 1,
    },
    // ABILITY 3
    {
      name: "Debilitating Mark",
      iconUrl: "DebilitatingMark.webp",
      description:
        "Select a target within 20m and deal {{DMG_MIN}} - {{DMG_MAX}} Wind damage to up to 4 ennemies within 4m of the target. Reduces ennemies' Wind Tolerance by 10% and deals {{DAMAGE_PER_SECOND}} Damage over Time every 1s for 10s",
      condition: [],

      // Stats
      damageMin: 53,
      damageMinModifier: undefined,
      damageMinModifiers: [33, 34, 33, 51, 63, 76, 63, 63, 64],
      damageMax: undefined,
      damageMaxModifier: undefined,
      damageMaxModifiers: undefined,
      damagePerSecond: 7,
      damagePerSecondModifier: undefined,
      damagePerSecondModifiers: [6, 5, 5, 7, 10, 11, 9, 10, 9],

      manaCost: 0,
      manaRegen: 0,

      // Meta
      range: 20,
      area: 4,
      castingDuration: "Instant Cast",
      cooldown: "10s",
      target: "4 Target",
      spellTag: ["Wind", "Attack", "Magic", "Debuff"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "Removes HP Consumed and restores 150MP",
          unlockLevel: 8,
          abilityId: 3,
        },
        {
          description: "–10% enemy Defense",
          unlockLevel: 8,
          abilityId: 3,
        },
        {
          description: "20% chance to inflict Stun for 3s",
          unlockLevel: 8,
          abilityId: 3,
        },
        {
          description: "Changes [Debilitating Mark] effect to –13% Effect Tolerance",
          unlockLevel: 12,
          abilityId: 3,
        },
        {
          description: "–50% Damage over Time intervals",
          unlockLevel: 16,
          abilityId: 3,
        },
      ],

      classId: 1,
    },
    // ABILITY 4
    {
      name: "Divine Aura",
      iconUrl: "DivineAura.webp",
      description:
        "Summons a Divine Aura near the caster. The Aura is stationary and periodically deals {{DMG_MIN}} Earth Damage to a selected target within 20m. The aura remains for 10s and consumes its own HP upon landing an attack.",
      condition: [],

      // Stats
      damageMin: 23,
      damageMinModifier: undefined,
      damageMinModifiers: [9, 9, 13, 17, 20, 17, 17, 17, 16],

      manaCost: 0,
      manaRegen: 0,

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "30s",
      target: "Single",
      spellTag: ["Magic", "Summon"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "–40% Move Speed for 3s to up to 4 enemies within 4m of the Aura",
          unlockLevel: 8,
          abilityId: 4,
        },
        {
          description: "Changes to AoE Skill",
          unlockLevel: 8,
          abilityId: 4,
        },
        {
          description: "+100% [Divine Aura]'s attacking speed",
          unlockLevel: 8,
          abilityId: 4,
        },
        {
          description: "+3s [Divine Aura] duration",
          unlockLevel: 12,
          abilityId: 4,
        },
        {
          description: "–5s cooldown",
          unlockLevel: 16,
          abilityId: 4,
        },
      ],

      classId: 1,
    },
    // ABILITY 5
    {
      name: "Chain of Torment",
      iconUrl: "ChainOfTorment.webp",
      description:
        "Select a target within 20m and deal {{DMG_MIN}} - {{DMG_MAX}} Earth damage top up to 4 ennemies within 4m of the target. Reduces ennemies Earth Tolerance by 10% and deals {{DAMAGE_PER_SECOND}} Damage over Time every 1s for 10s.",
      condition: ["Mobile"],

      // Stats
      damageMin: 116,
      damageMinModifier: undefined,
      damageMinModifiers: [45, 44, 68, 84, 102, 85, 84, 85, 84],
      damageMax: undefined,
      damageMaxModifier: undefined,
      damageMaxModifiers: undefined,
      damagePerSecond: 17,
      damagePerSecondModifier: undefined,
      damagePerSecondModifiers: [7, 6, 11, 12, 15, 13, 13, 13, 12],

      manaCost: 0,
      manaRegen: 0,

      // Meta
      range: 20,
      area: 4,
      castingDuration: "Instant Cast",
      cooldown: "20s",
      target: "4 Target",
      spellTag: ["Earth", "Attack", "Magic"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "Inflict Slowed",
          unlockLevel: 8,
          abilityId: 5,
        },
        {
          description: "+3s [Chain of Torment] effect duration",
          unlockLevel: 8,
          abilityId: 5,
        },
        {
          description: "20% chance to inflict Knockdown for 3s",
          unlockLevel: 8,
          abilityId: 5,
        },
        {
          description: "Changes [Chain of Torment] effect to –13% all Element Tolerance",
          unlockLevel: 12,
          abilityId: 5,
        },
        {
          description: "–50% Damage over Time intervals",
          unlockLevel: 16,
          abilityId: 5,
        },
      ],

      classId: 1,
    },
    // ABILITY 6
    {
      name: "Lighting Strike Scattershot",
      iconUrl: "LightingStrikeScattershot.webp",
      description:
        "Deals {{DMG_MIN}} - {{DMG_MAX}} damage to a target afflicted with Stagger within 20m.",
      condition: [],

      // Stats
      damageMin: 156,
      damageMinModifier: undefined,
      damageMinModifiers: [44, 68, 80, 100, 84, 84, 84, 80, 100],
      damageMax: undefined,
      damageMaxModifier: undefined,
      damageMaxModifiers: undefined,

      manaCost: 0,
      manaRegen: 0,

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant",
      target: "Single",
      spellTag: ["Attack", "Magic"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "Absorbs 10% of damage as HP",
          unlockLevel: 8,
          abilityId: 6,
        },
        {
          description: "Restores 120MP",
          unlockLevel: 8,
          abilityId: 6,
        },
        {
          description: "Changes to Mobile Skill",
          unlockLevel: 8,
          abilityId: 6,
        },
        {
          description: "Guaranteed Multi-Hit on hit",
          unlockLevel: 12,
          abilityId: 6,
        },
        {
          description: "–1s all skill cooldowns on hit",
          unlockLevel: 16,
          abilityId: 6,
        },
      ],

      classId: 1,
    },
    // ABILITY 7
    {
      name: "Light of Regeneration",
      iconUrl: "LightOfRegeneration.webp",
      description:
        "Restores {{HEAL_MIN}} - {{HEAL_MAX}} HP every 2s for 10s to the caster and party members within 25m.",
      condition: ["Nontarget Skill", "Mobile"],

      // Stats
      healMin: 25,
      healMinModifier: undefined,
      healMinModifiers: [8, 9, 20, 10, 17, 16, 10, 20, 10],
      healMax: 30,
      healMaxModifier: undefined,
      healMaxModifiers: [10, 10, 24, 13, 20, 19, 12, 24, 12],

      manaCost: 0,
      manaRegen: 0,

      // Meta
      range: 20,
      area: 25,
      castingDuration: "Instant Cast",
      cooldown: "10s",
      target: "Party, Caster",
      spellTag: ["Magic", "Regen", "Buff"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "+5% Defense",
          unlockLevel: 8,
          abilityId: 7,
        },
        {
          description: "+3% Attack",
          unlockLevel: 8,
          abilityId: 7,
        },
        {
          description: "+50 Block, 50 Evasion",
          unlockLevel: 8,
          abilityId: 7,
        },
        {
          description: "+50 Critical hit",
          unlockLevel: 12,
          abilityId: 7,
        },
        {
          description: "+5% Damage Tolerance",
          unlockLevel: 16,
          abilityId: 7,
        },
      ],

      chainSkills: ["Healing Light"],

      classId: 1,
    },
    // ABILITY 8
    {
      name: "Condemnation",
      iconUrl: "Condemnation.webp",
      description:
        "Select a target within 20m afflicted with Chain of Torment and deal {{DMG_MIN}} - {{DMG_MAX}} Earth damage to up to 4 ennemies within 4m of the target.",
      condition: [],

      // Stats
      damageMin: 241,
      damageMinModifier: undefined,
      damageMinModifiers: [79, 100, 119, 99, 99, 100, 99, 119, 100],

      manaCost: 0,
      manaRegen: 0,

      // Meta
      range: 20,
      area: 4,
      castingDuration: "Instant Cast",
      cooldown: "3s",
      target: "4 Target",
      spellTag: ["Earth", "Attack", "Magic"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "Restores 100MP on hit",
          unlockLevel: 8,
          abilityId: 8,
        },
        {
          description: "+50% Multi-Hit on hit",
          unlockLevel: 8,
          abilityId: 8,
        },
        {
          description: "Changes to mobile Skill",
          unlockLevel: 8,
          abilityId: 8,
        },
        {
          description: "50% chance to reset [Condemnation]",
          unlockLevel: 12,
          abilityId: 8,
        },
        {
          description: "20% chance to inflict Root for 3s",
          unlockLevel: 16,
          abilityId: 8,
        },
      ],

      classId: 1,
    },
    // ABILITY 9
    {
      name: "Healing Light",
      iconUrl: "HealingLight.webp",
      description:
        "Restores {{HEAL_MIN}} - {{HEAL_MAX}} HP to the caster and the party member within 25m with the lowest HP. Can be used while Light Of Regeneration is in effect.",
      condition: ["Nontarget Skill", "Mobile"],

      // Stats
      healMin: 120,
      healMinModifier: undefined,
      healMinModifiers: [31, 72, 37, 59, 59, 35, 70, 36, 46],
      healMax: 132,
      healMaxModifier: undefined,
      healMaxModifiers: [34, 79, 41, 65, 65, 38, 77, 40, 51],

      manaCost: 0,
      manaRegen: 0,

      // Meta
      range: 20,
      area: 25,
      castingDuration: "Instant Cast",
      cooldown: "3s",
      target: "Single, Party",
      spellTag: ["Magic", "Regen"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "Removes MP consumed",
          unlockLevel: 8,
          abilityId: 9,
        },
        {
          description: "+25% restored if the healing target's is less than 50%",
          unlockLevel: 8,
          abilityId: 9,
        },
        {
          description: "25 chance to remove 1 debuff",
          unlockLevel: 8,
          abilityId: 9,
        },
        {
          description: "+20% Skill Speed",
          unlockLevel: 12,
          abilityId: 9,
        },
        {
          description: "–2s cooldown",
          unlockLevel: 16,
          abilityId: 9,
        },
      ],

      classId: 1,
    },
    // ABILITY 10
    {
      name: "Radiant Recovery",
      iconUrl: "RadiantRecovery.webp",
      description:
        "Restores {{HEAL_MIN}} - {{HEAL_MAX}} HP to the caster and party members within 25m. Restores {{HEAL_MIN_FULLY_CHARGED}} - {{HEAL_MAX_FULLY_CHARGED}} when fully charged.",
      condition: ["Nontarget Skill", "Charge Skill"],

      // Stats
      healMin: 210,
      healMinModifier: undefined,
      healMinModifiers: [55, 125, 65, 103, 102, 62, 122, 63, 81],
      healMax: 231,
      healMaxModifier: undefined,
      healMaxModifiers: [61, 137, 72, 113, 112, 68, 134, 70, 89],
      // Fully charged values
      minHP: 315,
      minHPModifier: undefined,
      minHPModifiers: [82, 188, 98, 154, 153, 93, 183, 94, 123],
      maxHP: 347,
      maxHPModifier: undefined,
      maxHPModifiers: [90, 207, 107, 170, 168, 102, 202, 103, 135],

      manaCost: 0,
      manaRegen: 0,

      // Meta
      area: 25,
      castingDuration: "0.5s",
      cooldown: "7s",
      target: "Party, Caster",
      spellTag: ["Magic", "Regen"],
      chargeLevels: "1 charge level",

      // Specialty Choices
      specialtyChoices: [
        {
          description: "Removes up to 2 debuffs when fully charged",
          unlockLevel: 8,
          abilityId: 10,
        },
        {
          description: "+20% Skill Speed",
          unlockLevel: 8,
          abilityId: 10,
        },
        {
          description: "Changes to mobile Skill",
          unlockLevel: 8,
          abilityId: 10,
        },
        {
          description: "+20% Incoming Heal for 10s when fully charged",
          unlockLevel: 12,
          abilityId: 10,
        },
        {
          description: "Removes extra 10% of Max HP when fully charged",
          unlockLevel: 16,
          abilityId: 10,
        },
      ],

      classId: 1,
    },
    // ABILITY 11
    {
      name: "Bolt",
      iconUrl: "Bolt.webp",
      description:
        "Select a target within 20m and deal {{DMG_MIN}} - {{DMG_MAX}} Wind damage to up to 4 ennemies within 4m of the target.",
      condition: ["Charge Skill"],

      // Stats
      damageMin: 685,
      damageMinModifier: undefined,
      damageMinModifiers: [195, 161, 162, 162, 161, 195, 162, 119, 85],
      damageMax: 1096,
      damageMaxModifier: undefined,
      damageMaxModifiers: [311, 259, 259, 258, 259, 312, 258, 191, 137],

      manaCost: 0,
      manaRegen: 0,

      // Meta
      range: 4,
      area: 4,
      castingDuration: "0.5s, 1s, 1.5s",
      cooldown: "45s",
      target: "4 Target",
      spellTag: ["Attack", "Magic", "Wind"],
      chargeLevels: "3 charge level",

      // Specialty Choices
      specialtyChoices: [
        {
          description: "30% chance to inflict Stun for 3s at when fully charged",
          unlockLevel: 8,
          abilityId: 11,
        },
        {
          description: "Changes to mobile Skill",
          unlockLevel: 8,
          abilityId: 11,
        },
        {
          description: "+30% Skill Speed",
          unlockLevel: 8,
          abilityId: 11,
        },
        {
          description: "Max +20% damage when more targets hit",
          unlockLevel: 12,
          abilityId: 11,
        },
        {
          description: "Reset [Bolt] cooldown on defeating an ennemy with [Bolt]",
          unlockLevel: 16,
          abilityId: 11,
        },
      ],

      classId: 1,
    },
    // ABILITY 12
    {
      name: "Defiance",
      iconUrl: "Defiance.webp",
      description:
        "Removes STUN, KNOCKDOWN and AIRBORNE from the caster and grants Tenacity for 5s. Tenacity : +100% Stun, Knockdown, Airborne Resist.",
      condition: ["Nontarget Skill"],

      // Stats
      manaCost: 0,
      manaRegen: 0,

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "58s",
      target: "Caster",
      spellTag: ["Buff"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "20% Damage Tolerance for Tenacity duration",
          unlockLevel: 8,
          abilityId: 12,
        },
        {
          description: "10% Damage Reflection for Tenacity duration",
          unlockLevel: 8,
          abilityId: 12,
        },
        {
          description: "Restores 20% HP on casting [Defiance]",
          unlockLevel: 8,
          abilityId: 12,
        },
        {
          description: "+2s Tenacity duration",
          unlockLevel: 12,
          abilityId: 12,
        },
        {
          description: "25% chance to reset cooldown on casting [Defiance]",
          unlockLevel: 16,
          abilityId: 12,
        },
      ],

      chainSkills: ["Blessing of Regeneration"],

      classId: 1,
    },

    // ==========================
    // Chain Skills
    // ==========================
    // CHAIN SKILL 1 (Earth's Retribution - Thunder and Lighting)
    {
      name: "Thunder and Lighting",
      iconUrl: "EarthsRetribution.webp",
      description:
        "Deals {{DMG_MIN}} - {{DMG_MAX}} Wind damage to a target within 20m and restores 110MP.",
      condition: ["Mobile"],

      // Stats
      damageMin: 54,
      damageMinModifier: undefined,
      damageMinModifiers: [19, 19, 20, 28, 36, 44, 36, 36, 36],
      damageMax: undefined,
      damageMaxModifier: undefined,
      damageMaxModifiers: undefined,

      manaCost: 0,
      manaRegen: 110,

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Single",
      spellTag: ["Wind", "Attack", "Magic"],
      classId: 1,
    },
    // CHAIN SKILL 2 (Earth's Retribution - Discharge)
    {
      name: "Discharge",
      iconUrl: "EarthsRetribution.webp",
      description:
        "Deals {{DMG_MIN}} - {{DMG_MAX}} Wind damage to a target within 20m and restores 150MP.",
      condition: ["Mobile"],

      // Stats
      damageMin: 145,
      damageMinModifier: undefined,
      damageMinModifiers: [75, 75, 76, 113, 141, 171, 142, 142, 142],

      manaCost: 0,
      manaRegen: 150,

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Single",
      spellTag: ["Wind", "Attack", "Magic"],
      classId: 1,
    },
    // CHAIN SKILL 3 (Judgement Thunder - Divine Punishment)
    {
      name: "Divine Punishment",
      iconUrl: "JudgementThunder.webp",
      description:
        "Select a target within 20m and deal {{DMG_MIN}} - {{DMG_MAX}} Wind damage to up to 4 ennemies within 4m of the target.",
      condition: ["Mobile"],

      // Stats
      damageMin: 83,
      damageMinModifier: undefined,
      damageMinModifiers: [37, 37, 38, 55, 70, 84, 70, 70, 69],

      manaCost: -120,
      manaRegen: 0,

      // Meta
      range: 20,
      area: 4,
      castingDuration: "Instant Cast",
      cooldown: "Instant",
      target: "4 Target",
      spellTag: ["Wind", "Attack", "Magic"],
      classId: 1,
    },
    // CHAIN SKILL 4 (Defiance - Blessing of Regeneration)
    {
      name: "Blessing of Regeneration",
      iconUrl: "Defiance.webp",
      description:
        "Restores the caster's HP by {{HEAL_MIN}} - {{HEAL_MAX}} and MP by 40%",
      condition: ["Nontarget Skill", "Mobile"],

      // Stats
      healMin: 814,
      healMinModifier: undefined,
      healMinModifiers: [386, 90, 97, 104, 112, 120, 129, 139, 149],
      healMax: 977,
      healMaxModifier: undefined,
      healMaxModifiers: [343, 99, 107, 114, 123, 132, 142, 153, 164],

      manaCost: 0,
      manaRegen: 0,

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "2 MIN",
      target: "Caster",
      spellTag: ["Magic", "Regen"],
      classId: 1,
    },
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
      healMinModifier: undefined,
      healMinModifiers: [14, 20, 23, 52, 27, 43, 43, 25, 51],
      healMax: 64,
      healMaxModifier: undefined,
      healMaxModifiers: [16, 24, 28, 62, 33, 51, 52, 30, 61],

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
      damageMin: 51,
      damageMinModifier: undefined,
      damageMinModifiers: [17, 21, 26, 21, 21, 22, 21, 26, 21],

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
        "Forms a protective Shield with blocks {{BLOCK_DAMAGE}} damage and increases the caster's Heal boost by {{HEAL_BOOST_PERCENTAGE}}% for 30s when HP is 50% or less.",

      // Stats
      healBoost: 20,
      healBoostModifier: undefined,
      healBoostModifiers: undefined,

      blockDamage: 424,
      blockDamageModifier: undefined,
      blockDamageModifiers: [200, 105, 164, 163, 99, 196, 100, 131, 67],

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
      damageBoost: 10.5,
      damageBoostModifier: 0.5,

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
        "Has a 7% chance to resto {{HEAL_MIN}} - {{HEAL_MAX}} HP to the caster and party members within 40m on landing an attack.",

      // Stats
      healMin: 480,
      healMinModifier: undefined,
      healMinModifiers: [46, 89, 45, 60, 30, 123, 62, 33, 34],
      healMax: 576,
      healMaxModifier: undefined,
      healMaxModifiers: [55, 107, 54, 72, 36, 148, 74, 40, 40],

      // Meta
      range: 20,
      area: 4,
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Caster, Party",
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
      healMin: 2003,
      healMinModifier: undefined,
      healMinModifiers: [365, 223, 438, 224, 293, 151, 366, 161, 162],
      healMax: 2203,
      healMaxModifier: undefined,
      healMaxModifiers: [402, 245, 482, 246, 323, 166, 402, 177, 179],

      manaCost: 200,
      manaRegen: 0,

      // Meta
      area: 25,
      castingDuration: "Instant Cast",
      cooldown: "1 MIN",
      target: "Party, Caster",
      spellTag: ["Magic", "Regen"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "-30s cooldown",
          unlockLevel: 5,
          stigmaId: 2,
        },
        {
          description: "Removes up to 5 debuffs",
          unlockLevel: 10,
          stigmaId: 2,
        },
        {
          description:
            "Restores extra 10% of max Hp of the caster and party members",
          unlockLevel: 15,
          stigmaId: 2,
        },
        {
          description: "Removes all debuffs",
          unlockLevel: 20,
          stigmaId: 2,
        },
      ],
      classId: 1,
    },
    // STIGMA 3
    {
      name: "Healing Aura",
      iconUrl: "HealingAura.webp",
      description:
        "Summons a Healing Aura that lasts for 15 seconds near the caster. The Aura is stationary and periodically heals the caster and party members within 7m by {{HEAL_MIN}} - {{HEAL_MAX}}.",
      condition: ["Nontarget Skill"],

      // Stats
      healMin: 239,
      healMinModifier: undefined,
      healMinModifiers: [43, 27, 52, 27, 35, 18, 44, 19, 19],
      healMax: 287,
      healMaxModifier: undefined,
      healMaxModifiers: [51, 33, 62, 33, 42, 21, 53, 23, 23],

      manaCost: 0,
      manaRegen: 0,

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "1 MIN 30s",
      target: "Caster",
      spellTag: ["Magic", "Summon", "Regen"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "+3m [Healing Aura] healing radius",
          unlockLevel: 5,
          stigmaId: 3,
        },
        {
          description: "+10% Defense",
          unlockLevel: 10,
          stigmaId: 3,
        },
        {
          description: "+10% Atack",
          unlockLevel: 15,
          stigmaId: 3,
        },
        {
          description: "+10% Combat Speed",
          unlockLevel: 20,
          stigmaId: 3,
        },
      ],
      classId: 1,
    },
    // STIGMA 4
    {
      name: "Prayer of Amplification",
      iconUrl: "PowerBurst.webp",
      description: "Increases Attack by {{ATTACK_PERCENTAGE}}% for 10s.",
      condition: ["Nontarget Skill", "Mobile"],

      // Stats
      attack: 20,
      attackModifier: undefined,

      manaCost: 0,
      manaRegen: 0,

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "1 MIN",
      target: "Caster",
      spellTag: ["Buff", "Magic"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "-30s cooldown",
          unlockLevel: 5,
          stigmaId: 4,
        },
        {
          description: "x1.5 [Empyrean Lord's Grace] effect for the duration",
          unlockLevel: 10,
          stigmaId: 4,
        },
        {
          description: "x1.5 [Earth's Grace] effect for the duration",
          unlockLevel: 15,
          stigmaId: 4,
        },
        {
          description: "+5% additionnal Attack effect",
          unlockLevel: 20,
          stigmaId: 4,
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
        "Dels {{DMG_MIN}} Earth Damage to a target within 20m and {{DAMAGE_PER_SECOND}} damage every 1s for 10s.",
      condition: ["Nontarget Skill", "Mobile"],

      // Stats
      damageMin: 929,
      damageMinModifier: undefined,
      damageMinModifiers: [125, 125, 151, 125, 92, 66, 92, 91, 92],
      damagePerSecond: 120,
      damagePerSecondModifier: undefined,
      damagePerSecondModifiers: [17, 17, 17, 17, 12, 8, 12, 12, 12],

      manaCost: 200,
      manaRegen: 0,

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "1 MIN",
      target: "Single",
      spellTag: ["Earth", "Attack", "Magic", "Debuff"],

      // Specialty Choices
      specialtyChoices: [
        {
          description:
            "[Condemnation] lands as Guaranteed Crit on Earth Punishment",
          unlockLevel: 5,
          stigmaId: 6,
        },
        {
          description: "-100 ennemy Block, -100 ennemy Evasion",
          unlockLevel: 10,
          stigmaId: 6,
        },
        {
          description: "-10% ennemy Attack, -10% ennemy Defense",
          unlockLevel: 15,
          stigmaId: 6,
        },
        {
          description: "+10s Earth Punishment duration",
          unlockLevel: 20,
          stigmaId: 6,
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
      castingDuration: "Instant Cast",
      cooldown: "2 MIN 30s",
      target: "Caster",
      spellTag: ["Buff", "Magic"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "+100% incoming Heal",
          unlockLevel: 5,
          stigmaId: 7,
        },
        {
          description: "Restores 20% of Max HP at the end of [Salvation]",
          unlockLevel: 10,
          stigmaId: 7,
        },
        {
          description: "Grants [Salvation] base effect to the party members",
          unlockLevel: 15,
          stigmaId: 7,
        },
        {
          description:
            "Activate [Salvation] when afflicted with impact-type status effect",
          unlockLevel: 20,
          stigmaId: 7,
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
      damageMin: 956,
      damageMinModifier: undefined,
      damageMinModifiers: [129, 129, 154, 129, 95, 68, 94, 95, 94],

      manaCost: 200,
      manaRegen: 0,

      // Meta
      range: 20,
      area: 4,
      castingDuration: "Instant Cast",
      cooldown: "1 MIN",
      target: "4",
      spellTag: ["Earth", "Attack", "Magic", "Debuff"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "Changes to mobile skill",
          unlockLevel: 5,
          stigmaId: 8,
        },
        {
          description: "+2s Root Duraction",
          unlockLevel: 10,
          stigmaId: 8,
        },
        {
          description: "+25% Root chance",
          unlockLevel: 15,
          stigmaId: 8,
        },
        {
          description: "x2 Damage over Time on Root target",
          unlockLevel: 20,
          stigmaId: 8,
        },
      ],
      classId: 1,
    },
    // STIGMA 9
    {
      name: "Light of Protection",
      iconUrl: "LightOfProtection.webp",
      description:
        "Increases Max Hp by x for 5 min and immediately restores {{HEAL_MIN}} HP for the caster and the party within 40m.",
      condition: ["Nontarget Skill"],

      // Stats
      healMin: 788,
      healMinModifier: undefined,
      healMinModifiers: [143, 88, 172, 88, 116, 59, 144, 63, 64],

      // Meta
      area: 40,
      castingDuration: "Instant Cast",
      cooldown: "3 MIN",
      target: "Party, Caster",
      spellTag: ["Magic", "Buff"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "+5% incoming Heal",
          unlockLevel: 5,
          stigmaId: 9,
        },
        {
          description: "+5% Move Speed",
          unlockLevel: 10,
          stigmaId: 9,
        },
        {
          description: "+100 Combat HP Regen",
          unlockLevel: 15,
          stigmaId: 9,
        },
        {
          description: "+5% Impact-type, Mental-ype, Ailment-Type",
          unlockLevel: 20,
          stigmaId: 9,
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
      castingDuration: "Instant Cast",
      cooldown: "1 MIN 30s",
      target: "Party, Caster",
      spellTag: ["Buff", "Magic"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "10% Max HP Protective Shield",
          unlockLevel: 5,
          stigmaId: 10,
        },
        {
          description: "+100 Block and Evasion",
          unlockLevel: 10,
          stigmaId: 10,
        },
        {
          description: "+5% additional Damage Tolerance increase",
          unlockLevel: 15,
          stigmaId: 10,
        },
        {
          description: "+10% Impact-type, Mental-ype, Ailment-Type",
          unlockLevel: 20,
          stigmaId: 10,
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
      name: "Assault Mark",
      iconUrl: "PowerBurst.webp",
      description:
        "Select a target within 20m and deal {{DMG_MIN}} damage to up 4 ennemies within 4m of the target with a 30% chance to inflict Root. 100% chance to inflict Root on NPC. Increases Defense by {{DEFENSE_PERCENTAGE}}%, max 20% proportional to hit targets.",
      condition: ["Avaible only while gliding"],

      // Stats
      damageMin: 907,
      damageMinModifier: undefined,
      damageMinModifiers: [122, 122, 147, 122, 90, 64, 90, 90, 89],

      defense: 2,
      defenseModifier: 2,

      // Meta
      range: 20,
      area: 4,
      castingDuration: "Instant Cast",
      cooldown: "2 MIN",
      target: "UP TO 4 ENEMIES",
      spellTag: ["Attack", "Magic", "Buff"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "+20% Attack for 5s on hit*",
          unlockLevel: 5,
          stigmaId: 12,
        },
        {
          description: "500MP damage on hit",
          unlockLevel: 10,
          stigmaId: 12,
        },
        {
          description: "+10m Range",
          unlockLevel: 15,
          stigmaId: 12,
        },
        {
          description: "+20% Root chance",
          unlockLevel: 20,
          stigmaId: 12,
        },
      ],
      classId: 1,
    },
  ],
};
