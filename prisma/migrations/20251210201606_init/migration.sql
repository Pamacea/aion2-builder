-- CreateTable
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ability" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "damageMin" INTEGER,
    "damageMax" INTEGER,
    "targetRange" INTEGER,
    "effect" TEXT,
    "type" TEXT DEFAULT 'Physical',
    "category" TEXT DEFAULT 'Attack',
    "isNontarget" BOOLEAN NOT NULL DEFAULT false,
    "isMobile" BOOLEAN NOT NULL DEFAULT false,
    "castingDuration" TEXT DEFAULT 'Instant Cast',
    "cooldown" TEXT DEFAULT 'Instant Cast',
    "maxLevel" INTEGER NOT NULL DEFAULT 20,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "Ability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialtyChoice" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "unlockLevel" INTEGER NOT NULL,
    "abilityId" INTEGER NOT NULL,

    CONSTRAINT "SpecialtyChoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passive" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "maxLevel" INTEGER NOT NULL DEFAULT 10,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "Passive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stigma" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "baseCost" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "Stigma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Build" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "classId" INTEGER NOT NULL,
    "baseSP" INTEGER NOT NULL DEFAULT 231,
    "extraSP" INTEGER NOT NULL DEFAULT 0,
    "baseSTP" INTEGER NOT NULL DEFAULT 40,
    "extraSTP" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Build_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildAbility" (
    "id" SERIAL NOT NULL,
    "buildId" INTEGER NOT NULL,
    "abilityId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "activeSpecialtyChoiceIds" INTEGER[],

    CONSTRAINT "BuildAbility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildPassive" (
    "id" SERIAL NOT NULL,
    "buildId" INTEGER NOT NULL,
    "passiveId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "BuildPassive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildStigma" (
    "id" SERIAL NOT NULL,
    "buildId" INTEGER NOT NULL,
    "stigmaId" INTEGER NOT NULL,
    "stigmaCost" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "BuildStigma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClassToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ClassToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ClassToStigma" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ClassToStigma_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Class_name_key" ON "Class"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "_ClassToTag_B_index" ON "_ClassToTag"("B");

-- CreateIndex
CREATE INDEX "_ClassToStigma_B_index" ON "_ClassToStigma"("B");

-- AddForeignKey
ALTER TABLE "Ability" ADD CONSTRAINT "Ability_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialtyChoice" ADD CONSTRAINT "SpecialtyChoice_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "Ability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Passive" ADD CONSTRAINT "Passive_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildAbility" ADD CONSTRAINT "BuildAbility_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildAbility" ADD CONSTRAINT "BuildAbility_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "Ability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildPassive" ADD CONSTRAINT "BuildPassive_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildPassive" ADD CONSTRAINT "BuildPassive_passiveId_fkey" FOREIGN KEY ("passiveId") REFERENCES "Passive"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildStigma" ADD CONSTRAINT "BuildStigma_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildStigma" ADD CONSTRAINT "BuildStigma_stigmaId_fkey" FOREIGN KEY ("stigmaId") REFERENCES "Stigma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToTag" ADD CONSTRAINT "_ClassToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToTag" ADD CONSTRAINT "_ClassToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToStigma" ADD CONSTRAINT "_ClassToStigma_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToStigma" ADD CONSTRAINT "_ClassToStigma_B_fkey" FOREIGN KEY ("B") REFERENCES "Stigma"("id") ON DELETE CASCADE ON UPDATE CASCADE;
