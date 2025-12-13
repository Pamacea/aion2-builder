/*
  Warnings:

  - You are about to drop the column `effect` on the `Ability` table. All the data in the column will be lost.
  - You are about to drop the column `effect` on the `Passive` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ability" DROP COLUMN "effect";

-- AlterTable
ALTER TABLE "Passive" DROP COLUMN "effect";
