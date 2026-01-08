/**
 * Benchmark suite for questlogDescriptionParser performance testing
 * Measures optimization improvements before/after changes
 */

import { parseQuestlogDescription as parseOriginal } from '../questlogDescriptionParser';
import type { AbilityType } from '@/types/schema';

// Mock skill data for testing
const createMockSkill = (id: string): AbilityType => ({
  id,
  name: `Test Skill ${id}`,
  descriptionData: {
    access: ['None'],
    placeholders: {
      'se_dmg:12345:SkillUIMinDmgsum': {
        base: { values: ['100'] },
        levels: {
          '5': { values: ['150'] },
          '10': { values: ['200'] }
        }
      },
      'se_dmg:12345:SkillUIMaxDmgsum': {
        base: { values: ['200'] },
        levels: {
          '5': { values: ['250'] },
          '10': { values: ['300'] }
        }
      },
      'se_dmg:12345:SkillUIHPHealMin': {
        base: { values: ['50'] }
      },
      'se_dmg:12345:SkillUIHPHealMax': {
        base: { values: ['100'] }
      },
      'se:67890:effect_value02:time': {
        base: { values: ['10'] }
      },
      'se:67890:effect_value02': {
        base: { values: ['5'] }
      }
    }
  }
} as unknown as AbilityType);

const testCases = [
  {
    name: 'Simple damage placeholder',
    description: 'Deals {se_dmg:12345:SkillUIMinDmgsum} to {se_dmg:12345:SkillUIMaxDmgsum} damage'
  },
  {
    name: 'Heal placeholder',
    description: 'Heals for {se_dmg:12345:SkillUIHPHealMin} to {se_dmg:12345:SkillUIHPHealMax} HP'
  },
  {
    name: 'Duration placeholder',
    description: 'Stuns target for {se:67890:effect_value02:time} seconds'
  },
  {
    name: 'Mixed placeholders',
    description: 'Deals {se_dmg:12345:SkillUIMinDmgsum} damage and heals for {se_dmg:12345:SkillUIHPHealMin} HP for {se:67890:effect_value02:time}s'
  },
  {
    name: 'Unknown placeholder',
    description: 'Applies {se:99999:effect_value02} effect'
  },
  {
    name: 'HTML content',
    description: '<span>Deals {se_dmg:12345:SkillUIMinDmgsum} damage</span>'
  },
  {
    name: 'Complex description',
    description: 'Deals {se_dmg:12345:SkillUIMinDmgsum} to {se_dmg:12345:SkillUIMaxDmgsum} damage, heals for {se_dmg:12345:SkillUIHPHealMin} to {se_dmg:12345:SkillUIHPHealMax} HP, and stuns for {se:67890:effect_value02:time}s. Additional {se:67890:effect_value02} effect applied.'
  }
];

interface BenchmarkResult {
  name: string;
  iterations: number;
  totalTime: number;
  avgTime: number;
  minTime: number;
  maxTime: number;
  opsPerSecond: number;
}

function benchmark(
  name: string,
  fn: () => void,
  iterations: number = 10000
): BenchmarkResult {
  // Warmup
  for (let i = 0; i < 100; i++) {
    fn();
  }

  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    const end = performance.now();
    times.push(end - start);
  }

  const totalTime = times.reduce((a, b) => a + b, 0);
  const avgTime = totalTime / iterations;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  return {
    name,
    iterations,
    totalTime,
    avgTime,
    minTime,
    maxTime,
    opsPerSecond: 1000 / avgTime
  };
}

