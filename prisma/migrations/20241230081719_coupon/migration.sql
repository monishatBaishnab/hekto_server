-- CreateEnum
CREATE TYPE "DiscountBy" AS ENUM ('AMOUNT', 'PERCENTAGE');

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "shop_id" TEXT NOT NULL,
    "coupon" TEXT NOT NULL,
    "discount" TEXT NOT NULL,
    "discount_by" "DiscountBy" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
