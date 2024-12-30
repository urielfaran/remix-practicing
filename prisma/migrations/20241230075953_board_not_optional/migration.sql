/*
  Warnings:

  - Made the column `boardId` on table `list` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `list` DROP FOREIGN KEY `List_boardId_fkey`;

-- DropIndex
DROP INDEX `List_boardId_fkey` ON `list`;

-- AlterTable
ALTER TABLE `list` MODIFY `boardId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `List` ADD CONSTRAINT `List_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
