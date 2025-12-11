/*
  Warnings:

  - You are about to drop the column `level` on the `Ability` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Passive` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Stigma` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ability" DROP COLUMN "level";

-- AlterTable
ALTER TABLE "BuildAbility" ADD COLUMN     "maxLevel" INTEGER NOT NULL DEFAULT 20;

-- AlterTable
ALTER TABLE "BuildPassive" ADD COLUMN     "maxLevel" INTEGER NOT NULL DEFAULT 20;

-- AlterTable
ALTER TABLE "BuildStigma" ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "maxLevel" INTEGER NOT NULL DEFAULT 20;

-- AlterTable
ALTER TABLE "Passive" DROP COLUMN "level";

-- AlterTable
ALTER TABLE "Stigma" DROP COLUMN "level";
