/*
  Warnings:

  - The values [NOT_SRATED] on the enum `Todo_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `todo` MODIFY `status` ENUM('NOT_STARTED', 'IN_PROGGRESS', 'COMPLETED') NOT NULL;
