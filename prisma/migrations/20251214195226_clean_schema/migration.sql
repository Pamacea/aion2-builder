/*
  Warnings:

  - You are about to drop the column `isMobile` on the `Ability` table. All the data in the column will be lost.
  - You are about to drop the column `isNontarget` on the `Ability` table. All the data in the column will be lost.
  - You are about to drop the column `isMobile` on the `Passive` table. All the data in the column will be lost.
  - You are about to drop the column `isNontarget` on the `Passive` table. All the data in the column will be lost.
  - You are about to drop the column `isMobile` on the `Stigma` table. All the data in the column will be lost.
  - You are about to drop the column `isNontarget` on the `Stigma` table. All the data in the column will be lost.
  - You are about to drop the column `isShared` on the `Stigma` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ability" DROP COLUMN "isMobile",
DROP COLUMN "isNontarget";

-- AlterTable
ALTER TABLE "Passive" DROP COLUMN "isMobile",
DROP COLUMN "isNontarget";

-- AlterTable
ALTER TABLE "Stigma" DROP COLUMN "isMobile",
DROP COLUMN "isNontarget",
DROP COLUMN "isShared";
