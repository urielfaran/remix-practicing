/*
  Warnings:

  - You are about to drop the column `completeDate` on the `todo` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `todo` table. All the data in the column will be lost.
  - Added the required column `completeTime` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `todo` DROP COLUMN `completeDate`,
    DROP COLUMN `isCompleted`,
    ADD COLUMN `completeTime` DATETIME(3) NOT NULL;
