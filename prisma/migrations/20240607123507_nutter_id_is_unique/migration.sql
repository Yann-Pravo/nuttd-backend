/*
  Warnings:

  - A unique constraint covering the columns `[nutterId]` on the table `Nut` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Nut_nutterId_key" ON "Nut"("nutterId");
