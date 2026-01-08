const fs = require('fs');
const path = require('path');

const QUESTLOG_DATA_PATH = path.join(__dirname, '../questlog-api/skillbuilder.json');

console.log('🔍 Analyse détaillée des placeholders Questlog vs Schema Prisma\n');

const data = JSON.parse(fs.readFileSync(QUESTLOG_DATA_PATH, 'utf8'));
const skills = data.result.data;

// Schema Prisma (champs principaux)
const prismaFields = {
  damageMin: true,
  damageMax: true,
  damageMinModifier: true,
  damageMaxModifier: true,
  damageMinModifiers: true,
  damageMaxModifiers: true,
  damageBoost: true,
  damageTolerance: true,
  healMin: true,
  healMax: true,
  healBoost: true,
  incomingHeal: true,
  minMP: true,
  maxHP: true,
  maxMP: true,
  criticalHit: true,
  criticalHitResist: true,
  statusEffectResist: true,
  impactTypeResist: true,
  impactTypeChance: true,
  attack: true,
  defense: true,
  blockDamage: true,
  damagePerSecond: true,
  staggerDamage: true,
  manaCost: true,
  manaRegen: true,
  range: true,
  area: true,
  castingDuration: true,
  cooldown: true,
  target: true,
  condition: true,
  enmity: true,
  enmityModifier: true,
  enmityModifiers: true,
  duration: true,
  durationModifier: true,
  durationModifiers: true,
  protectiveShield: true,
  protectiveShieldModifier: true,
  protectiveShieldModifiers: true,
  // etc...
};

// Trouver tous les skills avec des placeholders
const skillsWithPlaceholders = skills.filter(s =>
  s.descriptionData && s.descriptionData.placeholders && Object.keys(s.descriptionData.placeholders).length > 0
);

console.log(`📊 ${skillsWithPlaceholders.length} skills ont des placeholders sur ${skills.length}\n`);

// Analyser les types de placeholders
const placeholderTypes = new Map();

skillsWithPlaceholders.slice(0, 50).forEach(skill => {
  Object.entries(skill.descriptionData.placeholders).forEach(([key, placeholder]) => {
    // Extraire le type du placeholder (ex: "se_dmg", "se", "abe")
    const typeMatch = key.match(/^\{([a-z_]+):/);
    if (typeMatch) {
      const type = typeMatch[1];
      if (!placeholderTypes.has(type)) {
        placeholderTypes.set(type, []);
      }
      placeholderTypes.get(type).push({
        skill: skill.name,
        placeholder: key,
        hasLevels: !!placeholder.levels
      });
    }
  });
});

console.log(`📋 Types de placeholders trouvés (${placeholderTypes.size}):\n`);

Array.from(placeholderTypes.entries()).forEach(([type, examples]) => {
  console.log(`  ${type}:`);
  console.log(`    Nombre: ${examples.length}`);
  console.log(`    Exemples de champs:`, [...new Set(examples.map(e => e.field))].slice(0, 5).join(', '));
});

// Maintenant analyser quels champs sont dans les levels
console.log('\n\n📈 Analyse des champs dans levels[]:\n');

const levelFields = new Map();

skillsWithPlaceholders.slice(0, 20).forEach(skill => {
  if (skill.levels && skill.levels.length > 0) {
    Object.entries(skill.levels[0]).forEach(([key, value]) => {
      if (!levelFields.has(key)) {
        levelFields.set(key, []);
      }
      levelFields.get(key).push({
        skill: skill.name,
        value: value
      });
    });
  }
});

console.log(`  Champs dans levels: (${levelFields.size})\n`);

Array.from(levelFields.entries()).forEach(([field, examples]) => {
  const sampleValues = examples.slice(0, 3).map(e => e.value);
  console.log(`    ${field}: ${sampleValues.join(', ')}`);
});

// Comparer avec les placeholders dans descriptionData
console.log('\n\n🔍 Analyse complète des placeholders dans descriptionData:\n');

const allPlaceholderFields = new Map();

skillsWithPlaceholders.slice(0, 100).forEach(skill => {
  Object.entries(skill.descriptionData.placeholders).forEach(([key, placeholder]) => {
    if (!allPlaceholderFields.has(placeholder.field)) {
      allPlaceholderFields.set(placeholder.field, {
        type: key.match(/^\{([a-z_]+):/)[1],
        examples: []
      });
    }
    allPlaceholderFields.get(placeholder.field).examples.push(skill.name);
  });
});

console.log(`  Champs uniques dans placeholders: (${allPlaceholderFields.size})\n`);

Array.from(allPlaceholderFields.entries()).forEach(([field, data]) => {
  const isInPrisma = field in prismaFields;
  const status = isInPrisma ? '✓' : '✗';
  console.log(`  ${status} ${field} (${data.type}): ${data.examples.length} skills`);
});

console.log('\n\n✅ Analyse terminée!');
