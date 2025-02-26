/*
  Warnings:

  - You are about to drop the column `todoid` on the `label` table. All the data in the column will be lost.
  - Added the required column `todoId` to the `Label` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `label` DROP FOREIGN KEY `Label_todoid_fkey`;

-- DropIndex
DROP INDEX `Label_todoid_fkey` ON `label`;

-- AlterTable
ALTER TABLE `label` DROP COLUMN `todoid`,
    ADD COLUMN `text` VARCHAR(191) NULL,
    ADD COLUMN `todoId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Label` ADD CONSTRAINT `Label_todoId_fkey` FOREIGN KEY (`todoId`) REFERENCES `Todo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
