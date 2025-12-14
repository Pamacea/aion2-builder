-- AlterTable
ALTER TABLE "Ability" ADD COLUMN     "damagePerSecond" INTEGER,
ADD COLUMN     "damagePerSecondModifier" INTEGER,
ADD COLUMN     "damagePerSecondModifiers" JSONB;

-- AlterTable
ALTER TABLE "Passive" ADD COLUMN     "damagePerSecond" INTEGER,
ADD COLUMN     "damagePerSecondModifier" INTEGER,
ADD COLUMN     "damagePerSecondModifiers" JSONB;

-- AlterTable
ALTER TABLE "Stigma" ADD COLUMN     "damagePerSecond" INTEGER,
ADD COLUMN     "damagePerSecondModifier" INTEGER,
ADD COLUMN     "damagePerSecondModifiers" JSONB;
