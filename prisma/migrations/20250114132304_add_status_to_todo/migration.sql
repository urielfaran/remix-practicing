/*
  Warnings:

  - Added the required column `status` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `todo` ADD COLUMN `status` ENUM('NOT_SRATED', 'IN_PROGGRESS', 'COMPLETED') NOT NULL;
