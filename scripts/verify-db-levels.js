const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../src/generated/prisma/client");
const config = require("dotenv");

config.config({ path: require("path").resolve(process.cwd(), ".env.local") });
config.config({ path: require("path").resolve(process.cwd(), ".env") });

const connectionString = process.env.DATABASE_URL || process.env.BAHIONDB_POSTGRES_URL || "";

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function verify() {
  console.log('🔍 Vérification des données Questlog dans la base de données...\n');

  // Vérifier les abilities avec levels
  const abilitiesWithLevels = await prisma.ability.findMany({
    where: {
      levels: {
        not: null
      }
    },
    select: {
      id: true,
      name: true,
      classId: true
    }
  });

  console.log(`✅ Abilities avec levels: ${abilitiesWithLevels.length}`);

  if (abilitiesWithLevels.length > 0) {
    // Afficher un exemple
    const sampleAbility = await prisma.ability.findFirst({
      where: { levels: { not: null } },
      select: {
        name: true,
        levels: true
      }
    });

    if (sampleAbility && sampleAbility.levels) {
      const levels = JSON.parse(JSON.stringify(sampleAbility.levels));
      console.log(`\nExemple - ${sampleAbility.name}:`);
      console.log(`  Niveaux: ${levels.length}`);
      console.log(`  Premier niveau:`, levels[0]);
      console.log(`  Dernier niveau:`, levels[levels.length - 1]);
    }
  }

  // Vérifier les passives avec levels
  const passivesWithLevels = await prisma.passive.count({
    where: {
      levels: {
        not: null
      }
    }
  });

  console.log(`\n✅ Passives avec levels: ${passivesWithLevels}`);

  // Vérifier les stigmas avec levels
  const stigmasWithLevels = await prisma.stigma.count({
    where: {
      levels: {
        not: null
      }
    }
  });

  console.log(`\n✅ Stigmas avec levels: ${stigmasWithLevels}`);

  const total = abilitiesWithLevels.length + passivesWithLevels + stigmasWithLevels;
  console.log(`\n📊 Total des skills avec données Questlog: ${total}`);

  if (total > 0) {
    console.log('\n🎉 Les données Questlog sont dans la base de données!');
  } else {
    console.log('\n❌ Aucune donnée Questlog trouvée dans la base de données.');
  }

  await prisma.$disconnect();
}

verify().catch(console.error);
