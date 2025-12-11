import { PrismaClient } from "generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { tagsList } from "data/tags";
import { classesData } from "data/classes";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding TAGS...");

  // --- Seed TAGS ---
  for (const tag of tagsList) {
    await prisma.tag.upsert({
      where: { name: tag },
      update: {},
      create: { name: tag },
    });
  }

  console.log("🌱 Seeding CLASSES...");

  // --- Seed CLASSES ---
  for (const c of classesData) {
    const existingTags = await prisma.tag.findMany({
      where: { name: { in: c.tags.map((t) => t.toLowerCase()) } },
    });

    await prisma.class.upsert({
      where: { name: c.name },
      update: {},
      create: {
        name: c.name,
        iconUrl: c.iconUrl,
        bannerUrl: c.bannerUrl,
        characterUrl: c.characterURL,
        description: c.description,
        tags: {
          connect: existingTags.map((tag) => ({ id: tag.id })),
        },
      },
    });
  }

  console.log("🌱 Seeding BUILDS...");

    // --- Seed BUILDS ---
  for (const c of classesData) {
    const classRecord = await prisma.class.findUnique({
      where: { name: c.name },
    });

    if (!classRecord) {
      console.warn(`⚠️ Classe "${c.name}" non trouvée, skipping build...`);
      continue;
    }

    const buildName = `Starter Build - ${c.name.charAt(0).toUpperCase()}${c.name.slice(1)}`;

    const existingBuild = await prisma.build.findFirst({
      where: {
        name: buildName,
        classId: classRecord.id,
      },
    });

    if (!existingBuild) {
      await prisma.build.create({
        data: {
          name: buildName,
          classId: classRecord.id,
          baseSP: 231,
          extraSP: 0,
          baseSTP: 40,
          extraSTP: 0,
          abilities: { create: [] },
          passives: { create: [] },
          stigmas: { create: [] },
        },
      });
      console.log(`✅ Build "${buildName}" seeded for class "${c.name}"`);
    } else {
      console.log(`⚠️ Build "${buildName}" already exists for class "${c.name}", skipping.`);
    }
  }

  console.log("✅ All data seeded successfully!");
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
