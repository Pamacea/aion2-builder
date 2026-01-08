const fs = require('fs');
const path = require('path');

const QUESTLOG_DATA_PATH = path.join(__dirname, '../questlog-api/skillbuilder.json');

console.log('🔍 Analyse complète des données Questlog...\n');

const data = JSON.parse(fs.readFileSync(QUESTLOG_DATA_PATH, 'utf8'));
const skills = data.result.data;

// Analyser un échantillon de skills pour voir tous les champs
const sampleSkills = skills.slice(0, 10);

console.log(`📊 Analyse de ${sampleSkills.length} skills pour trouver tous les champs:\n`);

// Récupérer tous les champs uniques
const allFields = new Map();

sampleSkills.forEach(skill => {
  Object.keys(skill).forEach(key => {
    if (!allFields.has(key)) {
      allFields.set(key, typeof skill[key]);
    }
  });
});

console.log(`📋 ${allFields.size} champs trouvés:\n`);

Array.from(allFields.entries()).sort().forEach(([field, type]) => {
  console.log(`  - ${field}: ${type}`);
});

// Analyser les champs descriptionData en détail
console.log('\n\n🔍 Analyse approfondie de descriptionData:\n');

const descDataSamples = skills
  .filter(s => s.descriptionData)
  .slice(0, 3)
  .map(s => ({
    name: s.name,
    descriptionData: s.descriptionData
  }));

descDataSamples.forEach(sample => {
  console.log(`\n${sample.name}:`);
  console.log(`  text: ${sample.descriptionData.text?.substring(0, 100)}...`);

  if (sample.descriptionData.placeholders) {
    console.log(`  placeholders (${Object.keys(sample.descriptionData.placeholders).length}):`);
    Object.entries(sample.descriptionData.placeholders).slice(0, 5).forEach(([key, value]) => {
      console.log(`    ${key}:`);
      console.log(`      base: ${JSON.stringify(value.base?.values?.slice(0, 2))}`);
      if (value.levels) {
        const levelKeys = Object.keys(value.levels).slice(0, 3);
        console.log('      levels: [' + levelKeys.join(', ') + '...]');
      }
    });
  }
});

// Analyser les levels du skill
console.log('\n\n📈 Analyse des niveaux par skill:\n');

skills.slice(0, 5).forEach(skill => {
  if (skill.levels && skill.levels.length > 0) {
    console.log(`\n${skill.name} (${skill.id}):`);
    console.log(`  Nombre de niveaux: ${skill.levels.length}`);
    console.log(`  Premier niveau: ${JSON.stringify(skill.levels[0])}`);
    console.log(`  Dernier niveau: ${JSON.stringify(skill.levels[skill.levels.length - 1])}`);
  }
});

// Chercher des patterns spéciaux
console.log('\n\n🔍 Recherche de patterns spéciaux:\n');

const specialPatterns = [
  { name: 'Enmity', regex: /enmi/i },
  { name: 'Shield', regex: /shield/i },
  { name: 'Stun', regex: /stun/i },
  { name: 'Knockback', regex: /knockback/i },
  { name: 'Poison', regex: /poison/i },
  { name: 'Bleed', regex: /bleed/i },
  { name: 'Root', regex: /root/i },
  { name: 'Sleep', regex: /sleep/i },
];

specialPatterns.forEach(pattern => {
  const count = skills.filter(s =>
    s.descriptionData?.text?.match(pattern.regex) ||
    s.description?.match(pattern.regex)
  ).length;

  if (count > 0) {
    console.log(`  ${pattern.name}: ${count} skills`);
  }
});

console.log('\n\n✅ Analyse terminée!');
