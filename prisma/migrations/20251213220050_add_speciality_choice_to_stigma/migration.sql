-- DropForeignKey
ALTER TABLE "SpecialtyChoice" DROP CONSTRAINT "SpecialtyChoice_abilityId_fkey";

-- AlterTable
ALTER TABLE "BuildStigma" ADD COLUMN     "activeSpecialtyChoiceIds" INTEGER[];

-- AlterTable
ALTER TABLE "SpecialtyChoice" ADD COLUMN     "stigmaId" INTEGER,
ALTER COLUMN "abilityId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SpecialtyChoice" ADD CONSTRAINT "SpecialtyChoice_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "Ability"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialtyChoice" ADD CONSTRAINT "SpecialtyChoice_stigmaId_fkey" FOREIGN KEY ("stigmaId") REFERENCES "Stigma"("id") ON DELETE SET NULL ON UPDATE CASCADE;
