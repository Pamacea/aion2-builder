const fs = require('fs');
const path = require('path');

const QUESTLOG_DATA_PATH = path.join(__dirname, '../questlog-api/skillbuilder.json');

console.log('🔍 DEEP ANALYSIS - Structure complète des données Questlog\n');

const data = JSON.parse(fs.readFileSync(QUESTLOG_DATA_PATH, 'utf8'));
const skills = data.result.data;

// 1. Trouver tous les placeholders uniques
const allPlaceholders = new Map();
const skillsWithPlaceholders = [];

skills.forEach(skill => {
  const desc = skill.description || '';
  const placeholders = desc.match(/\{[a-z_]+:[^}]+\}/gi) || [];

  if (placeholders.length > 0) {
    skillsWithPlaceholders.push({
      id: skill.id,
      name: skill.name,
      description: desc,
      placeholders: placeholders,
      rawPlaceholders: skill.placeholders // Check structure here
    });

    placeholders.forEach(ph => {
      if (!allPlaceholders.has(ph)) {
        allPlaceholders.set(ph, {
          count: 0,
          skills: [],
          type: ph.split(':')[0]
        });
      }
      allPlaceholders.get(ph).count++;
      allPlaceholders.get(ph).skills.push(skill.name);
    });
  }
});

console.log('📊 Statistiques générales:');
console.log(`   Total skills: ${skills.length}`);
console.log(`   Skills avec placeholders: ${skillsWithPlaceholders.length}`);
console.log(`   Placeholders uniques: ${allPlaceholders.size}\n`);

// 2. Analyser les patterns de placeholders
console.log('🔧 Patterns de placeholders trouvés:\n');
const byType = new Map();
allPlaceholders.forEach((info, ph) => {
  if (!byType.has(info.type)) {
    byType.set(info.type, []);
  }
  byType.get(info.type).push({ placeholder: ph, count: info.count });
});

byType.forEach((placeholders, type) => {
  console.log(`[${type}] ${placeholders.length} variants:`);
  placeholders.slice(0, 5).forEach(p => {
    console.log(`   ${p.placeholder} (${p.count}x)`);
  });
  if (placeholders.length > 5) {
    console.log(`   ... et ${placeholders.length - 5} autres`);
  }
  console.log('');
});

// 3. Analyser la structure des données
console.log('🏗️  Structure des données placeholders (5 exemples):\n');
skillsWithPlaceholders.slice(0, 5).forEach(skill => {
  console.log(`Skill: ${skill.name} (ID: ${skill.id})`);
  console.log(`Description: ${skill.description.substring(0, 100)}...`);

  if (skill.rawPlaceholders) {
    console.log(`Placeholders object structure:`);
    const keys = Object.keys(skill.rawPlaceholders).slice(0, 3);
    keys.forEach(key => {
      const placeholder = skill.rawPlaceholders[key];
      console.log(`   ${key}:`);
      console.log(`      field: ${placeholder.field || 'N/A'}`);
      console.log(`      has base: ${!!placeholder.base}`);
      console.log(`      has levels: ${!!placeholder.levels}`);

      if (placeholder.base) {
        console.log(`      base.values: ${JSON.stringify(placeholder.base.values?.slice(0, 3))}`);
      }
      if (placeholder.levels) {
        const levelKeys = Object.keys(placeholder.levels).slice(0, 2);
        console.log(`      levels sample: ${levelKeys.join(', ')}...`);
      }
    });
  }
  console.log('');
});

// 4. Trouver les champs les plus utilisés
console.log('📈 Champs les plus utilisés dans les placeholders:\n');
const fieldCounts = new Map();

allPlaceholders.forEach((info, ph) => {
  // Extraire le champ du placeholder
  const parts = ph.split(':');
  const field = parts[parts.length - 1] || parts[parts.length - 2];

  if (!fieldCounts.has(field)) {
    fieldCounts.set(field, 0);
  }
  fieldCounts.set(field, fieldCounts.get(field) + 1);
});

const sortedFields = Array.from(fieldCounts.entries())
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20);

sortedFields.forEach(([field, count]) => {
  console.log(`   ${field}: ${count}x`);
});

// 5. Trouver les skills avec le plus de placeholders non parsés
console.log('\n⚠️  Exemples de skills avec des placeholders potentiellement problématiques:\n');

const problematicSkills = skillsWithPlaceholders.filter(skill => {
  return skill.placeholders.some(ph => {
    const parts = ph.split(':');
    const field = parts[parts.length - 1];
    // Check if this is not a standard damage/heal/duration field
    return !field.includes('Dmg') &&
           !field.includes('Heal') &&
           !field.includes('time') &&
           !field.includes('divide100');
  });
});

problematicSkills.slice(0, 5).forEach(skill => {
  console.log(`Skill: ${skill.name}`);
  console.log(`Placeholders: ${skill.placeholders.join(', ')}`);
  console.log('');
});
