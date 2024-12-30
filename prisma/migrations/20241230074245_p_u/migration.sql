-- AlterTable
ALTER TABLE "products" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "flash_sale" BOOLEAN NOT NULL DEFAULT false;
