/*
  Warnings:

  - You are about to drop the column `avatar` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "avatar" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatar";
