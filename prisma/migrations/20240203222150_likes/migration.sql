-- AlterTable
ALTER TABLE `Post` MODIFY `content` VARCHAR(280) NOT NULL;

-- CreateTable
CREATE TABLE `_userLikedPosts` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_userLikedPosts_AB_unique`(`A`, `B`),
    INDEX `_userLikedPosts_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_userLikedPosts` ADD CONSTRAINT `_userLikedPosts_A_fkey` FOREIGN KEY (`A`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_userLikedPosts` ADD CONSTRAINT `_userLikedPosts_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
