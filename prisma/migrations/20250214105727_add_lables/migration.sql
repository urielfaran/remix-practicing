-- CreateTable
CREATE TABLE `Label` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `todoid` INTEGER NOT NULL,
    `backgroundColor` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Label` ADD CONSTRAINT `Label_todoid_fkey` FOREIGN KEY (`todoid`) REFERENCES `Todo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
