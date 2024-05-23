/*
  Warnings:

  - You are about to drop the column `firstname` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "firstname",
DROP COLUMN "lastname",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT;
