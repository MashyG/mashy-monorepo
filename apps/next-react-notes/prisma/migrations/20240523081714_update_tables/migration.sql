/*
  Warnings:

  - You are about to drop the column `desc` on the `note` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `note` DROP FOREIGN KEY `Note_authorId_fkey`;

-- AlterTable
ALTER TABLE `note` DROP COLUMN `desc`;

-- AddForeignKey
ALTER TABLE `note` ADD CONSTRAINT `note_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
