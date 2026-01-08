const data = require('../questlog-api/skillbuilder.json');
console.log('First skill:', data.result.data[0].id);
const skill = data.result.data.find(s => s.id === data.result.data[0].id);

console.log('Skill found?', !!skill);
if (skill) {
  console.log('Keys:', Object.keys(skill));
  console.log('Has placeholders?', !!skill.placeholders);

  if (skill.placeholders) {
    console.log('Placeholder keys:', Object.keys(skill.placeholders).slice(0, 5));
    const firstPh = skill.placeholders[Object.keys(skill.placeholders)[0]];
    console.log('\nFirst placeholder structure:');
    console.log(JSON.stringify(firstPh, null, 2));
  } else {
    console.log('Full skill data:');
    console.log(JSON.stringify(skill, null, 2).substring(0, 1000));
  }
}
