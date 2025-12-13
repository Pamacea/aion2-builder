import { PrismaPg } from "@prisma/adapter-pg";
import { classesData } from "data/classes";
import { spellTagsList } from "data/spellTags";
import { tagsList } from "data/tags";
import { PrismaClient } from "generated/prisma/client";

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

  console.log("🌱 Seeding SPELL TAGS...");

  // --- Seed SPELL TAGS ---
  for (const spellTag of spellTagsList) {
   await prisma.spellTag.upsert({
     where: { name: spellTag },
     update: {},
     create: { name: spellTag },
   });
 }

  console.log("🌱 Seeding CLASSES...");

  // --- Seed CLASSES ---
  for (const c of classesData) {
    const existingTags = await prisma.tag.findMany({
      where: { name: { in: c.tags.map((t) => t.toLowerCase()) } },
    });

    const classRecord = await prisma.class.upsert({
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

    // --- Seed ABILITIES for this class ---
    if (c.abilities && c.abilities.length > 0) {
      for (const ability of c.abilities) {
        // Get or create SpellTags for this ability
        const spellTagNames = ability.spellTag || [];
        const existingSpellTags = await prisma.spellTag.findMany({
          where: { name: { in: spellTagNames } },
        });

        // Check if ability already exists
        const existingAbility = await prisma.ability.findFirst({
          where: {
            name: ability.name,
            classId: classRecord.id,
          },
        });

        // Create or update the ability
        const abilityDataBase = {
          iconUrl: ability.iconUrl ?? undefined,
          description: ability.description ?? undefined,
          baseCost: "baseCost" in ability ? ability.baseCost : 1,
          baseCostModifier: "baseCostModifier" in ability ? ability.baseCostModifier : 2,
          maxLevel: "maxLevel" in ability ? ability.maxLevel : 10,
          damageMin: "damageMin" in ability ? ability.damageMin : undefined,
          damageMinModifier: "damageMinModifier" in ability ? ability.damageMinModifier : undefined,
          damageMinModifiers: "damageMinModifiers" in ability && ability.damageMinModifiers ? ability.damageMinModifiers : undefined,
          damageMax: "damageMax" in ability ? ability.damageMax : undefined,
          damageMaxModifier: "damageMaxModifier" in ability ? ability.damageMaxModifier : undefined,
          damageMaxModifiers: "damageMaxModifiers" in ability && ability.damageMaxModifiers ? ability.damageMaxModifiers : undefined,
          staggerDamage: "staggerDamage" in ability ? ability.staggerDamage : undefined,
          manaCost: "manaCost" in ability ? ability.manaCost : undefined,
          manaRegen: "manaRegen" in ability ? ability.manaRegen : undefined,
          range: "range" in ability ? ability.range : 20,
          isNontarget: "isNontarget" in ability ? ability.isNontarget : false,
          isMobile: "isMobile" in ability ? ability.isMobile : false,
          castingDuration: "castingDuration" in ability ? ability.castingDuration : "Instant Cast",
          cooldown: "cooldown" in ability ? ability.cooldown : "Instant Cast",
          target: "target" in ability ? ability.target : "Single Target",
          spellTag: {
            [existingAbility ? "set" : "connect"]: existingSpellTags.map((tag) => ({ id: tag.id })),
          },
        };

        const createdAbility = existingAbility
          ? await prisma.ability.update({
              where: { id: existingAbility.id },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data: abilityDataBase as any,
            })
          : await prisma.ability.create({
              data: {
                ...abilityDataBase,
                name: ability.name,
                classId: classRecord.id,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } as any,
            });

        // --- Seed SPECIALTY CHOICES for this ability ---
        if (ability.specialtyChoices && ability.specialtyChoices.length > 0) {
          for (const specialtyChoice of ability.specialtyChoices) {
            // Check if specialty choice already exists
            const existingSpecialtyChoice = await prisma.specialtyChoice.findFirst({
              where: {
                abilityId: createdAbility.id,
                unlockLevel: specialtyChoice.unlockLevel,
              },
            });

            if (existingSpecialtyChoice) {
              await prisma.specialtyChoice.update({
                where: { id: existingSpecialtyChoice.id },
                data: {
                  description: specialtyChoice.description,
                },
              });
            } else {
              await prisma.specialtyChoice.create({
                data: {
                  description: specialtyChoice.description,
                  unlockLevel: specialtyChoice.unlockLevel,
                  abilityId: createdAbility.id,
                },
              });
            }
          }
        }
      }
    }

    // --- Seed STIGMAS for this class ---
    if (c.stigmas && c.stigmas.length > 0) {
      for (const stigma of c.stigmas) {
        // Get or create SpellTags for this stigma
        const spellTagNames = stigma.spellTag || [];
        const existingSpellTags = await prisma.spellTag.findMany({
          where: { name: { in: spellTagNames } },
        });

        // Check if stigma already exists
        const existingStigma = await prisma.stigma.findFirst({
          where: {
            name: stigma.name,
            classes: {
              some: {
                id: classRecord.id,
              },
            },
          },
        });

        // Create or update the stigma
        const stigmaDataBase = {
          iconUrl: stigma.iconUrl ?? undefined,
          description: stigma.description ?? undefined,
          maxLevel: "maxLevel" in stigma ? stigma.maxLevel : 20,
          baseCost: "baseCost" in stigma ? stigma.baseCost : 1,
          baseCostModifier: "baseCostModifier" in stigma ? stigma.baseCostModifier : 2,
          damageMin: "damageMin" in stigma ? stigma.damageMin : undefined,
          damageMinModifier: "damageMinModifier" in stigma ? stigma.damageMinModifier : undefined,
          damageMinModifiers: "damageMinModifiers" in stigma && stigma.damageMinModifiers ? stigma.damageMinModifiers : undefined,
          damageMax: "damageMax" in stigma ? stigma.damageMax : undefined,
          damageMaxModifier: "damageMaxModifier" in stigma ? stigma.damageMaxModifier : undefined,
          damageMaxModifiers: "damageMaxModifiers" in stigma && stigma.damageMaxModifiers ? stigma.damageMaxModifiers : undefined,
          staggerDamage: "staggerDamage" in stigma ? stigma.staggerDamage : undefined,
          manaCost: "manaCost" in stigma ? stigma.manaCost : undefined,
          manaRegen: "manaRegen" in stigma ? stigma.manaRegen : undefined,
          range: "range" in stigma ? stigma.range : 20,
          area: "area" in stigma ? stigma.area : 4,
          isNontarget: "isNontarget" in stigma ? stigma.isNontarget : false,
          isMobile: "isMobile" in stigma ? stigma.isMobile : false,
          castingDuration: "castingDuration" in stigma ? stigma.castingDuration : "Instant Cast",
          cooldown: "cooldown" in stigma ? stigma.cooldown : "Instant Cast",
          target: "target" in stigma ? stigma.target : "Single Target",
          isShared: "isShared" in stigma ? stigma.isShared : false,
          spellTag: {
            [existingStigma ? "set" : "connect"]: existingSpellTags.map((tag) => ({ id: tag.id })),
          },
          classes: {
            [existingStigma ? "set" : "connect"]: [{ id: classRecord.id }],
          },
        };

        const createdStigma = existingStigma
          ? await prisma.stigma.update({
              where: { id: existingStigma.id },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data: stigmaDataBase as any,
            })
          : await prisma.stigma.create({
              data: {
                ...stigmaDataBase,
                name: stigma.name,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } as any,
            });

        // --- Seed SPECIALTY CHOICES for this stigma ---
        if (stigma.specialtyChoices && stigma.specialtyChoices.length > 0) {
          for (const specialtyChoice of stigma.specialtyChoices) {
            // Check if specialty choice already exists
            const existingSpecialtyChoice = await prisma.specialtyChoice.findFirst({
              where: {
                stigmaId: createdStigma.id,
                unlockLevel: specialtyChoice.unlockLevel,
              },
            });

            if (existingSpecialtyChoice) {
              await prisma.specialtyChoice.update({
                where: { id: existingSpecialtyChoice.id },
                data: {
                  description: specialtyChoice.description,
                },
              });
            } else {
              await prisma.specialtyChoice.create({
                data: {
                  description: specialtyChoice.description,
                  unlockLevel: specialtyChoice.unlockLevel,
                  stigmaId: createdStigma.id,
                },
              });
            }
          }
        }
      }
    }

    // --- Seed PASSIVES for this class ---
    if (c.passives && c.passives.length > 0) {
      for (const passive of c.passives) {
        // Get or create SpellTags for this passive
        const spellTagNames = passive.spellTag || [];
        const existingSpellTags = await prisma.spellTag.findMany({
          where: { name: { in: spellTagNames } },
        });

        // Check if passive already exists
        const existingPassive = await prisma.passive.findFirst({
          where: {
            name: passive.name,
            classId: classRecord.id,
          },
        });

        // Create or update the passive
        const passiveDataBase = {
          iconUrl: passive.iconUrl ?? undefined,
          description: passive.description ?? undefined,
          baseCost: "baseCost" in passive ? passive.baseCost : 1,
          baseCostModifier: "baseCostModifier" in passive ? passive.baseCostModifier : 2,
          maxLevel: "maxLevel" in passive ? passive.maxLevel : 10,
          damageMin: "damageMin" in passive ? passive.damageMin : undefined,
          damageMinModifier: "damageMinModifier" in passive ? passive.damageMinModifier : undefined,
          damageMinModifiers: "damageMinModifiers" in passive && passive.damageMinModifiers ? passive.damageMinModifiers : undefined,
          damageMax: "damageMax" in passive ? passive.damageMax : undefined,
          damageMaxModifier: "damageMaxModifier" in passive ? passive.damageMaxModifier : undefined,
          damageMaxModifiers: "damageMaxModifiers" in passive && passive.damageMaxModifiers ? passive.damageMaxModifiers : undefined,
          damageBoost: "damageBoost" in passive ? passive.damageBoost : undefined,
          damageTolerance: "damageTolerance" in passive ? passive.damageTolerance : undefined,
          healMin: "healMin" in passive ? passive.healMin : undefined,
          healMinModifier: "healMinModifier" in passive ? passive.healMinModifier : undefined,
          healMinModifiers: "healMinModifiers" in passive && passive.healMinModifiers ? passive.healMinModifiers : undefined,
          healMax: "healMax" in passive ? passive.healMax : undefined,
          healMaxModifier: "healMaxModifier" in passive ? passive.healMaxModifier : undefined,
          healMaxModifiers: "healMaxModifiers" in passive && passive.healMaxModifiers ? passive.healMaxModifiers : undefined,
          healBoost: "healBoost" in passive ? passive.healBoost : undefined,
          healBoostModifier: "healBoostModifier" in passive ? passive.healBoostModifier : undefined,
          incomingHeal: "incomingHeal" in passive ? passive.incomingHeal : undefined,
          incomingHealModifier: "incomingHealModifier" in passive ? passive.incomingHealModifier : undefined,
          maxHP: "maxHP" in passive ? passive.maxHP : undefined,
          maxHPModifier: "maxHPModifier" in passive ? passive.maxHPModifier : undefined,
          maxHPModifiers: "maxHPModifiers" in passive && passive.maxHPModifiers ? passive.maxHPModifiers : undefined,
          maxMP: "maxMP" in passive ? passive.maxMP : undefined,
          maxMPModifier: "maxMPModifier" in passive ? passive.maxMPModifier : undefined,
          maxMPModifiers: "maxMPModifiers" in passive && passive.maxMPModifiers ? passive.maxMPModifiers : undefined,
          criticalHitResist: "criticalHitResist" in passive ? passive.criticalHitResist : undefined,
          criticalHitResistModifier: "criticalHitResistModifier" in passive ? passive.criticalHitResistModifier : undefined,
          statusEffectResist: "statusEffectResist" in passive ? passive.statusEffectResist : undefined,
          statusEffectResistModifier: "statusEffectResistModifier" in passive ? passive.statusEffectResistModifier : undefined,
          impactTypeResist: "impactTypeResist" in passive ? passive.impactTypeResist : undefined,
          impactTypeResistModifier: "impactTypeResistModifier" in passive ? passive.impactTypeResistModifier : undefined,
          attack: "attack" in passive ? passive.attack : undefined,
          attackModifier: "attackModifier" in passive ? passive.attackModifier : undefined,
          defense: "defense" in passive ? passive.defense : undefined,
          defenseModifier: "defenseModifier" in passive ? passive.defenseModifier : undefined,
          staggerDamage: "staggerDamage" in passive ? passive.staggerDamage : undefined,
          manaCost: "manaCost" in passive ? passive.manaCost : undefined,
          manaRegen: "manaRegen" in passive ? passive.manaRegen : undefined,
          range: "range" in passive ? passive.range : 20,
          isNontarget: passive.isNontarget ?? false,
          isMobile: passive.isMobile ?? false,
          castingDuration: passive.castingDuration ?? "Instant Cast",
          cooldown: passive.cooldown ?? "Instant Cast",
          target: passive.target ?? "Single Target",
          spellTag: {
            [existingPassive ? "set" : "connect"]: existingSpellTags.map((tag) => ({ id: tag.id })),
          },
        };

        await (existingPassive
          ? prisma.passive.update({
              where: { id: existingPassive.id },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data: passiveDataBase as any,
            })
          : prisma.passive.create({
              data: {
                ...passiveDataBase,
                name: passive.name,
                classId: classRecord.id,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } as any,
            }));
      }
    }
  }

  console.log("🌱 Seeding BUILDS...");

    // --- Seed BUILDS ---
  for (const c of classesData) {
    const classRecord = await prisma.class.findUnique({
      where: { name: c.name },
      include: {
        abilities: true,
        passives: true,
      },
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
      // Get all abilities and passives for this class
      const classAbilities = classRecord.abilities || [];
      const classPassives = classRecord.passives || [];

      await prisma.build.create({
        data: {
          name: buildName,
          classId: classRecord.id,
          baseSP: 231,
          extraSP: 0,
          baseSTP: 40,
          extraSTP: 0,
          abilities: {
            create: classAbilities.map((ability) => ({
              abilityId: ability.id,
              level: 1,
              maxLevel: ability.maxLevel ?? 20,
              activeSpecialtyChoiceIds: [],
            })),
          },
          passives: {
            create: classPassives.map((passive) => ({
              passiveId: passive.id,
              level: 1,
              maxLevel: passive.maxLevel ?? 20,
            })),
          },
          stigmas: { create: [] },
        },
      });
      console.log(`✅ Build "${buildName}" seeded for class "${c.name}" with ${classAbilities.length} abilities and ${classPassives.length} passives`);
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
