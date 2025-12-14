-- AlterTable
ALTER TABLE "Ability" ADD COLUMN     "condition" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "ChainSkill" ADD COLUMN     "condition" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "ChainSkillStigma" ADD COLUMN     "condition" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Stigma" ADD COLUMN     "condition" TEXT[] DEFAULT ARRAY[]::TEXT[];
