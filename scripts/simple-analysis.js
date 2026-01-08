const fs = require('fs');
const path = require('path');

const QUESTLOG_DATA_PATH = path.join(__dirname, '../questlog-api/skillbuilder.json');

const data = JSON.parse(fs.readFileSync(QUESTLOG_DATA_PATH, 'utf8'));
const skills = data.result.data;

console.log('🔍 Analyse simple des données Questlog\n');

// Prendre un échantillon de skills de combat (pas les passifs de base)
const combatSkills = skills.filter(s => s.mainCategory && s.mainCategory !== 'common');

console.log(`📊 ${combatSkills.length} skills de combat\n`);

// Analyser les premiers skills avec des levels intéressants
const interestingSkills = combatSkills
  .filter(s => s.levels && s.levels.length > 5)
  .slice(0, 5);

console.log('📋 Skills avec plusieurs niveaux:\n');

interestingSkills.forEach(skill => {
  console.log(`\n${skill.name} (${skill.id}):`);
  console.log(`  levels: ${skill.levels.length} niveaux`);

  // Montrer les pattern de levels
  const levelPattern = skill.levels.slice(0, Math.min(5, skill.levels.length));
  console.log('  Pattern des niveaux:');
  levelPattern.forEach((lvl, idx) => {
    const values = Object.entries(lvl).filter(([k, v]) => k !== 'level');
    if (values.length > 0) {
      console.log(`    Nv${lvl.level}: ${values.map(([k, v]) => `${k}=${v}`).join(', ')}`);
    }
  });

  // Afficher les placeholders
  if (skill.descriptionData?.placeholders) {
    const phKeys = Object.keys(skill.descriptionData.placeholders).slice(0, 3);
    console.log(`  Placeholders (${phKeys.length}): ${phKeys.join(', ')}`);

    // Afficher les détails d'un placeholder
    const firstPh = skill.descriptionData.placeholders[phKeys[0]];
    if (firstPh) {
      console.log(`    Exemple ${phKeys[0]}:`);
      console.log(`      field: ${firstPh.field}`);
      if (firstPh.base?.values) {
        console.log(`      base values: ${firstPh.base.values.slice(0, 3).join(', ')}`);
      }
      if (firstPh.levels) {
        const lvls = Object.keys(firstPh.levels);
        console.log(`      levels: Nv${lvls.slice(0, 3).join(', Nv')}...`);
      }
    }
  }
});

// Maintenant, lister tous les placeholders uniques avec leurs fields
console.log('\n\n🔍 Tous les placeholders uniques dans les skills de combat:\n');

const allPlaceholders = new Map();

combatSkills.slice(0, 200).forEach(skill => {
  if (skill.descriptionData?.placeholders) {
    Object.entries(skill.descriptionData.placeholders).forEach(([key, ph]) => {
      if (!allPlaceholders.has(ph.field)) {
        allPlaceholders.set(ph.field, {
          keys: [],
          skills: []
        });
      }
      const data = allPlaceholders.get(ph.field);
      if (!data.keys.includes(key)) {
        data.keys.push(key);
      }
      data.skills.push(skill.name);
    });
  }
});

console.log(`  ${allPlaceholders.size} champs uniques trouvés:\n`);

Array.from(allPlaceholders.entries()).forEach(([field, data]) => {
  console.log(`    ${field}:`);
  console.log(`      Utilisé par: ${data.skills.length} skills`);
  console.log(`      Keys: ${data.keys.slice(0, 2).join(', ')}`);
});

console.log('\n\n✅ Analyse terminée!');
