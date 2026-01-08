const fs = require('fs');
const path = require('path');

const CLASSES_DIR = path.join(__dirname, '../src/data/classes');

console.log('🔧 Removing descriptionData from Class level (should only be in skills)...\n');

const files = fs.readdirSync(CLASSES_DIR)
  .filter(f => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts');

files.forEach(file => {
  const filePath = path.join(CLASSES_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove descriptionData from Class level (between name: and tags:)
  content = content.replace(/(name: "[^"]+",[\s\S]*?)(description: `[^`]+`,)\s*descriptionData: \{[^}]+\},\s*/g, '$1$2\n');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Cleaned ${file}`);
});

console.log('\n✅ Done! Now building...');
