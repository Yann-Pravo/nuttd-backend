/*
  Warnings:

  - You are about to drop the `Discord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Discord" DROP CONSTRAINT "Discord_userId_fkey";

-- DropTable
DROP TABLE "Discord";

-- CreateTable
CREATE TABLE "ThirdParty" (
    "platformId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ThirdParty_platformId_key" ON "ThirdParty"("platformId");

-- CreateIndex
CREATE UNIQUE INDEX "ThirdParty_userId_key" ON "ThirdParty"("userId");

-- AddForeignKey
ALTER TABLE "ThirdParty" ADD CONSTRAINT "ThirdParty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
