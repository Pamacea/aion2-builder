/*
  Warnings:

  - You are about to drop the column `category` on the `Ability` table. All the data in the column will be lost.
  - You are about to drop the column `targetRange` on the `Ability` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Ability` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ability" DROP COLUMN "category",
DROP COLUMN "targetRange",
DROP COLUMN "type",
ADD COLUMN     "area" INTEGER DEFAULT 4,
ADD COLUMN     "baseCost" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "baseCostModifier" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "damageMaxModifier" INTEGER,
ADD COLUMN     "damageMinModifier" INTEGER,
ADD COLUMN     "manaCost" INTEGER,
ADD COLUMN     "manaRegen" INTEGER,
ADD COLUMN     "range" INTEGER DEFAULT 20,
ADD COLUMN     "staggerDamage" INTEGER,
ADD COLUMN     "target" TEXT DEFAULT 'Single Target',
ALTER COLUMN "maxLevel" SET DEFAULT 10;

-- AlterTable
ALTER TABLE "Passive" ADD COLUMN     "area" INTEGER DEFAULT 4,
ADD COLUMN     "attack" INTEGER,
ADD COLUMN     "attackModifier" INTEGER,
ADD COLUMN     "baseCost" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "baseCostModifier" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "castingDuration" TEXT DEFAULT 'Instant Cast',
ADD COLUMN     "cooldown" TEXT DEFAULT 'Instant Cast',
ADD COLUMN     "criticalHitResist" INTEGER,
ADD COLUMN     "criticalHitResistModifier" INTEGER,
ADD COLUMN     "damageBoost" INTEGER,
ADD COLUMN     "damageMax" INTEGER,
ADD COLUMN     "damageMaxModifier" INTEGER,
ADD COLUMN     "damageMin" INTEGER,
ADD COLUMN     "damageMinModifier" INTEGER,
ADD COLUMN     "damageTolerance" INTEGER,
ADD COLUMN     "defense" INTEGER,
ADD COLUMN     "defenseModifier" INTEGER,
ADD COLUMN     "effect" TEXT,
ADD COLUMN     "healBoost" INTEGER,
ADD COLUMN     "healBoostModifier" INTEGER,
ADD COLUMN     "healMax" INTEGER,
ADD COLUMN     "healMaxModifier" INTEGER,
ADD COLUMN     "healMin" INTEGER,
ADD COLUMN     "healMinModifier" INTEGER,
ADD COLUMN     "impactTypeResist" INTEGER,
ADD COLUMN     "impactTypeResistModifier" INTEGER,
ADD COLUMN     "incomingHeal" INTEGER,
ADD COLUMN     "incomingHealModifier" INTEGER,
ADD COLUMN     "isMobile" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isNontarget" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "manaCost" INTEGER,
ADD COLUMN     "manaRegen" INTEGER,
ADD COLUMN     "maxHP" INTEGER,
ADD COLUMN     "maxHPModifier" INTEGER,
ADD COLUMN     "maxMP" INTEGER,
ADD COLUMN     "maxMPModifier" INTEGER,
ADD COLUMN     "range" INTEGER DEFAULT 20,
ADD COLUMN     "staggerDamage" INTEGER,
ADD COLUMN     "statusEffectResist" INTEGER,
ADD COLUMN     "statusEffectResistModifier" INTEGER,
ADD COLUMN     "target" TEXT DEFAULT 'Single Target',
ALTER COLUMN "maxLevel" SET DEFAULT 10;

-- AlterTable
ALTER TABLE "Stigma" ADD COLUMN     "area" INTEGER DEFAULT 4,
ADD COLUMN     "baseCostModifier" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "castingDuration" TEXT DEFAULT 'Instant Cast',
ADD COLUMN     "cooldown" TEXT DEFAULT 'Instant Cast',
ADD COLUMN     "damageMax" INTEGER,
ADD COLUMN     "damageMaxModifier" INTEGER,
ADD COLUMN     "damageMin" INTEGER,
ADD COLUMN     "damageMinModifier" INTEGER,
ADD COLUMN     "isMobile" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isNontarget" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "manaCost" INTEGER,
ADD COLUMN     "manaRegen" INTEGER,
ADD COLUMN     "range" INTEGER DEFAULT 20,
ADD COLUMN     "staggerDamage" INTEGER,
ADD COLUMN     "target" TEXT DEFAULT 'Single Target',
ALTER COLUMN "baseCost" SET DEFAULT 1;

-- CreateTable
CREATE TABLE "SpellTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SpellTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SpellTagToStigma" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SpellTagToStigma_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AbilityToSpellTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AbilityToSpellTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PassiveToSpellTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PassiveToSpellTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpellTag_name_key" ON "SpellTag"("name");

-- CreateIndex
CREATE INDEX "_SpellTagToStigma_B_index" ON "_SpellTagToStigma"("B");

-- CreateIndex
CREATE INDEX "_AbilityToSpellTag_B_index" ON "_AbilityToSpellTag"("B");

-- CreateIndex
CREATE INDEX "_PassiveToSpellTag_B_index" ON "_PassiveToSpellTag"("B");

-- AddForeignKey
ALTER TABLE "_SpellTagToStigma" ADD CONSTRAINT "_SpellTagToStigma_A_fkey" FOREIGN KEY ("A") REFERENCES "SpellTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpellTagToStigma" ADD CONSTRAINT "_SpellTagToStigma_B_fkey" FOREIGN KEY ("B") REFERENCES "Stigma"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AbilityToSpellTag" ADD CONSTRAINT "_AbilityToSpellTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Ability"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AbilityToSpellTag" ADD CONSTRAINT "_AbilityToSpellTag_B_fkey" FOREIGN KEY ("B") REFERENCES "SpellTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PassiveToSpellTag" ADD CONSTRAINT "_PassiveToSpellTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Passive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PassiveToSpellTag" ADD CONSTRAINT "_PassiveToSpellTag_B_fkey" FOREIGN KEY ("B") REFERENCES "SpellTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
