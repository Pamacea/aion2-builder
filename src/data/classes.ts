  export const classesData = [
    {
      name: "gladiator",
      iconUrl: "gladiator-icon.webp",
      bannerUrl: "gladiator-banner.webp",
      characterURL: "gladiator-character.webp",
      description:
        "Frontline melee bruiser with sweeping AoE strikes and relentless pressure.",
      tags: ["melee", "dps", "sustain", "offtank"],
    },
    {
      name: "templar",
      iconUrl: "templar-icon.webp",
      bannerUrl: "templar-banner.webp",
      characterURL: "templar-character.webp",
      description:
        "Shielded tank specializing in control and protection to anchor your team.",
      tags: ["melee", "tank", "dps", "buff"],
    },
    {
      name: "assassin",
      iconUrl: "assassin-icon.webp",
      bannerUrl: "assassin-banner.webp",
      characterURL: "assassin-character.webp",
      description:
        "Stealthy finisher with explosive burst, mobility, and lethal single-target focus.",
      tags: ["melee", "dps", "burst", "mobility"],
    },
    {
      name: "ranger",
      iconUrl: "ranger-icon.webp",
      bannerUrl: "ranger-banner.webp",
      characterURL: "ranger-character.webp",
      description:
        "Agile ranged damage dealer using precision shots, traps and kiting mastery.",
      tags: ["distance", "dps", "mobility"],
    },
    {
      name: "sorcerer",
      iconUrl: "sorcerer-icon.webp",
      bannerUrl: "sorcerer-banner.webp",
      characterURL: "sorcerer-character.webp",
      description:
        "Master of elemental magic and ranged damage, unleashing devastating magical nukes.",
      tags: ["distance", "dps", "burst", "debuff"],
    },
    {
      name: "elementalist",
      iconUrl: "elementalist-icon.webp",
      bannerUrl: "elementalist-banner.webp",
      characterURL: "elementalist-character.webp",
      description:
        "Summons elemental spirits to control space, disrupt foes, and apply pressure.",
      tags: ["distance", "dps", "control", "debuff"],
    },
    {
      name: "cleric",
      iconUrl: "cleric-icon.webp",
      bannerUrl: "cleric-banner.webp",
      characterURL: "cleric-character.webp",
      description:
        "Primary healer with potent recovery, barriers, and group-saving utility.",
      tags: ["distance", "heal", "buff"],
      abilities : [
        {
          name: "Earth's Retribution",
          iconUrl: "EarthsRetribution.webp",
          description: "Deals {{DMG_MIN}} - {{DMG_MAX}} Earth Damage to a target within 20m and restores 110MP.",

          condition: ["Mobile"],
          
          damageMin: 371,
          damageMinModifier: undefined, // Utilise damageMinModifiers à la place
          damageMinModifiers: [18, 18, 17, 27, 34, 41, 34, 34, 33, 34], // Modifiers pour niveaux 2-11
          damageMax: 390,
          damageMaxModifier: undefined, // Utilise damageMaxModifiers à la place
          damageMaxModifiers: [18, 18, 17, 27, 34, 41, 34, 34, 33, 34], // Modifiers pour niveaux 2-11
          staggerDamage: 100,
          manaCost: 0,
          manaRegen: 0,
          range: 20,
          isNontarget: false,
          isMobile: false,
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
          chainSkills: ["Earth's Retribution Chain"], // Référence au nom du chain skill
          classId: 1,
        },
        {
          name: "Earth's Retribution Chain",
          iconUrl: "EarthsRetribution.webp",
          description: "Deals {{DMG_MIN}} - {{DMG_MAX}} Earth Damage to a target within 20m and restores 110MP.",

          condition: ["Mobile"],
          
          damageMin: 371,
          damageMinModifier: undefined, // Utilise damageMinModifiers à la place
          damageMinModifiers: [18, 18, 17, 27, 34, 41, 34, 34, 33, 34], // Modifiers pour niveaux 2-11
          damageMax: 390,
          damageMaxModifier: undefined, // Utilise damageMaxModifiers à la place
          damageMaxModifiers: [18, 18, 17, 27, 34, 41, 34, 34, 33, 34], // Modifiers pour niveaux 2-11
          staggerDamage: 100,
          manaCost: 0,
          manaRegen: 0,
          range: 20,
          isNontarget: false,
          isMobile: false,
          castingDuration: "Instant Cast",
          cooldown: "Instant Cast",
          target: "Single Target",
          spellTag: ["Earth", "Attack", "Magic"],
          classId: 1,
        },
      ],
      passives: [
        {
          name: "Warm Benediction",
          iconUrl: "WarmBenediction.webp",
          description: "Increase the caster's max HP by {{MAX_HP_PERCENTAGE}}% and MAX MP by {{MAX_MP_FLAT}}.",

          maxHP: 6,
          maxHPModifier: 1,
          maxMP: 7,
          maxMPModifier: 2,
          isNontarget: false,
          isMobile: false,
          castingDuration: "Instant Cast",
          cooldown: "Instant Cast",
          target: "Caster",
          spellTag: ["Magic", "Buff"],
          classId: 1,
        },
      ],
      stigmas: [
        {
          name: "Power Burst",
          iconUrl: "PowerBurst.webp",
          description: "Deals {{DMG_MIN}} - {{DMG_MAX}} Earth Damage to a target within 20m.",
          
          damageMin: 788,
          damageMinModifier: undefined, // Utilise damageMinModifiers à la place
          damageMinModifiers: [18, 18, 17, 27, 34, 41, 34, 34, 33, 34], // Modifiers pour niveaux 2-11
          damageMax: 871,
          damageMaxModifier: undefined, // Utilise damageMaxModifiers à la place
          damageMaxModifiers: [18, 18, 17, 27, 34, 41, 34, 34, 33, 34], // Modifiers pour niveaux 2-11
          staggerDamage: 50,
          manaCost: 200,
          manaRegen: 0,
          range: 20,
          isNontarget: false,
          isMobile: false,
          castingDuration: "Instant Cast",
          cooldown: "Instant Cast",
          target: "Single Target",
          spellTag: ["Earth", "Attack", "Magic"],
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
      ],
    },
    {
      name: "chanter",
      iconUrl: "chanter-icon.webp",
      bannerUrl: "chanter-banner.webp",
      characterURL: "chanter-character.webp",
      description:
        "Support hybrid amplifying allies with powerful buffs, heals, and protection.",
      tags: ["melee", "heal", "buff", "dps"],
    },
  ];