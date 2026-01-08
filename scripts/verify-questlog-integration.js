const fs = require('fs');
const path = require('path');

const CLASSES_DIR = path.join(__dirname, '../src/data/classes');
const CLASSES = ['gladiator', 'templar', 'assassin', 'ranger', 'sorcerer', 'elementalist', 'cleric', 'chanter'];

console.log('🔍 Verification de l\'intégration Questlog\n');
console.log('=' .repeat(80));

let totalSkills = 0;
let totalSkillsWithLevels = 0;
let totalLevels = 0;

CLASSES.forEach(className => {
  const filePath = path.join(CLASSES_DIR, `${className}.ts`);
  const content = fs.readFileSync(filePath, 'utf8');

  // Compter les skills
  const abilitiesMatch = content.match(/abilities:\s*\[/g);
  const passivesMatch = content.match(/passives:\s*\[/g);
  const stigmasMatch = content.match(/stigmas:\s*\[/g);

  const abilitiesCount = abilitiesMatch ? 1 : 0;
  const passivesCount = passivesMatch ? 1 : 0;
  const stigmasCount = stigmasMatch ? 1 : 0;

  // Compter les niveaux
  const levelsMatches = content.match(/levels:\s*\[/g);
  const levelsCount = levelsMatches ? levelsMatches.length : 0;

  // Compter les entrées de niveau individuelles
  const levelEntries = content.match(/\{\s*"level":/g) || [];
  const totalLevelEntries = levelEntries.length;

  totalSkills += abilitiesCount + passivesCount + stigmasCount;
  totalSkillsWithLevels += levelsCount;
  totalLevels += totalLevelEntries;

  console.log(`\n📊 ${className.charAt(0).toUpperCase() + className.slice(1)}`);
  console.log(`   Abilities: ${abilitiesCount > 0 ? '✓' : '✗'}`);
  console.log(`   Passives: ${passivesCount > 0 ? '✓' : '✗'}`);
  console.log(`   Stigmas: ${stigmasCount > 0 ? '✓' : '✗'}`);
  console.log(`   Skills with levels: ${levelsCount}`);
  console.log(`   Total level entries: ${totalLevelEntries}`);
});

console.log('\n' + '='.repeat(80));
console.log('\n📈 RÉSUMÉ GLOBAL');
console.log('='.repeat(80));
console.log(`✓ Classes traitées: ${CLASSES.length}`);
console.log(`✓ Skills total: ${totalSkills}`);
console.log(`✓ Skills avec données de niveau: ${totalSkillsWithLevels}`);
console.log(`✓ Entrées de niveau total: ${totalLevels}`);
console.log(`✓ Moyenne de niveaux par skill: ${(totalLevels / totalSkillsWithLevels).toFixed(1)}`);

// Vérifier que les IDs Questlog sont présents
console.log('\n' + '='.repeat(80));
console.log('\n🔑 VÉRIFICATION DES IDS QUESTLOG');
console.log('='.repeat(80));

let questlogIdsFound = 0;
CLASSES.forEach(className => {
  const filePath = path.join(CLASSES_DIR, `${className}.ts`);
  const content = fs.readFileSync(filePath, 'utf8');

  const idMatches = content.match(/id:\s*`?\d{8}`?/g) || [];
  questlogIdsFound += idMatches.length;

  if (idMatches.length > 0) {
    const sampleId = idMatches[0].match(/`?(\d{8})`?/)[1];
    console.log(`✓ ${className}: ${idMatches.length} IDs Questlog (ex: ${sampleId})`);
  }
});

console.log(`\n✓ Total IDs Questlog: ${questlogIdsFound}`);

// Vérifier les types
console.log('\n' + '='.repeat(80));
console.log('\n📝 VÉRIFICATION DES TYPES');
console.log('='.repeat(80));

const typesPath = path.join(__dirname, '../src/data/classes/types.ts');
const typesContent = fs.readFileSync(typesPath, 'utf8');

const hasSkillLevel = typesContent.includes('export interface SkillLevel');
const hasLevelsField = typesContent.includes('levels?: SkillLevel[]');

console.log(`${hasSkillLevel ? '✓' : '✗'} Interface SkillLevel définie`);
console.log(`${hasLevelsField ? '✓' : '✗'} Champ levels ajouté aux types`);

// Vérifier les utilitaires
console.log('\n' + '='.repeat(80));
console.log('\n🛠️  VÉRIFICATION DES UTILITAIRES');
console.log('='.repeat(80));

const statsUtilsPath = path.join(__dirname, '../src/utils/statsUtils.ts');
const statsUtilsContent = fs.readFileSync(statsUtilsPath, 'utf8');

const hasCalculateFromLevels = statsUtilsContent.includes('calculateStatFromLevels');
const hasCalculateWithQuestlog = statsUtilsContent.includes('calculateStatWithQuestlogData');

console.log(`${hasCalculateFromLevels ? '✓' : '✗'} calculateStatFromLevels()`);
console.log(`${hasCalculateWithQuestlog ? '✓' : '✗'} calculateStatWithQuestlogData()`);

const skillDescPath = path.join(__dirname, '../src/app/build/[buildId]/skill/_client/skill-desc.tsx');
const skillDescContent = fs.readFileSync(skillDescPath, 'utf8');

const usesQuestlogData = skillDescContent.includes('calculateStatWithQuestlogData');

console.log(`${usesQuestlogData ? '✓' : '✗'} SkillDesc utilise les données Questlog`);

// Verdict final
console.log('\n' + '='.repeat(80));
console.log('\n🎉 VERDICT FINAL');
console.log('='.repeat(80));

const allChecks = [
  totalSkills === 272,
  totalSkillsWithLevels > 0,
  totalLevels > 0,
  questlogIdsFound > 0,
  hasSkillLevel,
  hasLevelsField,
  hasCalculateFromLevels,
  hasCalculateWithQuestlog,
  usesQuestlogData
];

const passedChecks = allChecks.filter(check => check).length;
const totalChecks = allChecks.length;

if (passedChecks === totalChecks) {
  console.log(`✅ ${passedChecks}/${totalChecks} vérifications réussies`);
  console.log('\n🎊 L\'intégration Questlog est COMPLETE et fonctionnelle!');
  console.log('\n📦 Vous pouvez maintenant:');
  console.log('   • Committer les changements');
  console.log('   • Pusher vers le repository');
  console.log('   • Déployer en production');
  console.log('\n🚀 Les données Questlog sont actives dans le builder!');
} else {
  console.log(`⚠️  ${passedChecks}/${totalChecks} vérifications réussies`);
  console.log('\nCertains éléments nécessitent votre attention.');
}
