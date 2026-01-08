const fs = require('fs');
const path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../questlog-api/skillbuilder.json'), 'utf8'));
const skills = data.result.data;

// Find a skill with damage placeholders
const skill = skills.find(s =>
  s.descriptionData &&
  s.descriptionData.placeholders &&
  Object.keys(s.descriptionData.placeholders).some(k => k.includes('SkillUIMinDmgsum'))
);

if (skill) {
  const placeholders = skill.descriptionData.placeholders;
  const dmgPlaceholder = Object.keys(placeholders).find(k => k.includes('SkillUIMinDmgsum'));

  console.log('Skill:', skill.name);
  console.log('ID:', skill.id);
  console.log('\nPlaceholder key:', dmgPlaceholder);
  console.log('\nPlaceholder data:');
  console.log(JSON.stringify(placeholders[dmgPlaceholder], null, 2));

  console.log('\n\nLevels data:');
  const levels = placeholders[dmgPlaceholder].levels;
  if (levels) {
    Object.entries(levels).slice(0, 5).forEach(([level, data]) => {
      console.log(`\nLevel ${level}:`);
      console.log(JSON.stringify(data, null, 2));
    });
  }
}
