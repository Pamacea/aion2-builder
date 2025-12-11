/*
  Warnings:

  - Changed the type of `name` on the `Tag` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TagRole" AS ENUM ('TANK', 'HEALER', 'SUPPORT', 'OFFTANK', 'SUSTAIN', 'BUFF', 'DEBUFF', 'DPS', 'MELEE', 'DISTANCE');

-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "characterUrl" TEXT;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "name",
ADD COLUMN     "name" "TagRole" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
