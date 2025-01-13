-- CreateTable
CREATE TABLE `_TodoToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_TodoToUser_AB_unique`(`A`, `B`),
    INDEX `_TodoToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_TodoToUser` ADD CONSTRAINT `_TodoToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Todo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TodoToUser` ADD CONSTRAINT `_TodoToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
