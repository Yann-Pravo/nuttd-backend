/*
  Warnings:

  - You are about to drop the column `coordinates` on the `Nut` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[locationId]` on the table `Nut` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locationId` to the `Nut` table without a default value. This is not possible if the table is not empty.

*/
-- Delete all Nuts
DELETE FROM "Nut";
-- AlterTable
ALTER TABLE "Nut" DROP COLUMN "coordinates",
ADD COLUMN     "locationId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "citycountry" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "regionName" TEXT NOT NULL,
    "zip" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_citycountry_key" ON "Location"("citycountry");

-- CreateIndex
CREATE UNIQUE INDEX "Nut_locationId_key" ON "Nut"("locationId");

-- AddForeignKey
ALTER TABLE "Nut" ADD CONSTRAINT "Nut_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
