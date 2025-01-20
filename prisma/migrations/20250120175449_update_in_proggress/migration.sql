/*
  Warnings:

  - The values [IN_PROGGRESS] on the enum `Todo_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `todo` MODIFY `status` ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') NOT NULL;
