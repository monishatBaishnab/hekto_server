-- CreateEnum
CREATE TYPE "ShopStatus" AS ENUM ('ACTIVE', 'BLOCKED');

-- AlterTable
ALTER TABLE "shops" ADD COLUMN     "status" "ShopStatus" NOT NULL DEFAULT 'ACTIVE';
