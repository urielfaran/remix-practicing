/*
  Warnings:

  - You are about to drop the column `userid` on the `notification` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_userid_fkey`;

-- DropIndex
DROP INDEX `Notification_userid_fkey` ON `notification`;

-- AlterTable
ALTER TABLE `notification` DROP COLUMN `userid`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
