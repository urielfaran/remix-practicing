/*
  Warnings:

  - Added the required column `order` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `todo` ADD COLUMN `order` DOUBLE NOT NULL;
