const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../src/generated/prisma/client");
const config = require("dotenv");

config.config({ path: require("path").resolve(process.cwd(), ".env.local") });
config.config({ path: require("path").resolve(process.cwd(), ".env") });

const connectionString = process.env.DATABASE_URL || process.env.BAHIONDB_POSTGRES_URL || "";

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function findPlaceholders() {
  console.log('🔍 Recherche de tous les placeholders Questlog...\n');

  const abilities = await prisma.ability.findMany({
    where: { levels: { not: null } },
    select: { id: true, name: true, description: true },
    take: 20
  });

  const placeholders = new Set();

  abilities.forEach(ability => {
    const matches = ability.description?.match(/\{[a-z_]+:[^}]+\}/gi) || [];
    matches.forEach(match => placeholders.add(match));
  });

  console.log(`\n📊 Trouvé ${placeholders.size} placeholders Questlog uniques:\n`);

  Array.from(placeholders).sort().forEach(ph => {
    console.log(`  - ${ph}`);
  });

  await prisma.$disconnect();
}

findPlaceholders().catch(console.error);
