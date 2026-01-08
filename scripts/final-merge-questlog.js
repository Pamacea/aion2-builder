const fs = require('fs');
const path = require('path');

const CLASSES_DIR = path.join(__dirname, '../src/data/classes');
const CLASSES = ['gladiator', 'templar', 'assassin', 'ranger', 'sorcerer', 'elementalist', 'cleric', 'chanter'];

function loadExistingClass(className) {
  const filePath = path.join(CLASSES_DIR, `${className}.ts`);
  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, 'utf8');

  const descriptionMatch = content.match(/description:\s*"([^"]+)"/);
  const tagsMatch = content.match(/tags:\s*\[([^\]]+)\]/);

  const description = descriptionMatch ? descriptionMatch[1] : '';
  const tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim().replace(/"/g, '').replace(/'/g, '')) : [];

  return { description, tags };
}

function cleanHtmlDescription(description) {
  return description
    .replace(/<span[^>]*>/g, '')
    .replace(/<\/span>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\{[^}]+\}/g, '[value]')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function mergeClassData(className) {
  const existingData = loadExistingClass(className);
  const questlogPath = path.join(CLASSES_DIR, `${className}.questlog.ts`);

  if (!fs.existsSync(questlogPath)) {
    console.log(`No questlog data for ${className}`);
    return;
  }

  let questlogContent = fs.readFileSync(questlogPath, 'utf8');

  if (existingData) {
    questlogContent = questlogContent.replace(
      /description:\s*""/,
      `description: \`${existingData.description}\``
    );

    if (existingData.tags && existingData.tags.length > 0) {
      const tagsString = JSON.stringify(existingData.tags);
      questlogContent = questlogContent.replace(
        /tags:\s*\[\]/,
        `tags: ${tagsString}`
      );
    }
  }

  const outputPath = path.join(CLASSES_DIR, `${className}.ts`);
  fs.writeFileSync(outputPath, questlogContent);
  console.log(`✓ Merged ${className}.ts`);
}

function main() {
  console.log('Merging Questlog data with existing class metadata...\n');

  CLASSES.forEach(className => {
    mergeClassData(className);
  });

  console.log('\n✓ All classes merged successfully!');
}

main();
