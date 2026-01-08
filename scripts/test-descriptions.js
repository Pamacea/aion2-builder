const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../src/generated/prisma/client");
const config = require("dotenv");

config.config({ path: require("path").resolve(process.cwd(), ".env.local") });
config.config({ path: require("path").resolve(process.cwd(), ".env") });

const connectionString = process.env.DATABASE_URL || process.env.BAHIONDB_POSTGRES_URL || "";

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function test() {
  console.log('🔍 Test des descriptions nettoyées...\n');

  // Récupérer une ability
  const ability = await prisma.ability.findFirst({
    where: { levels: { not: null } },
    select: {
      name: true,
      description: true
    }
  });

  if (ability) {
    console.log('Ability:', ability.name);
    console.log('\nDescription:');
    console.log(ability.description);

    if (ability.description.includes('<span')) {
      console.log('\n❌ La description contient encore du HTML!');
    } else if (ability.description.includes('{{DMG')) {
      console.log('\n✅ La description utilise le bon format de placeholders!');
    } else {
      console.log('\n⚠️  La description ne contient pas de placeholders');
    }
  }

  await prisma.$disconnect();
}

test().catch(console.error);
