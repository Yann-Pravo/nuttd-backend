/*
  Warnings:

  - You are about to drop the `_GuildToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GuildToUser" DROP CONSTRAINT "_GuildToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GuildToUser" DROP CONSTRAINT "_GuildToUser_B_fkey";

-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "_GuildToUser";

-- CreateTable
CREATE TABLE "_GuildUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GuildAdmins" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GuildUsers_AB_unique" ON "_GuildUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_GuildUsers_B_index" ON "_GuildUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GuildAdmins_AB_unique" ON "_GuildAdmins"("A", "B");

-- CreateIndex
CREATE INDEX "_GuildAdmins_B_index" ON "_GuildAdmins"("B");

-- AddForeignKey
ALTER TABLE "_GuildUsers" ADD CONSTRAINT "_GuildUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuildUsers" ADD CONSTRAINT "_GuildUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuildAdmins" ADD CONSTRAINT "_GuildAdmins_A_fkey" FOREIGN KEY ("A") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuildAdmins" ADD CONSTRAINT "_GuildAdmins_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
