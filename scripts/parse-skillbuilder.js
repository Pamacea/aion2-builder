const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../questlog-api/skillbuilder.json'), 'utf8'));

// Get first 5 entries with level data
const skillsWithLevels = data.result.data
  .filter(skill => skill.levels && skill.levels.length > 0)
  .slice(0, 5);

console.log('Sample skills with level data:');
console.log(JSON.stringify(skillsWithLevels, null, 2));

// Get one gladiator skill with detailed levels
const gladiatorSkill = data.result.data.find(s => s.id === '11020000');
if (gladiatorSkill) {
  console.log('\n\n=== Gladiator Keen Strike (11020000) ===');
  console.log(JSON.stringify(gladiatorSkill, null, 2));
}
