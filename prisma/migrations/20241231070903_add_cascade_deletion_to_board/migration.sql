-- DropForeignKey
ALTER TABLE `list` DROP FOREIGN KEY `List_boardId_fkey`;

-- DropIndex
DROP INDEX `List_boardId_fkey` ON `list`;

-- AddForeignKey
ALTER TABLE `List` ADD CONSTRAINT `List_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
