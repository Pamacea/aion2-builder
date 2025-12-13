-- AlterTable
ALTER TABLE "Passive" ADD COLUMN     "damageMaxModifiers" JSONB,
ADD COLUMN     "damageMinModifiers" JSONB,
ADD COLUMN     "healBoostModifiers" INTEGER,
ADD COLUMN     "healMaxModifiers" JSONB,
ADD COLUMN     "healMinModifiers" JSONB,
ADD COLUMN     "incomingHealModifiers" INTEGER,
ADD COLUMN     "maxHPModifiers" JSONB,
ADD COLUMN     "maxMPModifiers" JSONB;

-- AlterTable
ALTER TABLE "Stigma" ADD COLUMN     "damageMaxModifiers" JSONB,
ADD COLUMN     "damageMinModifiers" JSONB;
