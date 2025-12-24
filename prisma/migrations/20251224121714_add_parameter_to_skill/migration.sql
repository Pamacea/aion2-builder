-- AlterTable
ALTER TABLE "Passive" ADD COLUMN     "defenseModifiers" JSONB,
ADD COLUMN     "impactTypeChanceModifiers" JSONB,
ADD COLUMN     "impactTypeResistModifiers" JSONB,
ADD COLUMN     "smiteModifiers" JSONB,
ADD COLUMN     "statusEffectResistModifiers" JSONB;

-- AlterTable
ALTER TABLE "Stigma" ADD COLUMN     "defenseModifiers" JSONB,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "durationModifier" INTEGER,
ADD COLUMN     "durationModifiers" JSONB,
ADD COLUMN     "enmity" INTEGER,
ADD COLUMN     "enmityModifier" INTEGER,
ADD COLUMN     "enmityModifiers" JSONB,
ADD COLUMN     "protectiveShield" INTEGER,
ADD COLUMN     "protectiveShieldModifier" INTEGER,
ADD COLUMN     "protectiveShieldModifiers" JSONB;
