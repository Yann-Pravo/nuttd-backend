-- DropForeignKey
ALTER TABLE "Nut" DROP CONSTRAINT "Nut_nutterId_fkey";

-- AlterTable
ALTER TABLE "Nut" ALTER COLUMN "nutterId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Nut" ADD CONSTRAINT "Nut_nutterId_fkey" FOREIGN KEY ("nutterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
