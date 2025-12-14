-- AlterTable
ALTER TABLE "Ability" ADD COLUMN     "blockDamage" INTEGER,
ADD COLUMN     "blockDamageModifier" INTEGER,
ADD COLUMN     "blockDamageModifiers" JSONB;

-- AlterTable
ALTER TABLE "Passive" ADD COLUMN     "blockDamage" INTEGER,
ADD COLUMN     "blockDamageModifier" INTEGER,
ADD COLUMN     "blockDamageModifiers" JSONB;

-- AlterTable
ALTER TABLE "Stigma" ADD COLUMN     "blockDamage" INTEGER,
ADD COLUMN     "blockDamageModifier" INTEGER,
ADD COLUMN     "blockDamageModifiers" JSONB;
