/*
  Warnings:

  - You are about to drop the column `isFavorite` on the `board` table. All the data in the column will be lost.
  - You are about to drop the `userboardpermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `userboardpermission` DROP FOREIGN KEY `UserBoardPermission_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `userboardpermission` DROP FOREIGN KEY `UserBoardPermission_userId_fkey`;

-- AlterTable
ALTER TABLE `board` DROP COLUMN `isFavorite`;

-- DropTable
DROP TABLE `userboardpermission`;

-- CreateTable
CREATE TABLE `UserBoardRelation` (
    `boardId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `permissions` INTEGER NOT NULL,
    `isFavorite` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `UserBoardRelation_boardId_userId_key`(`boardId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserBoardRelation` ADD CONSTRAINT `UserBoardRelation_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserBoardRelation` ADD CONSTRAINT `UserBoardRelation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
