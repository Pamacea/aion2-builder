-- CreateTable
CREATE TABLE "DaevanionRune" (
    "id" SERIAL NOT NULL,
    "slotId" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "positionX" INTEGER NOT NULL,
    "positionY" INTEGER NOT NULL,
    "prerequisites" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "stats" JSONB,

    CONSTRAINT "DaevanionRune_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildDaevanion" (
    "id" SERIAL NOT NULL,
    "buildId" INTEGER NOT NULL,
    "nezekan" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "zikel" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "vaizel" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "triniel" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "ariel" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "azphel" INTEGER[] DEFAULT ARRAY[]::INTEGER[],

    CONSTRAINT "BuildDaevanion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DaevanionRune_path_idx" ON "DaevanionRune"("path");

-- CreateIndex
CREATE UNIQUE INDEX "DaevanionRune_path_slotId_key" ON "DaevanionRune"("path", "slotId");

-- CreateIndex
CREATE UNIQUE INDEX "BuildDaevanion_buildId_key" ON "BuildDaevanion"("buildId");

-- AddForeignKey
ALTER TABLE "BuildDaevanion" ADD CONSTRAINT "BuildDaevanion_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE CASCADE ON UPDATE CASCADE;
