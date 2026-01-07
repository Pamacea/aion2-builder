import type { ClassData } from "./types";

export const chanterData: ClassData = {
  name: "chanter",
  iconUrl: "IC_Class_Chanter.webp",
  bannerUrl: "BA_Chanter.webp",
  characterURL: "CH_Chanter.webp",
  description: "Support hybrid amplifying allies with powerful buffs, heals, and protection.",
  tags: ["melee", "heal", "buff", "dps"],

  // ==========================
  // Abilities
  // ==========================
  abilities: [
    // ABILITY 1(auto-attack)
    {
      name: "Onslaught",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_001.png",
      description:
        "Deals {{DMG_MIN}} - {{DMG_MAX}} damage to up to 4 enemies within 4m and restores 100MP. Absorbs 7% of damage as HP and reduces [Spinning Strike] cooldown by 1s on hit.",
      condition: ["Mobile", "Nontarget Skill"],

      // Stats
      damageMin: 58,
      damageMinModifier: undefined,
      damageMinModifiers: [20, 22, 22, 32, 40, 48, 38, 40, 40],

      manaCost: 0,
      manaRegen: 100,

      // Meta
      range: 4,
      area: 5,
      castingDuration: "Instant Cast",
      cooldown: "Instant",
      target: "4 Target",
      spellTag: ["Attack", "Physical"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "+20% MP restored",
          unlockLevel: 8,
          abilityId: 1,
        },
        {
          description: "Absorbs 7% of damage as HP",
          unlockLevel: 8,
          abilityId: 1,
        },
        {
          description: "+50% Multi-Hit on hit",
          unlockLevel: 8,
          abilityId: 1,
        },
        {
          description: "–1s [Spinning Strike] cooldown on hit",
          unlockLevel: 12,
          abilityId: 1,
        },
        {
          description: "Add [Storm Chain] Chain Skill",
          unlockLevel: 16,
          abilityId: 1,
        },
      ],

      chainSkills: ["Resonance Crush", "Bolt Crush"],

      classId: 2,
    },
    // ABILITY 2
    {
      name: "Incandescent Blow",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_004.png",
      description: "Deals {{DMG_MIN}} - {{DMG_MAX}} damage to up to 4 enemies within 4m.",
      condition: ["Mobile", "Nontarget"],

      // Stats
      damageMin: 84,
      damageMinModifier: undefined,
      damageMinModifiers: [40, 38, 38, 58, 72, 84, 72, 70, 72],

      manaCost: 120,
      manaRegen: 0,

      // Meta
      range: 4,
      area: 5,
      castingDuration: "Instant Cast",
      cooldown: "Instant",
      target: "4 Target",
      spellTag: ["Attack", "Physical"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "–20% MP consumed",
          unlockLevel: 8,
          abilityId: 2,
        },
        {
          description: "+200 Block while using skill",
          unlockLevel: 8,
          abilityId: 2,
        },
        {
          description: "Max +12% damage when there are less targets hit",
          unlockLevel: 8,
          abilityId: 2,
        },
        {
          description: "–200 enemy Accuracy for 3s on landing [Bursting Blow]",
          unlockLevel: 12,
          abilityId: 2,
        },
        {
          description: "10% chance to inflict Stun for 3s on landing [Bursting Blow]",
          unlockLevel: 16,
          abilityId: 2,
        },
      ],

      chainSkills: ["Bursting Blow"],

      classId: 2,
    },
    // ABILITY 3
    {
      name: "Rushing Smash",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_009.png",
      description:
        "Rushes at a target within 20m to deal {{DMG_MIN}} - {{DMG_MAX}} damage to up to 4 enemies with 50% chance to activate [Heat Wave Blow].",
      condition: [],

      // Stats
      damageMin: 130,
      damageMinModifier: undefined,
      damageMinModifiers: [82, 83, 83, 123, 153, 180, 153, 152, 152],

      manaCost: 150,
      manaRegen: 0,

      // Meta
      range: 20,
      area: 5,
      castingDuration: "Instant Cast",
      cooldown: "15s",
      target: "4 Target",
      spellTag: ["Attack", "Physical"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "Removes MP Consumed and restores 200 MP",
          unlockLevel: 8,
          abilityId: 3,
        },
        {
          description: "Changes to Charge Skill and increases damage by up to 60%",
          unlockLevel: 8,
          abilityId: 3,
        },
        {
          description: "50% chance to activate [Heat Wave Blow] on landing [Rushing Smash]",
          unlockLevel: 8,
          abilityId: 3,
        },
        {
          description: "–5s cooldown",
          unlockLevel: 12,
          abilityId: 3,
        },
        {
          description: "Ignores Block and Evasion and lands a Multi-Hit",
          unlockLevel: 16,
          abilityId: 3,
        },
      ],

      classId: 2,
    },
    // ABILITY 4
    {
      name: "Impactful Crush",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_006.png",
      description:
        "Select a target within 20m and deal {{DMG_MIN}} - {{DMG_MAX}} damage to up to 4 enemies within 4m of the target with a 60% chance to inflict Stun on the target for 3s. 100% chance to inflict Stun on NPC targets.",
      condition: [],

      // Stats
      damageMin: 157,
      damageMinModifier: undefined,
      damageMinModifiers: [61, 61, 92, 112, 133, 113, 112, 112, 113],

      manaCost: 100,
      manaRegen: 0,

      // Meta
      range: 20,
      area: 4,
      castingDuration: "Instant Cast",
      cooldown: "15s",
      target: "4 Target",
      spellTag: ["Attack", "Physical", "Debuff"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "Changes to AoE damage",
          unlockLevel: 8,
          abilityId: 4,
        },
        {
          description: "+1s [Impactful Crush] Stun duration",
          unlockLevel: 8,
          abilityId: 4,
        },
        {
          description: "Changes to mobile skill",
          unlockLevel: 8,
          abilityId: 4,
        },
        {
          description: "Adds [Crushing Blow] Chain Skill, [Crushing Blow] lands as Guaranteed Multi-Hit on hiting a Stun target.",
          unlockLevel: 12,
          abilityId: 4,
        },
        {
          description: "+20s [Impactful Crush] Stun Chance",
          unlockLevel: 16,
          abilityId: 4,
        },
      ],

      chainSkills: ["Crushing Blow"],

      classId: 2,
    },
    // ABILITY 5
    {
      name: "Dark Crush",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_010.png",
      description:
        "Select a target afflicted Stun, Knockdown, or Airborne within 20m and deal {{DMG_MIN}} - {{DMG_MAX}} damage to up to 4 enemies around it.",
      condition: [],

      // Stats
      damageMin: 146,
      damageMinModifier: undefined,
      damageMinModifiers: [57, 56, 85, 104, 124, 104, 105, 104, 104],

      manaCost: 0,
      manaRegen: 0,

      // Meta
      range: 20,
      area: 4,
      castingDuration: "Instant Cast",
      cooldown: "5s",
      target: "4 Target",
      spellTag: ["Attack", "Physical"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "Absorbs 20% of damage as HP",
          unlockLevel: 8,
          abilityId: 5,
        },
        {
          description: "Changes to AoE Skill",
          unlockLevel: 8,
          abilityId: 5,
        },
        {
          description: "5% chance to activate on attacking an Incapacited Immune target",
          unlockLevel: 8,
          abilityId: 5,
        },
        {
          description: "Adds [Piercing Strike] Chain Skill",
          unlockLevel: 12,
          abilityId: 5,
        },
        {
          description: "Removes [Dark Crush] cooldown",
          unlockLevel: 16,
          abilityId: 5,
        },
      ],

      classId: 2,
    },
    // ABILITY 6
    {
      name: "Gust Rampage",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_030.png",
      description:
        "Deals {{DMG_MIN}} - {{DMG_MAX}} damage to a target afflicted with Stagger within 4m and absorbs 10% of damage as HP.",
      condition: [],

      // Stats
      damageMin: 128,
      damageMinModifier: undefined,
      damageMinModifiers: [36, 52, 68, 76, 68, 64, 68, 64, 80],

      manaCost: 0,
      manaRegen: 0,

      // Meta
      range: 4,
      castingDuration: "Instant Cast",
      cooldown: "Instant",
      target: "Single",
      spellTag: ["Attack", "Physical"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "Absorbs 10% of damage as HP",
          unlockLevel: 8,
          abilityId: 6,
        },
        {
          description: "Restores 120 MP",
          unlockLevel: 8,
          abilityId: 6,
        },
        {
          description: "Changes to mobile skill",
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

      classId: 2,
    },
    // ABILITY 7
    {
      name: "Heat Wave Blow",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_015.png",
      description:
        "Select a target within 20m and deal {{DMG_MIN}} - {{DMG_MAX}} damage to up to 4 enemies within 4m with a 60% chance to inflict Seal for 3s on sucessful Block. 100% chance to inflict Seal on NPC targets.",
      condition: ["Nontarget"],

      // Stats
      damageMin: 363,
      damageMinModifier: undefined,
      damageMinModifiers: [119, 146, 173, 146, 146, 146, 146, 174, 146],

      manaCost: 0,
      manaRegen: 0,

      // Meta
      range: 20,
      area: 25,
      castingDuration: "Instant Cast",
      cooldown: "10s",
      target: "Party, Caster",
      spellTag: ["Attack", "Physical", "Debuff"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "3% chance to inflict Stun for 3s",
          unlockLevel: 8,
          abilityId: 7,
        },
        {
          description: "+20% Seal Chance",
          unlockLevel: 8,
          abilityId: 7,
        },
        {
          description: "Max +20% damage when there are targets hit",
          unlockLevel: 8,
          abilityId: 7,
        },
        {
          description: "Ignores Block and Evasion and lands a Multi-Hit",
          unlockLevel: 12,
          abilityId: 7,
        },
        {
          description: "25% chance to reset [Heat Wave Blow]",
          unlockLevel: 16,
          abilityId: 7,
        },
      ],

      classId: 2,
    },
    // ABILITY 8
    {
      name: "Recuperation",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_013.png",
      description:
        "Immediately restores {{HEAL_MIN}} - {{HEAL_MAX}} HP and regenerates {{HEAL_MIN_PER_TICK}} HP every 2s for 8s for the caster and party members within 25m.",
      condition: ["Nontarget"],

      // Stats
      healMin: 161,
      healMinModifier: undefined,
      healMinModifiers: [49, 55, 125, 65, 103, 102, 62, 122, 63],
      healMax: 177,
      healMaxModifier: undefined,
      healMaxModifiers: [54, 61, 137, 72, 113, 112, 68, 134, 70],
      // Heal per tick (every 2s for 8s)
      minHP: 48,
      minHPModifier: undefined,
      minHPModifiers: [15, 16, 38, 19, 31, 31, 18, 37, 19],

      manaCost: 0,
      manaRegen: 0,

      // Meta
      area: 25,
      castingDuration: "Instant Cast",
      cooldown: "15s",
      target: "Caster, Party",
      spellTag: ["Magic", "Regen", "Buff"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "–3s [Recuperation] cooldown",
          unlockLevel: 8,
          abilityId: 8,
        },
        {
          description: "Restores 200 MP",
          unlockLevel: 8,
          abilityId: 8,
        },
        {
          description: "+4s [Recuperation] duration",
          unlockLevel: 8,
          abilityId: 8,
        },
        {
          description: "Changes to mobile skill",
          unlockLevel: 12,
          abilityId: 8,
        },
        {
          description: "Restores extra 10% of Max HP",
          unlockLevel: 16,
          abilityId: 8,
        },
      ],

      classId: 2,
    },
    // ABILITY 9
    {
      name: "Tremor Crush",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_021.png",
      description:
        "Moves to a target within 10m and deal {{DMG_MIN}} - {{DMG_MAX}} damage with a 50% chance to inflict Stun for 3s after using [Dodge]. Restores 300 Stamina on hit. 100% chance to inflict Stun on NPC targets.",
      condition: [],

      // Stats
      damageMin: 270,
      damageMinModifier: undefined,
      damageMinModifiers: [81, 98, 81, 82, 82, 82, 97, 82, 60],

      manaCost: 0,
      manaRegen: 0,

      // Meta
      range: 10,
      castingDuration: "Instant Cast",
      cooldown: "20s",
      target: "Single",
      spellTag: ["Attack", "Physical", "Debuff"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "Restores 300 Stamina on hit",
          unlockLevel: 8,
          abilityId: 9,
        },
        {
          description: "+10m [Tremor Crush] range",
          unlockLevel: 8,
          abilityId: 9,
        },
        {
          description: "+50% Multi-Hit on hit",
          unlockLevel: 8,
          abilityId: 9,
        },
        {
          description: "Adds [Surging Strike] Chain Skill",
          unlockLevel: 12,
          abilityId: 9,
        },
        {
          description: "+25% [Tremor Crush] Stun Chance",
          unlockLevel: 16,
          abilityId: 9,
        },
      ],

      chainSkills: ["Surging Strike"],

      classId: 2,
    },
    // ABILITY 10
    {
      name: "Wave Blow",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_008.png",
      description:
        "Deals {{DMG_MIN}} - {{DMG_MAX}} damage to a target afflicted with Stun within 4m and inflicts Knockdown for 3s. Lands as a Guaranteed Multi-Hit.",
      condition: [],

      // Stats
      damageMin: 464,
      damageMinModifier: undefined,
      damageMinModifiers: [142, 168, 140, 142, 142, 140, 168, 142, 102],

      manaCost: 0,
      manaRegen: 0,

      // Meta
      range: 4,
      castingDuration: "Instant Cast",
      cooldown: "20s",
      target: "Single",
      spellTag: ["Attack", "Physical", "Debuff"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "Guaranteed Multi-Hit on hit",
          unlockLevel: 8,
          abilityId: 10,
        },
        {
          description: "+6m Range",
          unlockLevel: 8,
          abilityId: 10,
        },
        {
          description: "5% chance to activate on attacking an Incapacited Immunity target",
          unlockLevel: 8,
          abilityId: 10,
        },
        {
          description: "+1s Knockdown duration",
          unlockLevel: 12,
          abilityId: 10,
        },
        {
          description: "Changes to AoE skill on down Strike",
          unlockLevel: 16,
          abilityId: 10,
        },
      ],

      classId: 2,
    },
    // ABILITY 11
    {
      name: "Spinning Strike",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_029.png",
      description:
        "Deals {{DMG_MIN}} - {{DMG_MAX}} damage to up to 4 enemies within a 4m radius, centered 2m in front of the caster with a 40% chance to inflict Seal for 3s. Increase Skill Speed by 30%. 100% chance to land Seal on NPC targets.",
      condition: [],

      // Stats
      damageMin: 892,
      damageMinModifier: undefined,
      damageMinModifiers: [248, 208, 212, 208, 208, 248, 208, 152, 112],

      manaCost: 250,
      manaRegen: 0,

      // Meta
      range: 4,
      area: 4,
      castingDuration: "Instant Cast",
      cooldown: "30s",
      target: "4 Target",
      spellTag: ["Attack", "Physical"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "Restores 50 MP on landing a Critical Hit",
          unlockLevel: 8,
          abilityId: 11,
        },
        {
          description: "+30% Skill Speed",
          unlockLevel: 8,
          abilityId: 11,
        },
        {
          description: "Max +20% damage when there are more targets hit",
          unlockLevel: 8,
          abilityId: 11,
        },
        {
          description: "40% chance to inflict Seal for 3s",
          unlockLevel: 12,
          abilityId: 11,
        },
        {
          description: "Ignores Block and Evasion and lands as Multi-Hit",
          unlockLevel: 16,
          abilityId: 11,
        },
      ],

      classId: 2,
    },
    // ABILITY 12
    {
      name: "Defiance",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CO_SKILL_002.png",
      description:
        "Removes STUN, KNOCKDOWN and AIRBORNE from the caster and grants Tenacity for 5s. Tenacity : +100% Stun, Knockdown, Airborne Resist.",
      condition: ["Nontarget"],

      // Stats
      manaCost: 0,
      manaRegen: 0,

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "50s",
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

      chainSkills: ["Crushing Strike"],

      classId: 2,
    },

    // ==========================
    // Chain Skills
    // ==========================
    // CHAIN SKILL 1 (Onslaught - Resonance Crush)
    {
      name: "Resonance Crush",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_001.png",
      description:
        "Deals {{DMG_MIN}} - {{DMG_MAX}} damage to up to 4 enemies within 4m and restores 100MP. Absorbs 7% of damage as HP and reduces [Spinning Strike] cooldown by 1s on hit.",
      condition: ["Mobile", "Nontarget Skill"],

      // Stats
      damageMin: 60,
      damageMinModifier: undefined,
      damageMinModifiers: [25, 30, 25, 35, 50, 55, 45, 45, 50],

      manaCost: 0,
      manaRegen: 100,

      // Meta
      range: 4,
      area: 5,
      castingDuration: "Instant Cast",
      cooldown: "Instant",
      target: "4 Target",
      spellTag: ["Attack", "Physical"],

      classId: 2,
    },
    // CHAIN SKILL 2 (Onslaught - Bolt Crush)
    {
      name: "Bolt Crush",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_001.png",
      description:
        "Deals {{DMG_MIN}} - {{DMG_MAX}} damage to up to 4 enemies within 4m and restores 120MP. Absorbs 7% of damage as HP and reduces [Spinning Strike] cooldown by 1s on hit.",
      condition: ["Mobile", "Nontarget Skill"],

      // Stats
      damageMin: 76,
      damageMinModifier: undefined,
      damageMinModifiers: [33, 33, 33, 50, 60, 73, 60, 61, 61],

      manaCost: 0,
      manaRegen: 120,

      // Meta
      range: 4,
      area: 5,
      castingDuration: "Instant Cast",
      cooldown: "Instant",
      target: "4 Target",
      spellTag: ["Attack", "Physical"],

      classId: 2,
    },
    // CHAIN SKILL 3 (Incandescent Blow - Bursting Blow)
    {
      name: "Bursting Blow",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_004.png",
      description: "Deals {{DMG_MIN}} - {{DMG_MAX}} damage to up to 4 enemies within 4m.",
      condition: ["Mobile", "Nontarget"],

      // Stats
      damageMin: 92,
      damageMinModifier: undefined,
      damageMinModifiers: [42, 43, 42, 64, 79, 93, 79, 79, 78],

      manaCost: 120,
      manaRegen: 0,

      // Meta
      range: 4,
      area: 5,
      castingDuration: "Instant Cast",
      cooldown: "Instant",
      target: "4 Target",
      spellTag: ["Attack", "Physical"],

      classId: 2,
    },
    // CHAIN SKILL 4 (Impactful Crush - Crushing Blow)
    {
      name: "Crushing Blow",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_006.png",
      description:
        "Select a target within 20m and deal {{DMG_MIN}} - {{DMG_MAX}} damage to up to 4 enemies within 4m of the target with a 60% chance to inflict Stun on the target for 3s. 100% chance to inflict Stun on NPC targets.",
      condition: [],

      // Stats
      damageMin: 157,
      damageMinModifier: undefined,
      damageMinModifiers: [61, 61, 92, 112, 133, 113, 112, 112, 113],

      manaCost: 100,
      manaRegen: 0,

      // Meta
      range: 20,
      area: 4,
      castingDuration: "Instant Cast",
      cooldown: "15s",
      target: "4 Target",
      spellTag: ["Attack", "Physical", "Debuff"],

      classId: 2,
    },
    // CHAIN SKILL 5 (Defiance - Crushing Strike)
    {
      name: "Crushing Strike",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CO_SKILL_002.png",
      description: "Select a target within 4m and deal {{DMG_MIN}} - {{DMG_MAX}} damage to up to 4 enemies and inflict Stun for 3s.",
      condition: [],

      // Stats
      damageMin: 550,
      damageMinModifier: undefined,
      damageMinModifiers: [101, 100, 101, 100, 119, 101, 73, 54, 74],

      manaCost: 0,
      manaRegen: 0,

      // Meta
      range: 4,
      castingDuration: "Instant Cast",
      cooldown: "Instant",
      target: "4 Target",
      spellTag: ["Attack", "Physical", "Debuff"],

      classId: 2,
    },
    // CHAIN SKILL 6 (Tremor Crush - Surging Strike)
    {
      name: "Surging Strike",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_021.png",
      description:
        "Moves to a target within 4m and deal {{DMG_MIN}} - {{DMG_MAX}} damage with a 50% chance to inflict Stun for 3s.",
      condition: [],

      // Stats
      damageMin: 270,
      damageMinModifier: undefined,
      damageMinModifiers: [81, 98, 81, 82, 82, 82, 97, 82, 60],

      manaCost: 0,
      manaRegen: 0,

      // Meta
      range: 4,
      castingDuration: "Instant Cast",
      cooldown: "Instant",
      target: "Single",
      spellTag: ["Attack", "Physical", "Debuff"],

      classId: 2,
    },
  ],

  // ==========================
  // Passives
  // ==========================
  passives: [
    // PASSIVE 1
    {
      name: "Blessing of Life",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_Passive_012.png",
      description:
        "Increases the caster's Max HP by {{MAX_HP_PERCENTAGE}}% and Heal Boost by {{HEAL_BOOST_PERCENTAGE}}%",

      // Stats
      maxHP: 8,
      maxHPModifier: 1,
      healBoost: 6.5,
      healBoostModifier: 1.5,

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Caster",
      spellTag: ["Buff", "Physical"],

      classId: 2,
    },
    // PASSIVE 2
    {
      name: "Crossguard",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_Passive_002.png",
      description:
        "Increases the caster's Block by 200 and restores {{HEAL_MIN}} - {{HEAL_MAX}} HP on a sucessful Block.",

      // Stats
      healMin: 53,
      healMinModifier: undefined,
      healMinModifiers: [14, 20, 23, 52, 27, 43, 43, 25, 51],
      healMax: 58,
      healMaxModifier: undefined,
      healMaxModifiers: [16, 22, 25, 57, 30, 47, 48, 27, 56],

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Caster",
      spellTag: ["Buff", "Physical"],

      classId: 2,
    },
    // PASSIVE 3
    {
      name: "Protection Circle",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_Passive_001.png",
      description:
        "Receives a Protection Circle that lasts for 5s upon landing an attack. Removes the Protection Circle at 20 stacks and imbues the caster and party members with Divine Barrier, within 500 damage for 10s.",

      // Stats
      blockDamage: 262,
      blockDamageModifier: undefined,
      blockDamageModifiers: [81, 89, 204, 107, 168, 166, 101, 200, 102],

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Caster",
      spellTag: ["Buff", "Physical"],

      classId: 2,
    },
    // PASSIVE 4
    {
      name: "Inspiring Spell",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_Passive_011.png",
      description:
        "Increases the caster's Critical Hit by 150 and Perfect by {{PERFECT_PERCENTAGE}}%",

      // Stats
      criticalHit: 150,
      perfect: 0.5,
      perfectModifier: 0.5,

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Caster",
      spellTag: ["Buff", "Physical"],

      classId: 2,
    },
    // PASSIVE 5
    {
      name: "Attack Preparation",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_GL_SKILL_Passive_005.png",
      description:
        "Increases the caster's Attack by {{ATTACK_PERCENTAGE}}% and Defense by {{DEFENSE_PERCENTAGE}}%.",

      // Stats
      attack: 1,
      attackModifier: 1,
      defense: 2,
      defenseModifier: 2,

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Caster",
      spellTag: ["Buff", "Physical"],

      classId: 2,
    },
    // PASSIVE 6
    {
      name: "Impact Hit",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_GL_SKILL_Passive_006.png",
      description:
        "Increases the caster's Impact-type Chance by {{IMPACT_TYPE_CHANCE_PERCENTAGE}}% and Smite by {{SMITE_PERCENTAGE}}%.",

      // Stats
      impactTypeChance: 11,
      impactTypeChanceModifier: 1,
      smite: 0.3,
      smiteModifier: 0.3,

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Caster",
      spellTag: ["Buff", "Physical"],

      classId: 2,
    },
    // PASSIVE 7
    {
      name: "Raging Spell",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_Passive_007.png",
      description:
        "Deals {{DMG_MIN}} - {{DMG_MAX}} extra damage to targets afflicted with Stagger or an impact-type status.",

      // Stats
      damageMin: 149,
      damageMinModifier: undefined,
      damageMinModifiers: [27, 27, 28, 27, 32, 28, 20, 14, 20],

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Caster",
      spellTag: ["Buff", "Physical"],

      classId: 2,
    },
    // PASSIVE 8
    {
      name: "Earth's Promise",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_Passive_010.png",
      description:
        "Reduces the target's Defense by {{DEFENSE_PERCENTAGE}}% for 10s on a sucessful Block.",

      // Stats
      defense: 10.5,
      defenseModifier: 0.5,

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Caster",
      spellTag: ["Buff", "Physical"],

      classId: 2,
    },
    // PASSIVE 9
    {
      name: "Survival Willpower",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_GL_SKILL_Passive_009.png",
      description:
        "Increases the caster's Status Effect Resist by {{STATUS_EFFECT_RESIST}}%. Increases Impact-type Resist and Damage Tolerance by {{IMPACT_TYPE_RESIST}}% and {{DAMAGE_TOLERANCE}}% for 5s when afflicted with an Impact-type status.",

      // Stats
      statusEffectResist: 16.5,
      statusEffectResistModifier: 1.5,
      impactTypeResist: 12,
      impactTypeResistModifier: 2,
      damageTolerance: 12,
      damageToleranceModifier: 2,

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Caster",
      spellTag: ["Buff", "Physical"],

      classId: 2,
    },
    // PASSIVE 10
    {
      name: "Wind's Promise",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_Passive_008.png",
      description:
        "Has a 25% chance to deal {{DMG_MIN}} - {{DMG_MAX}} extra damage to the target on landing a Critical Hit.",

      // Stats
      damageMin: 204,
      damageMinModifier: undefined,
      damageMinModifiers: [24, 29, 24, 17, 13, 18, 17, 18, 17],

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "Instant Cast",
      target: "Caster",
      spellTag: ["Buff", "Physical"],

      classId: 2,
    },
  ],

  // ==========================
  // Stigmas
  // ==========================
  stigmas: [
    // STIGMA 1
    {
      name: "Obliterate",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_022.png",
      description:
        "Deals {{DMG_MIN}} - {{DMG_MAX}} damage to up to 4 enemies within 4m of the target with a 50% chance to inflict Knockdown. 100% chance to inflict Knockdown on NPC targets.",

      // Stats
      damageMin: 1095,
      damageMinModifier: undefined,
      damageMinModifiers: [147, 147, 174, 144, 108, 78, 108, 108, 105],

      manaCost: 200,
      manaRegen: 0,

      // Meta
      range: 4,
      area: 5,
      castingDuration: "Instant Cast",
      cooldown: "1 MIN",
      target: "4 Target",
      spellTag: ["Attack", "Physical", "Debuff"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "Max +20% damage when there are more targets hit",
          unlockLevel: 5,
          stigmaId: 1,
        },
        {
          description: "+20% Skill Speed",
          unlockLevel: 10,
          stigmaId: 1,
        },
        {
          description: "Guaranteed Crit on hit",
          unlockLevel: 15,
          stigmaId: 1,
        },
        {
          description: "+25% Knockdown Chance",
          unlockLevel: 20,
          stigmaId: 1,
        },
      ],

      classId: 2,
    },
    // STIGMA 2
    {
      name: "Undefeated Mantra",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_019.png",
      description:
        "Increases the caster and nearby party members' Attack by {{ATTACK_PERCENTAGE}}%, Defense by {{DEFENSE_PERCENTAGE}}% and Critical Hit by {{CRITICAL_HIT}}.",

      // Stats
      attack: 15.5,
      attackModifier: 0.5,
      defense: 15.5,
      defenseModifier: 0.5,
      criticalHit: 150,
      criticalHitModifier: 50,

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "5s",
      target: "Caster",
      spellTag: ["Magic", "Buff"],
      effectCondition: "Toggle Skill",

      // Specialty Choices
      specialtyChoices: [
        {
          description: "+50 Critical Hit",
          unlockLevel: 5,
          stigmaId: 2,
        },
        {
          description: "+5% Damage Tolerance",
          unlockLevel: 10,
          stigmaId: 2,
        },
        {
          description: "–5% MP Cost",
          unlockLevel: 15,
          stigmaId: 2,
        },
        {
          description: "+5% Damage Boost",
          unlockLevel: 20,
          stigmaId: 2,
        },
      ],

      classId: 2,
    },
    // STIGMA 3
    {
      name: "Focused Defense",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_014.png",
      description:
        "Temporarily Increases Block damage reduction to front attacks by 100% and guarantees Parry. Restores {{MP}} MP and Stamina once on a sucessful Block.",

      // Stats
      minMP: 100,
      minMPModifier: 10,

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "20s",
      target: "Caster",
      spellTag: ["Buff", "Physical"],
      effectCondition: "Sustained Skill",

      // Specialty Choices
      specialtyChoices: [
        {
          description: "+1 Consecutive Cast(s)",
          unlockLevel: 5,
          stigmaId: 3,
        },
        {
          description: "Changes to mobile skill",
          unlockLevel: 10,
          stigmaId: 3,
        },
        {
          description: "+1 Consecutive Cast(s)",
          unlockLevel: 15,
          stigmaId: 3,
        },
        {
          description: "Restores 10% HP once on a sucessful Parry",
          unlockLevel: 20,
          stigmaId: 3,
        },
      ],

      classId: 2,
    },
    // STIGMA 4
    {
      name: "Sprint Mantra",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_016.png",
      description:
        "Increases Move Speed by 13%. Incoming Heal by {{INCOMING_HEAL_PERCENTAGE}}% and has a 15% chance to restore {{HEAL_MIN}} - {{HEAL_MAX}} HP when the caster or nearby party members lands an attack.",

      // Stats
      incomingHeal: 10,
      incomingHealModifier: 0.5,
      healMin: 134,
      healMinModifier: undefined,
      healMinModifiers: [24, 15, 29, 15, 19, 10, 25, 11, 10],
      healMax: 147,
      healMaxModifier: undefined,
      healMaxModifiers: [27, 16, 32, 17, 21, 11, 27, 12, 11],

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "5s",
      target: "Caster",
      spellTag: ["Magic", "Buff"],
      effectCondition: "Toggle Skill",

      // Specialty Choices
      specialtyChoices: [
        {
          description: "+5% Incoming Heal",
          unlockLevel: 5,
          stigmaId: 4,
        },
        {
          description: "+20% Natural Stamina Regen",
          unlockLevel: 10,
          stigmaId: 4,
        },
        {
          description: "+20% HP restored when HP is 25% or less",
          unlockLevel: 15,
          stigmaId: 4,
        },
        {
          description: "+25% Stowed and Root Resist",
          unlockLevel: 20,
          stigmaId: 4,
        },
      ],

      classId: 2,
    },
    // STIGMA 5
    {
      name: "Fracturing Blow",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_043.png",
      description:
        "Rushes to a target within 20m and deals {{DMG_MIN}} - {{DMG_MAX}} damage to a target. Increases damage by 20% to targets afflicted with an Impact-type status.",

      // Stats
      damageMin: 1309,
      damageMinModifier: undefined,
      damageMinModifiers: [175, 175, 207, 175, 128, 95, 127, 128, 127],

      manaCost: 100,
      manaRegen: 0,

      // Meta
      range: 20,
      castingDuration: "Instant Cast",
      cooldown: "30s",
      target: "Single",
      spellTag: ["Attack", "Physical"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "–15s [Fracturing Blow] cooldown",
          unlockLevel: 5,
          stigmaId: 5,
        },
        {
          description: "+10% additional Impact-type Status target damage",
          unlockLevel: 10,
          stigmaId: 5,
        },
        {
          description: "Guaranteed Crit on hit",
          unlockLevel: 15,
          stigmaId: 5,
        },
        {
          description: "+10% additional Impact-type Status target damage",
          unlockLevel: 20,
          stigmaId: 5,
        },
      ],

      classId: 2,
    },
    // STIGMA 6
    {
      name: "Marchutan's Wrath",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_033.png",
      description:
        "Select a target within 20m and deal {{DMG_MIN}} - {{DMG_MAX}} damage to up to 4 enemies within 4m of the target.",

      // Stats
      damageMin: 1279,
      damageMinModifier: undefined,
      damageMinModifiers: [171, 171, 203, 171, 125, 92, 125, 124, 125],

      manaCost: 0,
      manaRegen: 0,

      // Meta
      range: 20,
      area: 4,
      castingDuration: "Instant Cast",
      cooldown: "1 MIN",
      target: "4 Target",
      spellTag: ["Attack", "Debuff", "Physical"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "Max +20% damage when there are less targets hit",
          unlockLevel: 5,
          stigmaId: 6,
        },
        {
          description: "Inflits Slowed",
          unlockLevel: 10,
          stigmaId: 6,
        },
        {
          description: "–50% ennemy Incoming Heal and Potion Recovery",
          unlockLevel: 15,
          stigmaId: 6,
        },
        {
          description: "3% chance to inflict Stun for 3s",
          unlockLevel: 20,
          stigmaId: 6,
        },
      ],

      classId: 2,
    },
    // STIGMA 7
    {
      name: "Impeding Authority",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_024.png",
      description:
        "Grants a Protective Shield for 20s to the caster and nearby party members within 40m. The Protective Shield blocks up to {{PROTECTIVE_SHIELD}} damage per hit and remains until it has taken a total of {{TOTAL_DAMAGE}} damage.",

      // Stats
      blockDamage: 1000,
      blockDamageModifier: 100,
      // Total damage absorbed
      maxHP: 2817,
      maxHPModifier: undefined,
      maxHPModifiers: [514, 313, 616, 315, 413, 211, 515, 227, 228],

      // Meta
      area: 40,
      castingDuration: "Instant Cast",
      cooldown: "1 MIN 30s",
      target: "Caster, Party",
      spellTag: ["Magic", "Buff"],
      condition: ["Nontarget Skill"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "+10% all Element Tolerance",
          unlockLevel: 5,
          stigmaId: 7,
        },
        {
          description: "+10% Incoming Heal",
          unlockLevel: 10,
          stigmaId: 7,
        },
        {
          description: "+10% Damage Tolerance",
          unlockLevel: 15,
          stigmaId: 7,
        },
        {
          description: "Restores 10% of Max HP at the end of Protective Shield",
          unlockLevel: 20,
          stigmaId: 7,
        },
      ],

      classId: 2,
    },
    // STIGMA 8
    {
      name: "Ensnaring Mark",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_023.png",
      description:
        "Select a target within 20m and deal {{DMG_MIN}} - {{DMG_MAX}} damage to up to 4 enemies within 4m with a 50% chance to inflict Seal for 5s. 100% chance to inflict Seal on NPC targets.",

      // Stats
      damageMin: 1051,
      damageMinModifier: undefined,
      damageMinModifiers: [140, 141, 166, 141, 102, 76, 103, 102, 102],

      manaCost: 0,
      manaRegen: 0,

      // Meta
      range: 20,
      area: 4,
      castingDuration: "Instant Cast",
      cooldown: "1 MIN 30s",
      target: "4 Target",
      spellTag: ["Attack", "Debuff", "Physical"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "50% chance to inflict Root",
          unlockLevel: 5,
          stigmaId: 8,
        },
        {
          description: "50% chance to inflict –1000 enemy Max Stamina",
          unlockLevel: 10,
          stigmaId: 8,
        },
        {
          description: "+3s Seal, Root, Max Stamina reduction effect",
          unlockLevel: 15,
          stigmaId: 8,
        },
        {
          description: "+25% Seal, Root, Max Stamina reduction chance",
          unlockLevel: 20,
          stigmaId: 8,
        },
      ],

      classId: 2,
    },
    // STIGMA 9
    {
      name: "Healing Touch",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_017.png",
      description:
        "Restores {{HEAL_MIN}} - {{HEAL_MAX}} HP to the caster and party members within 25m.",

      // Stats
      healMin: 974,
      healMinModifier: undefined,
      healMinModifiers: [180, 108, 214, 109, 143, 73, 178, 79, 79],
      healMax: 1074,
      healMaxModifier: undefined,
      healMaxModifiers: [195, 119, 236, 120, 157, 80, 196, 87, 87],

      // Meta
      area: 25,
      castingDuration: "Instant Cast",
      cooldown: "2 MIN",
      target: "Party, Caster",
      spellTag: ["Magic", "Buff"],
      condition: ["Nontarget Skill"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "Removes 1 debuff",
          unlockLevel: 5,
          stigmaId: 9,
        },
        {
          description: "Restores 250 MP",
          unlockLevel: 10,
          stigmaId: 9,
        },
        {
          description: "Restores 1000 Stamina",
          unlockLevel: 15,
          stigmaId: 9,
        },
        {
          description: "Restores 10% of Max HP",
          unlockLevel: 20,
          stigmaId: 9,
        },
      ],

      classId: 2,
    },
    // STIGMA 10
    {
      name: "Power of the Storm",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_025.png",
      description:
        "Increases Combat Speed by 20% for the caster and party member within 40m for {{DURATION}}s.",

      // Stats
      // Duration in seconds
      // Level 1: 10s, increases by 0.5s per level

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "1 MIN 30s",
      target: "Party, Caster",
      spellTag: ["Magic", "Buff"],
      condition: ["Nontarget Skill"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "–20s cooldown",
          unlockLevel: 5,
          stigmaId: 10,
        },
        {
          description: "+200 Acuracy",
          unlockLevel: 10,
          stigmaId: 10,
        },
        {
          description: "+200 Critical Hit",
          unlockLevel: 15,
          stigmaId: 10,
        },
        {
          description: "+20% Attack",
          unlockLevel: 20,
          stigmaId: 10,
        },
      ],

      classId: 2,
    },
    // STIGMA 11
    {
      name: "Guardian Blessing",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CH_SKILL_042.png",
      description:
        "Increases the caster's Max HP by {{MAX_HP}} for 5min and instantly restores {{HEAL_MIN}} HP.",

      // Stats
      maxHP: 1840,
      maxHPModifier: undefined,
      maxHPModifiers: [320, 180, 400, 190, 260, 130, 340, 120, 130],
      healMin: 1840,
      healMinModifier: undefined,
      healMinModifiers: [320, 180, 400, 190, 260, 130, 340, 120, 130],

      // Meta
      castingDuration: "Instant Cast",
      cooldown: "5 MIN",
      target: "Caster",
      spellTag: ["Magic", "Buff"],
      condition: ["Nontarget Skill", "Mobile"],

      // Specialty Choices
      specialtyChoices: [
        {
          description: "+100 Natural HP Regen",
          unlockLevel: 5,
          stigmaId: 11,
        },
        {
          description: "x1.5 [Crossguard] effect for the duration",
          unlockLevel: 10,
          stigmaId: 11,
        },
        {
          description: "+5% Impact-type Resist(s)",
          unlockLevel: 15,
          stigmaId: 11,
        },
        {
          description: "+10% Incoming Heal",
          unlockLevel: 20,
          stigmaId: 11,
        },
      ],

      classId: 2,
    },
    // STIGMA 12
    {
      name: "Assault Shock",
      iconUrl: "https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CO_SKILL_003.png",
      description:
        "Select a target within 20m and deal {{DMG_MIN}} - {{DMG_MAX}} damage to up to 4 enemies within 4m of the target with a 30% chance to inflict Stun for 3s. 100% chance to inflict Stun on NPC targets. Increases Defense by max 20% proportional to hit targets.",

      // Stats
      damageMin: 1002,
      damageMinModifier: undefined,
      damageMinModifiers: [134, 135, 159, 134, 97, 73, 98, 97, 98],

      // Meta
      range: 20,
      area: 4,
      castingDuration: "Instant Cast",
      cooldown: "2 MIN",
      target: "4 Target",
      spellTag: ["Attack", "Physical", "Debuff"],
      condition: ["Avaible only while gliding"],

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

      classId: 2,
    },
  ],
};
