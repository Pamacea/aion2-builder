-- AlterTable
ALTER TABLE "Ability" ADD COLUMN     "criticalHit" INTEGER,
ADD COLUMN     "criticalHitModifier" INTEGER;

-- AlterTable
ALTER TABLE "Passive" ADD COLUMN     "criticalHit" INTEGER,
ADD COLUMN     "criticalHitModifier" INTEGER,
ADD COLUMN     "impactTypeChance" INTEGER,
ADD COLUMN     "impactTypeChanceModifier" INTEGER,
ADD COLUMN     "perfect" DOUBLE PRECISION,
ADD COLUMN     "perfectModifier" DOUBLE PRECISION,
ADD COLUMN     "smite" DOUBLE PRECISION,
ADD COLUMN     "smiteModifier" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Stigma" ADD COLUMN     "criticalHit" INTEGER,
ADD COLUMN     "criticalHitModifier" INTEGER,
ADD COLUMN     "impactTypeChance" INTEGER,
ADD COLUMN     "impactTypeChanceModifier" INTEGER;
