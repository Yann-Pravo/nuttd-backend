/*
  Warnings:

  - You are about to drop the column `nutterId` on the `Nut` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Nut` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Nut` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Nut" DROP CONSTRAINT "Nut_nutterId_fkey";

-- DropIndex
DROP INDEX "Nut_nutterId_key";

-- AlterTable
ALTER TABLE "Nut" DROP COLUMN "nutterId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Nut_userId_key" ON "Nut"("userId");

-- AddForeignKey
ALTER TABLE "Nut" ADD CONSTRAINT "Nut_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
