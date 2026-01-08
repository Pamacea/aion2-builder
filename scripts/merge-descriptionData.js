const fs = require('fs');
const path = require('path');

const QUESTLOG_SKILLS_PATH = path.join(__dirname, '../src/data/questlog-skills.json');
const CLASSES_DIR = path.join(__dirname, '../src/data/classes');

console.log('🔧 Merging descriptionData into class files...\n');

// Load questlog skills with descriptionData
const questlogData = JSON.parse(fs.readFileSync(QUESTLOG_SKILLS_PATH, 'utf8'));

const classNameMapping = {
  gladiator: 'gladiator',
  templar: 'templar',
  assassin: 'assassin',
  ranger: 'ranger',
  sorcerer: 'sorcerer',
  elementalist: 'elementalist',
  cleric: 'cleric',
  chanter: 'chanter'
};

// Create a map of all skills by name for quick lookup
const skillsByName = new Map();

Object.entries(questlogData).forEach(([className, classData]) => {
  [...(classData.abilities || []), ...(classData.passives || []), ...(classData.stigmas || [])].forEach(skill => {
    if (skill.descriptionData) {
      skillsByName.set(skill.name, skill.descriptionData);
    }
  });
});

console.log(`Found ${skillsByName.size} skills with descriptionData\n`);

// Process each class file
Object.entries(classNameMapping).forEach(([className, fileName]) => {
  const classFilePath = path.join(CLASSES_DIR, `${fileName}.ts`);
  const content = fs.readFileSync(classFilePath, 'utf8');

  // Check if file already has descriptionData
  if (content.includes('descriptionData:')) {
    console.log(`✓ ${fileName}.ts already has descriptionData, skipping...`);
    return;
  }

  console.log(`Processing ${fileName}.ts...`);

  // Add descriptionData after each description field
  let updatedCount = 0;
  let newContent = content.replace(
    /description: `([^`]+)`,/g,
    (match, description) => {
      // Try to find the skill name before this description
      const beforeMatch = content.substring(Math.max(0, match.index - 200), match.index).match(/name: `([^`]+)`,/);

      if (beforeMatch) {
        const skillName = beforeMatch[1];
        const descData = skillsByName.get(skillName);

        if (descData) {
          updatedCount++;
          // Return description + descriptionData
          return `description: \`${description}\`,\n      descriptionData: ${JSON.stringify(descData)},`;
        }
      }

      return match;
    }
  );

  if (updatedCount > 0) {
    fs.writeFileSync(classFilePath, newContent, 'utf8');
    console.log(`  ✓ Added descriptionData to ${updatedCount} skills\n`);
  } else {
    console.log(`  ⚠ No matching skills found\n`);
  }
});

console.log('\n✅ Done! descriptionData has been added to all class files.');
console.log('\nNext steps:');
console.log('1. Review the changes in src/data/classes/*.ts');
console.log('2. Run: npx prisma migrate dev --name add_descriptionData');
console.log('3. Run: npx prisma generate');
console.log('4. Run: npm run seed');
