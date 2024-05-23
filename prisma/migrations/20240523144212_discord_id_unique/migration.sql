/*
  Warnings:

  - A unique constraint covering the columns `[discordId]` on the table `Discord` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Discord_discordId_key" ON "Discord"("discordId");
