const fs = require('fs');
const path = require('path');

const CLASSES_DIR = path.join(__dirname, '../src/data/classes');

console.log('🔍 Diagnostic des placeholders dans les fichiers de classes\n');

// Lire tous les fichiers de classes
const files = fs.readdirSync(CLASSES_DIR)
  .filter(f => f.endsWith('.ts'))
  .map(f => path.join(CLASSES_DIR, f));

let totalSkills = 0;
let skillsWithParentheses = 0;
let skillsWithBraces = 0;
let placeholderPatterns = new Map();
let examples = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Trouver tous les placeholders avec parenthèses: (abe:...), (se:...), etc.
  const parenthesesMatches = content.match(/\([a-z_]+:[^)]+\)/gi) || [];

  // Trouver tous les placeholders avec accolades: {abe:...}, {se:...}, etc.
  const bracesMatches = content.match(/\{[a-z_]+:[^}]+\}/gi) || [];

  if (parenthesesMatches.length > 0 || bracesMatches.length > 0) {
    totalSkills++;

    // Extraire le nom de la classe
    const className = path.basename(file, '.ts');

    if (parenthesesMatches.length > 0) {
      skillsWithParentheses++;

      // Analyser les patterns
      parenthesesMatches.forEach(match => {
        const type = match.match(/\(([a-z_]+):/)?.[1] || 'unknown';
        if (!placeholderPatterns.has(type)) {
          placeholderPatterns.set(type, { count: 0, examples: [] });
        }
        placeholderPatterns.get(type).count++;

        if (placeholderPatterns.get(type).examples.length < 3) {
          placeholderPatterns.get(type).examples.push({
            class: className,
            placeholder: match
          });
        }
      });

      // Garder quelques exemples
      if (examples.length < 5) {
        examples.push({
          class: className,
          placeholders: parenthesesMatches.slice(0, 2)
        });
      }
    }

    if (bracesMatches.length > 0) {
      skillsWithBraces++;
    }
  }
});

console.log('📊 RÉSUMÉ:\n');
console.log(`   Total skills analysés: ${totalSkills}`);
console.log(`   Skills avec parenthèses (): ${skillsWithParentheses}`);
console.log(`   Skills avec accolades {}: ${skillsWithBraces}\n`);

console.log('🔧 PATTERNS TROUVÉS:\n');
const sortedPatterns = Array.from(placeholderPatterns.entries())
  .sort((a, b) => b[1].count - a[1].count);

sortedPatterns.forEach(([type, info]) => {
  console.log(`   ${type}: ${info.count} occurrences`);
  info.examples.slice(0, 2).forEach(ex => {
    console.log(`      ${ex.class}: ${ex.placeholder}`);
  });
  console.log('');
});

if (examples.length > 0) {
  console.log('📝 EXEMLES DE CLASSES AVEC PARENTHÈSES:\n');
  examples.slice(0, 3).forEach(ex => {
    console.log(`   ${ex.class}:`);
    ex.placeholders.forEach(ph => {
      console.log(`      ${ph}`);
    });
    console.log('');
  });
}

console.log('✅ Diagnostic terminé!\n');
