/*
  Warnings:

  - Made the column `nutterId` on table `Nut` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Nut" DROP CONSTRAINT "Nut_nutterId_fkey";

-- AlterTable
ALTER TABLE "Nut" ALTER COLUMN "nutterId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Nut" ADD CONSTRAINT "Nut_nutterId_fkey" FOREIGN KEY ("nutterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
