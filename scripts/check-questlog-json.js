const data = require('../src/data/questlog-skills.json');

const assassin = data.assassin;
console.log('Abilities:', assassin.abilities?.length || 0);
console.log('First ability:');
console.log('  ID:', assassin.abilities?.[0]?.id);
console.log('  Name:', assassin.abilities?.[0]?.name);
console.log('  Has descriptionData:', !!assassin.abilities?.[0]?.descriptionData);
if (assassin.abilities?.[0]?.descriptionData) {
  console.log('  Placeholders:', Object.keys(assassin.abilities[0].descriptionData.placeholders || {}).length);
}
