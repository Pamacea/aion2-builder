const fs = require('fs');
const path = require('path');

const QUESTLOG_DATA_PATH = path.join(__dirname, '../questlog-api/skillbuilder.json');

console.log('🔍 ANALYSE STRUCTURE RÉELLE des données Questlog\n');

const data = JSON.parse(fs.readFileSync(QUESTLOG_DATA_PATH, 'utf8'));
const skills = data.result.data;

// Trouver les skills avec des placeholders
const skillsWithData = skills.filter(skill =>
  skill.descriptionData &&
  skill.descriptionData.placeholders &&
  Object.keys(skill.descriptionData.placeholders).length > 0
);

console.log(`📊 Skills avec des placeholders: ${skillsWithData.length}/${skills.length}\n`);

// Analyser la structure des placeholders
const allFields = new Map();

skillsWithData.slice(0, 10).forEach(skill => {
  const placeholders = skill.descriptionData.placeholders;

  console.log(`\nSkill: ${skill.name} (${skill.id})`);
  console.log(`Description: ${skill.description.substring(0, 80)}...`);

  Object.entries(placeholders).forEach(([key, placeholder]) => {
    console.log(`\n  Placeholder key: ${key}`);
    console.log(`    field: ${placeholder.field}`);
    console.log(`    has base: ${!!placeholder.base}`);
    console.log(`    has levels: ${!!placeholder.levels}`);

    if (placeholder.base) {
      console.log(`    base.values: ${JSON.stringify(placeholder.base.values)}`);
    }

    if (placeholder.levels) {
      const levelKeys = Object.keys(placeholder.levels).slice(0, 2);
      console.log(`    levels: ${levelKeys.join(', ')}...`);
    }

    // Track all unique fields
    if (!allFields.has(placeholder.field)) {
      allFields.set(placeholder.field, {
        count: 0,
        skills: [],
        examples: []
      });
    }
    allFields.get(placeholder.field).count++;
    allFields.get(placeholder.field).skills.push(skill.name);
    if (allFields.get(placeholder.field).examples.length < 3) {
      allFields.get(placeholder.field).examples.push(key);
    }
  });
});

console.log('\n\n📈 Tous les champs uniques trouvés:\n');
const sortedFields = Array.from(allFields.entries())
  .sort((a, b) => b[1].count - a[1].count);

sortedFields.forEach(([field, info]) => {
  console.log(`\n${field} (${info.count}x):`);
  console.log(`  Exemples: ${info.examples.slice(0, 3).join(', ')}`);
  console.log(`  Skills: ${info.skills.slice(0, 3).join(', ')}${info.skills.length > 3 ? '...' : ''}`);
});

// Trouver les champs qui ne sont pas encore dans le parser
console.log('\n\n⚠️  Champs qui ne sont PAS encore gérés par le parser:\n');

const knownPatterns = [
  'SkillUIMinDmgsum',
  'SkillUIMaxDmgsum',
  'SkillUIMinDmgSum',
  'SkillUIMaxDmgSum',
  'SkillUIHPHealMin',
  'SkillUIHPHealMax',
  'time',
  'divide100'
];

const unknownFields = sortedFields.filter(([field]) =>
  !knownPatterns.some(pattern => field.includes(pattern))
);

unknownFields.slice(0, 10).forEach(([field, info]) => {
  console.log(`\n${field} (${info.count}x):`);
  console.log(`  Exemples: ${info.examples.join(', ')}`);
});
