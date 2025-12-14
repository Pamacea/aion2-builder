-- AlterTable
ALTER TABLE "BuildAbility" ADD COLUMN     "selectedChainSkillIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- AlterTable
ALTER TABLE "BuildStigma" ADD COLUMN     "selectedChainSkillIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- CreateTable
CREATE TABLE "ChainSkill" (
    "id" SERIAL NOT NULL,
    "parentAbilityId" INTEGER NOT NULL,
    "chainAbilityId" INTEGER NOT NULL,

    CONSTRAINT "ChainSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChainSkillStigma" (
    "id" SERIAL NOT NULL,
    "parentStigmaId" INTEGER NOT NULL,
    "chainStigmaId" INTEGER NOT NULL,

    CONSTRAINT "ChainSkillStigma_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChainSkill_parentAbilityId_idx" ON "ChainSkill"("parentAbilityId");

-- CreateIndex
CREATE UNIQUE INDEX "ChainSkill_parentAbilityId_chainAbilityId_key" ON "ChainSkill"("parentAbilityId", "chainAbilityId");

-- CreateIndex
CREATE INDEX "ChainSkillStigma_parentStigmaId_idx" ON "ChainSkillStigma"("parentStigmaId");

-- CreateIndex
CREATE UNIQUE INDEX "ChainSkillStigma_parentStigmaId_chainStigmaId_key" ON "ChainSkillStigma"("parentStigmaId", "chainStigmaId");

-- AddForeignKey
ALTER TABLE "ChainSkill" ADD CONSTRAINT "ChainSkill_parentAbilityId_fkey" FOREIGN KEY ("parentAbilityId") REFERENCES "Ability"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChainSkill" ADD CONSTRAINT "ChainSkill_chainAbilityId_fkey" FOREIGN KEY ("chainAbilityId") REFERENCES "Ability"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChainSkillStigma" ADD CONSTRAINT "ChainSkillStigma_parentStigmaId_fkey" FOREIGN KEY ("parentStigmaId") REFERENCES "Stigma"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChainSkillStigma" ADD CONSTRAINT "ChainSkillStigma_chainStigmaId_fkey" FOREIGN KEY ("chainStigmaId") REFERENCES "Stigma"("id") ON DELETE CASCADE ON UPDATE CASCADE;
