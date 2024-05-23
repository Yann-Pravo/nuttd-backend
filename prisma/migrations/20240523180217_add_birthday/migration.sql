/*
  Warnings:

  - You are about to drop the column `birthyear` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "birthyear",
ADD COLUMN     "birthday" TIMESTAMP(3);
