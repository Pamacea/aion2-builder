const fs = require('fs');
const path = require('path');

const QUESTLOG_DATA_PATH = path.join(__dirname, '../questlog-api/skillbuilder.json');
const OUTPUT_DIR = path.join(__dirname, '../src/data/classes');

const CLASS_IDS = {
  gladiator: '11000000',
  templar: '12000000',
  assassin: '13000000',
  ranger: '14000000',
  sorcerer: '15000000',
  elementalist: '16000000',
  cleric: '21000000',
  chanter: '22000000'
};

const CLASS_NAMES = {
  gladiator: 'Gladiator',
  templar: 'Templar',
  assassin: 'Assassin',
  ranger: 'Ranger',
  sorcerer: 'Sorcerer',
  elementalist: 'Elementalist',
  cleric: 'Cleric',
  chanter: 'Chanter'
};

const CLASS_TYPE_IDS = {
  gladiator: 1,
  templar: 2,
  assassin: 3,
  ranger: 4,
  sorcerer: 5,
  elementalist: 6,
  cleric: 7,
  chanter: 8
};

function extractIconUrl(icon) {
  if (!icon) return '';
  const fileName = icon.split('.').pop();
  return `https://assets.playnccdn.com/static-aion2-gamedata/resources/${fileName}.png`;
}

function parsePlaceholder(placeholders, key, property) {
  const placeholderKey = `{${key}:${property}}`;
  const placeholder = placeholders[placeholderKey];

  if (!placeholder) return null;

  const result = {
    base: placeholder.base?.values?.[0] || '0',
    levels: {}
  };

  if (placeholder.levels) {
    Object.entries(placeholder.levels).forEach(([level, data]) => {
      result.levels[level] = data.values?.[0] || '0';
    });
  }

  return result;
}

function extractDamageFromPlaceholders(skill) {
  if (!skill.descriptionData?.placeholders) return { min: null, max: null };

  const keys = Object.keys(skill.descriptionData.placeholders);
  const dmgKey = keys.find(k => k.startsWith('{se_dmg:') && k.includes(':SkillUIMinDmg'));
  const dmgMaxKey = keys.find(k => k.startsWith('{se_dmg:') && k.includes(':SkillUIMaxDmg'));

  if (!dmgKey) return { min: null, max: null };

  const keyMatch = dmgKey.match(/\{se_dmg:([^:]+):/);
  if (!keyMatch) return { min: null, max: null };
  const key = keyMatch[1];

  const minData = parsePlaceholder(skill.descriptionData.placeholders, `se_dmg:${key}`, 'SkillUIMinDmgSum');
  const maxData = parsePlaceholder(skill.descriptionData.placeholders, `se_dmg:${key}`, 'SkillUIMaxDmgSum');

  return { min: minData, max: maxData };
}

function convertAbility(skill, classType) {
  const damageData = extractDamageFromPlaceholders(skill);

  const ability = {
    id: skill.id,
    name: skill.name,
    iconUrl: extractIconUrl(skill.icon),
    description: skill.descriptionData?.text || skill.description || '',
    condition: skill.descriptionData?.text?.includes('Mobile') ? ['Mobile'] : [],
    damageMin: damageData.min?.base ? parseInt(damageData.min.base) : undefined,
    damageMax: damageData.max?.base ? parseInt(damageData.max.base) : undefined,
    damageMinModifiers: damageData.min?.levels ? Object.values(damageData.min.levels).map(v => parseInt(v)) : undefined,
    damageMaxModifiers: damageData.max?.levels ? Object.values(damageData.max.levels).map(v => parseInt(v)) : undefined,
    staggerDamage: skill.description?.includes('Stagger Gauge Damage') ?
      parseInt(skill.description.match(/(\d+)\s*Stagger Gauge Damage/)?.[1] || '0') : undefined,
    manaCost: skill.description?.includes('Restores') ?
      -parseInt(skill.description.match(/Restores\s+(\d+)\s+MP/)?.[1] || '0') : undefined,
    manaRegen: 0,
    range: skill.descriptionData?.placeholders ? 20 : undefined,
    area: skill.description?.includes('enemies within') ?
      parseInt(skill.description.match(/within\s+(\d+)m/)?.[1] || '0') : undefined,
    castingDuration: "Instant Cast",
    cooldown: "Instant Cast",
    target: skill.description?.includes('up to 4 enemies') ? 'Area' : 'Single Target',
    spellTag: skill.damageType === 'physic' ? ['Physical', 'Attack'] : ['Magic', 'Attack'],
    baseCost: 1,
    baseCostModifier: 1,
    maxLevel: skill.levels?.length || 20,
    classId: CLASS_TYPE_IDS[classType],
    levels: skill.levels || []
  };

  Object.keys(ability).forEach(key => {
    if (ability[key] === undefined) delete ability[key];
  });

  return ability;
}

function convertStigma(skill, classType) {
  const ability = convertAbility(skill, classType);
  return {
    ...ability,
    enmity: skill.description?.includes('Enmity') ? 100 : undefined,
    duration: skill.description?.includes('for ') ?
      parseInt(skill.description.match(/for\s+<[^>]*>(\d+)/)?.[1] ||
             skill.description.match(/for\s+(\d+)/)?.[1] || '0') : undefined,
    protectiveShield: skill.description?.includes('Shield') ?
      parseInt(skill.description.match(/Shield\s+by\s+(\d+)/)?.[1] || '0') : undefined
  };
}

function convertPassive(skill, classType) {
  return {
    id: skill.id,
    name: skill.name,
    iconUrl: extractIconUrl(skill.icon),
    description: skill.descriptionData?.text || skill.description || '',
    spellTag: ['Passive'],
    maxLevel: skill.levels?.length || 1,
    classId: CLASS_TYPE_IDS[classType],
    levels: skill.levels || []
  };
}

function processClass(className, classType) {
  const rawData = JSON.parse(fs.readFileSync(QUESTLOG_DATA_PATH, 'utf8'));
  const skills = rawData.result.data;

  const classIdPrefix = CLASS_IDS[classType];
  if (!classIdPrefix) {
    console.log(`No class ID found for ${className}`);
    return null;
  }

  const classSkills = skills.filter(skill =>
    skill.mainCategory === classType ||
    (skill.id.startsWith(classIdPrefix.slice(0, 2)) && skill.id.length === 8)
  );

  const result = {
    abilities: [],
    passives: [],
    stigmas: []
  };

  classSkills.forEach(skill => {
    if (skill.type === 'passive' && skill.subCategory !== 'common') {
      result.passives.push(convertPassive(skill, classType));
    } else if (skill.subCategory === 'stigma') {
      result.stigmas.push(convertStigma(skill, classType));
    } else if (skill.subCategory === 'active' && skill.mainCategory === classType) {
      result.abilities.push(convertAbility(skill, classType));
    }
  });

  console.log(`${CLASS_NAMES[classType]}: ${result.abilities.length} abilities, ${result.passives.length} passives, ${result.stigmas.length} stigmas`);

  return result;
}

function main() {
  console.log('Converting Questlog API data...\n');

  const classes = ['gladiator', 'templar', 'assassin', 'ranger', 'sorcerer', 'elementalist', 'cleric', 'chanter'];
  const results = {};

  classes.forEach(className => {
    const data = processClass(className, className);
    if (data) {
      results[className] = data;
    }
  });

  const outputPath = path.join(__dirname, '../src/data/questlog-skills.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\n✓ Converted data saved to ${outputPath}`);
  console.log('\nTo integrate this data:');
  console.log('1. Review the generated file');
  console.log('2. Manually merge with existing class files or update types to support per-level data');
}

main();
