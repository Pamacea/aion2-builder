import { PrismaPg } from "@prisma/adapter-pg";
import { classesData } from "data/classes/index";
import { spellTagsList } from "data/spellTags";
import { tagsList } from "data/tags";
import { config } from "dotenv";
import { PrismaClient } from "generated/prisma/client";
import { resolve } from "path";
import { DaevanionRune } from "../src/types/daevanion.type";

// Charger les variables d'environnement depuis .env.local puis .env
config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

// Utiliser DATABASE_URL en priorité, ou BAHIONDB_POSTGRES_URL en fallback
// IMPORTANT: Ne PAS utiliser les URLs Prisma Accelerate avec PrismaPg adapter
const connectionString = process.env.DATABASE_URL || 
                        process.env.BAHIONDB_POSTGRES_URL || 
                        "";

if (!connectionString || connectionString === "") {
  console.error("❌ No DATABASE_URL found!");
  console.error("Required: DATABASE_URL environment variable with postgres:// or postgresql://");
  console.error("Do NOT use Prisma Accelerate URL (prisma://) with PrismaPg adapter");
  process.exit(1);
}

// Vérifier que ce n'est pas une URL Prisma Accelerate
if (connectionString.startsWith("prisma://") || connectionString.startsWith("prisma+postgres://")) {
  console.error("❌ Prisma Accelerate URL detected. PrismaPg adapter requires direct PostgreSQL URL.");
  console.error("Please use BAHION_POSTGRES_URL or DATABASE_URL with postgres:// or postgresql://");
  process.exit(1);
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding data...");

  // --- Seed TAGS ---
  for (const tag of tagsList) {
    await prisma.tag.upsert({
      where: { name: tag },
      update: {},
      create: { name: tag },
    });
  }

  // --- Seed SPELL TAGS ---
  for (const spellTag of spellTagsList) {
   await prisma.spellTag.upsert({
     where: { name: spellTag },
     update: {},
     create: { name: spellTag },
   });
 }

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
          damageBoost: "damageBoost" in ability ? ability.damageBoost : undefined,
          damageBoostModifier: "damageBoostModifier" in ability ? ability.damageBoostModifier : undefined,
          damageBoostModifiers: "damageBoostModifiers" in ability && ability.damageBoostModifiers ? ability.damageBoostModifiers : undefined,
          damageTolerance: "damageTolerance" in ability ? ability.damageTolerance : undefined,
          damageToleranceModifier: "damageToleranceModifier" in ability ? ability.damageToleranceModifier : undefined,
          damageToleranceModifiers: "damageToleranceModifiers" in ability && ability.damageToleranceModifiers ? ability.damageToleranceModifiers : undefined,
          healMin: "healMin" in ability ? ability.healMin : undefined,
          healMinModifier: "healMinModifier" in ability ? ability.healMinModifier : undefined,
          healMinModifiers: "healMinModifiers" in ability && ability.healMinModifiers ? ability.healMinModifiers : undefined,
          healMax: "healMax" in ability ? ability.healMax : undefined,
          healMaxModifier: "healMaxModifier" in ability ? ability.healMaxModifier : undefined,
          healMaxModifiers: "healMaxModifiers" in ability && ability.healMaxModifiers ? ability.healMaxModifiers : undefined,
          healBoost: "healBoost" in ability ? ability.healBoost : undefined,
          healBoostModifier: "healBoostModifier" in ability ? ability.healBoostModifier : undefined,
          healBoostModifiers: "healBoostModifiers" in ability && ability.healBoostModifiers ? ability.healBoostModifiers : undefined,
          incomingHeal: "incomingHeal" in ability ? ability.incomingHeal : undefined,
          incomingHealModifier: "incomingHealModifier" in ability ? ability.incomingHealModifier : undefined,
          incomingHealModifiers: "incomingHealModifiers" in ability && ability.incomingHealModifiers ? ability.incomingHealModifiers : undefined,
          minMP: "minMP" in ability ? ability.minMP : undefined,
          minMPModifier: "minMPModifier" in ability ? ability.minMPModifier : undefined,
          minMPModifiers: "minMPModifiers" in ability && ability.minMPModifiers ? ability.minMPModifiers : undefined,
          maxHP: "maxHP" in ability ? ability.maxHP : undefined,
          maxHPModifier: "maxHPModifier" in ability ? ability.maxHPModifier : undefined,
          maxHPModifiers: "maxHPModifiers" in ability && ability.maxHPModifiers ? ability.maxHPModifiers : undefined,
          minHP: "minHP" in ability ? ability.minHP : undefined,
          minHPModifier: "minHPModifier" in ability ? ability.minHPModifier : undefined,
          minHPModifiers: "minHPModifiers" in ability && ability.minHPModifiers ? ability.minHPModifiers : undefined,
          maxMP: "maxMP" in ability ? ability.maxMP : undefined,
          maxMPModifier: "maxMPModifier" in ability ? ability.maxMPModifier : undefined,
          maxMPModifiers: "maxMPModifiers" in ability && ability.maxMPModifiers ? ability.maxMPModifiers : undefined,
          criticalHitResist: "criticalHitResist" in ability ? ability.criticalHitResist : undefined,
          criticalHitResistModifier: "criticalHitResistModifier" in ability ? ability.criticalHitResistModifier : undefined,
          statusEffectResist: "statusEffectResist" in ability ? ability.statusEffectResist : undefined,
          statusEffectResistModifier: "statusEffectResistModifier" in ability ? ability.statusEffectResistModifier : undefined,
          impactTypeResist: "impactTypeResist" in ability ? ability.impactTypeResist : undefined,
          impactTypeResistModifier: "impactTypeResistModifier" in ability ? ability.impactTypeResistModifier : undefined,
          attack: "attack" in ability ? ability.attack : undefined,
          attackModifier: "attackModifier" in ability ? ability.attackModifier : undefined,
          defense: "defense" in ability ? ability.defense : undefined,
          defenseModifier: "defenseModifier" in ability ? ability.defenseModifier : undefined,
          blockDamage: "blockDamage" in ability ? ability.blockDamage : undefined,
          blockDamageModifier: "blockDamageModifier" in ability ? ability.blockDamageModifier : undefined,
          blockDamageModifiers: "blockDamageModifiers" in ability && ability.blockDamageModifiers ? ability.blockDamageModifiers : undefined,
          damagePerSecond: "damagePerSecond" in ability ? ability.damagePerSecond : undefined,
          damagePerSecondModifier: "damagePerSecondModifier" in ability ? ability.damagePerSecondModifier : undefined,
          damagePerSecondModifiers: "damagePerSecondModifiers" in ability && ability.damagePerSecondModifiers ? ability.damagePerSecondModifiers : undefined,
          staggerDamage: "staggerDamage" in ability ? ability.staggerDamage : undefined,
          manaCost: "manaCost" in ability ? ability.manaCost : undefined,
          manaRegen: "manaRegen" in ability ? ability.manaRegen : undefined,
          range: "range" in ability ? ability.range : 20,
          area: "area" in ability ? ability.area : 4,
          castingDuration: "castingDuration" in ability ? ability.castingDuration : "Instant Cast",
          cooldown: "cooldown" in ability ? ability.cooldown : "Instant Cast",
          target: "target" in ability ? ability.target : "Single Target",
          condition: "condition" in ability && Array.isArray(ability.condition) ? ability.condition : [],
          effectCondition: "effectCondition" in ability ? ability.effectCondition : undefined,
          chargeLevels: "chargeLevels" in ability ? ability.chargeLevels : undefined,
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
          // Delete all existing specialty choices for this ability first
          await prisma.specialtyChoice.deleteMany({
            where: {
              abilityId: createdAbility.id,
            },
          });

          // Create all specialty choices
          for (const specialtyChoice of ability.specialtyChoices) {
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

      // --- Seed CHAIN SKILLS for abilities ---
      if (c.abilities && c.abilities.length > 0) {
        for (const ability of c.abilities) {
          // Find the parent ability
          const parentAbility = await prisma.ability.findFirst({
            where: {
              name: ability.name,
              classId: classRecord.id,
            },
          });

          if (parentAbility && ability.chainSkills && ability.chainSkills.length > 0) {
            for (const chainSkillName of ability.chainSkills) {
              const chainSkillAbility = await prisma.ability.findFirst({
                where: {
                  name: chainSkillName,
                  classId: classRecord.id,
                },
              });

              if (chainSkillAbility) {
                const existingChainSkill = await prisma.chainSkill.findFirst({
                  where: {
                    parentAbilityId: parentAbility.id,
                    chainAbilityId: chainSkillAbility.id,
                  },
                });

                if (!existingChainSkill) {
                  await prisma.chainSkill.create({
                    data: {
                      parentAbilityId: parentAbility.id,
                      chainAbilityId: chainSkillAbility.id,
                    },
                  });
                }
              }
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
          damageBoost: "damageBoost" in stigma ? stigma.damageBoost : undefined,
          damageBoostModifier: "damageBoostModifier" in stigma ? stigma.damageBoostModifier : undefined,
          damageBoostModifiers: "damageBoostModifiers" in stigma && stigma.damageBoostModifiers ? stigma.damageBoostModifiers : undefined,
          damageTolerance: "damageTolerance" in stigma ? stigma.damageTolerance : undefined,
          damageToleranceModifier: "damageToleranceModifier" in stigma ? stigma.damageToleranceModifier : undefined,
          damageToleranceModifiers: "damageToleranceModifiers" in stigma && stigma.damageToleranceModifiers ? stigma.damageToleranceModifiers : undefined,
          healMin: "healMin" in stigma ? stigma.healMin : undefined,
          healMinModifier: "healMinModifier" in stigma ? stigma.healMinModifier : undefined,
          healMinModifiers: "healMinModifiers" in stigma && stigma.healMinModifiers ? stigma.healMinModifiers : undefined,
          healMax: "healMax" in stigma ? stigma.healMax : undefined,
          healMaxModifier: "healMaxModifier" in stigma ? stigma.healMaxModifier : undefined,
          healMaxModifiers: "healMaxModifiers" in stigma && stigma.healMaxModifiers ? stigma.healMaxModifiers : undefined,
          healBoost: "healBoost" in stigma ? stigma.healBoost : undefined,
          healBoostModifier: "healBoostModifier" in stigma ? stigma.healBoostModifier : undefined,
          healBoostModifiers: "healBoostModifiers" in stigma && stigma.healBoostModifiers ? stigma.healBoostModifiers : undefined,
          incomingHeal: "incomingHeal" in stigma ? stigma.incomingHeal : undefined,
          incomingHealModifier: "incomingHealModifier" in stigma ? stigma.incomingHealModifier : undefined,
          incomingHealModifiers: "incomingHealModifiers" in stigma && stigma.incomingHealModifiers ? stigma.incomingHealModifiers : undefined,
          minMP: "minMP" in stigma ? stigma.minMP : undefined,
          minMPModifier: "minMPModifier" in stigma ? stigma.minMPModifier : undefined,
          minMPModifiers: "minMPModifiers" in stigma && stigma.minMPModifiers ? stigma.minMPModifiers : undefined,
          maxHP: "maxHP" in stigma ? stigma.maxHP : undefined,
          maxHPModifier: "maxHPModifier" in stigma ? stigma.maxHPModifier : undefined,
          maxHPModifiers: "maxHPModifiers" in stigma && stigma.maxHPModifiers ? stigma.maxHPModifiers : undefined,
          minHP: "minHP" in stigma ? stigma.minHP : undefined,
          minHPModifier: "minHPModifier" in stigma ? stigma.minHPModifier : undefined,
          minHPModifiers: "minHPModifiers" in stigma && stigma.minHPModifiers ? stigma.minHPModifiers : undefined,
          maxMP: "maxMP" in stigma ? stigma.maxMP : undefined,
          maxMPModifier: "maxMPModifier" in stigma ? stigma.maxMPModifier : undefined,
          maxMPModifiers: "maxMPModifiers" in stigma && stigma.maxMPModifiers ? stigma.maxMPModifiers : undefined,
          criticalHitResist: "criticalHitResist" in stigma ? stigma.criticalHitResist : undefined,
          criticalHitResistModifier: "criticalHitResistModifier" in stigma ? stigma.criticalHitResistModifier : undefined,
          statusEffectResist: "statusEffectResist" in stigma ? stigma.statusEffectResist : undefined,
          statusEffectResistModifier: "statusEffectResistModifier" in stigma ? stigma.statusEffectResistModifier : undefined,
          impactTypeResist: "impactTypeResist" in stigma ? stigma.impactTypeResist : undefined,
          impactTypeResistModifier: "impactTypeResistModifier" in stigma ? stigma.impactTypeResistModifier : undefined,
          attack: "attack" in stigma ? stigma.attack : undefined,
          attackModifier: "attackModifier" in stigma ? stigma.attackModifier : undefined,
          defense: "defense" in stigma ? stigma.defense : undefined,
          defenseModifier: "defenseModifier" in stigma ? stigma.defenseModifier : undefined,
          blockDamage: "blockDamage" in stigma ? stigma.blockDamage : undefined,
          blockDamageModifier: "blockDamageModifier" in stigma ? stigma.blockDamageModifier : undefined,
          blockDamageModifiers: "blockDamageModifiers" in stigma && stigma.blockDamageModifiers ? stigma.blockDamageModifiers : undefined,
          damagePerSecond: "damagePerSecond" in stigma ? stigma.damagePerSecond : undefined,
          damagePerSecondModifier: "damagePerSecondModifier" in stigma ? stigma.damagePerSecondModifier : undefined,
          damagePerSecondModifiers: "damagePerSecondModifiers" in stigma && stigma.damagePerSecondModifiers ? stigma.damagePerSecondModifiers : undefined,
          staggerDamage: "staggerDamage" in stigma ? stigma.staggerDamage : undefined,
          manaCost: "manaCost" in stigma ? stigma.manaCost : undefined,
          manaRegen: "manaRegen" in stigma ? stigma.manaRegen : undefined,
          range: "range" in stigma ? stigma.range : 20,
          area: "area" in stigma ? stigma.area : 4,
          castingDuration: "castingDuration" in stigma ? stigma.castingDuration : "Instant Cast",
          cooldown: "cooldown" in stigma ? stigma.cooldown : "Instant Cast",
          target: "target" in stigma ? stigma.target : "Single Target",
          condition: "condition" in stigma && Array.isArray(stigma.condition) ? stigma.condition : [],
          effectCondition: "effectCondition" in stigma ? stigma.effectCondition : undefined,
          chargeLevels: "chargeLevels" in stigma && stigma.chargeLevels ? stigma.chargeLevels : "",
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
          // Delete all existing specialty choices for this stigma first
          await prisma.specialtyChoice.deleteMany({
            where: {
              stigmaId: createdStigma.id,
            },
          });

          // Create all specialty choices
          for (const specialtyChoice of stigma.specialtyChoices) {
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
          blockDamage: "blockDamage" in passive ? passive.blockDamage : undefined,
          blockDamageModifier: "blockDamageModifier" in passive ? passive.blockDamageModifier : undefined,
          blockDamageModifiers: "blockDamageModifiers" in passive && passive.blockDamageModifiers ? passive.blockDamageModifiers : undefined,
          damagePerSecond: "damagePerSecond" in passive ? passive.damagePerSecond : undefined,
          damagePerSecondModifier: "damagePerSecondModifier" in passive ? passive.damagePerSecondModifier : undefined,
          damagePerSecondModifiers: "damagePerSecondModifiers" in passive && passive.damagePerSecondModifiers ? passive.damagePerSecondModifiers : undefined,
          staggerDamage: "staggerDamage" in passive ? passive.staggerDamage : undefined,
          manaCost: "manaCost" in passive ? passive.manaCost : undefined,
          manaRegen: "manaRegen" in passive ? passive.manaRegen : undefined,
          range: "range" in passive ? passive.range : 20,
          castingDuration: passive.castingDuration ?? "Instant Cast",
          cooldown: passive.cooldown ?? "Instant Cast",
          target: passive.target ?? "Single Target",
          effectCondition: "effectCondition" in passive ? passive.effectCondition : undefined,
          chargeLevels: "chargeLevels" in passive ? passive.chargeLevels : undefined,
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

  // Helper function to seed runes for a path
  const seedDaevanionPath = async (pathName: string, runes: (DaevanionRune | null)[]) => {
    let count = 0;
    for (const rune of runes) {
      if (!rune) continue;
      
      await prisma.daevanionRune.upsert({
        where: {
          path_slotId: {
            path: rune.path,
            slotId: rune.slotId,
          },
        },
        update: {},
        create: {
          slotId: rune.slotId,
          path: rune.path,
          rarity: rune.rarity,
          name: rune.name,
          description: rune.description,
          positionX: rune.position?.x ?? 0,
          positionY: rune.position?.y ?? 0,
          prerequisites: rune.prerequisites || [],
          stats: rune.stats ? JSON.parse(JSON.stringify(rune.stats)) : null,
        },
      });
      count++;
    }
    return count;
  };

  // --- Seed DAEVANION RUNES ---
  const { nezekanRunes } = await import("../src/data/daevanion/nezekan");
  const { zikelRunes } = await import("../src/data/daevanion/zikel");
  const { vaizelRunes } = await import("../src/data/daevanion/vaizel");
  const { trinielRunes } = await import("../src/data/daevanion/triniel");
  const { arielRunes } = await import("../src/data/daevanion/ariel");
  const { azphelRunes } = await import("../src/data/daevanion/azphel");
  
  await seedDaevanionPath("nezekan", nezekanRunes);
  await seedDaevanionPath("zikel", zikelRunes);
  await seedDaevanionPath("vaizel", vaizelRunes);
  await seedDaevanionPath("triniel", trinielRunes);
  await seedDaevanionPath("ariel", arielRunes);
  await seedDaevanionPath("azphel", azphelRunes);

    // --- Seed BUILDS ---
  for (const c of classesData) {
    const classRecord = await prisma.class.findUnique({
      where: { name: c.name },
      include: {
        abilities: true,
        passives: true,
      },
    });

    if (!classRecord) continue;

    const buildName = `Starter Build - ${c.name.charAt(0).toUpperCase()}${c.name.slice(1)}`;

    const existingBuild = await prisma.build.findFirst({
      where: {
        name: buildName,
        classId: classRecord.id,
      },
    });

    if (!existingBuild) {
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
    }
  }

  console.log("✅ Seeding completed!");
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
