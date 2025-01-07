/*
  Warnings:

  - Added the required column `creatingUserid` to the `Board` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `board` ADD COLUMN `creatingUserid` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Board` ADD CONSTRAINT `Board_creatingUserid_fkey` FOREIGN KEY (`creatingUserid`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
