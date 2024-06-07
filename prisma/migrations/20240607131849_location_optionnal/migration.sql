-- DropForeignKey
ALTER TABLE "Nut" DROP CONSTRAINT "Nut_locationId_fkey";

-- AlterTable
ALTER TABLE "Nut" ALTER COLUMN "locationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Nut" ADD CONSTRAINT "Nut_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
