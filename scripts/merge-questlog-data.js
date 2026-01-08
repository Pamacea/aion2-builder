const fs = require('fs');
const path = require('path');

const QUESTLOG_DATA_PATH = path.join(__dirname, '../src/data/questlog-skills.json');
const CLASSES_DIR = path.join(__dirname, '../src/data/classes');

const questlogData = JSON.parse(fs.readFileSync(QUESTLOG_DATA_PATH, 'utf8'));
const classNames = Object.keys(questlogData);

function createMergedClassFile(className) {
  const classData = questlogData[className];

  const imports = `import type { ClassData } from "./types";

export const ${className}Data: ClassData = {
  name: "${className}",
  iconUrl: "IC_Class_${className.charAt(0).toUpperCase() + className.slice(1)}.webp",
  bannerUrl: "BA_${className.charAt(0).toUpperCase() + className.slice(1)}.webp",
  characterURL: "CH_${className.charAt(0).toUpperCase() + className.slice(1)}.webp",
  description: "",
  tags: [],`;

  const abilitiesSection = `
  abilities: [
${classData.abilities.map(ability => {
  const props = Object.entries(ability)
    .filter(([key, value]) => value !== undefined && key !== 'levels')
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `      ${key}: ${JSON.stringify(value)},`;
      }
      if (typeof value === 'string') {
        return `      ${key}: \`${value.replace(/`/g, '\\`')}\`,`;
      }
      return `      ${key}: ${JSON.stringify(value)},`;
    })
    .join('\n');

  return `    {
${props}
      levels: ${JSON.stringify(ability.levels || [])}
    }`;
}).join(',\n')}
  ],`;

  const passivesSection = `
  passives: [
${classData.passives.map(passive => {
  const props = Object.entries(passive)
    .filter(([key, value]) => value !== undefined && key !== 'levels')
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `      ${key}: ${JSON.stringify(value)},`;
      }
      if (typeof value === 'string') {
        return `      ${key}: \`${value.replace(/`/g, '\\`')}\`,`;
      }
      return `      ${key}: ${JSON.stringify(value)},`;
    })
    .join('\n');

  return `    {
${props}
      levels: ${JSON.stringify(passive.levels || [])}
    }`;
}).join(',\n')}
  ],`;

  const stigmasSection = `
  stigmas: [
${classData.stigmas.map(stigma => {
  const props = Object.entries(stigma)
    .filter(([key, value]) => value !== undefined && key !== 'levels')
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `      ${key}: ${JSON.stringify(value)},`;
      }
      if (typeof value === 'string') {
        return `      ${key}: \`${value.replace(/`/g, '\\`')}\`,`;
      }
      return `      ${key}: ${JSON.stringify(value)},`;
    })
    .join('\n');

  return `    {
${props}
      levels: ${JSON.stringify(stigma.levels || [])}
    }`;
}).join(',\n')}
  ]`;

  return `${imports}${abilitiesSection}${passivesSection}${stigmasSection}
};
`;
}

function main() {
  console.log('Merging Questlog data into class files...\n');

  classNames.forEach(className => {
    const mergedContent = createMergedClassFile(className);
    const outputPath = path.join(CLASSES_DIR, `${className}.questlog.ts`);
    fs.writeFileSync(outputPath, mergedContent);
    console.log(`✓ Created ${outputPath}`);
  });

  console.log('\n✓ All questlog data merged successfully!');
  console.log('\nNext steps:');
  console.log('1. Review the generated .questlog.ts files');
  console.log('2. Copy descriptions/tags from existing files');
  console.log('3. Replace existing .ts files when ready');
}

main();
