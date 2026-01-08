import type { ClassData } from "./types";

export const rangerData: ClassData = {
  name: "ranger",
  iconUrl: "IC_Class_Ranger.webp",
  bannerUrl: "BA_Ranger.webp",
  characterURL: "CH_Ranger.webp",
  description: "",
  tags: [],
  abilities: [
    {
      id: `14010000`,
      name: `Deadshot`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_002.png`,
      description: `Deals <span style="color: #FCC78B">{se_dmg:1401000011:SkillUIMinDmgsum}-{se_dmg:1401000311:SkillUIMaxDmgsum}</span> damage to a target within 20m. Increases damage by 25% to Mark targets.

Max 3 Charge Levels
10 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 10,
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Single Target`,
      spellTag: ["Physical","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 4,
      levels: [{"level":1,"maxValue":"509","minValue":"509"},{"level":2,"maxValue":"656","minValue":"656"},{"level":3,"maxValue":"779","minValue":"779"},{"level":4,"maxValue":"902","minValue":"902"},{"level":5,"maxValue":"1025","minValue":"1025"},{"level":6,"maxValue":"1148","minValue":"1148"},{"level":7,"maxValue":"1295","minValue":"1295"},{"level":8,"maxValue":"1418","minValue":"1418"},{"level":9,"maxValue":"1508","minValue":"1508"},{"level":10,"maxValue":"1574","minValue":"1574"},{"level":11,"maxValue":"1664","minValue":"1664"},{"level":12,"maxValue":"1754","minValue":"1754"},{"level":13,"maxValue":"1844","minValue":"1844"},{"level":14,"maxValue":"1934","minValue":"1934"},{"level":15,"maxValue":"2000","minValue":"2000"},{"level":16,"maxValue":"2066","minValue":"2066"},{"level":17,"maxValue":"2132","minValue":"2132"},{"level":18,"maxValue":"2198","minValue":"2198"},{"level":19,"maxValue":"2264","minValue":"2264"},{"level":20,"maxValue":"2330","minValue":"2330"},{"level":21,"maxValue":"2396","minValue":"2396"},{"level":22,"maxValue":"2462","minValue":"2462"},{"level":23,"maxValue":"2528","minValue":"2528"},{"level":24,"maxValue":"2594","minValue":"2594"},{"level":25,"maxValue":"2660","minValue":"2660"},{"level":26,"maxValue":"2726","minValue":"2726"},{"level":27,"maxValue":"2792","minValue":"2792"},{"level":28,"maxValue":"2858","minValue":"2858"},{"level":29,"maxValue":"2924","minValue":"2924"},{"level":30,"maxValue":"2990","minValue":"2990"}]
    },
    {
      id: `14020000`,
      name: `Snipe`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_001.png`,
      description: `Deals <span style="color: #FCC78B">{se_dmg:1402000011:SkillUIMinDmgsum}-{se_dmg:1402000011:SkillUIMaxDmgsum}</span> damage to a target within 20m and restores 120 MP.`,
      condition: [],
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Single Target`,
      spellTag: ["Physical","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 4,
      levels: [{"level":1,"maxValue":"43","minValue":"43"},{"level":2,"maxValue":"58","minValue":"58"},{"level":3,"maxValue":"72","minValue":"72"},{"level":4,"maxValue":"86","minValue":"86"},{"level":5,"maxValue":"107","minValue":"107"},{"level":6,"maxValue":"133","minValue":"133"},{"level":7,"maxValue":"164","minValue":"164"},{"level":8,"maxValue":"190","minValue":"190"},{"level":9,"maxValue":"216","minValue":"216"},{"level":10,"maxValue":"242","minValue":"242"},{"level":11,"maxValue":"269","minValue":"269"},{"level":12,"maxValue":"300","minValue":"300"},{"level":13,"maxValue":"326","minValue":"326"},{"level":14,"maxValue":"345","minValue":"345"},{"level":15,"maxValue":"359","minValue":"359"},{"level":16,"maxValue":"378","minValue":"378"},{"level":17,"maxValue":"397","minValue":"397"},{"level":18,"maxValue":"416","minValue":"416"},{"level":19,"maxValue":"436","minValue":"436"},{"level":20,"maxValue":"450","minValue":"450"},{"level":21,"maxValue":"464","minValue":"464"},{"level":22,"maxValue":"478","minValue":"478"},{"level":23,"maxValue":"492","minValue":"492"},{"level":24,"maxValue":"506","minValue":"506"},{"level":25,"maxValue":"520","minValue":"520"},{"level":26,"maxValue":"534","minValue":"534"},{"level":27,"maxValue":"548","minValue":"548"},{"level":28,"maxValue":"562","minValue":"562"},{"level":29,"maxValue":"576","minValue":"576"},{"level":30,"maxValue":"590","minValue":"590"}]
    },
    {
      id: `14050000`,
      name: `Drill Dart`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_005.png`,
      description: `Select a target within 20m and deal <span style="color: #FCC78B">{se_dmg:1405000011:SkillUIMinDmgsum}-{se_dmg:1405000011:SkillUIMaxDmgsum}</span> damage to up to 4 enemies within 4m of the target and restores 100 MP on a successful Critical Hit. Inflicts Bleed on the target which deals <span style="color: #FCC78B">{se_abe_dmg:1405000012:1405000012:SkillUIDotMinDmg:tick}-{se_abe_dmg:1405000012:1405000012:SkillUIDotMaxDmg:tick}</span> damage per second for {se:1405000012:effect_value02:time}.

5 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 5,
      manaRegen: 0,
      range: 20,
      area: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Physical","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 4,
      levels: [{"level":1,"maxValue":"78","minValue":"78"},{"level":2,"maxValue":"112","minValue":"112"},{"level":3,"maxValue":"145","minValue":"145"},{"level":4,"maxValue":"195","minValue":"195"},{"level":5,"maxValue":"257","minValue":"257"},{"level":6,"maxValue":"332","minValue":"332"},{"level":7,"maxValue":"394","minValue":"394"},{"level":8,"maxValue":"456","minValue":"456"},{"level":9,"maxValue":"519","minValue":"519"},{"level":10,"maxValue":"581","minValue":"581"},{"level":11,"maxValue":"655","minValue":"655"},{"level":12,"maxValue":"718","minValue":"718"},{"level":13,"maxValue":"763","minValue":"763"},{"level":14,"maxValue":"797","minValue":"797"},{"level":15,"maxValue":"842","minValue":"842"},{"level":16,"maxValue":"888","minValue":"888"},{"level":17,"maxValue":"933","minValue":"933"},{"level":18,"maxValue":"979","minValue":"979"},{"level":19,"maxValue":"1012","minValue":"1012"},{"level":20,"maxValue":"1046","minValue":"1046"},{"level":21,"maxValue":"1079","minValue":"1079"},{"level":22,"maxValue":"1112","minValue":"1112"},{"level":23,"maxValue":"1146","minValue":"1146"},{"level":24,"maxValue":"1179","minValue":"1179"},{"level":25,"maxValue":"1213","minValue":"1213"},{"level":26,"maxValue":"1246","minValue":"1246"},{"level":27,"maxValue":"1280","minValue":"1280"},{"level":28,"maxValue":"1313","minValue":"1313"},{"level":29,"maxValue":"1346","minValue":"1346"},{"level":30,"maxValue":"1380","minValue":"1380"}]
    },
    {
      id: `14070000`,
      name: `Suppressing Arrow`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_007.png`,
      description: `Deals <span style="color: #FCC78B">{se_dmg:1407000011:SkillUIMinDmgsum}-{se_dmg:1407000011:SkillUIMaxDmgsum}</span> damage to a Mark target within 20m with a {se:1407000012:effect_value05:divide100}% chance to inflict Stun for {se:1407000012:effect_value02:time}.
100% chance to land Stun on NPC targets. 

10 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 10,
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Single Target`,
      spellTag: ["Physical","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 4,
      levels: [{"level":1,"maxValue":"333","minValue":"333"},{"level":2,"maxValue":"439","minValue":"439"},{"level":3,"maxValue":"566","minValue":"566"},{"level":4,"maxValue":"672","minValue":"672"},{"level":5,"maxValue":"778","minValue":"778"},{"level":6,"maxValue":"884","minValue":"884"},{"level":7,"maxValue":"990","minValue":"990"},{"level":8,"maxValue":"1117","minValue":"1117"},{"level":9,"maxValue":"1223","minValue":"1223"},{"level":10,"maxValue":"1300","minValue":"1300"},{"level":11,"maxValue":"1357","minValue":"1357"},{"level":12,"maxValue":"1435","minValue":"1435"},{"level":13,"maxValue":"1513","minValue":"1513"},{"level":14,"maxValue":"1590","minValue":"1590"},{"level":15,"maxValue":"1668","minValue":"1668"},{"level":16,"maxValue":"1725","minValue":"1725"},{"level":17,"maxValue":"1782","minValue":"1782"},{"level":18,"maxValue":"1839","minValue":"1839"},{"level":19,"maxValue":"1896","minValue":"1896"},{"level":20,"maxValue":"1953","minValue":"1953"},{"level":21,"maxValue":"2009","minValue":"2009"},{"level":22,"maxValue":"2066","minValue":"2066"},{"level":23,"maxValue":"2123","minValue":"2123"},{"level":24,"maxValue":"2180","minValue":"2180"},{"level":25,"maxValue":"2237","minValue":"2237"},{"level":26,"maxValue":"2294","minValue":"2294"},{"level":27,"maxValue":"2351","minValue":"2351"},{"level":28,"maxValue":"2408","minValue":"2408"},{"level":29,"maxValue":"2465","minValue":"2465"},{"level":30,"maxValue":"2522","minValue":"2522"}]
    },
    {
      id: `14080000`,
      name: `Burst Arrow`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_008.png`,
      description: `Select a Slowed or Root target within 20m and deal <span style="color: #FCC78B">{se_dmg:1408000011:SkillUIMinDmgsum}-{se_dmg:1408000011:SkillUIMaxDmgsum}</span> damage to up to 4 enemies within 4m of the target.

15 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 15,
      manaRegen: 0,
      range: 20,
      area: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Physical","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 4,
      levels: [{"level":1,"maxValue":"340","minValue":"340"},{"level":2,"maxValue":"448","minValue":"448"},{"level":3,"maxValue":"578","minValue":"578"},{"level":4,"maxValue":"686","minValue":"686"},{"level":5,"maxValue":"795","minValue":"795"},{"level":6,"maxValue":"903","minValue":"903"},{"level":7,"maxValue":"1012","minValue":"1012"},{"level":8,"maxValue":"1141","minValue":"1141"},{"level":9,"maxValue":"1249","minValue":"1249"},{"level":10,"maxValue":"1329","minValue":"1329"},{"level":11,"maxValue":"1387","minValue":"1387"},{"level":12,"maxValue":"1466","minValue":"1466"},{"level":13,"maxValue":"1546","minValue":"1546"},{"level":14,"maxValue":"1625","minValue":"1625"},{"level":15,"maxValue":"1704","minValue":"1704"},{"level":16,"maxValue":"1762","minValue":"1762"},{"level":17,"maxValue":"1821","minValue":"1821"},{"level":18,"maxValue":"1879","minValue":"1879"},{"level":19,"maxValue":"1937","minValue":"1937"},{"level":20,"maxValue":"1995","minValue":"1995"},{"level":21,"maxValue":"2053","minValue":"2053"},{"level":22,"maxValue":"2111","minValue":"2111"},{"level":23,"maxValue":"2169","minValue":"2169"},{"level":24,"maxValue":"2228","minValue":"2228"},{"level":25,"maxValue":"2286","minValue":"2286"},{"level":26,"maxValue":"2344","minValue":"2344"},{"level":27,"maxValue":"2402","minValue":"2402"},{"level":28,"maxValue":"2460","minValue":"2460"},{"level":29,"maxValue":"2518","minValue":"2518"},{"level":30,"maxValue":"2577","minValue":"2577"}]
    },
    {
      id: `14090000`,
      name: `Marking Shot`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_031.png`,
      description: `Deals <span style="color: #FCC78B">{se_dmg:1409001021:SkillUIMinDmgsum}-{se_dmg:1409001021:SkillUIMaxDmgsum}</span> damage to a target within 20m and moves in the entered direction. The target is inflicted with Mark for {se:1409000022:effect_value02:time}, which reduces Critical Hit Resist by {abe:1409000011:value02:noneabs}%.

7 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 7,
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Single Target`,
      spellTag: ["Physical","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 31,
      classId: 4,
      levels: [{"level":1,"maxValue":"500","minValue":"CasterLocation_CasterToTargetDirection"},{"level":1,"maxValue":"106","minValue":"106"},{"level":2,"maxValue":"152","minValue":"152"},{"level":3,"maxValue":"197","minValue":"197"},{"level":4,"maxValue":"265","minValue":"265"},{"level":5,"maxValue":"350","minValue":"350"},{"level":6,"maxValue":"451","minValue":"451"},{"level":7,"maxValue":"535","minValue":"535"},{"level":8,"maxValue":"620","minValue":"620"},{"level":9,"maxValue":"704","minValue":"704"},{"level":10,"maxValue":"789","minValue":"789"},{"level":11,"maxValue":"890","minValue":"890"},{"level":12,"maxValue":"975","minValue":"975"},{"level":13,"maxValue":"1037","minValue":"1037"},{"level":14,"maxValue":"1082","minValue":"1082"},{"level":15,"maxValue":"1144","minValue":"1144"},{"level":16,"maxValue":"1206","minValue":"1206"},{"level":17,"maxValue":"1268","minValue":"1268"},{"level":18,"maxValue":"1329","minValue":"1329"},{"level":19,"maxValue":"1375","minValue":"1375"},{"level":20,"maxValue":"1420","minValue":"1420"},{"level":21,"maxValue":"1466","minValue":"1466"},{"level":22,"maxValue":"1511","minValue":"1511"},{"level":23,"maxValue":"1556","minValue":"1556"},{"level":24,"maxValue":"1602","minValue":"1602"},{"level":25,"maxValue":"1647","minValue":"1647"},{"level":26,"maxValue":"1692","minValue":"1692"},{"level":27,"maxValue":"1738","minValue":"1738"},{"level":28,"maxValue":"1783","minValue":"1783"},{"level":29,"maxValue":"1829","minValue":"1829"},{"level":30,"maxValue":"1874","minValue":"1874"}]
    },
    {
      id: `14110000`,
      name: `Gale Arrow`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_011.png`,
      description: `Select a target within 20m and deal <span style="color: #FCC78B">{se_dmg:1411000011:SkillUIMinDmgsum}-{se_dmg:1411000311:SkillUIMaxDmgsum}</span> damage to up to 4 enemies within 4m of the target.

Max 3 Charge Levels
10 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 10,
      manaRegen: 0,
      range: 20,
      area: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Physical","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 4,
      levels: [{"level":1,"maxValue":"269","minValue":"269"},{"level":2,"maxValue":"362","minValue":"362"},{"level":3,"maxValue":"477","minValue":"477"},{"level":4,"maxValue":"615","minValue":"615"},{"level":5,"maxValue":"730","minValue":"730"},{"level":6,"maxValue":"846","minValue":"846"},{"level":7,"maxValue":"961","minValue":"961"},{"level":8,"maxValue":"1076","minValue":"1076"},{"level":9,"maxValue":"1214","minValue":"1214"},{"level":10,"maxValue":"1329","minValue":"1329"},{"level":11,"maxValue":"1414","minValue":"1414"},{"level":12,"maxValue":"1476","minValue":"1476"},{"level":13,"maxValue":"1560","minValue":"1560"},{"level":14,"maxValue":"1644","minValue":"1644"},{"level":15,"maxValue":"1729","minValue":"1729"},{"level":16,"maxValue":"1813","minValue":"1813"},{"level":17,"maxValue":"1875","minValue":"1875"},{"level":18,"maxValue":"1937","minValue":"1937"},{"level":19,"maxValue":"1999","minValue":"1999"},{"level":20,"maxValue":"2061","minValue":"2061"},{"level":21,"maxValue":"2122","minValue":"2122"},{"level":22,"maxValue":"2184","minValue":"2184"},{"level":23,"maxValue":"2246","minValue":"2246"},{"level":24,"maxValue":"2308","minValue":"2308"},{"level":25,"maxValue":"2370","minValue":"2370"},{"level":26,"maxValue":"2432","minValue":"2432"},{"level":27,"maxValue":"2494","minValue":"2494"},{"level":28,"maxValue":"2556","minValue":"2556"},{"level":29,"maxValue":"2617","minValue":"2617"},{"level":30,"maxValue":"2679","minValue":"2679"}]
    },
    {
      id: `14130000`,
      name: `Snare Shot`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_013.png`,
      description: `Select a target within 20m and deal <span style="color: #FCC78B">{se_dmg:1413000011:SkillUIMinDmgsum}-{se_dmg:1413000011:SkillUIMaxDmgsum}</span> damage to up to 4 enemies within 4m of the target and inflict Slowed that reduces Move Speed by {abe:1000000412:value02:divide100abs}% for {se:1413000012:effect_value02:time}.

10 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 10,
      manaRegen: 0,
      range: 20,
      area: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Physical","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 4,
      levels: [{"level":1,"maxValue":"50","minValue":"50"},{"level":2,"maxValue":"87","minValue":"87"},{"level":3,"maxValue":"124","minValue":"124"},{"level":4,"maxValue":"161","minValue":"161"},{"level":5,"maxValue":"217","minValue":"217"},{"level":6,"maxValue":"286","minValue":"286"},{"level":7,"maxValue":"369","minValue":"369"},{"level":8,"maxValue":"438","minValue":"438"},{"level":9,"maxValue":"507","minValue":"507"},{"level":10,"maxValue":"576","minValue":"576"},{"level":11,"maxValue":"645","minValue":"645"},{"level":12,"maxValue":"728","minValue":"728"},{"level":13,"maxValue":"797","minValue":"797"},{"level":14,"maxValue":"848","minValue":"848"},{"level":15,"maxValue":"885","minValue":"885"},{"level":16,"maxValue":"936","minValue":"936"},{"level":17,"maxValue":"986","minValue":"986"},{"level":18,"maxValue":"1037","minValue":"1037"},{"level":19,"maxValue":"1088","minValue":"1088"},{"level":20,"maxValue":"1125","minValue":"1125"},{"level":21,"maxValue":"1162","minValue":"1162"},{"level":22,"maxValue":"1199","minValue":"1199"},{"level":23,"maxValue":"1236","minValue":"1236"},{"level":24,"maxValue":"1273","minValue":"1273"},{"level":25,"maxValue":"1310","minValue":"1310"},{"level":26,"maxValue":"1347","minValue":"1347"},{"level":27,"maxValue":"1385","minValue":"1385"},{"level":28,"maxValue":"1422","minValue":"1422"},{"level":29,"maxValue":"1459","minValue":"1459"},{"level":30,"maxValue":"1496","minValue":"1496"}]
    },
    {
      id: `14170000`,
      name: `Explosion Trap`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_017.png`,
      description: `Sets an explosive trap at the caster's location. The trap lasts for 10 seconds and deals <span style="color: #FCC78B">{se_dmg:1417000111:SkillUIMinDmgsum}-{se_dmg:1417000111:SkillUIMaxDmgsum}</span> damage with a {se:1417000112:effect_value05:divide100}% chance to inflict Stun for {se:1417000112:effect_value02:time} on up to 4 enemies within 5m when stepped on.
100% chance to inflict Stun on NPC targets.

10 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 10,
      manaRegen: 0,
      range: 20,
      area: 5,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Physical","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 1,
      classId: 4,
      levels: [{"level":1,"maxValue":"IgnoreOtherActor","minValue":"200"}]
    },
    {
      id: `14260000`,
      name: `Defiance`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CO_SKILL_002.png`,
      description: `Removes Stun, Knockdown, and Airborne from the caster and grants Tenacity for {se:1820000012:effect_value02:time}.
Tenacity: {abe:1002000011:value02:divide100}% Stun, Knockdown, Airborne Resist`,
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
      classId: 4,
      levels: [{"level":1,"maxValue":"Debuff","minValue":"FALSE"}]
    },
    {
      id: `14330000`,
      name: `Arrow Scattershot`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_033.png`,
      description: `Deals <span style="color: #FCC78B">{se_dmg:1433000011:SkillUIMinDmgsum}-{se_dmg:1433000011:SkillUIMaxDmgsum}</span> damage to a Stagger target within 20m.`,
      condition: [],
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Single Target`,
      spellTag: ["Physical","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 120,
      classId: 4,
      levels: [{"level":1,"maxValue":"96","minValue":"96"},{"level":2,"maxValue":"125","minValue":"125"},{"level":3,"maxValue":"169","minValue":"169"},{"level":4,"maxValue":"222","minValue":"222"},{"level":5,"maxValue":"287","minValue":"287"},{"level":6,"maxValue":"340","minValue":"340"},{"level":7,"maxValue":"394","minValue":"394"},{"level":8,"maxValue":"448","minValue":"448"},{"level":9,"maxValue":"502","minValue":"502"},{"level":10,"maxValue":"566","minValue":"566"},{"level":11,"maxValue":"620","minValue":"620"},{"level":12,"maxValue":"659","minValue":"659"},{"level":13,"maxValue":"688","minValue":"688"},{"level":14,"maxValue":"728","minValue":"728"},{"level":15,"maxValue":"767","minValue":"767"},{"level":16,"maxValue":"806","minValue":"806"},{"level":17,"maxValue":"846","minValue":"846"},{"level":18,"maxValue":"875","minValue":"875"},{"level":19,"maxValue":"904","minValue":"904"},{"level":20,"maxValue":"932","minValue":"932"},{"level":21,"maxValue":"961","minValue":"961"},{"level":22,"maxValue":"990","minValue":"990"},{"level":23,"maxValue":"1019","minValue":"1019"},{"level":24,"maxValue":"1048","minValue":"1048"},{"level":25,"maxValue":"1077","minValue":"1077"},{"level":26,"maxValue":"1106","minValue":"1106"},{"level":27,"maxValue":"1135","minValue":"1135"},{"level":28,"maxValue":"1163","minValue":"1163"},{"level":29,"maxValue":"1192","minValue":"1192"},{"level":30,"maxValue":"1221","minValue":"1221"},{"level":1,"maxValue":"96","minValue":"96"},{"level":2,"maxValue":"125","minValue":"125"},{"level":3,"maxValue":"169","minValue":"169"},{"level":4,"maxValue":"222","minValue":"222"},{"level":5,"maxValue":"287","minValue":"287"},{"level":6,"maxValue":"340","minValue":"340"},{"level":7,"maxValue":"394","minValue":"394"},{"level":8,"maxValue":"448","minValue":"448"},{"level":9,"maxValue":"502","minValue":"502"},{"level":10,"maxValue":"566","minValue":"566"},{"level":11,"maxValue":"620","minValue":"620"},{"level":12,"maxValue":"659","minValue":"659"},{"level":13,"maxValue":"688","minValue":"688"},{"level":14,"maxValue":"728","minValue":"728"},{"level":15,"maxValue":"767","minValue":"767"},{"level":16,"maxValue":"806","minValue":"806"},{"level":17,"maxValue":"846","minValue":"846"},{"level":18,"maxValue":"875","minValue":"875"},{"level":19,"maxValue":"904","minValue":"904"},{"level":20,"maxValue":"932","minValue":"932"},{"level":21,"maxValue":"961","minValue":"961"},{"level":22,"maxValue":"990","minValue":"990"},{"level":23,"maxValue":"1019","minValue":"1019"},{"level":24,"maxValue":"1048","minValue":"1048"},{"level":25,"maxValue":"1077","minValue":"1077"},{"level":26,"maxValue":"1106","minValue":"1106"},{"level":27,"maxValue":"1135","minValue":"1135"},{"level":28,"maxValue":"1163","minValue":"1163"},{"level":29,"maxValue":"1192","minValue":"1192"},{"level":30,"maxValue":"1221","minValue":"1221"},{"level":1,"maxValue":"96","minValue":"96"},{"level":2,"maxValue":"125","minValue":"125"},{"level":3,"maxValue":"169","minValue":"169"},{"level":4,"maxValue":"222","minValue":"222"},{"level":5,"maxValue":"287","minValue":"287"},{"level":6,"maxValue":"340","minValue":"340"},{"level":7,"maxValue":"394","minValue":"394"},{"level":8,"maxValue":"448","minValue":"448"},{"level":9,"maxValue":"502","minValue":"502"},{"level":10,"maxValue":"566","minValue":"566"},{"level":11,"maxValue":"620","minValue":"620"},{"level":12,"maxValue":"659","minValue":"659"},{"level":13,"maxValue":"688","minValue":"688"},{"level":14,"maxValue":"728","minValue":"728"},{"level":15,"maxValue":"767","minValue":"767"},{"level":16,"maxValue":"806","minValue":"806"},{"level":17,"maxValue":"846","minValue":"846"},{"level":18,"maxValue":"875","minValue":"875"},{"level":19,"maxValue":"904","minValue":"904"},{"level":20,"maxValue":"932","minValue":"932"},{"level":21,"maxValue":"961","minValue":"961"},{"level":22,"maxValue":"990","minValue":"990"},{"level":23,"maxValue":"1019","minValue":"1019"},{"level":24,"maxValue":"1048","minValue":"1048"},{"level":25,"maxValue":"1077","minValue":"1077"},{"level":26,"maxValue":"1106","minValue":"1106"},{"level":27,"maxValue":"1135","minValue":"1135"},{"level":28,"maxValue":"1163","minValue":"1163"},{"level":29,"maxValue":"1192","minValue":"1192"},{"level":30,"maxValue":"1221","minValue":"1221"},{"level":1,"maxValue":"96","minValue":"96"},{"level":2,"maxValue":"125","minValue":"125"},{"level":3,"maxValue":"169","minValue":"169"},{"level":4,"maxValue":"222","minValue":"222"},{"level":5,"maxValue":"287","minValue":"287"},{"level":6,"maxValue":"340","minValue":"340"},{"level":7,"maxValue":"394","minValue":"394"},{"level":8,"maxValue":"448","minValue":"448"},{"level":9,"maxValue":"502","minValue":"502"},{"level":10,"maxValue":"566","minValue":"566"},{"level":11,"maxValue":"620","minValue":"620"},{"level":12,"maxValue":"659","minValue":"659"},{"level":13,"maxValue":"688","minValue":"688"},{"level":14,"maxValue":"728","minValue":"728"},{"level":15,"maxValue":"767","minValue":"767"},{"level":16,"maxValue":"806","minValue":"806"},{"level":17,"maxValue":"846","minValue":"846"},{"level":18,"maxValue":"875","minValue":"875"},{"level":19,"maxValue":"904","minValue":"904"},{"level":20,"maxValue":"932","minValue":"932"},{"level":21,"maxValue":"961","minValue":"961"},{"level":22,"maxValue":"990","minValue":"990"},{"level":23,"maxValue":"1019","minValue":"1019"},{"level":24,"maxValue":"1048","minValue":"1048"},{"level":25,"maxValue":"1077","minValue":"1077"},{"level":26,"maxValue":"1106","minValue":"1106"},{"level":27,"maxValue":"1135","minValue":"1135"},{"level":28,"maxValue":"1163","minValue":"1163"},{"level":29,"maxValue":"1192","minValue":"1192"},{"level":30,"maxValue":"1221","minValue":"1221"}]
    },
    {
      id: `14340000`,
      name: `Tempest Shot`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_034.png`,
      description: `Select a target within 20m and deal <span style="color: #FCC78B">{se_dmg:1434000011:SkillUIMinDmgsum}-{se_dmg:1434000011:SkillUIMaxDmgsum}</span> damage to up to 4 enemies within 4m of the target.
1 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 1,
      manaRegen: 0,
      range: 20,
      area: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Physical","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 60,
      classId: 4,
      levels: [{"level":1,"maxValue":"52","minValue":"52"},{"level":2,"maxValue":"72","minValue":"72"},{"level":3,"maxValue":"92","minValue":"92"},{"level":4,"maxValue":"113","minValue":"113"},{"level":5,"maxValue":"143","minValue":"143"},{"level":6,"maxValue":"181","minValue":"181"},{"level":7,"maxValue":"226","minValue":"226"},{"level":8,"maxValue":"263","minValue":"263"},{"level":9,"maxValue":"301","minValue":"301"},{"level":10,"maxValue":"339","minValue":"339"},{"level":11,"maxValue":"376","minValue":"376"},{"level":12,"maxValue":"421","minValue":"421"},{"level":13,"maxValue":"459","minValue":"459"},{"level":14,"maxValue":"486","minValue":"486"},{"level":15,"maxValue":"507","minValue":"507"},{"level":16,"maxValue":"534","minValue":"534"},{"level":17,"maxValue":"562","minValue":"562"},{"level":18,"maxValue":"589","minValue":"589"},{"level":19,"maxValue":"617","minValue":"617"},{"level":20,"maxValue":"637","minValue":"637"},{"level":21,"maxValue":"657","minValue":"657"},{"level":22,"maxValue":"678","minValue":"678"},{"level":23,"maxValue":"698","minValue":"698"},{"level":24,"maxValue":"718","minValue":"718"},{"level":25,"maxValue":"738","minValue":"738"},{"level":26,"maxValue":"758","minValue":"758"},{"level":27,"maxValue":"779","minValue":"779"},{"level":28,"maxValue":"799","minValue":"799"},{"level":29,"maxValue":"819","minValue":"819"},{"level":30,"maxValue":"839","minValue":"839"},{"level":1,"maxValue":"52","minValue":"52"},{"level":2,"maxValue":"72","minValue":"72"},{"level":3,"maxValue":"92","minValue":"92"},{"level":4,"maxValue":"113","minValue":"113"},{"level":5,"maxValue":"143","minValue":"143"},{"level":6,"maxValue":"181","minValue":"181"},{"level":7,"maxValue":"226","minValue":"226"},{"level":8,"maxValue":"263","minValue":"263"},{"level":9,"maxValue":"301","minValue":"301"},{"level":10,"maxValue":"339","minValue":"339"},{"level":11,"maxValue":"376","minValue":"376"},{"level":12,"maxValue":"421","minValue":"421"},{"level":13,"maxValue":"459","minValue":"459"},{"level":14,"maxValue":"486","minValue":"486"},{"level":15,"maxValue":"507","minValue":"507"},{"level":16,"maxValue":"534","minValue":"534"},{"level":17,"maxValue":"562","minValue":"562"},{"level":18,"maxValue":"589","minValue":"589"},{"level":19,"maxValue":"617","minValue":"617"},{"level":20,"maxValue":"637","minValue":"637"},{"level":21,"maxValue":"657","minValue":"657"},{"level":22,"maxValue":"678","minValue":"678"},{"level":23,"maxValue":"698","minValue":"698"},{"level":24,"maxValue":"718","minValue":"718"},{"level":25,"maxValue":"738","minValue":"738"},{"level":26,"maxValue":"758","minValue":"758"},{"level":27,"maxValue":"779","minValue":"779"},{"level":28,"maxValue":"799","minValue":"799"},{"level":29,"maxValue":"819","minValue":"819"},{"level":30,"maxValue":"839","minValue":"839"}]
    }
  ],
  passives: [
    {
      id: `14710000`,
      name: `Vigilant Eye`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_Passive_004.png`,
      description: `Increases the caster's Evasion by {abe:1471000011:value02}, Max HP by <span style="color: #FCC78B">{abe:1471000012:value02:divide100}%</span>, and immediately restores <span style="color: #FCC78B">{se_dmg:1471000711:SkillUIHPHealMin:total}-{se_dmg:1471000711:SkillUIHPHealMax:total}</span> HP on a successful Evasion.

Cooldown: {abe:1471000013:value03:time}`,
      spellTag: ["Passive"],
      maxLevel: 30,
      classId: 4,
      levels: [{"level":1,"minValue":"147100001"},{"level":2,"minValue":"147100001"},{"level":3,"minValue":"147100001"},{"level":4,"minValue":"147100001"},{"level":5,"minValue":"147100001"},{"level":6,"minValue":"147100001"},{"level":7,"minValue":"147100001"},{"level":8,"minValue":"147100001"},{"level":9,"minValue":"147100001"},{"level":10,"minValue":"147100001"},{"level":11,"minValue":"147100001"},{"level":12,"minValue":"147100001"},{"level":13,"minValue":"147100001"},{"level":14,"minValue":"147100001"},{"level":15,"minValue":"147100001"},{"level":16,"minValue":"147100001"},{"level":17,"minValue":"147100001"},{"level":18,"minValue":"147100001"},{"level":19,"minValue":"147100001"},{"level":20,"minValue":"147100001"},{"level":21,"minValue":"147100001"},{"level":22,"minValue":"147100001"},{"level":23,"minValue":"147100001"},{"level":24,"minValue":"147100001"},{"level":25,"minValue":"147100001"},{"level":26,"minValue":"147100001"},{"level":27,"minValue":"147100001"},{"level":28,"minValue":"147100001"},{"level":29,"minValue":"147100001"},{"level":30,"minValue":"147100001"}]
    },
    {
      id: `14720000`,
      name: `Concentrated Fire`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_Passive_003.png`,
      description: `Has a {abe:1472000011:value02:divide100}% chance to deal <span style="color: #FCC78B">{se_dmg:1472000711:SkillUIMinDmgsum}-{se_dmg:1472000711:SkillUIMaxDmgsum}</span> damage to a target taking Damage over Time.

Cooldown: {abe:1472000011:value03:time}`,
      spellTag: ["Passive"],
      maxLevel: 30,
      classId: 4,
      levels: [{"level":1,"minValue":"147200001"},{"level":2,"minValue":"147200001"},{"level":3,"minValue":"147200001"},{"level":4,"minValue":"147200001"},{"level":5,"minValue":"147200001"},{"level":6,"minValue":"147200001"},{"level":7,"minValue":"147200001"},{"level":8,"minValue":"147200001"},{"level":9,"minValue":"147200001"},{"level":10,"minValue":"147200001"},{"level":11,"minValue":"147200001"},{"level":12,"minValue":"147200001"},{"level":13,"minValue":"147200001"},{"level":14,"minValue":"147200001"},{"level":15,"minValue":"147200001"},{"level":16,"minValue":"147200001"},{"level":17,"minValue":"147200001"},{"level":18,"minValue":"147200001"},{"level":19,"minValue":"147200001"},{"level":20,"minValue":"147200001"},{"level":21,"minValue":"147200001"},{"level":22,"minValue":"147200001"},{"level":23,"minValue":"147200001"},{"level":24,"minValue":"147200001"},{"level":25,"minValue":"147200001"},{"level":26,"minValue":"147200001"},{"level":27,"minValue":"147200001"},{"level":28,"minValue":"147200001"},{"level":29,"minValue":"147200001"},{"level":30,"minValue":"147200001"}]
    },
    {
      id: `14730000`,
      name: `Wind Vigor`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_Passive_006.png`,
      description: `Increases Move Speed by <span style="color: #FCC78B">{abe:1473000711:value02:divide100}%</span> for <span style="color: #FCC78B">{se:1473000711:effect_value02:time}</span> when attacked.

Cooldown: {abe:1473000011:value03:time}`,
      spellTag: ["Passive"],
      maxLevel: 30,
      classId: 4,
      levels: [{"level":1,"minValue":"147300001"},{"level":2,"minValue":"147300001"},{"level":3,"minValue":"147300001"},{"level":4,"minValue":"147300001"},{"level":5,"minValue":"147300001"},{"level":6,"minValue":"147300001"},{"level":7,"minValue":"147300001"},{"level":8,"minValue":"147300001"},{"level":9,"minValue":"147300001"},{"level":10,"minValue":"147300001"},{"level":11,"minValue":"147300001"},{"level":12,"minValue":"147300001"},{"level":13,"minValue":"147300001"},{"level":14,"minValue":"147300001"},{"level":15,"minValue":"147300001"},{"level":16,"minValue":"147300001"},{"level":17,"minValue":"147300001"},{"level":18,"minValue":"147300001"},{"level":19,"minValue":"147300001"},{"level":20,"minValue":"147300001"},{"level":21,"minValue":"147300001"},{"level":22,"minValue":"147300001"},{"level":23,"minValue":"147300001"},{"level":24,"minValue":"147300001"},{"level":25,"minValue":"147300001"},{"level":26,"minValue":"147300001"},{"level":27,"minValue":"147300001"},{"level":28,"minValue":"147300001"},{"level":29,"minValue":"147300001"},{"level":30,"minValue":"147300001"}]
    },
    {
      id: `14740000`,
      name: `Focused Eye`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_Passive_001.png`,
      description: `Increases the caster's Accuracy by {abe:1474000011:value02} and Attack by <span style="color: #FCC78B">{abe:1474000012:value02:divide100}%</span>.`,
      spellTag: ["Passive"],
      maxLevel: 30,
      classId: 4,
      levels: [{"level":1,"minValue":"147400001"},{"level":2,"minValue":"147400001"},{"level":3,"minValue":"147400001"},{"level":4,"minValue":"147400001"},{"level":5,"minValue":"147400001"},{"level":6,"minValue":"147400001"},{"level":7,"minValue":"147400001"},{"level":8,"minValue":"147400001"},{"level":9,"minValue":"147400001"},{"level":10,"minValue":"147400001"},{"level":11,"minValue":"147400001"},{"level":12,"minValue":"147400001"},{"level":13,"minValue":"147400001"},{"level":14,"minValue":"147400001"},{"level":15,"minValue":"147400001"},{"level":16,"minValue":"147400001"},{"level":17,"minValue":"147400001"},{"level":18,"minValue":"147400001"},{"level":19,"minValue":"147400001"},{"level":20,"minValue":"147400001"},{"level":21,"minValue":"147400001"},{"level":22,"minValue":"147400001"},{"level":23,"minValue":"147400001"},{"level":24,"minValue":"147400001"},{"level":25,"minValue":"147400001"},{"level":26,"minValue":"147400001"},{"level":27,"minValue":"147400001"},{"level":28,"minValue":"147400001"},{"level":29,"minValue":"147400001"},{"level":30,"minValue":"147400001"}]
    },
    {
      id: `14750000`,
      name: `Hunter's Resolve`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_Passive_011.png`,
      description: `Increases the caster's Critical Damage Boost by <span style="color: #FCC78B">{abe:1475000011:value02:divide100}%</span>.`,
      spellTag: ["Passive"],
      maxLevel: 30,
      classId: 4,
      levels: [{"level":1,"minValue":"147500001"},{"level":2,"minValue":"147500001"},{"level":3,"minValue":"147500001"},{"level":4,"minValue":"147500001"},{"level":5,"minValue":"147500001"},{"level":6,"minValue":"147500001"},{"level":7,"minValue":"147500001"},{"level":8,"minValue":"147500001"},{"level":9,"minValue":"147500001"},{"level":10,"minValue":"147500001"},{"level":11,"minValue":"147500001"},{"level":12,"minValue":"147500001"},{"level":13,"minValue":"147500001"},{"level":14,"minValue":"147500001"},{"level":15,"minValue":"147500001"},{"level":16,"minValue":"147500001"},{"level":17,"minValue":"147500001"},{"level":18,"minValue":"147500001"},{"level":19,"minValue":"147500001"},{"level":20,"minValue":"147500001"},{"level":21,"minValue":"147500001"},{"level":22,"minValue":"147500001"},{"level":23,"minValue":"147500001"},{"level":24,"minValue":"147500001"},{"level":25,"minValue":"147500001"},{"level":26,"minValue":"147500001"},{"level":27,"minValue":"147500001"},{"level":28,"minValue":"147500001"},{"level":29,"minValue":"147500001"},{"level":30,"minValue":"147500001"}]
    },
    {
      id: `14760000`,
      name: `Unyielding Resolve`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_Passive_012.png`,
      description: `Increases the caster's Ailment-type Resist by <span style="color: #FCC78B">{abe:1476000011:value02:divide100}%</span>.`,
      spellTag: ["Passive"],
      maxLevel: 30,
      classId: 4,
      levels: [{"level":1,"minValue":"147600001"},{"level":2,"minValue":"147600001"},{"level":3,"minValue":"147600001"},{"level":4,"minValue":"147600001"},{"level":5,"minValue":"147600001"},{"level":6,"minValue":"147600001"},{"level":7,"minValue":"147600001"},{"level":8,"minValue":"147600001"},{"level":9,"minValue":"147600001"},{"level":10,"minValue":"147600001"},{"level":11,"minValue":"147600001"},{"level":12,"minValue":"147600001"},{"level":13,"minValue":"147600001"},{"level":14,"minValue":"147600001"},{"level":15,"minValue":"147600001"},{"level":16,"minValue":"147600001"},{"level":17,"minValue":"147600001"},{"level":18,"minValue":"147600001"},{"level":19,"minValue":"147600001"},{"level":20,"minValue":"147600001"},{"level":21,"minValue":"147600001"},{"level":22,"minValue":"147600001"},{"level":23,"minValue":"147600001"},{"level":24,"minValue":"147600001"},{"level":25,"minValue":"147600001"},{"level":26,"minValue":"147600001"},{"level":27,"minValue":"147600001"},{"level":28,"minValue":"147600001"},{"level":29,"minValue":"147600001"},{"level":30,"minValue":"147600001"}]
    },
    {
      id: `14770000`,
      name: `Rooting Eye`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_Passive_008.png`,
      description: `Has a {abe:1477000011:value02:divide100}% chance to deal <span style="color: #FCC78B">{se_dmg:1477000711:SkillUIMinDmgsum}-{se_dmg:1477000711:SkillUIMaxDmgsum}</span> damage when landing an attack on a target afflicted with Slowed or Root.

Cooldown: {abe:1477000011:value03:time}`,
      spellTag: ["Passive"],
      maxLevel: 30,
      classId: 4,
      levels: [{"level":1,"minValue":"147700001"},{"level":2,"minValue":"147700001"},{"level":3,"minValue":"147700001"},{"level":4,"minValue":"147700001"},{"level":5,"minValue":"147700001"},{"level":6,"minValue":"147700001"},{"level":7,"minValue":"147700001"},{"level":8,"minValue":"147700001"},{"level":9,"minValue":"147700001"},{"level":10,"minValue":"147700001"},{"level":11,"minValue":"147700001"},{"level":12,"minValue":"147700001"},{"level":13,"minValue":"147700001"},{"level":14,"minValue":"147700001"},{"level":15,"minValue":"147700001"},{"level":16,"minValue":"147700001"},{"level":17,"minValue":"147700001"},{"level":18,"minValue":"147700001"},{"level":19,"minValue":"147700001"},{"level":20,"minValue":"147700001"},{"level":21,"minValue":"147700001"},{"level":22,"minValue":"147700001"},{"level":23,"minValue":"147700001"},{"level":24,"minValue":"147700001"},{"level":25,"minValue":"147700001"},{"level":26,"minValue":"147700001"},{"level":27,"minValue":"147700001"},{"level":28,"minValue":"147700001"},{"level":29,"minValue":"147700001"},{"level":30,"minValue":"147700001"}]
    },
    {
      id: `14780000`,
      name: `Melee Fire`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_Passive_013.png`,
      description: `Has a {abe:1478000011:value02:divide100}% chance to inflict Knock Back when landing an attack on a target within 5m. Has a {abe:1478000012:value02:divide100}% chance to deal <span style="color: #FCC78B">{se_dmg:1478000811:SkillUIMinDmgsum}-{se_dmg:1478000811:SkillUIMaxDmgsum}</span> extra damage when landing an attack on a target beyond 5m.

Cooldown: {abe:1478000011:value03:time}`,
      spellTag: ["Passive"],
      maxLevel: 30,
      classId: 4,
      levels: [{"level":1,"minValue":"147800001"},{"level":2,"minValue":"147800001"},{"level":3,"minValue":"147800001"},{"level":4,"minValue":"147800001"},{"level":5,"minValue":"147800001"},{"level":6,"minValue":"147800001"},{"level":7,"minValue":"147800001"},{"level":8,"minValue":"147800001"},{"level":9,"minValue":"147800001"},{"level":10,"minValue":"147800001"},{"level":11,"minValue":"147800001"},{"level":12,"minValue":"147800001"},{"level":13,"minValue":"147800001"},{"level":14,"minValue":"147800001"},{"level":15,"minValue":"147800001"},{"level":16,"minValue":"147800001"},{"level":17,"minValue":"147800001"},{"level":18,"minValue":"147800001"},{"level":19,"minValue":"147800001"},{"level":20,"minValue":"147800001"},{"level":21,"minValue":"147800001"},{"level":22,"minValue":"147800001"},{"level":23,"minValue":"147800001"},{"level":24,"minValue":"147800001"},{"level":25,"minValue":"147800001"},{"level":26,"minValue":"147800001"},{"level":27,"minValue":"147800001"},{"level":28,"minValue":"147800001"},{"level":29,"minValue":"147800001"},{"level":30,"minValue":"147800001"}]
    },
    {
      id: `14790000`,
      name: `Revitalization Contract`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_AS_SKILL_Passive_009.png`,
      description: `Increases the caster's Status Effect Resist by <span style="color: #FCC78B">{abe:1379000012:value02:divide100}%</span> and immediately restores <span style="color: #FCC78B">{se_dmg:1379000711:SkillUIHPHealMin:total}-{se_dmg:1379000711:SkillUIHPHealMax:total}</span> HP when the caster's HP is 10% or less.

Cooldown: {abe:1379000011:value03:time}`,
      spellTag: ["Passive"],
      maxLevel: 30,
      classId: 4,
      levels: [{"level":1,"minValue":"147900001"},{"level":2,"minValue":"147900001"},{"level":3,"minValue":"147900001"},{"level":4,"minValue":"147900001"},{"level":5,"minValue":"147900001"},{"level":6,"minValue":"147900001"},{"level":7,"minValue":"147900001"},{"level":8,"minValue":"147900001"},{"level":9,"minValue":"147900001"},{"level":10,"minValue":"147900001"},{"level":11,"minValue":"147900001"},{"level":12,"minValue":"147900001"},{"level":13,"minValue":"147900001"},{"level":14,"minValue":"147900001"},{"level":15,"minValue":"147900001"},{"level":16,"minValue":"147900001"},{"level":17,"minValue":"147900001"},{"level":18,"minValue":"147900001"},{"level":19,"minValue":"147900001"},{"level":20,"minValue":"147900001"},{"level":21,"minValue":"147900001"},{"level":22,"minValue":"147900001"},{"level":23,"minValue":"147900001"},{"level":24,"minValue":"147900001"},{"level":25,"minValue":"147900001"},{"level":26,"minValue":"147900001"},{"level":27,"minValue":"147900001"},{"level":28,"minValue":"147900001"},{"level":29,"minValue":"147900001"},{"level":30,"minValue":"147900001"}]
    },
    {
      id: `14800000`,
      name: `Hunter's Soul`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_Passive_007.png`,
      description: `Has a {abe:1480000011:value02:divide100}% chance to deal <span style="color: #FCC78B">{se_dmg:1480000711:SkillUIMinDmgsum}-{se_dmg:1480000711:SkillUIMaxDmgsum}</span> damage on a Critical Hit.

Cooldown: {abe:1480000011:value03:time}`,
      spellTag: ["Passive"],
      maxLevel: 30,
      classId: 4,
      levels: [{"level":1,"minValue":"148000001"},{"level":2,"minValue":"148000001"},{"level":3,"minValue":"148000001"},{"level":4,"minValue":"148000001"},{"level":5,"minValue":"148000001"},{"level":6,"minValue":"148000001"},{"level":7,"minValue":"148000001"},{"level":8,"minValue":"148000001"},{"level":9,"minValue":"148000001"},{"level":10,"minValue":"148000001"},{"level":11,"minValue":"148000001"},{"level":12,"minValue":"148000001"},{"level":13,"minValue":"148000001"},{"level":14,"minValue":"148000001"},{"level":15,"minValue":"148000001"},{"level":16,"minValue":"148000001"},{"level":17,"minValue":"148000001"},{"level":18,"minValue":"148000001"},{"level":19,"minValue":"148000001"},{"level":20,"minValue":"148000001"},{"level":21,"minValue":"148000001"},{"level":22,"minValue":"148000001"},{"level":23,"minValue":"148000001"},{"level":24,"minValue":"148000001"},{"level":25,"minValue":"148000001"},{"level":26,"minValue":"148000001"},{"level":27,"minValue":"148000001"},{"level":28,"minValue":"148000001"},{"level":29,"minValue":"148000001"},{"level":30,"minValue":"148000001"}]
    }
  ],
  stigmas: [
    {
      id: `14060000`,
      name: `Griffon Arrow`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_006.png`,
      description: `Deals <span style="color: #FCC78B">{se_dmg:1406000011:SkillUIMinDmgsum}-{se_dmg:1406000011:SkillUIMaxDmgsum}</span> damage to up to 4 enemies in the Griffon's path of flight. Enemies receive <span style="color: #FCC78B">{se_abe_dmg:1406000012:1406000011:SkillUIDotMinDmg:tick}-{se_abe_dmg:1406000012:1406000011:SkillUIDotMaxDmg:tick}</span> Fire Damage over Time every 1s for {se:1406000012:effect_value02:time}.

20 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 20,
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Physical","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 4,
      duration: 10,
      levels: [{"level":1,"maxValue":"964","minValue":"964"},{"level":2,"maxValue":"1095","minValue":"1095"},{"level":3,"maxValue":"1227","minValue":"1227"},{"level":4,"maxValue":"1384","minValue":"1384"},{"level":5,"maxValue":"1515","minValue":"1515"},{"level":6,"maxValue":"1612","minValue":"1612"},{"level":7,"maxValue":"1682","minValue":"1682"},{"level":8,"maxValue":"1778","minValue":"1778"},{"level":9,"maxValue":"1875","minValue":"1875"},{"level":10,"maxValue":"1971","minValue":"1971"},{"level":11,"maxValue":"2067","minValue":"2067"},{"level":12,"maxValue":"2137","minValue":"2137"},{"level":13,"maxValue":"2208","minValue":"2208"},{"level":14,"maxValue":"2279","minValue":"2279"},{"level":15,"maxValue":"2349","minValue":"2349"},{"level":16,"maxValue":"2420","minValue":"2420"},{"level":17,"maxValue":"2490","minValue":"2490"},{"level":18,"maxValue":"2561","minValue":"2561"},{"level":19,"maxValue":"2631","minValue":"2631"},{"level":20,"maxValue":"2702","minValue":"2702"},{"level":21,"maxValue":"2772","minValue":"2772"},{"level":22,"maxValue":"2843","minValue":"2843"},{"level":23,"maxValue":"2913","minValue":"2913"},{"level":24,"maxValue":"2984","minValue":"2984"},{"level":25,"maxValue":"3054","minValue":"3054"},{"level":26,"maxValue":"3125","minValue":"3125"},{"level":27,"maxValue":"3195","minValue":"3195"},{"level":28,"maxValue":"3266","minValue":"3266"},{"level":29,"maxValue":"3337","minValue":"3337"},{"level":30,"maxValue":"3407","minValue":"3407"}]
    },
    {
      id: `14120000`,
      name: `Ambush Kick`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_012.png`,
      description: `Moves behind a target within 5m to deal <span style="color: #FCC78B">{se_dmg:1412000021:SkillUIMinDmgsum}-{se_dmg:1412000021:SkillUIMaxDmgsum}</span> damage and inflict Knock Back. The caster moves back.`,
      condition: [],
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Single Target`,
      spellTag: ["Physical","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 32,
      classId: 4,
      levels: [{"level":1,"maxValue":"70","minValue":"TargetLocation_CasterToTargetDirection"},{"level":1,"maxValue":"857","minValue":"857"},{"level":2,"maxValue":"974","minValue":"974"},{"level":3,"maxValue":"1090","minValue":"1090"},{"level":4,"maxValue":"1230","minValue":"1230"},{"level":5,"maxValue":"1347","minValue":"1347"},{"level":6,"maxValue":"1432","minValue":"1432"},{"level":7,"maxValue":"1495","minValue":"1495"},{"level":8,"maxValue":"1581","minValue":"1581"},{"level":9,"maxValue":"1666","minValue":"1666"},{"level":10,"maxValue":"1752","minValue":"1752"},{"level":11,"maxValue":"1837","minValue":"1837"},{"level":12,"maxValue":"1900","minValue":"1900"},{"level":13,"maxValue":"1963","minValue":"1963"},{"level":14,"maxValue":"2025","minValue":"2025"},{"level":15,"maxValue":"2088","minValue":"2088"},{"level":16,"maxValue":"2151","minValue":"2151"},{"level":17,"maxValue":"2213","minValue":"2213"},{"level":18,"maxValue":"2276","minValue":"2276"},{"level":19,"maxValue":"2339","minValue":"2339"},{"level":20,"maxValue":"2401","minValue":"2401"},{"level":21,"maxValue":"2464","minValue":"2464"},{"level":22,"maxValue":"2527","minValue":"2527"},{"level":23,"maxValue":"2590","minValue":"2590"},{"level":24,"maxValue":"2652","minValue":"2652"},{"level":25,"maxValue":"2715","minValue":"2715"},{"level":26,"maxValue":"2778","minValue":"2778"},{"level":27,"maxValue":"2840","minValue":"2840"},{"level":28,"maxValue":"2903","minValue":"2903"},{"level":29,"maxValue":"2966","minValue":"2966"},{"level":30,"maxValue":"3028","minValue":"3028"},{"level":1,"maxValue":"800","minValue":"CasterLocation_CasterToTargetDirection"}]
    },
    {
      id: `14150000`,
      name: `Sleep Arrow`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_015.png`,
      description: `Inflicts Sleep on a target within 20m for {se:1415000011:effect_value02:time} and reduces their Defense by {abe:1415000012:value02:divide100abs}%. Sleep is removed when attacked.`,
      condition: [],
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Single Target`,
      spellTag: ["Physical","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 1,
      classId: 4,
      duration: 10,
      levels: [{"level":1,"maxValue":"10000","minValue":"10000"}]
    },
    {
      id: `14160000`,
      name: `Sealing Arrow`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_016.png`,
      description: `Deals <span style="color: #FCC78B">{se_dmg:1416000011:SkillUIMinDmgsum}-{se_dmg:1416000011:SkillUIMaxDmgsum}</span> damage to a target within 20m with a {se:1416000012:effect_value05:divide100}% chance to inflict Seal for {se:1416000012:effect_value02:time}.
100% chance to land Seal on NPC targets. 

20 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 20,
      manaRegen: 0,
      range: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Single Target`,
      spellTag: ["Physical","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 4,
      duration: 5,
      levels: [{"level":1,"maxValue":"1043","minValue":"1043"},{"level":2,"maxValue":"1185","minValue":"1185"},{"level":3,"maxValue":"1327","minValue":"1327"},{"level":4,"maxValue":"1497","minValue":"1497"},{"level":5,"maxValue":"1640","minValue":"1640"},{"level":6,"maxValue":"1744","minValue":"1744"},{"level":7,"maxValue":"1820","minValue":"1820"},{"level":8,"maxValue":"1924","minValue":"1924"},{"level":9,"maxValue":"2028","minValue":"2028"},{"level":10,"maxValue":"2132","minValue":"2132"},{"level":11,"maxValue":"2236","minValue":"2236"},{"level":12,"maxValue":"2312","minValue":"2312"},{"level":13,"maxValue":"2389","minValue":"2389"},{"level":14,"maxValue":"2465","minValue":"2465"},{"level":15,"maxValue":"2541","minValue":"2541"},{"level":16,"maxValue":"2618","minValue":"2618"},{"level":17,"maxValue":"2694","minValue":"2694"},{"level":18,"maxValue":"2770","minValue":"2770"},{"level":19,"maxValue":"2847","minValue":"2847"},{"level":20,"maxValue":"2923","minValue":"2923"},{"level":21,"maxValue":"2999","minValue":"2999"},{"level":22,"maxValue":"3076","minValue":"3076"},{"level":23,"maxValue":"3152","minValue":"3152"},{"level":24,"maxValue":"3228","minValue":"3228"},{"level":25,"maxValue":"3305","minValue":"3305"},{"level":26,"maxValue":"3381","minValue":"3381"},{"level":27,"maxValue":"3457","minValue":"3457"},{"level":28,"maxValue":"3533","minValue":"3533"},{"level":29,"maxValue":"3610","minValue":"3610"},{"level":30,"maxValue":"3686","minValue":"3686"}]
    },
    {
      id: `14180000`,
      name: `Ensnaring Trap`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_018.png`,
      description: `Sets an explosive trap at the caster's location. The trap lasts for 30 seconds and deals <span style="color: #FCC78B">{se_dmg:1418000111:SkillUIMinDmgsum}-{se_dmg:1418000111:SkillUIMaxDmgsum}</span> damage and inflicts Airborne for {se:1418000112:effect_value02:time} on up to 4 enemies within 5m.

20 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 20,
      manaRegen: 0,
      range: 20,
      area: 5,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Physical","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 1,
      classId: 4,
      duration: 30,
      levels: [{"level":1,"maxValue":"IgnoreOtherActor","minValue":"200"}]
    },
    {
      id: `14190000`,
      name: `Stealth`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_019.png`,
      description: `Enter Stealth for {se:1419000011:effect_value02:time}.
Usable out of combat and canceled upon entering combat after using Stealth.`,
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
      classId: 4,
      duration: 10,
      levels: [{"level":1,"maxValue":"10000","minValue":"10000"}]
    },
    {
      id: `14220000`,
      name: `Bow of Blessing`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_030.png`,
      description: `Increases Critical Hit by <span style="color: #FCC78B">{abe:1422000011:value02}</span>% for the caster and party members within 40m for {se:1422000011:effect_value02:time}.`,
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
      classId: 4,
      duration: 10,
      levels: [{"level":1,"maxValue":"10000","minValue":"10000"},{"level":2,"maxValue":"10500","minValue":"10500"},{"level":3,"maxValue":"11000","minValue":"11000"},{"level":4,"maxValue":"11500","minValue":"11500"},{"level":5,"maxValue":"12000","minValue":"12000"},{"level":6,"maxValue":"12500","minValue":"12500"},{"level":7,"maxValue":"13000","minValue":"13000"},{"level":8,"maxValue":"13500","minValue":"13500"},{"level":9,"maxValue":"14000","minValue":"14000"},{"level":10,"maxValue":"14500","minValue":"14500"},{"level":11,"maxValue":"15000","minValue":"15000"},{"level":12,"maxValue":"15500","minValue":"15500"},{"level":13,"maxValue":"16000","minValue":"16000"},{"level":14,"maxValue":"16500","minValue":"16500"},{"level":15,"maxValue":"17000","minValue":"17000"},{"level":16,"maxValue":"17500","minValue":"17500"},{"level":17,"maxValue":"18000","minValue":"18000"},{"level":18,"maxValue":"18500","minValue":"18500"},{"level":19,"maxValue":"19000","minValue":"19000"},{"level":20,"maxValue":"20000","minValue":"20000"},{"level":21,"maxValue":"20500","minValue":"20500"},{"level":22,"maxValue":"21000","minValue":"21000"},{"level":23,"maxValue":"21500","minValue":"21500"},{"level":24,"maxValue":"22000","minValue":"22000"},{"level":25,"maxValue":"22500","minValue":"22500"},{"level":26,"maxValue":"23000","minValue":"23000"},{"level":27,"maxValue":"23500","minValue":"23500"},{"level":28,"maxValue":"24000","minValue":"24000"},{"level":29,"maxValue":"24500","minValue":"24500"},{"level":30,"maxValue":"25000","minValue":"25000"}]
    },
    {
      id: `14270000`,
      name: `Arrow Storm`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_026.png`,
      description: `Select a target within 20m and deal <span style="color: #FCC78B">{se_dmg:1427000011:SkillUIMinDmgsum}-{se_dmg:1427000011:SkillUIMaxDmgsum}</span> damage to up to 4 enemies within 4m of the target with a {se:1427000012:effect_value05:divide100}% chance to inflict Stun for {se:1427000012:effect_value02:time}.
100% chance to land Stun on NPC targets.

50 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 50,
      manaRegen: 0,
      range: 20,
      area: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Physical","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 4,
      duration: 3,
      levels: [{"level":1,"maxValue":"1184","minValue":"1184"},{"level":2,"maxValue":"1345","minValue":"1345"},{"level":3,"maxValue":"1507","minValue":"1507"},{"level":4,"maxValue":"1700","minValue":"1700"},{"level":5,"maxValue":"1861","minValue":"1861"},{"level":6,"maxValue":"1979","minValue":"1979"},{"level":7,"maxValue":"2066","minValue":"2066"},{"level":8,"maxValue":"2184","minValue":"2184"},{"level":9,"maxValue":"2302","minValue":"2302"},{"level":10,"maxValue":"2420","minValue":"2420"},{"level":11,"maxValue":"2538","minValue":"2538"},{"level":12,"maxValue":"2625","minValue":"2625"},{"level":13,"maxValue":"2712","minValue":"2712"},{"level":14,"maxValue":"2798","minValue":"2798"},{"level":15,"maxValue":"2885","minValue":"2885"},{"level":16,"maxValue":"2972","minValue":"2972"},{"level":17,"maxValue":"3058","minValue":"3058"},{"level":18,"maxValue":"3145","minValue":"3145"},{"level":19,"maxValue":"3231","minValue":"3231"},{"level":20,"maxValue":"3318","minValue":"3318"},{"level":21,"maxValue":"3405","minValue":"3405"},{"level":22,"maxValue":"3491","minValue":"3491"},{"level":23,"maxValue":"3578","minValue":"3578"},{"level":24,"maxValue":"3665","minValue":"3665"},{"level":25,"maxValue":"3751","minValue":"3751"},{"level":26,"maxValue":"3838","minValue":"3838"},{"level":27,"maxValue":"3924","minValue":"3924"},{"level":28,"maxValue":"4011","minValue":"4011"},{"level":29,"maxValue":"4098","minValue":"4098"},{"level":30,"maxValue":"4184","minValue":"4184"}]
    },
    {
      id: `14310000`,
      name: `Vaizel's Authority`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_022.png`,
      description: `Increases the caster's Attack by {abe:1431000011:value02:divide100}% for <span style="color: #FCC78B">{se:1431000011:effect_value02:time}</span>.`,
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
      classId: 4,
      duration: 10,
      levels: [{"level":1,"maxValue":"10000","minValue":"10000"},{"level":2,"maxValue":"10500","minValue":"10500"},{"level":3,"maxValue":"11000","minValue":"11000"},{"level":4,"maxValue":"11500","minValue":"11500"},{"level":5,"maxValue":"12000","minValue":"12000"},{"level":6,"maxValue":"12500","minValue":"12500"},{"level":7,"maxValue":"13000","minValue":"13000"},{"level":8,"maxValue":"13500","minValue":"13500"},{"level":9,"maxValue":"14000","minValue":"14000"},{"level":10,"maxValue":"14500","minValue":"14500"},{"level":11,"maxValue":"15000","minValue":"15000"},{"level":12,"maxValue":"15500","minValue":"15500"},{"level":13,"maxValue":"16000","minValue":"16000"},{"level":14,"maxValue":"16500","minValue":"16500"},{"level":15,"maxValue":"17000","minValue":"17000"},{"level":16,"maxValue":"17500","minValue":"17500"},{"level":17,"maxValue":"18000","minValue":"18000"},{"level":18,"maxValue":"18500","minValue":"18500"},{"level":19,"maxValue":"19000","minValue":"19000"},{"level":20,"maxValue":"20000","minValue":"20000"},{"level":21,"maxValue":"20500","minValue":"20500"},{"level":22,"maxValue":"21000","minValue":"21000"},{"level":23,"maxValue":"21500","minValue":"21500"},{"level":24,"maxValue":"22000","minValue":"22000"},{"level":25,"maxValue":"22500","minValue":"22500"},{"level":26,"maxValue":"23000","minValue":"23000"},{"level":27,"maxValue":"23500","minValue":"23500"},{"level":28,"maxValue":"24000","minValue":"24000"},{"level":29,"maxValue":"24500","minValue":"24500"},{"level":30,"maxValue":"25000","minValue":"25000"}]
    },
    {
      id: `14350000`,
      name: `Mother Nature's Breath`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_035.png`,
      description: `Reflects {abe:1435000011:value01:divide100}% of all magic damage taken from enemies for {se:1435000011:effect_value02:time}.`,
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
      classId: 4,
      duration: 10,
      levels: [{"level":1,"maxValue":"10000","minValue":"10000"},{"level":2,"maxValue":"10000","minValue":"10000"},{"level":3,"maxValue":"10000","minValue":"10000"},{"level":4,"maxValue":"10000","minValue":"10000"},{"level":5,"maxValue":"10000","minValue":"10000"},{"level":6,"maxValue":"10000","minValue":"10000"},{"level":7,"maxValue":"10000","minValue":"10000"},{"level":8,"maxValue":"10000","minValue":"10000"},{"level":9,"maxValue":"10000","minValue":"10000"},{"level":10,"maxValue":"10000","minValue":"10000"},{"level":11,"maxValue":"10000","minValue":"10000"},{"level":12,"maxValue":"10000","minValue":"10000"},{"level":13,"maxValue":"10000","minValue":"10000"},{"level":14,"maxValue":"10000","minValue":"10000"},{"level":15,"maxValue":"10000","minValue":"10000"},{"level":16,"maxValue":"10000","minValue":"10000"},{"level":17,"maxValue":"10000","minValue":"10000"},{"level":18,"maxValue":"10000","minValue":"10000"},{"level":19,"maxValue":"10000","minValue":"10000"},{"level":20,"maxValue":"10000","minValue":"10000"},{"level":21,"maxValue":"10000","minValue":"10000"},{"level":22,"maxValue":"10000","minValue":"10000"},{"level":23,"maxValue":"10000","minValue":"10000"},{"level":24,"maxValue":"10000","minValue":"10000"},{"level":25,"maxValue":"10000","minValue":"10000"},{"level":26,"maxValue":"10000","minValue":"10000"},{"level":27,"maxValue":"10000","minValue":"10000"},{"level":28,"maxValue":"10000","minValue":"10000"},{"level":29,"maxValue":"10000","minValue":"10000"},{"level":30,"maxValue":"10000","minValue":"10000"}]
    },
    {
      id: `14360000`,
      name: `Explosive Arrow`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_RA_SKILL_023.png`,
      description: `Select a target within 20m and deals <span style="color: #FCC78B">{se_dmg:1436000011:SkillUIMinDmgsum}-{se_dmg:1436000011:SkillUIMaxDmgsum}</span> damage to up to 4 enemies within 4m. Increases damage by 20% to Impact-type Status targets.

20 Stagger Gauge Damage`,
      condition: [],
      staggerDamage: 20,
      manaRegen: 0,
      range: 20,
      area: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Physical","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 30,
      classId: 4,
      levels: [{"level":1,"maxValue":"1240","minValue":"1240"},{"level":2,"maxValue":"1409","minValue":"1409"},{"level":3,"maxValue":"1579","minValue":"1579"},{"level":4,"maxValue":"1781","minValue":"1781"},{"level":5,"maxValue":"1950","minValue":"1950"},{"level":6,"maxValue":"2074","minValue":"2074"},{"level":7,"maxValue":"2164","minValue":"2164"},{"level":8,"maxValue":"2288","minValue":"2288"},{"level":9,"maxValue":"2412","minValue":"2412"},{"level":10,"maxValue":"2536","minValue":"2536"},{"level":11,"maxValue":"2659","minValue":"2659"},{"level":12,"maxValue":"2750","minValue":"2750"},{"level":13,"maxValue":"2841","minValue":"2841"},{"level":14,"maxValue":"2932","minValue":"2932"},{"level":15,"maxValue":"3022","minValue":"3022"},{"level":16,"maxValue":"3113","minValue":"3113"},{"level":17,"maxValue":"3204","minValue":"3204"},{"level":18,"maxValue":"3295","minValue":"3295"},{"level":19,"maxValue":"3385","minValue":"3385"},{"level":20,"maxValue":"3476","minValue":"3476"},{"level":21,"maxValue":"3567","minValue":"3567"},{"level":22,"maxValue":"3658","minValue":"3658"},{"level":23,"maxValue":"3748","minValue":"3748"},{"level":24,"maxValue":"3839","minValue":"3839"},{"level":25,"maxValue":"3930","minValue":"3930"},{"level":26,"maxValue":"4021","minValue":"4021"},{"level":27,"maxValue":"4111","minValue":"4111"},{"level":28,"maxValue":"4202","minValue":"4202"},{"level":29,"maxValue":"4293","minValue":"4293"},{"level":30,"maxValue":"4384","minValue":"4384"}]
    },
    {
      id: `14700000`,
      name: `Assault Smite`,
      iconUrl: `https://assets.playnccdn.com/static-aion2-gamedata/resources/ICON_CO_SKILL_003.png`,
      description: `Select a target within 20m and deal <span style="color: #FCC78B">{se_dmg:1470000021:SkillUIMinDmgSum}-{se_dmg:1470000021:SkillUIMaxDmgSum}</span> damage with a {se:1470000025:effect_value05:divide100}% chance to inflict Stun for {se:1470000025:effect_value02:time} to up to 4 enemies within 4m.
100% chance to land Stun on NPC targets.

Increases Defense by max 20% proportional to hit targets.`,
      condition: [],
      damageMin: 902,
      damageMax: 902,
      damageMinModifiers: [1025,1148,1295,1418,1508,1574,1664,1754,1844,1934,2000,2066,2132,2198,2264,2330,2396,2462,2528,2594,2660,2726,2792,2858,2924,2990,3056,3122,3188],
      damageMaxModifiers: [1025,1148,1295,1418,1508,1574,1664,1754,1844,1934,2000,2066,2132,2198,2264,2330,2396,2462,2528,2594,2660,2726,2792,2858,2924,2990,3056,3122,3188],
      manaRegen: 0,
      range: 20,
      area: 20,
      castingDuration: `Instant Cast`,
      cooldown: `Instant Cast`,
      target: `Area`,
      spellTag: ["Physical","Attack"],
      baseCost: 1,
      baseCostModifier: 1,
      maxLevel: 31,
      classId: 4,
      duration: 3,
      levels: [{"level":1,"maxValue":"50","minValue":"TargetLocation_CasterToTargetDirection"},{"level":1,"maxValue":"902","minValue":"902"},{"level":2,"maxValue":"1025","minValue":"1025"},{"level":3,"maxValue":"1148","minValue":"1148"},{"level":4,"maxValue":"1295","minValue":"1295"},{"level":5,"maxValue":"1418","minValue":"1418"},{"level":6,"maxValue":"1508","minValue":"1508"},{"level":7,"maxValue":"1574","minValue":"1574"},{"level":8,"maxValue":"1664","minValue":"1664"},{"level":9,"maxValue":"1754","minValue":"1754"},{"level":10,"maxValue":"1844","minValue":"1844"},{"level":11,"maxValue":"1934","minValue":"1934"},{"level":12,"maxValue":"2000","minValue":"2000"},{"level":13,"maxValue":"2066","minValue":"2066"},{"level":14,"maxValue":"2132","minValue":"2132"},{"level":15,"maxValue":"2198","minValue":"2198"},{"level":16,"maxValue":"2264","minValue":"2264"},{"level":17,"maxValue":"2330","minValue":"2330"},{"level":18,"maxValue":"2396","minValue":"2396"},{"level":19,"maxValue":"2462","minValue":"2462"},{"level":20,"maxValue":"2528","minValue":"2528"},{"level":21,"maxValue":"2594","minValue":"2594"},{"level":22,"maxValue":"2660","minValue":"2660"},{"level":23,"maxValue":"2726","minValue":"2726"},{"level":24,"maxValue":"2792","minValue":"2792"},{"level":25,"maxValue":"2858","minValue":"2858"},{"level":26,"maxValue":"2924","minValue":"2924"},{"level":27,"maxValue":"2990","minValue":"2990"},{"level":28,"maxValue":"3056","minValue":"3056"},{"level":29,"maxValue":"3122","minValue":"3122"},{"level":30,"maxValue":"3188","minValue":"3188"}]
    }
  ]
};
