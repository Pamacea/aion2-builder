import type { ClassData } from "./types";

export const elementalistData: ClassData = {
  name: "elementalist",
  iconUrl: "IC_Class_Elementalist.webp",
  bannerUrl: "BA_Elementalist.webp",
  characterURL: "CH_Elementalist.webp",
  description: "",
  tags: [],
  abilities: [
    {
      id: `16010000`,
      name: `Cold Shock`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_001.png`,
      description: `Deals <span style="color: #FCC78B">{se_dmg:1601000011:SkillUIMinDmgsum}-{se_dmg:1601000011:SkillUIMaxDmgsum}</span> Water damage to a target within 20m and restores 100 MP.`,
      condition: [],
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Single Target`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 6,
      levels: [{"level":1,"maxValue":"52","minValue":"52"},{"level":2,"maxValue":"73","minValue":"73"},{"level":3,"maxValue":"94","minValue":"94"},{"level":4,"maxValue":"114","minValue":"114"},{"level":5,"maxValue":"145","minValue":"145"},{"level":6,"maxValue":"183","minValue":"183"},{"level":7,"maxValue":"229","minValue":"229"},{"level":8,"maxValue":"267","minValue":"267"},{"level":9,"maxValue":"305","minValue":"305"},{"level":10,"maxValue":"343","minValue":"343"},{"level":11,"maxValue":"382","minValue":"382"},{"level":12,"maxValue":"427","minValue":"427"},{"level":13,"maxValue":"466","minValue":"466"},{"level":14,"maxValue":"493","minValue":"493"},{"level":15,"maxValue":"514","minValue":"514"},{"level":16,"maxValue":"542","minValue":"542"},{"level":17,"maxValue":"570","minValue":"570"},{"level":18,"maxValue":"598","minValue":"598"},{"level":19,"maxValue":"626","minValue":"626"},{"level":20,"maxValue":"646","minValue":"646"},{"level":21,"maxValue":"667","minValue":"667"},{"level":22,"maxValue":"687","minValue":"687"},{"level":23,"maxValue":"708","minValue":"708"},{"level":24,"maxValue":"729","minValue":"729"},{"level":25,"maxValue":"749","minValue":"749"},{"level":26,"maxValue":"770","minValue":"770"},{"level":27,"maxValue":"790","minValue":"790"},{"level":28,"maxValue":"811","minValue":"811"},{"level":29,"maxValue":"832","minValue":"832"},{"level":30,"maxValue":"852","minValue":"852"}]
    },
    {
      id: `16040000`,
      name: `Combustion`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_004.png`,
      description: `Select a target within 20m and deal <span style="color: #FCC78B">{se_dmg:1604000011:SkillUIMinDmgsum}-{se_dmg:1604000011:SkillUIMaxDmgsum}</span> Fire damage to up to 4 enemies within 4m of the target.

3 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 3,
      manaRegen: 0,
      range: 20,
      area: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 6,
      levels: [{"level":1,"maxValue":"61","minValue":"61"},{"level":2,"maxValue":"88","minValue":"88"},{"level":3,"maxValue":"115","minValue":"115"},{"level":4,"maxValue":"142","minValue":"142"},{"level":5,"maxValue":"182","minValue":"182"},{"level":6,"maxValue":"232","minValue":"232"},{"level":7,"maxValue":"291","minValue":"291"},{"level":8,"maxValue":"341","minValue":"341"},{"level":9,"maxValue":"391","minValue":"391"},{"level":10,"maxValue":"441","minValue":"441"},{"level":11,"maxValue":"491","minValue":"491"},{"level":12,"maxValue":"551","minValue":"551"},{"level":13,"maxValue":"601","minValue":"601"},{"level":14,"maxValue":"637","minValue":"637"},{"level":15,"maxValue":"664","minValue":"664"},{"level":16,"maxValue":"700","minValue":"700"},{"level":17,"maxValue":"737","minValue":"737"},{"level":18,"maxValue":"773","minValue":"773"},{"level":19,"maxValue":"810","minValue":"810"},{"level":20,"maxValue":"837","minValue":"837"},{"level":21,"maxValue":"864","minValue":"864"},{"level":22,"maxValue":"890","minValue":"890"},{"level":23,"maxValue":"917","minValue":"917"},{"level":24,"maxValue":"944","minValue":"944"},{"level":25,"maxValue":"971","minValue":"971"},{"level":26,"maxValue":"998","minValue":"998"},{"level":27,"maxValue":"1025","minValue":"1025"},{"level":28,"maxValue":"1052","minValue":"1052"},{"level":29,"maxValue":"1079","minValue":"1079"},{"level":30,"maxValue":"1105","minValue":"1105"}]
    },
    {
      id: `16070000`,
      name: `Soul's Cry`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_007.png`,
      description: `Deals <span style="color: #FCC78B">{se_dmg:1607000011:SkillUIMinDmgsum}-{se_dmg:1607000011:SkillUIMaxDmgsum}</span> damage to a target within 20m with a {se:1607000013:effect_value05:divide100}% chance to inflict Fear for {se:1607000013:effect_value02:time}.
100% chance to land Fear on NPC targets. 

15 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 15,
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Single Target`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 6,
      levels: [{"level":1,"maxValue":"246","minValue":"246"},{"level":2,"maxValue":"324","minValue":"324"},{"level":3,"maxValue":"417","minValue":"417"},{"level":4,"maxValue":"495","minValue":"495"},{"level":5,"maxValue":"573","minValue":"573"},{"level":6,"maxValue":"651","minValue":"651"},{"level":7,"maxValue":"729","minValue":"729"},{"level":8,"maxValue":"822","minValue":"822"},{"level":9,"maxValue":"900","minValue":"900"},{"level":10,"maxValue":"957","minValue":"957"},{"level":11,"maxValue":"999","minValue":"999"},{"level":12,"maxValue":"1056","minValue":"1056"},{"level":13,"maxValue":"1113","minValue":"1113"},{"level":14,"maxValue":"1170","minValue":"1170"},{"level":15,"maxValue":"1227","minValue":"1227"},{"level":16,"maxValue":"1269","minValue":"1269"},{"level":17,"maxValue":"1311","minValue":"1311"},{"level":18,"maxValue":"1353","minValue":"1353"},{"level":19,"maxValue":"1395","minValue":"1395"},{"level":20,"maxValue":"1437","minValue":"1437"},{"level":21,"maxValue":"1479","minValue":"1479"},{"level":22,"maxValue":"1521","minValue":"1521"},{"level":23,"maxValue":"1563","minValue":"1563"},{"level":24,"maxValue":"1605","minValue":"1605"},{"level":25,"maxValue":"1647","minValue":"1647"},{"level":26,"maxValue":"1689","minValue":"1689"},{"level":27,"maxValue":"1731","minValue":"1731"},{"level":28,"maxValue":"1773","minValue":"1773"},{"level":29,"maxValue":"1815","minValue":"1815"},{"level":30,"maxValue":"1857","minValue":"1857"}]
    },
    {
      id: `16100000`,
      name: `Summon: Fire Spirit`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_010.png`,
      description: `Summons a Fire Spirit.
The Fire Spirit rushes towards a target within 20m and uses a skill which deals <span style="color: #FCC78B">{se_dmg:1610000121:SkillUIMinDmgsum}-{se_dmg:1610000121:SkillUIMaxDmgsum}</span> damage to up to 4 enemies within 5m.
Continues fighting using basic attacks with a 15% chance to use its skill each time an attack lands. It is dismissed upon selecting the summon icon.
Each skill level increases the Fire Spirit's Attack and Defense by 1%.

7 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 7,
      manaRegen: 0,
      range: 20,
      area: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 31,
      classId: 6,
      levels: [{"level":1},{"level":1,"maxValue":"Vacant","minValue":"200"},{"level":2,"maxValue":"Vacant","minValue":"200"},{"level":3,"maxValue":"Vacant","minValue":"200"},{"level":4,"maxValue":"Vacant","minValue":"200"},{"level":5,"maxValue":"Vacant","minValue":"200"},{"level":6,"maxValue":"Vacant","minValue":"200"},{"level":7,"maxValue":"Vacant","minValue":"200"},{"level":8,"maxValue":"Vacant","minValue":"200"},{"level":9,"maxValue":"Vacant","minValue":"200"},{"level":10,"maxValue":"Vacant","minValue":"200"},{"level":11,"maxValue":"Vacant","minValue":"200"},{"level":12,"maxValue":"Vacant","minValue":"200"},{"level":13,"maxValue":"Vacant","minValue":"200"},{"level":14,"maxValue":"Vacant","minValue":"200"},{"level":15,"maxValue":"Vacant","minValue":"200"},{"level":16,"maxValue":"Vacant","minValue":"200"},{"level":17,"maxValue":"Vacant","minValue":"200"},{"level":18,"maxValue":"Vacant","minValue":"200"},{"level":19,"maxValue":"Vacant","minValue":"200"},{"level":20,"maxValue":"Vacant","minValue":"200"},{"level":21,"maxValue":"Vacant","minValue":"200"},{"level":22,"maxValue":"Vacant","minValue":"200"},{"level":23,"maxValue":"Vacant","minValue":"200"},{"level":24,"maxValue":"Vacant","minValue":"200"},{"level":25,"maxValue":"Vacant","minValue":"200"},{"level":26,"maxValue":"Vacant","minValue":"200"},{"level":27,"maxValue":"Vacant","minValue":"200"},{"level":28,"maxValue":"Vacant","minValue":"200"},{"level":29,"maxValue":"Vacant","minValue":"200"},{"level":30,"maxValue":"Vacant","minValue":"200"}]
    },
    {
      id: `16110000`,
      name: `Summon: Water Spirit`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_011.png`,
      description: `Summons a Water Spirit.
The Water Spirit uses a skill which deals <span style="color: #FCC78B">{se_dmg:1611000111:SkillUIMinDmgsum}-{se_dmg:1611000111:SkillUIMaxDmgsum}</span> Water damage to a target within 20m.
Continues fighting using basic attacks with a 15% chance to use its skill, restores {se:1699000211:effect_value02} of the Elementalist's MP each time an attack lands. It is dismissed upon selecting the summon icon.
Each skill level increases the Water Spirit's Attack and Critical Hit by 1%.

7 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 7,
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Single Target`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 31,
      classId: 6,
      levels: [{"level":1},{"level":1,"maxValue":"Vacant","minValue":"200"},{"level":2,"maxValue":"Vacant","minValue":"200"},{"level":3,"maxValue":"Vacant","minValue":"200"},{"level":4,"maxValue":"Vacant","minValue":"200"},{"level":5,"maxValue":"Vacant","minValue":"200"},{"level":6,"maxValue":"Vacant","minValue":"200"},{"level":7,"maxValue":"Vacant","minValue":"200"},{"level":8,"maxValue":"Vacant","minValue":"200"},{"level":9,"maxValue":"Vacant","minValue":"200"},{"level":10,"maxValue":"Vacant","minValue":"200"},{"level":11,"maxValue":"Vacant","minValue":"200"},{"level":12,"maxValue":"Vacant","minValue":"200"},{"level":13,"maxValue":"Vacant","minValue":"200"},{"level":14,"maxValue":"Vacant","minValue":"200"},{"level":15,"maxValue":"Vacant","minValue":"200"},{"level":16,"maxValue":"Vacant","minValue":"200"},{"level":17,"maxValue":"Vacant","minValue":"200"},{"level":18,"maxValue":"Vacant","minValue":"200"},{"level":19,"maxValue":"Vacant","minValue":"200"},{"level":20,"maxValue":"Vacant","minValue":"200"},{"level":21,"maxValue":"Vacant","minValue":"200"},{"level":22,"maxValue":"Vacant","minValue":"200"},{"level":23,"maxValue":"Vacant","minValue":"200"},{"level":24,"maxValue":"Vacant","minValue":"200"},{"level":25,"maxValue":"Vacant","minValue":"200"},{"level":26,"maxValue":"Vacant","minValue":"200"},{"level":27,"maxValue":"Vacant","minValue":"200"},{"level":28,"maxValue":"Vacant","minValue":"200"},{"level":29,"maxValue":"Vacant","minValue":"200"},{"level":30,"maxValue":"Vacant","minValue":"200"}]
    },
    {
      id: `16120000`,
      name: `Summon: Wind Spirit`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_012.png`,
      description: `Summons a Wind Spirit.
The Wind Spirit selects a target within 20m and uses a skill that deals <span style="color: #FCC78B">{se_dmg:1612000111:SkillUIMinDmgsum}-{se_dmg:1612000111:SkillUIMaxDmgsum}</span> Wind damage to up to 4 enemies within 5m of the target and restores <span style="color: #FCC78B">{se_dmg:1612000025:SkillUIHPHealMin}-{se_dmg:1612000025:SkillUIHPHealMax}</span> HP to the Elementalist.
Continues fighting using basic attacks with a 10% chance to use its skill and restores {se:1699000311:effect_value02:divide100}% of the Elementalist's HP each time an attack lands. It is dismissed upon selecting the summon icon.
Each skill level increases the Wind Spirit's Accuracy and Critical Hit by 1%.

7 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 7,
      manaRegen: 0,
      range: 20,
      area: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 31,
      classId: 6,
      levels: [{"level":1},{"level":1,"maxValue":"Vacant","minValue":"200"},{"level":2,"maxValue":"Vacant","minValue":"200"},{"level":3,"maxValue":"Vacant","minValue":"200"},{"level":4,"maxValue":"Vacant","minValue":"200"},{"level":5,"maxValue":"Vacant","minValue":"200"},{"level":6,"maxValue":"Vacant","minValue":"200"},{"level":7,"maxValue":"Vacant","minValue":"200"},{"level":8,"maxValue":"Vacant","minValue":"200"},{"level":9,"maxValue":"Vacant","minValue":"200"},{"level":10,"maxValue":"Vacant","minValue":"200"},{"level":11,"maxValue":"Vacant","minValue":"200"},{"level":12,"maxValue":"Vacant","minValue":"200"},{"level":13,"maxValue":"Vacant","minValue":"200"},{"level":14,"maxValue":"Vacant","minValue":"200"},{"level":15,"maxValue":"Vacant","minValue":"200"},{"level":16,"maxValue":"Vacant","minValue":"200"},{"level":17,"maxValue":"Vacant","minValue":"200"},{"level":18,"maxValue":"Vacant","minValue":"200"},{"level":19,"maxValue":"Vacant","minValue":"200"},{"level":20,"maxValue":"Vacant","minValue":"200"},{"level":21,"maxValue":"Vacant","minValue":"200"},{"level":22,"maxValue":"Vacant","minValue":"200"},{"level":23,"maxValue":"Vacant","minValue":"200"},{"level":24,"maxValue":"Vacant","minValue":"200"},{"level":25,"maxValue":"Vacant","minValue":"200"},{"level":26,"maxValue":"Vacant","minValue":"200"},{"level":27,"maxValue":"Vacant","minValue":"200"},{"level":28,"maxValue":"Vacant","minValue":"200"},{"level":29,"maxValue":"Vacant","minValue":"200"},{"level":30,"maxValue":"Vacant","minValue":"200"}]
    },
    {
      id: `16130000`,
      name: `Summon: Earth Spirit`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_013.png`,
      description: `Summons an Earth Spirit.
The Earth Spirit uses a skill which deals <span style="color: #FCC78B">{se_dmg:1613000121:SkillUIMinDmgsum}-{se_dmg:1613000121:SkillUIMaxDmgsum}</span> Earth damage to a target within 20m and increases Enmity by <span style="color: #FCC78B">{se:1613000121:aggro_absolute}</span>. Has a {se:1613000131:effect_value05:divide100}% chance to inflict Taunt for {se:1613000131:effect_value02:time} if the target is a PC.
Continues fighting using basic attacks with a 10% chance to use its skill and increases Enmity each time an attack lands. It is dismissed upon selecting the summon icon.
Each skill level increases the Earth Spirit's Defense and HP by 1%.

7 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 7,
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Single Target`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 31,
      classId: 6,
      levels: [{"level":1},{"level":1,"maxValue":"Vacant","minValue":"200"},{"level":2,"maxValue":"Vacant","minValue":"200"},{"level":3,"maxValue":"Vacant","minValue":"200"},{"level":4,"maxValue":"Vacant","minValue":"200"},{"level":5,"maxValue":"Vacant","minValue":"200"},{"level":6,"maxValue":"Vacant","minValue":"200"},{"level":7,"maxValue":"Vacant","minValue":"200"},{"level":8,"maxValue":"Vacant","minValue":"200"},{"level":9,"maxValue":"Vacant","minValue":"200"},{"level":10,"maxValue":"Vacant","minValue":"200"},{"level":11,"maxValue":"Vacant","minValue":"200"},{"level":12,"maxValue":"Vacant","minValue":"200"},{"level":13,"maxValue":"Vacant","minValue":"200"},{"level":14,"maxValue":"Vacant","minValue":"200"},{"level":15,"maxValue":"Vacant","minValue":"200"},{"level":16,"maxValue":"Vacant","minValue":"200"},{"level":17,"maxValue":"Vacant","minValue":"200"},{"level":18,"maxValue":"Vacant","minValue":"200"},{"level":19,"maxValue":"Vacant","minValue":"200"},{"level":20,"maxValue":"Vacant","minValue":"200"},{"level":21,"maxValue":"Vacant","minValue":"200"},{"level":22,"maxValue":"Vacant","minValue":"200"},{"level":23,"maxValue":"Vacant","minValue":"200"},{"level":24,"maxValue":"Vacant","minValue":"200"},{"level":25,"maxValue":"Vacant","minValue":"200"},{"level":26,"maxValue":"Vacant","minValue":"200"},{"level":27,"maxValue":"Vacant","minValue":"200"},{"level":28,"maxValue":"Vacant","minValue":"200"},{"level":29,"maxValue":"Vacant","minValue":"200"},{"level":30,"maxValue":"Vacant","minValue":"200"}]
    },
    {
      id: `16140000`,
      name: `Jointstrike: Curse`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_014.png`,
      description: `Select a target within 20m and deal <span style="color: #FCC78B">{se_dmg:1614000011:SkillUIMinDmgsum}-{se_dmg:1614000011:SkillUIMaxDmgsum}</span> damage to up to 4 enemies within 4m of the target and inflict Curse for {se:1614000013:effect_value02:time}, which deals <span style="color: #FCC78B">{se_abe_dmg:1614000013:1614000011:SkillUIDotMinDmg:tick}-{se_abe_dmg:1614000013:1614000011:SkillUIDotMaxDmg:tick}</span> Damage over Time every 1s.

The Spirit joins for a coordinated assault.
Fire: <span style="color: #FCC78B">{se_dmg:1600110111:SkillUIMinDmgsum}-{se_dmg:1600110111:SkillUIMaxDmgsum}</span> AoE damage
Water: <span style="color: #FCC78B">{se_dmg:1600110511:SkillUIMinDmgsum}-{se_dmg:1600110511:SkillUIMaxDmgsum}</span> damage
Earth: <span style="color: #FCC78B">{se_dmg:1600111311:SkillUIMinDmgsum}-{se_dmg:1600111311:SkillUIMaxDmgsum}</span> damage, reduces enemy Status Effect Resist by {se_abe:1600111312:1600111311:value02:divide100abs}%
Wind: <span style="color: #FCC78B">{se_dmg:1600110911:SkillUIMinDmgsum}-{se_dmg:1600110911:SkillUIMaxDmgsum}</span> AoE damage, <span style="color: #FCC78B">{se_abe_dmg:1600110912:1600110912:SkillUIDotMinDmg:total}-{se_abe_dmg:1600110912:1600110912:SkillUIDotMaxDmg:total}</span> Damage over Time, reduces enemy Critical Damage Tolerance by {se_abe:1600110912:1600110911:value02:divide100abs}%
Ancient: <span style="color: #FCC78B">{se_dmg:1600111711:SkillUIMinDmgsum}-{se_dmg:1600111711:SkillUIMaxDmgsum}</span> AoE damage

10 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 10,
      manaRegen: 0,
      range: 20,
      area: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 6,
      levels: [{"level":1,"maxValue":"74","minValue":"74"},{"level":2,"maxValue":"105","minValue":"105"},{"level":3,"maxValue":"137","minValue":"137"},{"level":4,"maxValue":"184","minValue":"184"},{"level":5,"maxValue":"243","minValue":"243"},{"level":6,"maxValue":"312","minValue":"312"},{"level":7,"maxValue":"371","minValue":"371"},{"level":8,"maxValue":"429","minValue":"429"},{"level":9,"maxValue":"488","minValue":"488"},{"level":10,"maxValue":"546","minValue":"546"},{"level":11,"maxValue":"616","minValue":"616"},{"level":12,"maxValue":"675","minValue":"675"},{"level":13,"maxValue":"717","minValue":"717"},{"level":14,"maxValue":"749","minValue":"749"},{"level":15,"maxValue":"792","minValue":"792"},{"level":16,"maxValue":"834","minValue":"834"},{"level":17,"maxValue":"877","minValue":"877"},{"level":18,"maxValue":"920","minValue":"920"},{"level":19,"maxValue":"951","minValue":"951"},{"level":20,"maxValue":"983","minValue":"983"},{"level":21,"maxValue":"1014","minValue":"1014"},{"level":22,"maxValue":"1046","minValue":"1046"},{"level":23,"maxValue":"1077","minValue":"1077"},{"level":24,"maxValue":"1109","minValue":"1109"},{"level":25,"maxValue":"1140","minValue":"1140"},{"level":26,"maxValue":"1172","minValue":"1172"},{"level":27,"maxValue":"1203","minValue":"1203"},{"level":28,"maxValue":"1235","minValue":"1235"},{"level":29,"maxValue":"1266","minValue":"1266"},{"level":30,"maxValue":"1298","minValue":"1298"}]
    },
    {
      id: `16200000`,
      name: `Defiance`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CO_SKILL_002.png`,
      description: `Removes Stun, Knockdown, and Airborne from the caster and grants Tenacity for {se:1820000012:effect_value02:time}.
Tenacity: +{abe:1002000011:value02:divide100}% Stun, Knockdown, Airborne Resist`,
      condition: [],
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Single Target`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 1,
      classId: 6,
      levels: [{"level":1,"maxValue":"Debuff","minValue":"FALSE"}]
    },
    {
      id: `16300000`,
      name: `Elemental Fusion`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_030.png`,
      description: `The Elementalist receives an element each time a Spirit uses its skill. Grants Four Elements status and the ability to use the [Elemental Fusion] skill upon reaching 4 stacks. [Elemental Fusion] can only be used when granted Four Elements, and using [Elemental Fusion] will immediately remove Four Elements.

Deals <span style="color: #FCC78B">{se_dmg:1630000011:SkillUIMinDmgsum}-{se_dmg:1630000011:SkillUIMaxDmgsum}</span> damage to a target within 20m.

10 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 10,
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Single Target`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 31,
      classId: 6,
      levels: [{"level":1,"maxValue":"761","minValue":"761"},{"level":2,"maxValue":"979","minValue":"979"},{"level":3,"maxValue":"1163","minValue":"1163"},{"level":4,"maxValue":"1346","minValue":"1346"},{"level":5,"maxValue":"1529","minValue":"1529"},{"level":6,"maxValue":"1713","minValue":"1713"},{"level":7,"maxValue":"1931","minValue":"1931"},{"level":8,"maxValue":"2115","minValue":"2115"},{"level":9,"maxValue":"2248","minValue":"2248"},{"level":10,"maxValue":"2347","minValue":"2347"},{"level":11,"maxValue":"2481","minValue":"2481"},{"level":12,"maxValue":"2615","minValue":"2615"},{"level":13,"maxValue":"2749","minValue":"2749"},{"level":14,"maxValue":"2883","minValue":"2883"},{"level":15,"maxValue":"2982","minValue":"2982"},{"level":16,"maxValue":"3080","minValue":"3080"},{"level":17,"maxValue":"3179","minValue":"3179"},{"level":18,"maxValue":"3278","minValue":"3278"},{"level":19,"maxValue":"3376","minValue":"3376"},{"level":20,"maxValue":"3475","minValue":"3475"},{"level":21,"maxValue":"3574","minValue":"3574"},{"level":22,"maxValue":"3673","minValue":"3673"},{"level":23,"maxValue":"3771","minValue":"3771"},{"level":24,"maxValue":"3870","minValue":"3870"},{"level":25,"maxValue":"3969","minValue":"3969"},{"level":26,"maxValue":"4067","minValue":"4067"},{"level":27,"maxValue":"4166","minValue":"4166"},{"level":28,"maxValue":"4265","minValue":"4265"},{"level":29,"maxValue":"4363","minValue":"4363"},{"level":30,"maxValue":"4462","minValue":"4462"},{"level":1,"maxValue":"Buff","minValue":"FALSE"}]
    },
    {
      id: `16330000`,
      name: `Dimensional Control`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_033.png`,
      description: `A skill that is activated for a short while each time a Spirit uses its skill.
Select a target within 20m and deal <span style="color: #FCC78B">{se_dmg:1633000011:SkillUIMinDmgsum}-{se_dmg:1633000011:SkillUIMaxDmgsum}</span> damage to up to 4 enemies within 4m of the target and inflict Slowed, reducing Move Speed by {abe:1000000412:value02:divide100abs}% for {se:1633000013:effect_value02:time}. Restores 100 MP.

5 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 5,
      manaCost: -100,
      manaRegen: 0,
      range: 20,
      area: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 31,
      classId: 6,
      levels: [{"level":1,"maxValue":"157","minValue":"157"},{"level":2,"maxValue":"211","minValue":"211"},{"level":3,"maxValue":"278","minValue":"278"},{"level":4,"maxValue":"358","minValue":"358"},{"level":5,"maxValue":"425","minValue":"425"},{"level":6,"maxValue":"492","minValue":"492"},{"level":7,"maxValue":"559","minValue":"559"},{"level":8,"maxValue":"626","minValue":"626"},{"level":9,"maxValue":"706","minValue":"706"},{"level":10,"maxValue":"774","minValue":"774"},{"level":11,"maxValue":"823","minValue":"823"},{"level":12,"maxValue":"859","minValue":"859"},{"level":13,"maxValue":"908","minValue":"908"},{"level":14,"maxValue":"1006","minValue":"1006"},{"level":15,"maxValue":"1055","minValue":"1055"},{"level":16,"maxValue":"1091","minValue":"1091"},{"level":17,"maxValue":"1127","minValue":"1127"},{"level":18,"maxValue":"1163","minValue":"1163"},{"level":19,"maxValue":"1199","minValue":"1199"},{"level":20,"maxValue":"1235","minValue":"1235"},{"level":21,"maxValue":"1271","minValue":"1271"},{"level":22,"maxValue":"1308","minValue":"1308"},{"level":23,"maxValue":"1344","minValue":"1344"},{"level":24,"maxValue":"1380","minValue":"1380"},{"level":25,"maxValue":"1416","minValue":"1416"},{"level":26,"maxValue":"1452","minValue":"1452"},{"level":27,"maxValue":"1488","minValue":"1488"},{"level":28,"maxValue":"1524","minValue":"1524"},{"level":29,"maxValue":"1560","minValue":"1560"},{"level":30,"maxValue":"1597","minValue":"1597"},{"level":1,"maxValue":"Buff","minValue":"FALSE"}]
    },
    {
      id: `16340000`,
      name: `Rapid Scattershot`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_034.png`,
      description: `Deals <span style="color: #FCC78B">{se_dmg:1634000011:SkillUIMinDmgsum}-{se_dmg:1634000011:SkillUIMaxDmgsum}</span> damage to a Stagger target within 20m.`,
      condition: [],
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Single Target`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 120,
      classId: 6,
      levels: [{"level":1,"maxValue":"116","minValue":"116"},{"level":2,"maxValue":"150","minValue":"150"},{"level":3,"maxValue":"202","minValue":"202"},{"level":4,"maxValue":"267","minValue":"267"},{"level":5,"maxValue":"344","minValue":"344"},{"level":6,"maxValue":"408","minValue":"408"},{"level":7,"maxValue":"472","minValue":"472"},{"level":8,"maxValue":"537","minValue":"537"},{"level":9,"maxValue":"601","minValue":"601"},{"level":10,"maxValue":"678","minValue":"678"},{"level":11,"maxValue":"742","minValue":"742"},{"level":12,"maxValue":"789","minValue":"789"},{"level":13,"maxValue":"824","minValue":"824"},{"level":14,"maxValue":"965","minValue":"965"},{"level":15,"maxValue":"1012","minValue":"1012"},{"level":16,"maxValue":"1046","minValue":"1046"},{"level":17,"maxValue":"1081","minValue":"1081"},{"level":18,"maxValue":"1116","minValue":"1116"},{"level":19,"maxValue":"1150","minValue":"1150"},{"level":20,"maxValue":"1185","minValue":"1185"},{"level":21,"maxValue":"1220","minValue":"1220"},{"level":22,"maxValue":"1254","minValue":"1254"},{"level":23,"maxValue":"1289","minValue":"1289"},{"level":24,"maxValue":"1324","minValue":"1324"},{"level":25,"maxValue":"1358","minValue":"1358"},{"level":26,"maxValue":"1393","minValue":"1393"},{"level":27,"maxValue":"1428","minValue":"1428"},{"level":28,"maxValue":"1462","minValue":"1462"},{"level":29,"maxValue":"1497","minValue":"1497"},{"level":30,"maxValue":"1532","minValue":"1532"},{"level":1,"maxValue":"116","minValue":"116"},{"level":2,"maxValue":"150","minValue":"150"},{"level":3,"maxValue":"202","minValue":"202"},{"level":4,"maxValue":"267","minValue":"267"},{"level":5,"maxValue":"344","minValue":"344"},{"level":6,"maxValue":"408","minValue":"408"},{"level":7,"maxValue":"472","minValue":"472"},{"level":8,"maxValue":"537","minValue":"537"},{"level":9,"maxValue":"601","minValue":"601"},{"level":10,"maxValue":"678","minValue":"678"},{"level":11,"maxValue":"742","minValue":"742"},{"level":12,"maxValue":"789","minValue":"789"},{"level":13,"maxValue":"824","minValue":"824"},{"level":14,"maxValue":"965","minValue":"965"},{"level":15,"maxValue":"1012","minValue":"1012"},{"level":16,"maxValue":"1046","minValue":"1046"},{"level":17,"maxValue":"1081","minValue":"1081"},{"level":18,"maxValue":"1116","minValue":"1116"},{"level":19,"maxValue":"1150","minValue":"1150"},{"level":20,"maxValue":"1185","minValue":"1185"},{"level":21,"maxValue":"1220","minValue":"1220"},{"level":22,"maxValue":"1254","minValue":"1254"},{"level":23,"maxValue":"1289","minValue":"1289"},{"level":24,"maxValue":"1324","minValue":"1324"},{"level":25,"maxValue":"1358","minValue":"1358"},{"level":26,"maxValue":"1393","minValue":"1393"},{"level":27,"maxValue":"1428","minValue":"1428"},{"level":28,"maxValue":"1462","minValue":"1462"},{"level":29,"maxValue":"1497","minValue":"1497"},{"level":30,"maxValue":"1532","minValue":"1532"},{"level":1,"maxValue":"116","minValue":"116"},{"level":2,"maxValue":"150","minValue":"150"},{"level":3,"maxValue":"202","minValue":"202"},{"level":4,"maxValue":"267","minValue":"267"},{"level":5,"maxValue":"344","minValue":"344"},{"level":6,"maxValue":"408","minValue":"408"},{"level":7,"maxValue":"472","minValue":"472"},{"level":8,"maxValue":"537","minValue":"537"},{"level":9,"maxValue":"601","minValue":"601"},{"level":10,"maxValue":"678","minValue":"678"},{"level":11,"maxValue":"742","minValue":"742"},{"level":12,"maxValue":"789","minValue":"789"},{"level":13,"maxValue":"824","minValue":"824"},{"level":14,"maxValue":"965","minValue":"965"},{"level":15,"maxValue":"1012","minValue":"1012"},{"level":16,"maxValue":"1046","minValue":"1046"},{"level":17,"maxValue":"1081","minValue":"1081"},{"level":18,"maxValue":"1116","minValue":"1116"},{"level":19,"maxValue":"1150","minValue":"1150"},{"level":20,"maxValue":"1185","minValue":"1185"},{"level":21,"maxValue":"1220","minValue":"1220"},{"level":22,"maxValue":"1254","minValue":"1254"},{"level":23,"maxValue":"1289","minValue":"1289"},{"level":24,"maxValue":"1324","minValue":"1324"},{"level":25,"maxValue":"1358","minValue":"1358"},{"level":26,"maxValue":"1393","minValue":"1393"},{"level":27,"maxValue":"1428","minValue":"1428"},{"level":28,"maxValue":"1462","minValue":"1462"},{"level":29,"maxValue":"1497","minValue":"1497"},{"level":30,"maxValue":"1532","minValue":"1532"},{"level":1,"maxValue":"116","minValue":"116"},{"level":2,"maxValue":"150","minValue":"150"},{"level":3,"maxValue":"202","minValue":"202"},{"level":4,"maxValue":"267","minValue":"267"},{"level":5,"maxValue":"344","minValue":"344"},{"level":6,"maxValue":"408","minValue":"408"},{"level":7,"maxValue":"472","minValue":"472"},{"level":8,"maxValue":"537","minValue":"537"},{"level":9,"maxValue":"601","minValue":"601"},{"level":10,"maxValue":"678","minValue":"678"},{"level":11,"maxValue":"742","minValue":"742"},{"level":12,"maxValue":"789","minValue":"789"},{"level":13,"maxValue":"824","minValue":"824"},{"level":14,"maxValue":"965","minValue":"965"},{"level":15,"maxValue":"1012","minValue":"1012"},{"level":16,"maxValue":"1046","minValue":"1046"},{"level":17,"maxValue":"1081","minValue":"1081"},{"level":18,"maxValue":"1116","minValue":"1116"},{"level":19,"maxValue":"1150","minValue":"1150"},{"level":20,"maxValue":"1185","minValue":"1185"},{"level":21,"maxValue":"1220","minValue":"1220"},{"level":22,"maxValue":"1254","minValue":"1254"},{"level":23,"maxValue":"1289","minValue":"1289"},{"level":24,"maxValue":"1324","minValue":"1324"},{"level":25,"maxValue":"1358","minValue":"1358"},{"level":26,"maxValue":"1393","minValue":"1393"},{"level":27,"maxValue":"1428","minValue":"1428"},{"level":28,"maxValue":"1462","minValue":"1462"},{"level":29,"maxValue":"1497","minValue":"1497"},{"level":30,"maxValue":"1532","minValue":"1532"}]
    }
  ],
  passives: [
    {
      id: `16710000`,
      name: `Spirit Strike`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_Passive_004.png`,
      description: `Increases the caster's Attack by <span style="color: #FCC78B">{abe:1671000011:value02:divide100}%</span> and Spirit's Attack by <span style="color: #FCC78B">{abe:1671000011:value02:divide100}%</span>.`,
      spellTag: ["Passive"],
      maxLevel: 30,
      classId: 6,
      levels: [{"level":1,"minValue":"167100001"},{"level":2,"minValue":"167100001"},{"level":3,"minValue":"167100001"},{"level":4,"minValue":"167100001"},{"level":5,"minValue":"167100001"},{"level":6,"minValue":"167100001"},{"level":7,"minValue":"167100001"},{"level":8,"minValue":"167100001"},{"level":9,"minValue":"167100001"},{"level":10,"minValue":"167100001"},{"level":11,"minValue":"167100001"},{"level":12,"minValue":"167100001"},{"level":13,"minValue":"167100001"},{"level":14,"minValue":"167100001"},{"level":15,"minValue":"167100001"},{"level":16,"minValue":"167100001"},{"level":17,"minValue":"167100001"},{"level":18,"minValue":"167100001"},{"level":19,"minValue":"167100001"},{"level":20,"minValue":"167100001"},{"level":21,"minValue":"167100001"},{"level":22,"minValue":"167100001"},{"level":23,"minValue":"167100001"},{"level":24,"minValue":"167100001"},{"level":25,"minValue":"167100001"},{"level":26,"minValue":"167100001"},{"level":27,"minValue":"167100001"},{"level":28,"minValue":"167100001"},{"level":29,"minValue":"167100001"},{"level":30,"minValue":"167100001"}]
    },
    {
      id: `16720000`,
      name: `Spirit Protection`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_Passive_002.png`,
      description: `Increases the caster's Defense by <span style="color: #FCC78B">{abe:1672000011:value02:divide100}%</span> and Spirit's Defense by <span style="color: #FCC78B">{abe:1672000011:value02:divide100}%</span>.`,
      spellTag: ["Passive"],
      maxLevel: 30,
      classId: 6,
      levels: [{"level":1,"minValue":"167200001"},{"level":2,"minValue":"167200001"},{"level":3,"minValue":"167200001"},{"level":4,"minValue":"167200001"},{"level":5,"minValue":"167200001"},{"level":6,"minValue":"167200001"},{"level":7,"minValue":"167200001"},{"level":8,"minValue":"167200001"},{"level":9,"minValue":"167200001"},{"level":10,"minValue":"167200001"},{"level":11,"minValue":"167200001"},{"level":12,"minValue":"167200001"},{"level":13,"minValue":"167200001"},{"level":14,"minValue":"167200001"},{"level":15,"minValue":"167200001"},{"level":16,"minValue":"167200001"},{"level":17,"minValue":"167200001"},{"level":18,"minValue":"167200001"},{"level":19,"minValue":"167200001"},{"level":20,"minValue":"167200001"},{"level":21,"minValue":"167200001"},{"level":22,"minValue":"167200001"},{"level":23,"minValue":"167200001"},{"level":24,"minValue":"167200001"},{"level":25,"minValue":"167200001"},{"level":26,"minValue":"167200001"},{"level":27,"minValue":"167200001"},{"level":28,"minValue":"167200001"},{"level":29,"minValue":"167200001"},{"level":30,"minValue":"167200001"}]
    },
    {
      id: `16730000`,
      name: `Spirit's Descent`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_Passive_003.png`,
      description: `Has a {abe:1673000011:value02:divide100}% chance to deal <span style="color: #FCC78B">{se_dmg:1673000111:SkillUIMinDmgsum}-{se_dmg:1673000111:SkillUIMaxDmgsum}</span> extra damage whenever the Elementalist's attacks land within 10 seconds after a Spirit is summoned.`,
      spellTag: ["Passive"],
      maxLevel: 30,
      classId: 6,
      levels: [{"level":1,"minValue":"167300001"},{"level":2,"minValue":"167300001"},{"level":3,"minValue":"167300001"},{"level":4,"minValue":"167300001"},{"level":5,"minValue":"167300001"},{"level":6,"minValue":"167300001"},{"level":7,"minValue":"167300001"},{"level":8,"minValue":"167300001"},{"level":9,"minValue":"167300001"},{"level":10,"minValue":"167300001"},{"level":11,"minValue":"167300001"},{"level":12,"minValue":"167300001"},{"level":13,"minValue":"167300001"},{"level":14,"minValue":"167300001"},{"level":15,"minValue":"167300001"},{"level":16,"minValue":"167300001"},{"level":17,"minValue":"167300001"},{"level":18,"minValue":"167300001"},{"level":19,"minValue":"167300001"},{"level":20,"minValue":"167300001"},{"level":21,"minValue":"167300001"},{"level":22,"minValue":"167300001"},{"level":23,"minValue":"167300001"},{"level":24,"minValue":"167300001"},{"level":25,"minValue":"167300001"},{"level":26,"minValue":"167300001"},{"level":27,"minValue":"167300001"},{"level":28,"minValue":"167300001"},{"level":29,"minValue":"167300001"},{"level":30,"minValue":"167300001"}]
    },
    {
      id: `16740000`,
      name: `Corrode`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_Passive_012.png`,
      description: `Increases the caster's Critical Hit by <span style="color: #FCC78B">{abe:1674000011:value02}</span> and has a {abe:1674000012:value02:divide100}% chance to deal <span style="color: #FCC78B">{se_dmg:1674000111:SkillUIMinDmgsum}-{se_dmg:1674000111:SkillUIMaxDmgsum}</span> damage on landing a Critical Hit.`,
      spellTag: ["Passive"],
      maxLevel: 30,
      classId: 6,
      levels: [{"level":1,"minValue":"167400001"},{"level":2,"minValue":"167400001"},{"level":3,"minValue":"167400001"},{"level":4,"minValue":"167400001"},{"level":5,"minValue":"167400001"},{"level":6,"minValue":"167400001"},{"level":7,"minValue":"167400001"},{"level":8,"minValue":"167400001"},{"level":9,"minValue":"167400001"},{"level":10,"minValue":"167400001"},{"level":11,"minValue":"167400001"},{"level":12,"minValue":"167400001"},{"level":13,"minValue":"167400001"},{"level":14,"minValue":"167400001"},{"level":15,"minValue":"167400001"},{"level":16,"minValue":"167400001"},{"level":17,"minValue":"167400001"},{"level":18,"minValue":"167400001"},{"level":19,"minValue":"167400001"},{"level":20,"minValue":"167400001"},{"level":21,"minValue":"167400001"},{"level":22,"minValue":"167400001"},{"level":23,"minValue":"167400001"},{"level":24,"minValue":"167400001"},{"level":25,"minValue":"167400001"},{"level":26,"minValue":"167400001"},{"level":27,"minValue":"167400001"},{"level":28,"minValue":"167400001"},{"level":29,"minValue":"167400001"},{"level":30,"minValue":"167400001"}]
    },
    {
      id: `16750000`,
      name: `Spirit Revitalization`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_Passive_011.png`,
      description: `Immediately heals the Spirit for <span style="color: #FCC78B">{se:1675000111:effect_value02:divide100}%</span> of its Max HP when its HP is 50% or less.

Cooldown: 30s`,
      spellTag: ["Passive"],
      maxLevel: 30,
      classId: 6,
      levels: [{"level":1,"minValue":"167500001"},{"level":2,"minValue":"167500001"},{"level":3,"minValue":"167500001"},{"level":4,"minValue":"167500001"},{"level":5,"minValue":"167500001"},{"level":6,"minValue":"167500001"},{"level":7,"minValue":"167500001"},{"level":8,"minValue":"167500001"},{"level":9,"minValue":"167500001"},{"level":10,"minValue":"167500001"},{"level":11,"minValue":"167500001"},{"level":12,"minValue":"167500001"},{"level":13,"minValue":"167500001"},{"level":14,"minValue":"167500001"},{"level":15,"minValue":"167500001"},{"level":16,"minValue":"167500001"},{"level":17,"minValue":"167500001"},{"level":18,"minValue":"167500001"},{"level":19,"minValue":"167500001"},{"level":20,"minValue":"167500001"},{"level":21,"minValue":"167500001"},{"level":22,"minValue":"167500001"},{"level":23,"minValue":"167500001"},{"level":24,"minValue":"167500001"},{"level":25,"minValue":"167500001"},{"level":26,"minValue":"167500001"},{"level":27,"minValue":"167500001"},{"level":28,"minValue":"167500001"},{"level":29,"minValue":"167500001"},{"level":30,"minValue":"167500001"}]
    },
    {
      id: `16760000`,
      name: `Mental Focus`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_Passive_006.png`,
      description: `Increases the caster's Mental-type Chance(s) by <span style="color: #FCC78B">{abe:1676000011:value02:divide100}%</span> and Smite by <span style="color: #FCC78B">{abe:1676000012:value02:divide100}%</span>.`,
      spellTag: ["Passive"],
      maxLevel: 30,
      classId: 6,
      levels: [{"level":1,"minValue":"167600001"},{"level":2,"minValue":"167600001"},{"level":3,"minValue":"167600001"},{"level":4,"minValue":"167600001"},{"level":5,"minValue":"167600001"},{"level":6,"minValue":"167600001"},{"level":7,"minValue":"167600001"},{"level":8,"minValue":"167600001"},{"level":9,"minValue":"167600001"},{"level":10,"minValue":"167600001"},{"level":11,"minValue":"167600001"},{"level":12,"minValue":"167600001"},{"level":13,"minValue":"167600001"},{"level":14,"minValue":"167600001"},{"level":15,"minValue":"167600001"},{"level":16,"minValue":"167600001"},{"level":17,"minValue":"167600001"},{"level":18,"minValue":"167600001"},{"level":19,"minValue":"167600001"},{"level":20,"minValue":"167600001"},{"level":21,"minValue":"167600001"},{"level":22,"minValue":"167600001"},{"level":23,"minValue":"167600001"},{"level":24,"minValue":"167600001"},{"level":25,"minValue":"167600001"},{"level":26,"minValue":"167600001"},{"level":27,"minValue":"167600001"},{"level":28,"minValue":"167600001"},{"level":29,"minValue":"167600001"},{"level":30,"minValue":"167600001"}]
    },
    {
      id: `16770000`,
      name: `Spirit Communion`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_Passive_007.png`,
      description: `Has a {abe:1677000011:value02:divide100}% chance to restore the caster and Spirit's HP by <span style="color: #FCC78B">{se_dmg:1677000111:SkillUIHPHealMin}-{se_dmg:1677000111:SkillUIHPHealMax}</span> when landing an attack.`,
      spellTag: ["Passive"],
      maxLevel: 30,
      classId: 6,
      levels: [{"level":1,"minValue":"167700001"},{"level":2,"minValue":"167700001"},{"level":3,"minValue":"167700001"},{"level":4,"minValue":"167700001"},{"level":5,"minValue":"167700001"},{"level":6,"minValue":"167700001"},{"level":7,"minValue":"167700001"},{"level":8,"minValue":"167700001"},{"level":9,"minValue":"167700001"},{"level":10,"minValue":"167700001"},{"level":11,"minValue":"167700001"},{"level":12,"minValue":"167700001"},{"level":13,"minValue":"167700001"},{"level":14,"minValue":"167700001"},{"level":15,"minValue":"167700001"},{"level":16,"minValue":"167700001"},{"level":17,"minValue":"167700001"},{"level":18,"minValue":"167700001"},{"level":19,"minValue":"167700001"},{"level":20,"minValue":"167700001"},{"level":21,"minValue":"167700001"},{"level":22,"minValue":"167700001"},{"level":23,"minValue":"167700001"},{"level":24,"minValue":"167700001"},{"level":25,"minValue":"167700001"},{"level":26,"minValue":"167700001"},{"level":27,"minValue":"167700001"},{"level":28,"minValue":"167700001"},{"level":29,"minValue":"167700001"},{"level":30,"minValue":"167700001"}]
    },
    {
      id: `16780000`,
      name: `Element Unification`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_Passive_008.png`,
      description: `Deals <span style="color: #FCC78B">{se_abe_dmg:1678000111:1678000111:SkillUIDotMinDmg:tick}-{se_abe_dmg:1678000111:1678000111:SkillUIDotMaxDmg:tick}</span> Damage over Time every 1s for {se:1678000111:effect_value02:time} when landing a Spirit's skill attack.`,
      spellTag: ["Passive"],
      maxLevel: 30,
      classId: 6,
      levels: [{"level":1,"minValue":"167800001"},{"level":2,"minValue":"167800001"},{"level":3,"minValue":"167800001"},{"level":4,"minValue":"167800001"},{"level":5,"minValue":"167800001"},{"level":6,"minValue":"167800001"},{"level":7,"minValue":"167800001"},{"level":8,"minValue":"167800001"},{"level":9,"minValue":"167800001"},{"level":10,"minValue":"167800001"},{"level":11,"minValue":"167800001"},{"level":12,"minValue":"167800001"},{"level":13,"minValue":"167800001"},{"level":14,"minValue":"167800001"},{"level":15,"minValue":"167800001"},{"level":16,"minValue":"167800001"},{"level":17,"minValue":"167800001"},{"level":18,"minValue":"167800001"},{"level":19,"minValue":"167800001"},{"level":20,"minValue":"167800001"},{"level":21,"minValue":"167800001"},{"level":22,"minValue":"167800001"},{"level":23,"minValue":"167800001"},{"level":24,"minValue":"167800001"},{"level":25,"minValue":"167800001"},{"level":26,"minValue":"167800001"},{"level":27,"minValue":"167800001"},{"level":28,"minValue":"167800001"},{"level":29,"minValue":"167800001"},{"level":30,"minValue":"167800001"}]
    },
    {
      id: `16790000`,
      name: `Revitalization Contract`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_AS_SKILL_Passive_009.png`,
      description: `Increases the caster's Status Effect Resist by <span style="color: #FCC78B">{abe:1379000012:value02:divide100}%</span> and immediately restores <span style="color: #FCC78B">{se_dmg:1379000711:SkillUIHPHealMin:total}-{se_dmg:1379000711:SkillUIHPHealMax:total}</span> HP when the caster's HP is 10% or less.

Cooldown: {abe:1379000011:value03:time}`,
      spellTag: ["Passive"],
      maxLevel: 30,
      classId: 6,
      levels: [{"level":1,"minValue":"167900001"},{"level":2,"minValue":"167900001"},{"level":3,"minValue":"167900001"},{"level":4,"minValue":"167900001"},{"level":5,"minValue":"167900001"},{"level":6,"minValue":"167900001"},{"level":7,"minValue":"167900001"},{"level":8,"minValue":"167900001"},{"level":9,"minValue":"167900001"},{"level":10,"minValue":"167900001"},{"level":11,"minValue":"167900001"},{"level":12,"minValue":"167900001"},{"level":13,"minValue":"167900001"},{"level":14,"minValue":"167900001"},{"level":15,"minValue":"167900001"},{"level":16,"minValue":"167900001"},{"level":17,"minValue":"167900001"},{"level":18,"minValue":"167900001"},{"level":19,"minValue":"167900001"},{"level":20,"minValue":"167900001"},{"level":21,"minValue":"167900001"},{"level":22,"minValue":"167900001"},{"level":23,"minValue":"167900001"},{"level":24,"minValue":"167900001"},{"level":25,"minValue":"167900001"},{"level":26,"minValue":"167900001"},{"level":27,"minValue":"167900001"},{"level":28,"minValue":"167900001"},{"level":29,"minValue":"167900001"},{"level":30,"minValue":"167900001"}]
    },
    {
      id: `16800000`,
      name: `Consecutive Countercurrent`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_Passive_013.png`,
      description: `Has a {abe:1680000011:value02:divide100}% chance to deal <span style="color: #FCC78B">{se_dmg:1680000111:SkillUIMinDmgsum}-{se_dmg:1680000111:SkillUIMaxDmgsum}</span> extra damage when landing an attack on a target taking Damage over Time.`,
      spellTag: ["Passive"],
      maxLevel: 30,
      classId: 6,
      levels: [{"level":1,"minValue":"168000001"},{"level":2,"minValue":"168000001"},{"level":3,"minValue":"168000001"},{"level":4,"minValue":"168000001"},{"level":5,"minValue":"168000001"},{"level":6,"minValue":"168000001"},{"level":7,"minValue":"168000001"},{"level":8,"minValue":"168000001"},{"level":9,"minValue":"168000001"},{"level":10,"minValue":"168000001"},{"level":11,"minValue":"168000001"},{"level":12,"minValue":"168000001"},{"level":13,"minValue":"168000001"},{"level":14,"minValue":"168000001"},{"level":15,"minValue":"168000001"},{"level":16,"minValue":"168000001"},{"level":17,"minValue":"168000001"},{"level":18,"minValue":"168000001"},{"level":19,"minValue":"168000001"},{"level":20,"minValue":"168000001"},{"level":21,"minValue":"168000001"},{"level":22,"minValue":"168000001"},{"level":23,"minValue":"168000001"},{"level":24,"minValue":"168000001"},{"level":25,"minValue":"168000001"},{"level":26,"minValue":"168000001"},{"level":27,"minValue":"168000001"},{"level":28,"minValue":"168000001"},{"level":29,"minValue":"168000001"},{"level":30,"minValue":"168000001"}]
    }
  ],
  stigmas: [
    {
      id: `16060000`,
      name: `Siphon`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_006.png`,
      description: `Deals <span style="color: #FCC78B">{se_dmg:1606000011:SkillUIMinDmgsum}-{se_dmg:1606000011:SkillUIMaxDmgsum}</span> damage and {se:1606000012:effect_value02} MP damage to a target within 20m. Absorbs {se:1606000011:effect_value14:divide100}% of damage as HP and restores {se:1606000111:effect_value02} MP.`,
      condition: [],
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Single Target`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 6,
      levels: [{"level":1,"maxValue":"1180","minValue":"1180"},{"level":2,"maxValue":"1341","minValue":"1341"},{"level":3,"maxValue":"1501","minValue":"1501"},{"level":4,"maxValue":"1693","minValue":"1693"},{"level":5,"maxValue":"1854","minValue":"1854"},{"level":6,"maxValue":"1971","minValue":"1971"},{"level":7,"maxValue":"2057","minValue":"2057"},{"level":8,"maxValue":"2175","minValue":"2175"},{"level":9,"maxValue":"2292","minValue":"2292"},{"level":10,"maxValue":"2410","minValue":"2410"},{"level":11,"maxValue":"2527","minValue":"2527"},{"level":12,"maxValue":"2614","minValue":"2614"},{"level":13,"maxValue":"2700","minValue":"2700"},{"level":14,"maxValue":"2787","minValue":"2787"},{"level":15,"maxValue":"2873","minValue":"2873"},{"level":16,"maxValue":"2960","minValue":"2960"},{"level":17,"maxValue":"3046","minValue":"3046"},{"level":18,"maxValue":"3133","minValue":"3133"},{"level":19,"maxValue":"3219","minValue":"3219"},{"level":20,"maxValue":"3306","minValue":"3306"},{"level":21,"maxValue":"3392","minValue":"3392"},{"level":22,"maxValue":"3479","minValue":"3479"},{"level":23,"maxValue":"3565","minValue":"3565"},{"level":24,"maxValue":"3652","minValue":"3652"},{"level":25,"maxValue":"3738","minValue":"3738"},{"level":26,"maxValue":"3825","minValue":"3825"},{"level":27,"maxValue":"3911","minValue":"3911"},{"level":28,"maxValue":"3998","minValue":"3998"},{"level":29,"maxValue":"4084","minValue":"4084"},{"level":30,"maxValue":"4171","minValue":"4171"}]
    },
    {
      id: `16080000`,
      name: `Cry of Terror`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_008.png`,
      description: `Deals <span style="color: #FCC78B">{se_dmg:1608000011:SkillUIMinDmgsum}-{se_dmg:1608000011:SkillUIMaxDmgsum}</span> damage to up to {sef:160000004:target_count_max} enemies within {sef:160000004:effect_range_value05:divide100}m of the caster and has a {se:1608000012:effect_value05:divide100}% chance to inflict Fear for {se:1608000012:effect_value02:time}.
100% chance to land Fear on NPC targets.`,
      condition: [],
      manaRegen: 0,
      range: 20,
      area: 5,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 6,
      duration: 5,
      levels: [{"level":1,"maxValue":"859","minValue":"859"},{"level":2,"maxValue":"976","minValue":"976"},{"level":3,"maxValue":"1093","minValue":"1093"},{"level":4,"maxValue":"1233","minValue":"1233"},{"level":5,"maxValue":"1350","minValue":"1350"},{"level":6,"maxValue":"1435","minValue":"1435"},{"level":7,"maxValue":"1498","minValue":"1498"},{"level":8,"maxValue":"1584","minValue":"1584"},{"level":9,"maxValue":"1669","minValue":"1669"},{"level":10,"maxValue":"1755","minValue":"1755"},{"level":11,"maxValue":"1840","minValue":"1840"},{"level":12,"maxValue":"1903","minValue":"1903"},{"level":13,"maxValue":"1966","minValue":"1966"},{"level":14,"maxValue":"2029","minValue":"2029"},{"level":15,"maxValue":"2092","minValue":"2092"},{"level":16,"maxValue":"2155","minValue":"2155"},{"level":17,"maxValue":"2218","minValue":"2218"},{"level":18,"maxValue":"2281","minValue":"2281"},{"level":19,"maxValue":"2344","minValue":"2344"},{"level":20,"maxValue":"2407","minValue":"2407"},{"level":21,"maxValue":"2470","minValue":"2470"},{"level":22,"maxValue":"2533","minValue":"2533"},{"level":23,"maxValue":"2596","minValue":"2596"},{"level":24,"maxValue":"2659","minValue":"2659"},{"level":25,"maxValue":"2722","minValue":"2722"},{"level":26,"maxValue":"2785","minValue":"2785"},{"level":27,"maxValue":"2848","minValue":"2848"},{"level":28,"maxValue":"2911","minValue":"2911"},{"level":29,"maxValue":"2974","minValue":"2974"},{"level":30,"maxValue":"3037","minValue":"3037"}]
    },
    {
      id: `16150000`,
      name: `Jointstrike: Corrode`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_015.png`,
      description: `Select a target within 20m and deal <span style="color: #FCC78B">{se_dmg:1615000011:SkillUIMinDmgsum}-{se_dmg:1615000011:SkillUIMaxDmgsum}</span> damage to up to 4 enemies within 4m of the target and inflicts Corrode for {se:1615000013:effect_value02:time}.

[Corrode]
-{se_abe:1615000013:1615000012:value02:divide100abs}% All Element Tolerance, <span style="color: #FCC78B">{se_abe_dmg:1615000013:1615000011:SkillUIDotMinDmg:tick}-{se_abe_dmg:1615000013:1615000011:SkillUIDotMaxDmg:tick}</span> Damage over Time every 1s

The Spirit joins for a coordinated assault.
Fire: <span style="color: #FCC78B">{se_dmg:1615110011:SkillUIMinDmgsum}-{se_dmg:1615110011:SkillUIMaxDmgsum}</span> AoE damage and Knockdown
Water: <span style="color: #FCC78B">{se_dmg:1615210011:SkillUIMinDmgsum}-{se_dmg:1615210011:SkillUIMaxDmgsum}</span> damage and Slowed
Earth: <span style="color: #FCC78B">{se_dmg:1615310011:SkillUIMinDmgsum}-{se_dmg:1615310011:SkillUIMaxDmgsum}</span> damage and Seal
Wind: <span style="color: #FCC78B">{se_dmg:1615410011:SkillUIMinDmgsum}-{se_dmg:1615410011:SkillUIMaxDmgsum}</span> AoE damage and Stun
Ancient: <span style="color: #FCC78B">{se_dmg:1615510011:SkillUIMinDmgsum}-{se_dmg:1615510011:SkillUIMaxDmgsum}</span> AoE damage and Knockdown

10 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 10,
      manaRegen: 0,
      range: 20,
      area: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 6,
      duration: 10,
      levels: [{"level":1,"maxValue":"429","minValue":"429"},{"level":2,"maxValue":"488","minValue":"488"},{"level":3,"maxValue":"546","minValue":"546"},{"level":4,"maxValue":"616","minValue":"616"},{"level":5,"maxValue":"675","minValue":"675"},{"level":6,"maxValue":"717","minValue":"717"},{"level":7,"maxValue":"749","minValue":"749"},{"level":8,"maxValue":"792","minValue":"792"},{"level":9,"maxValue":"834","minValue":"834"},{"level":10,"maxValue":"877","minValue":"877"},{"level":11,"maxValue":"920","minValue":"920"},{"level":12,"maxValue":"951","minValue":"951"},{"level":13,"maxValue":"983","minValue":"983"},{"level":14,"maxValue":"1014","minValue":"1014"},{"level":15,"maxValue":"1046","minValue":"1046"},{"level":16,"maxValue":"1077","minValue":"1077"},{"level":17,"maxValue":"1109","minValue":"1109"},{"level":18,"maxValue":"1140","minValue":"1140"},{"level":19,"maxValue":"1172","minValue":"1172"},{"level":20,"maxValue":"1203","minValue":"1203"},{"level":21,"maxValue":"1235","minValue":"1235"},{"level":22,"maxValue":"1266","minValue":"1266"},{"level":23,"maxValue":"1298","minValue":"1298"},{"level":24,"maxValue":"1329","minValue":"1329"},{"level":25,"maxValue":"1361","minValue":"1361"},{"level":26,"maxValue":"1392","minValue":"1392"},{"level":27,"maxValue":"1424","minValue":"1424"},{"level":28,"maxValue":"1455","minValue":"1455"},{"level":29,"maxValue":"1487","minValue":"1487"},{"level":30,"maxValue":"1518","minValue":"1518"}]
    },
    {
      id: `16190000`,
      name: `Enhance: Spirit's Benediction`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_019.png`,
      description: `Increases Damage Boost of the caster and Spirit by {abe:1619000011:value02:divide100}% and Damage Tolerance by {abe:1619000012:value02:divide100}%, and restores <span style="color: #FCC78B">{se_abe_dmg:1619000011:1619000013:SkillUIHotMin:tick}-{se_abe_dmg:1619000011:1619000013:SkillUIHotMax:tick}</span> HP every 1s for {se:1619000011:effect_value02:time}.`,
      condition: [],
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Single Target`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 60,
      classId: 6,
      duration: 10,
      levels: [{"level":1,"maxValue":"10000","minValue":"10000"},{"level":2,"maxValue":"10000","minValue":"10000"},{"level":3,"maxValue":"10000","minValue":"10000"},{"level":4,"maxValue":"10000","minValue":"10000"},{"level":5,"maxValue":"10000","minValue":"10000"},{"level":6,"maxValue":"10000","minValue":"10000"},{"level":7,"maxValue":"10000","minValue":"10000"},{"level":8,"maxValue":"10000","minValue":"10000"},{"level":9,"maxValue":"10000","minValue":"10000"},{"level":10,"maxValue":"10000","minValue":"10000"},{"level":11,"maxValue":"10000","minValue":"10000"},{"level":12,"maxValue":"10000","minValue":"10000"},{"level":13,"maxValue":"10000","minValue":"10000"},{"level":14,"maxValue":"10000","minValue":"10000"},{"level":15,"maxValue":"10000","minValue":"10000"},{"level":16,"maxValue":"10000","minValue":"10000"},{"level":17,"maxValue":"10000","minValue":"10000"},{"level":18,"maxValue":"10000","minValue":"10000"},{"level":19,"maxValue":"10000","minValue":"10000"},{"level":20,"maxValue":"10000","minValue":"10000"},{"level":21,"maxValue":"10000","minValue":"10000"},{"level":22,"maxValue":"10000","minValue":"10000"},{"level":23,"maxValue":"10000","minValue":"10000"},{"level":24,"maxValue":"10000","minValue":"10000"},{"level":25,"maxValue":"10000","minValue":"10000"},{"level":26,"maxValue":"10000","minValue":"10000"},{"level":27,"maxValue":"10000","minValue":"10000"},{"level":28,"maxValue":"10000","minValue":"10000"},{"level":29,"maxValue":"10000","minValue":"10000"},{"level":30,"maxValue":"10000","minValue":"10000"},{"level":1,"maxValue":"10000","minValue":"10000"},{"level":2,"maxValue":"10000","minValue":"10000"},{"level":3,"maxValue":"10000","minValue":"10000"},{"level":4,"maxValue":"10000","minValue":"10000"},{"level":5,"maxValue":"10000","minValue":"10000"},{"level":6,"maxValue":"10000","minValue":"10000"},{"level":7,"maxValue":"10000","minValue":"10000"},{"level":8,"maxValue":"10000","minValue":"10000"},{"level":9,"maxValue":"10000","minValue":"10000"},{"level":10,"maxValue":"10000","minValue":"10000"},{"level":11,"maxValue":"10000","minValue":"10000"},{"level":12,"maxValue":"10000","minValue":"10000"},{"level":13,"maxValue":"10000","minValue":"10000"},{"level":14,"maxValue":"10000","minValue":"10000"},{"level":15,"maxValue":"10000","minValue":"10000"},{"level":16,"maxValue":"10000","minValue":"10000"},{"level":17,"maxValue":"10000","minValue":"10000"},{"level":18,"maxValue":"10000","minValue":"10000"},{"level":19,"maxValue":"10000","minValue":"10000"},{"level":20,"maxValue":"10000","minValue":"10000"},{"level":21,"maxValue":"10000","minValue":"10000"},{"level":22,"maxValue":"10000","minValue":"10000"},{"level":23,"maxValue":"10000","minValue":"10000"},{"level":24,"maxValue":"10000","minValue":"10000"},{"level":25,"maxValue":"10000","minValue":"10000"},{"level":26,"maxValue":"10000","minValue":"10000"},{"level":27,"maxValue":"10000","minValue":"10000"},{"level":28,"maxValue":"10000","minValue":"10000"},{"level":29,"maxValue":"10000","minValue":"10000"},{"level":30,"maxValue":"10000","minValue":"10000"}]
    },
    {
      id: `16220000`,
      name: `Cursed Cloud`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_022.png`,
      description: `Select a target within 20m and deal <span style="color: #FCC78B">{se_dmg:1622000011:SkillUIMinDmgsum}-{se_dmg:1622000011:SkillUIMaxDmgsum}</span> damage to up to 4 enemies within 4m. The enemies take <span style="color: #FCC78B">{se_abe_dmg:1622000012:1622000011:SkillUIDotMinDmg:tick}-{se_abe_dmg:1622000012:1622000011:SkillUIDotMaxDmg:tick}</span> Damage over Time every 1s for {se:1622000012:effect_value02:time}.

20 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 20,
      manaRegen: 0,
      range: 20,
      area: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 6,
      duration: 10,
      levels: [{"level":1,"maxValue":"601","minValue":"601"},{"level":2,"maxValue":"683","minValue":"683"},{"level":3,"maxValue":"765","minValue":"765"},{"level":4,"maxValue":"863","minValue":"863"},{"level":5,"maxValue":"945","minValue":"945"},{"level":6,"maxValue":"1004","minValue":"1004"},{"level":7,"maxValue":"1048","minValue":"1048"},{"level":8,"maxValue":"1108","minValue":"1108"},{"level":9,"maxValue":"1168","minValue":"1168"},{"level":10,"maxValue":"1228","minValue":"1228"},{"level":11,"maxValue":"1288","minValue":"1288"},{"level":12,"maxValue":"1332","minValue":"1332"},{"level":13,"maxValue":"1376","minValue":"1376"},{"level":14,"maxValue":"1420","minValue":"1420"},{"level":15,"maxValue":"1464","minValue":"1464"},{"level":16,"maxValue":"1508","minValue":"1508"},{"level":17,"maxValue":"1552","minValue":"1552"},{"level":18,"maxValue":"1597","minValue":"1597"},{"level":19,"maxValue":"1641","minValue":"1641"},{"level":20,"maxValue":"1685","minValue":"1685"},{"level":21,"maxValue":"1729","minValue":"1729"},{"level":22,"maxValue":"1773","minValue":"1773"},{"level":23,"maxValue":"1817","minValue":"1817"},{"level":24,"maxValue":"1861","minValue":"1861"},{"level":25,"maxValue":"1905","minValue":"1905"},{"level":26,"maxValue":"1949","minValue":"1949"},{"level":27,"maxValue":"1993","minValue":"1993"},{"level":28,"maxValue":"2038","minValue":"2038"},{"level":29,"maxValue":"2082","minValue":"2082"},{"level":30,"maxValue":"2126","minValue":"2126"}]
    },
    {
      id: `16230000`,
      name: `Seize Magic`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_023.png`,
      description: `Select a target within 20m and deal <span style="color: #FCC78B">{se_dmg:1623000012:SkillUIMinDmgsum}-{se_dmg:1623000012:SkillUIMaxDmgsum}</span> damage to up to 4 enemies within 4m of the target and remove up to 2 buffs.

Deals <span style="color: #FCC78B">{se_dmg:1623000111:SkillUIMinDmgsum}-{se_dmg:1623000211:SkillUIMaxDmgsum}</span> extra damage according to number of removed buffs.

20 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 20,
      manaRegen: 0,
      range: 20,
      area: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 6,
      levels: [{"level":1,"maxValue":"Buff","minValue":"FALSE"},{"level":2,"maxValue":"Buff","minValue":"FALSE"},{"level":3,"maxValue":"Buff","minValue":"FALSE"},{"level":4,"maxValue":"Buff","minValue":"FALSE"},{"level":5,"maxValue":"Buff","minValue":"FALSE"},{"level":6,"maxValue":"Buff","minValue":"FALSE"},{"level":7,"maxValue":"Buff","minValue":"FALSE"},{"level":8,"maxValue":"Buff","minValue":"FALSE"},{"level":9,"maxValue":"Buff","minValue":"FALSE"},{"level":10,"maxValue":"Buff","minValue":"FALSE"},{"level":11,"maxValue":"Buff","minValue":"FALSE"},{"level":12,"maxValue":"Buff","minValue":"FALSE"},{"level":13,"maxValue":"Buff","minValue":"FALSE"},{"level":14,"maxValue":"Buff","minValue":"FALSE"},{"level":15,"maxValue":"Buff","minValue":"FALSE"},{"level":16,"maxValue":"Buff","minValue":"FALSE"},{"level":17,"maxValue":"Buff","minValue":"FALSE"},{"level":18,"maxValue":"Buff","minValue":"FALSE"},{"level":19,"maxValue":"Buff","minValue":"FALSE"},{"level":20,"maxValue":"Buff","minValue":"FALSE"},{"level":21,"maxValue":"Buff","minValue":"FALSE"},{"level":22,"maxValue":"Buff","minValue":"FALSE"},{"level":23,"maxValue":"Buff","minValue":"FALSE"},{"level":24,"maxValue":"Buff","minValue":"FALSE"},{"level":25,"maxValue":"Buff","minValue":"FALSE"},{"level":26,"maxValue":"Buff","minValue":"FALSE"},{"level":27,"maxValue":"Buff","minValue":"FALSE"},{"level":28,"maxValue":"Buff","minValue":"FALSE"},{"level":29,"maxValue":"Buff","minValue":"FALSE"},{"level":30,"maxValue":"Buff","minValue":"FALSE"}]
    },
    {
      id: `16240000`,
      name: `Jointstrike: Destructive Attack`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_024.png`,
      description: `Deals <span style="color: #FCC78B">{se_dmg:1624000011:SkillUIMinDmgsum}-{se_dmg:1624000011:SkillUIMaxDmgsum}</span> damage to a target within 20m.

The Spirit joins you in a coordinated assault.
Fire: <span style="color: #FCC78B">{se_dmg:1600130111:SkillUIMinDmgsum}-{se_dmg:1600130111:SkillUIMaxDmgsum}</span> AoE Damage
Water: <span style="color: #FCC78B">{se_dmg:1600130511:SkillUIMinDmgsum}-{se_dmg:1600130511:SkillUIMaxDmgsum}</span>Damage
Earth: <span style="color: #FCC78B">{se_dmg:1600130911:SkillUIMinDmgsum}-{se_dmg:1600130911:SkillUIMaxDmgsum}</span>Damage
Wind: <span style="color: #FCC78B">{se_dmg:1600131311:SkillUIMinDmgsum}-{se_dmg:1600131311:SkillUIMaxDmgsum}</span>AoE Damage
Ancient: <span style="color: #FCC78B">{se_dmg:1600131711:SkillUIMinDmgsum}-{se_dmg:1600131711:SkillUIMaxDmgsum}</span>AoE Damage

50 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 50,
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Single Target`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 150,
      classId: 6,
      levels: [{"level":1,"maxValue":"573","minValue":"573"},{"level":2,"maxValue":"651","minValue":"651"},{"level":3,"maxValue":"729","minValue":"729"},{"level":4,"maxValue":"822","minValue":"822"},{"level":5,"maxValue":"900","minValue":"900"},{"level":6,"maxValue":"957","minValue":"957"},{"level":7,"maxValue":"999","minValue":"999"},{"level":8,"maxValue":"1056","minValue":"1056"},{"level":9,"maxValue":"1113","minValue":"1113"},{"level":10,"maxValue":"1170","minValue":"1170"},{"level":11,"maxValue":"1227","minValue":"1227"},{"level":12,"maxValue":"1269","minValue":"1269"},{"level":13,"maxValue":"1311","minValue":"1311"},{"level":14,"maxValue":"1353","minValue":"1353"},{"level":15,"maxValue":"1395","minValue":"1395"},{"level":16,"maxValue":"1437","minValue":"1437"},{"level":17,"maxValue":"1479","minValue":"1479"},{"level":18,"maxValue":"1521","minValue":"1521"},{"level":19,"maxValue":"1563","minValue":"1563"},{"level":20,"maxValue":"1605","minValue":"1605"},{"level":21,"maxValue":"1647","minValue":"1647"},{"level":22,"maxValue":"1689","minValue":"1689"},{"level":23,"maxValue":"1731","minValue":"1731"},{"level":24,"maxValue":"1773","minValue":"1773"},{"level":25,"maxValue":"1815","minValue":"1815"},{"level":26,"maxValue":"1857","minValue":"1857"},{"level":27,"maxValue":"1899","minValue":"1899"},{"level":28,"maxValue":"1941","minValue":"1941"},{"level":29,"maxValue":"1983","minValue":"1983"},{"level":30,"maxValue":"2025","minValue":"2025"},{"level":1,"maxValue":"573","minValue":"573"},{"level":2,"maxValue":"651","minValue":"651"},{"level":3,"maxValue":"729","minValue":"729"},{"level":4,"maxValue":"822","minValue":"822"},{"level":5,"maxValue":"900","minValue":"900"},{"level":6,"maxValue":"957","minValue":"957"},{"level":7,"maxValue":"999","minValue":"999"},{"level":8,"maxValue":"1056","minValue":"1056"},{"level":9,"maxValue":"1113","minValue":"1113"},{"level":10,"maxValue":"1170","minValue":"1170"},{"level":11,"maxValue":"1227","minValue":"1227"},{"level":12,"maxValue":"1269","minValue":"1269"},{"level":13,"maxValue":"1311","minValue":"1311"},{"level":14,"maxValue":"1353","minValue":"1353"},{"level":15,"maxValue":"1395","minValue":"1395"},{"level":16,"maxValue":"1437","minValue":"1437"},{"level":17,"maxValue":"1479","minValue":"1479"},{"level":18,"maxValue":"1521","minValue":"1521"},{"level":19,"maxValue":"1563","minValue":"1563"},{"level":20,"maxValue":"1605","minValue":"1605"},{"level":21,"maxValue":"1647","minValue":"1647"},{"level":22,"maxValue":"1689","minValue":"1689"},{"level":23,"maxValue":"1731","minValue":"1731"},{"level":24,"maxValue":"1773","minValue":"1773"},{"level":25,"maxValue":"1815","minValue":"1815"},{"level":26,"maxValue":"1857","minValue":"1857"},{"level":27,"maxValue":"1899","minValue":"1899"},{"level":28,"maxValue":"1941","minValue":"1941"},{"level":29,"maxValue":"1983","minValue":"1983"},{"level":30,"maxValue":"2025","minValue":"2025"},{"level":1,"maxValue":"573","minValue":"573"},{"level":2,"maxValue":"651","minValue":"651"},{"level":3,"maxValue":"729","minValue":"729"},{"level":4,"maxValue":"822","minValue":"822"},{"level":5,"maxValue":"900","minValue":"900"},{"level":6,"maxValue":"957","minValue":"957"},{"level":7,"maxValue":"999","minValue":"999"},{"level":8,"maxValue":"1056","minValue":"1056"},{"level":9,"maxValue":"1113","minValue":"1113"},{"level":10,"maxValue":"1170","minValue":"1170"},{"level":11,"maxValue":"1227","minValue":"1227"},{"level":12,"maxValue":"1269","minValue":"1269"},{"level":13,"maxValue":"1311","minValue":"1311"},{"level":14,"maxValue":"1353","minValue":"1353"},{"level":15,"maxValue":"1395","minValue":"1395"},{"level":16,"maxValue":"1437","minValue":"1437"},{"level":17,"maxValue":"1479","minValue":"1479"},{"level":18,"maxValue":"1521","minValue":"1521"},{"level":19,"maxValue":"1563","minValue":"1563"},{"level":20,"maxValue":"1605","minValue":"1605"},{"level":21,"maxValue":"1647","minValue":"1647"},{"level":22,"maxValue":"1689","minValue":"1689"},{"level":23,"maxValue":"1731","minValue":"1731"},{"level":24,"maxValue":"1773","minValue":"1773"},{"level":25,"maxValue":"1815","minValue":"1815"},{"level":26,"maxValue":"1857","minValue":"1857"},{"level":27,"maxValue":"1899","minValue":"1899"},{"level":28,"maxValue":"1941","minValue":"1941"},{"level":29,"maxValue":"1983","minValue":"1983"},{"level":30,"maxValue":"2025","minValue":"2025"},{"level":1,"maxValue":"573","minValue":"573"},{"level":2,"maxValue":"651","minValue":"651"},{"level":3,"maxValue":"729","minValue":"729"},{"level":4,"maxValue":"822","minValue":"822"},{"level":5,"maxValue":"900","minValue":"900"},{"level":6,"maxValue":"957","minValue":"957"},{"level":7,"maxValue":"999","minValue":"999"},{"level":8,"maxValue":"1056","minValue":"1056"},{"level":9,"maxValue":"1113","minValue":"1113"},{"level":10,"maxValue":"1170","minValue":"1170"},{"level":11,"maxValue":"1227","minValue":"1227"},{"level":12,"maxValue":"1269","minValue":"1269"},{"level":13,"maxValue":"1311","minValue":"1311"},{"level":14,"maxValue":"1353","minValue":"1353"},{"level":15,"maxValue":"1395","minValue":"1395"},{"level":16,"maxValue":"1437","minValue":"1437"},{"level":17,"maxValue":"1479","minValue":"1479"},{"level":18,"maxValue":"1521","minValue":"1521"},{"level":19,"maxValue":"1563","minValue":"1563"},{"level":20,"maxValue":"1605","minValue":"1605"},{"level":21,"maxValue":"1647","minValue":"1647"},{"level":22,"maxValue":"1689","minValue":"1689"},{"level":23,"maxValue":"1731","minValue":"1731"},{"level":24,"maxValue":"1773","minValue":"1773"},{"level":25,"maxValue":"1815","minValue":"1815"},{"level":26,"maxValue":"1857","minValue":"1857"},{"level":27,"maxValue":"1899","minValue":"1899"},{"level":28,"maxValue":"1941","minValue":"1941"},{"level":29,"maxValue":"1983","minValue":"1983"},{"level":30,"maxValue":"2025","minValue":"2025"},{"level":1,"maxValue":"573","minValue":"573"},{"level":2,"maxValue":"651","minValue":"651"},{"level":3,"maxValue":"729","minValue":"729"},{"level":4,"maxValue":"822","minValue":"822"},{"level":5,"maxValue":"900","minValue":"900"},{"level":6,"maxValue":"957","minValue":"957"},{"level":7,"maxValue":"999","minValue":"999"},{"level":8,"maxValue":"1056","minValue":"1056"},{"level":9,"maxValue":"1113","minValue":"1113"},{"level":10,"maxValue":"1170","minValue":"1170"},{"level":11,"maxValue":"1227","minValue":"1227"},{"level":12,"maxValue":"1269","minValue":"1269"},{"level":13,"maxValue":"1311","minValue":"1311"},{"level":14,"maxValue":"1353","minValue":"1353"},{"level":15,"maxValue":"1395","minValue":"1395"},{"level":16,"maxValue":"1437","minValue":"1437"},{"level":17,"maxValue":"1479","minValue":"1479"},{"level":18,"maxValue":"1521","minValue":"1521"},{"level":19,"maxValue":"1563","minValue":"1563"},{"level":20,"maxValue":"1605","minValue":"1605"},{"level":21,"maxValue":"1647","minValue":"1647"},{"level":22,"maxValue":"1689","minValue":"1689"},{"level":23,"maxValue":"1731","minValue":"1731"},{"level":24,"maxValue":"1773","minValue":"1773"},{"level":25,"maxValue":"1815","minValue":"1815"},{"level":26,"maxValue":"1857","minValue":"1857"},{"level":27,"maxValue":"1899","minValue":"1899"},{"level":28,"maxValue":"1941","minValue":"1941"},{"level":29,"maxValue":"1983","minValue":"1983"},{"level":30,"maxValue":"2025","minValue":"2025"}]
    },
    {
      id: `16250000`,
      name: `Summon: Ancient Spirit`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_025.png`,
      description: `Summons an Ancient Spirit for 30s and grants Four Elements status.
The Ancient Spirit faces a target within 20m and uses a skill which deals <span style="color: #FCC78B">{se_dmg:1625000111:SkillUIMinDmgsum}-{se_dmg:1625000111:SkillUIMaxDmgsum}</span> damage to up to 4 enemies.
After using the skill, it continues fighting using basic attacks and reuses its skill after 7 basic attacks. It is dismissed upon selecting the summon icon.
Each skill level increases the Spirit's Attack, Defense, Accuracy, and Critical Hit by 2%.

20 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 20,
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 32,
      classId: 6,
      duration: 30,
      levels: [{"level":1},{"level":1,"maxValue":"Vacant","minValue":"200"},{"level":2,"maxValue":"Vacant","minValue":"200"},{"level":3,"maxValue":"Vacant","minValue":"200"},{"level":4,"maxValue":"Vacant","minValue":"200"},{"level":5,"maxValue":"Vacant","minValue":"200"},{"level":6,"maxValue":"Vacant","minValue":"200"},{"level":7,"maxValue":"Vacant","minValue":"200"},{"level":8,"maxValue":"Vacant","minValue":"200"},{"level":9,"maxValue":"Vacant","minValue":"200"},{"level":10,"maxValue":"Vacant","minValue":"200"},{"level":11,"maxValue":"Vacant","minValue":"200"},{"level":12,"maxValue":"Vacant","minValue":"200"},{"level":13,"maxValue":"Vacant","minValue":"200"},{"level":14,"maxValue":"Vacant","minValue":"200"},{"level":15,"maxValue":"Vacant","minValue":"200"},{"level":16,"maxValue":"Vacant","minValue":"200"},{"level":17,"maxValue":"Vacant","minValue":"200"},{"level":18,"maxValue":"Vacant","minValue":"200"},{"level":19,"maxValue":"Vacant","minValue":"200"},{"level":20,"maxValue":"Vacant","minValue":"200"},{"level":21,"maxValue":"Vacant","minValue":"200"},{"level":22,"maxValue":"Vacant","minValue":"200"},{"level":23,"maxValue":"Vacant","minValue":"200"},{"level":24,"maxValue":"Vacant","minValue":"200"},{"level":25,"maxValue":"Vacant","minValue":"200"},{"level":26,"maxValue":"Vacant","minValue":"200"},{"level":27,"maxValue":"Vacant","minValue":"200"},{"level":28,"maxValue":"Vacant","minValue":"200"},{"level":29,"maxValue":"Vacant","minValue":"200"},{"level":30,"maxValue":"Vacant","minValue":"200"},{"level":1,"maxValue":"30000","minValue":"30000"}]
    },
    {
      id: `16260000`,
      name: `Magic Block`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_026.png`,
      description: `Deals <span style="color: #FCC78B">{se_dmg:1626000011:SkillUIMinDmgsum}-{se_dmg:1626000011:SkillUIMaxDmgsum}</span> damage to a target within 20m with a {se:1626000012:effect_value05:divide100}% chance to inflict Seal for {se:1626000012:effect_value02:time}.
20 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 20,
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Single Target`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 6,
      duration: 5,
      levels: [{"level":1,"maxValue":"1071","minValue":"1071"},{"level":2,"maxValue":"1217","minValue":"1217"},{"level":3,"maxValue":"1363","minValue":"1363"},{"level":4,"maxValue":"1537","minValue":"1537"},{"level":5,"maxValue":"1683","minValue":"1683"},{"level":6,"maxValue":"1789","minValue":"1789"},{"level":7,"maxValue":"1868","minValue":"1868"},{"level":8,"maxValue":"1974","minValue":"1974"},{"level":9,"maxValue":"2081","minValue":"2081"},{"level":10,"maxValue":"2187","minValue":"2187"},{"level":11,"maxValue":"2294","minValue":"2294"},{"level":12,"maxValue":"2373","minValue":"2373"},{"level":13,"maxValue":"2451","minValue":"2451"},{"level":14,"maxValue":"2530","minValue":"2530"},{"level":15,"maxValue":"2608","minValue":"2608"},{"level":16,"maxValue":"2687","minValue":"2687"},{"level":17,"maxValue":"2765","minValue":"2765"},{"level":18,"maxValue":"2844","minValue":"2844"},{"level":19,"maxValue":"2922","minValue":"2922"},{"level":20,"maxValue":"3001","minValue":"3001"},{"level":21,"maxValue":"3079","minValue":"3079"},{"level":22,"maxValue":"3158","minValue":"3158"},{"level":23,"maxValue":"3236","minValue":"3236"},{"level":24,"maxValue":"3315","minValue":"3315"},{"level":25,"maxValue":"3394","minValue":"3394"},{"level":26,"maxValue":"3472","minValue":"3472"},{"level":27,"maxValue":"3551","minValue":"3551"},{"level":28,"maxValue":"3629","minValue":"3629"},{"level":29,"maxValue":"3708","minValue":"3708"},{"level":30,"maxValue":"3786","minValue":"3786"}]
    },
    {
      id: `16360000`,
      name: `Kaisinel's Power`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_036.png`,
      description: `Removes 1 debuff from the caster and party members within 40m and increases Status Effect Resist by {abe:1636000011:value02:divide100}% for <span style="color: #FCC78B">{se:1636000011:effect_value02:time}</span>.`,
      condition: [],
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Single Target`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 60,
      classId: 6,
      duration: 10,
      levels: [{"level":1,"maxValue":"10000","minValue":"10000"},{"level":2,"maxValue":"10500","minValue":"10500"},{"level":3,"maxValue":"11000","minValue":"11000"},{"level":4,"maxValue":"11500","minValue":"11500"},{"level":5,"maxValue":"12000","minValue":"12000"},{"level":6,"maxValue":"12500","minValue":"12500"},{"level":7,"maxValue":"13000","minValue":"13000"},{"level":8,"maxValue":"13500","minValue":"13500"},{"level":9,"maxValue":"14000","minValue":"14000"},{"level":10,"maxValue":"14500","minValue":"14500"},{"level":11,"maxValue":"15000","minValue":"15000"},{"level":12,"maxValue":"15500","minValue":"15500"},{"level":13,"maxValue":"16000","minValue":"16000"},{"level":14,"maxValue":"16500","minValue":"16500"},{"level":15,"maxValue":"17000","minValue":"17000"},{"level":16,"maxValue":"17500","minValue":"17500"},{"level":17,"maxValue":"18000","minValue":"18000"},{"level":18,"maxValue":"18500","minValue":"18500"},{"level":19,"maxValue":"19000","minValue":"19000"},{"level":20,"maxValue":"20000","minValue":"20000"},{"level":21,"maxValue":"20500","minValue":"20500"},{"level":22,"maxValue":"21000","minValue":"21000"},{"level":23,"maxValue":"21500","minValue":"21500"},{"level":24,"maxValue":"22000","minValue":"22000"},{"level":25,"maxValue":"22500","minValue":"22500"},{"level":26,"maxValue":"23000","minValue":"23000"},{"level":27,"maxValue":"23500","minValue":"23500"},{"level":28,"maxValue":"24000","minValue":"24000"},{"level":29,"maxValue":"24500","minValue":"24500"},{"level":30,"maxValue":"25000","minValue":"25000"},{"level":1,"maxValue":"10000","minValue":"10000"},{"level":2,"maxValue":"10500","minValue":"10500"},{"level":3,"maxValue":"11000","minValue":"11000"},{"level":4,"maxValue":"11500","minValue":"11500"},{"level":5,"maxValue":"12000","minValue":"12000"},{"level":6,"maxValue":"12500","minValue":"12500"},{"level":7,"maxValue":"13000","minValue":"13000"},{"level":8,"maxValue":"13500","minValue":"13500"},{"level":9,"maxValue":"14000","minValue":"14000"},{"level":10,"maxValue":"14500","minValue":"14500"},{"level":11,"maxValue":"15000","minValue":"15000"},{"level":12,"maxValue":"15500","minValue":"15500"},{"level":13,"maxValue":"16000","minValue":"16000"},{"level":14,"maxValue":"16500","minValue":"16500"},{"level":15,"maxValue":"17000","minValue":"17000"},{"level":16,"maxValue":"17500","minValue":"17500"},{"level":17,"maxValue":"18000","minValue":"18000"},{"level":18,"maxValue":"18500","minValue":"18500"},{"level":19,"maxValue":"19000","minValue":"19000"},{"level":20,"maxValue":"20000","minValue":"20000"},{"level":21,"maxValue":"20500","minValue":"20500"},{"level":22,"maxValue":"21000","minValue":"21000"},{"level":23,"maxValue":"21500","minValue":"21500"},{"level":24,"maxValue":"22000","minValue":"22000"},{"level":25,"maxValue":"22500","minValue":"22500"},{"level":26,"maxValue":"23000","minValue":"23000"},{"level":27,"maxValue":"23500","minValue":"23500"},{"level":28,"maxValue":"24000","minValue":"24000"},{"level":29,"maxValue":"24500","minValue":"24500"},{"level":30,"maxValue":"25000","minValue":"25000"}]
    },
    {
      id: `16370000`,
      name: `Flame Blessing`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_EL_SKILL_037.png`,
      description: `Every attack has a {abe:1637000041:value02:divide100}% chance to deal <span style="color: #FCC78B">{se_dmg:1637000111:SkillUIMinDmgsum}-{se_dmg:1637000111:SkillUIMaxDmgsum}</span> extra damage for the caster and party members within 40m for {se:1637000011:effect_value02:time}.`,
      condition: [],
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Single Target`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 6,
      duration: 10,
      levels: [{"level":1,"maxValue":"10000","minValue":"10000"},{"level":2,"maxValue":"10000","minValue":"10000"},{"level":3,"maxValue":"10000","minValue":"10000"},{"level":4,"maxValue":"10000","minValue":"10000"},{"level":5,"maxValue":"10000","minValue":"10000"},{"level":6,"maxValue":"10000","minValue":"10000"},{"level":7,"maxValue":"10000","minValue":"10000"},{"level":8,"maxValue":"10000","minValue":"10000"},{"level":9,"maxValue":"10000","minValue":"10000"},{"level":10,"maxValue":"10000","minValue":"10000"},{"level":11,"maxValue":"10000","minValue":"10000"},{"level":12,"maxValue":"10000","minValue":"10000"},{"level":13,"maxValue":"10000","minValue":"10000"},{"level":14,"maxValue":"10000","minValue":"10000"},{"level":15,"maxValue":"10000","minValue":"10000"},{"level":16,"maxValue":"10000","minValue":"10000"},{"level":17,"maxValue":"10000","minValue":"10000"},{"level":18,"maxValue":"10000","minValue":"10000"},{"level":19,"maxValue":"10000","minValue":"10000"},{"level":20,"maxValue":"10000","minValue":"10000"},{"level":21,"maxValue":"10000","minValue":"10000"},{"level":22,"maxValue":"10000","minValue":"10000"},{"level":23,"maxValue":"10000","minValue":"10000"},{"level":24,"maxValue":"10000","minValue":"10000"},{"level":25,"maxValue":"10000","minValue":"10000"},{"level":26,"maxValue":"10000","minValue":"10000"},{"level":27,"maxValue":"10000","minValue":"10000"},{"level":28,"maxValue":"10000","minValue":"10000"},{"level":29,"maxValue":"10000","minValue":"10000"},{"level":30,"maxValue":"10000","minValue":"10000"}]
    },
    {
      id: `16700000`,
      name: `Assault Terror`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CO_SKILL_003.png`,
      description: `Select a target within 20m and deal <span style="color: #FCC78B">{se_dmg:1670000021:SkillUIMinDmgsum}-{se_dmg:1670000021:SkillUIMaxDmgsum}</span> damage with a {se:1670000025:effect_value05:divide100}% chance to inflict Fear to up to 4 enemies within 4m for {se:1670000025:effect_value02:time}.
100% chance to land Fear on NPC targets.

Increases Defense by max 20% proportional to hit targets.`,
      condition: [],
      manaRegen: 0,
      range: 20,
      area: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Magic","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 31,
      classId: 6,
      duration: 5,
      levels: [{"level":1,"maxValue":"50","minValue":"TargetLocation_CasterToTargetDirection"},{"level":1,"maxValue":"939","minValue":"939"},{"level":2,"maxValue":"1067","minValue":"1067"},{"level":3,"maxValue":"1195","minValue":"1195"},{"level":4,"maxValue":"1348","minValue":"1348"},{"level":5,"maxValue":"1476","minValue":"1476"},{"level":6,"maxValue":"1569","minValue":"1569"},{"level":7,"maxValue":"1638","minValue":"1638"},{"level":8,"maxValue":"1731","minValue":"1731"},{"level":9,"maxValue":"1825","minValue":"1825"},{"level":10,"maxValue":"1918","minValue":"1918"},{"level":11,"maxValue":"2012","minValue":"2012"},{"level":12,"maxValue":"2081","minValue":"2081"},{"level":13,"maxValue":"2150","minValue":"2150"},{"level":14,"maxValue":"2218","minValue":"2218"},{"level":15,"maxValue":"2287","minValue":"2287"},{"level":16,"maxValue":"2356","minValue":"2356"},{"level":17,"maxValue":"2425","minValue":"2425"},{"level":18,"maxValue":"2494","minValue":"2494"},{"level":19,"maxValue":"2563","minValue":"2563"},{"level":20,"maxValue":"2632","minValue":"2632"},{"level":21,"maxValue":"2701","minValue":"2701"},{"level":22,"maxValue":"2769","minValue":"2769"},{"level":23,"maxValue":"2838","minValue":"2838"},{"level":24,"maxValue":"2907","minValue":"2907"},{"level":25,"maxValue":"2976","minValue":"2976"},{"level":26,"maxValue":"3045","minValue":"3045"},{"level":27,"maxValue":"3114","minValue":"3114"},{"level":28,"maxValue":"3183","minValue":"3183"},{"level":29,"maxValue":"3252","minValue":"3252"},{"level":30,"maxValue":"3321","minValue":"3321"}]
    }
  ]
};
