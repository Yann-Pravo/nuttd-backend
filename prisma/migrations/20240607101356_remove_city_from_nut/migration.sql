/*
  Warnings:

  - You are about to drop the column `city` on the `Nut` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Nut` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Nut" DROP COLUMN "city",
DROP COLUMN "country";