function runBenchmarks(): void {
  console.log('\n🚀 Starting Questlog Parser Benchmarks\n');
  console.log('=' .repeat(80));

  const skill = createMockSkill('test-skill');

  testCases.forEach((testCase, index) => {
    console.log(`\n📊 Test Case ${index + 1}: ${testCase.name}`);
    console.log('-'.repeat(80));
    console.log(`Description: "${testCase.description}"`);
    console.log();

    const result = benchmark(
      'parseQuestlogDescription',
      () => parseOriginal(testCase.description, skill, 5)
    );

    console.log(`Iterations:       ${result.iterations.toLocaleString()}`);
    console.log(`Total Time:       ${result.totalTime.toFixed(2)}ms`);
    console.log(`Average Time:     ${result.avgTime.toFixed(4)}ms`);
    console.log(`Min Time:         ${result.minTime.toFixed(4)}ms`);
    console.log(`Max Time:         ${result.maxTime.toFixed(4)}ms`);
    console.log(`Ops/Second:       ${result.opsPerSecond.toFixed(0)}`);
    console.log();

    // Show the actual output
    const output = parseOriginal(testCase.description, skill, 5);
    console.log(`Output: "${output}"`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('✅ Benchmarks Complete\n');
}

function runComparisonBenchmarks(): void {
  console.log('\n🔬 Comparative Analysis: Same Description, Different Skills\n');
  console.log('=' .repeat(80));

  const description = 'Deals {se_dmg:12345:SkillUIMinDmgsum} to {se_dmg:12345:SkillUIMaxDmgsum} damage';

  // Test with 100 different skills
  const skills = Array.from({ length: 100 }, (_, i) => createMockSkill(`skill-${i}`));

  const result = benchmark(
    'parseQuestlogDescription - 100 different skills',
    () => {
      skills.forEach((skill, i) => {
        parseOriginal(description, skill, (i % 10) + 1);
      });
    },
    1000
  );

  console.log(`Description: "${description}"`);
  console.log(`Skills: 100 different mock skills`);
  console.log();
  console.log(`Iterations:       ${result.iterations.toLocaleString()}`);
  console.log(`Total Time:       ${result.totalTime.toFixed(2)}ms`);
  console.log(`Average Time:     ${result.avgTime.toFixed(4)}ms`);
  console.log(`Ops/Second:       ${result.opsPerSecond.toFixed(0)}`);
  console.log();
  console.log('=' .repeat(80));
}

function runCacheEffectivenessTest(): void {
  console.log('\n🧪 Cache Effectiveness Test\n');
  console.log('=' .repeat(80));

  const skill = createMockSkill('cache-test');
  const description = 'Deals {se_dmg:12345:SkillUIMinDmgsum} damage';

  // Test parsing the same description multiple times
  const iterations = 10000;
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    parseOriginal(description, skill, 5);
    const end = performance.now();
    times.push(end - start);
  }

  const totalTime = times.reduce((a, b) => a + b, 0);
  const avgTime = totalTime / iterations;

  console.log(`Same description parsed ${iterations} times`);
  console.log(`Average time per parse: ${avgTime.toFixed(4)}ms`);
  console.log(`Total time: ${totalTime.toFixed(2)}ms`);
  console.log();

  // Calculate potential cache savings
  const estimatedCacheHitTime = avgTime * 0.1; // Assuming 90% faster with cache
  const estimatedSavings = totalTime - (totalTime * 0.1);
  const savingsPercentage = ((estimatedSavings / totalTime) * 100).toFixed(1);

  console.log(`💰 Estimated cache savings: ${savingsPercentage}%`);
  console.log(`   (If implementing LRU cache with ~90% hit rate)`);
  console.log();
  console.log('=' .repeat(80));
}

// Main execution
export function runAllBenchmarks(): void {
  runBenchmarks();
  runComparisonBenchmarks();
  runCacheEffectivenessTest();

  console.log('\n📈 Summary\n');
  console.log('All benchmarks completed. Review results above for optimization opportunities.');
  console.log('Key metrics to watch:');
  console.log('  • Average time per parse (target: < 0.1ms)');
  console.log('  • Ops/second (target: > 10,000)');
  console.log('  • Cache hit rate (target: > 80%)');
  console.log();
}

// Run if executed directly
if (require.main === module) {
  runAllBenchmarks();
}
