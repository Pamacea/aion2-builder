const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../src/generated/prisma/client");
const config = require("dotenv");

config.config({ path: require("path").resolve(process.cwd(), ".env.local") });
config.config({ path: require("path").resolve(process.cwd(), ".env") });

const connectionString = process.env.DATABASE_URL || process.env.BAHIONDB_POSTGRES_URL || "";

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function debug() {
  console.log('🔍 Debug des descriptions...\n');

  // Prendre un échantillon d'abilities
  const abilities = await prisma.ability.findMany({
    where: {
      levels: { not: null }
    },
    select: {
      id: true,
      name: true,
      description: true,
      levels: true
    },
    take: 3
  });

  for (const ability of abilities) {
    console.log(`\n${ability.name} (ID: ${ability.id}):`);
    console.log('Description brute:');
    console.log(ability.description);

    // Compter les accolades
    const openBraces = (ability.description.match(/\{\{/g) || []).length;
    const closeBraces = (ability.description.match(/\}\}/g) || []).length;
    console.log(`\nAccolades: ${openBraces} ouvrantes, ${closeBraces} fermantes`);

    if (openBraces !== closeBraces) {
      console.log('⚠️  Problème: nombre d\'accolades inégal!');
    }

    // Chercher les placeholders
    const placeholders = ability.description.match(/\{\{[^}]+\}\}/g) || [];
    if (placeholders.length > 0) {
      console.log(`Placeholders trouvés: ${placeholders.join(', ')}`);
    }
  }

  await prisma.$disconnect();
}

debug().catch(console.error);
