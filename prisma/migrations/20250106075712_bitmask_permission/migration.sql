/*
  Warnings:

  - You are about to drop the column `permission` on the `userboardpermission` table. All the data in the column will be lost.
  - Added the required column `permissions` to the `UserBoardPermission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `userboardpermission` DROP COLUMN `permission`,
    ADD COLUMN `permissions` INTEGER NOT NULL;
