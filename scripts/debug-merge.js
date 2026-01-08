const fs = require('fs');
const path = require('path');

const CLASSES_DIR = path.join(__dirname, '../src/data/classes');
const content = fs.readFileSync(path.join(CLASSES_DIR, 'assassin.ts'), 'utf8');

// Test the regex
const regex = /description: `(`[\s\S]*?`)`,/g;
let match;
let matchCount = 0;

while ((match = regex.exec(content)) !== null) {
  matchCount++;
  console.log(`\nMatch ${matchCount}:`);
  console.log(`  Position: ${match.index}`);
  console.log(`  Description: ${match[1].substring(0, 50)}...`);

  // Check for name before
  const beforeText = content.substring(Math.max(0, match.index - 200), match.index);
  const nameMatch = beforeText.match(/name: `([^`]+)`,[\s\S]*?$/m);
  console.log(`  Name found: ${nameMatch ? nameMatch[1] : 'NONE'}`);
}

console.log(`\nTotal matches: ${matchCount}`);
