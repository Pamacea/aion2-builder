import { PrismaClient } from "generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding classes...");

  const classesData = [
    {
      name: "Gladiator",
      description:
        "Frontline melee bruiser with sweeping AoE strikes and relentless pressure.",
    },
    {
      name: "Templar",
      description:
        "Shielded tank specializing in control and protection to anchor your team.",
    },
    {
      name: "Assassin",
      description:
        "Stealthy finisher with explosive burst, mobility, and lethal single-target focus.",
    },
    {
      name: "Ranger",
      description:
        "Agile ranged damage dealer using precision shots, traps and kiting mastery.",
    },
    {
      name: "Sorcerer",
      description:
        "Master of elemental magic and ranged damage, unleashing devastating magical nukes.",
    },
    {
      name: "Elementalist",
      description:
        "Summons elemental spirits to control space, disrupt foes, and apply pressure.",
    },
    {
      name: "Cleric",
      description:
        "Primary healer with potent recovery, barriers, and group-saving utility.",
    },
    {
      name: "Chanter",
      description:
        "Support hybrid amplifying allies with powerful buffs, heals, and protection.",
    },
  ];

  for (const c of classesData) {
    await prisma.class.upsert({
      where: { name: c.name },
      update: {},
      create: {
        name: c.name,
        description: c.description,
      },
    });
  }

  console.log("✅ Classes seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
