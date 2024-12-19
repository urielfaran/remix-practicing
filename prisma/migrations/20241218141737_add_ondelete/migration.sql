/*
  Warnings:

  - Made the column `listId` on table `todo` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `todo` DROP FOREIGN KEY `Todo_listId_fkey`;

-- DropIndex
DROP INDEX `Todo_listId_fkey` ON `todo`;

-- AlterTable
ALTER TABLE `todo` MODIFY `listId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Todo` ADD CONSTRAINT `Todo_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `List`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
