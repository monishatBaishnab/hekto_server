-- DropForeignKey
ALTER TABLE "products_categories" DROP CONSTRAINT "products_categories_category_id_fkey";

-- AddForeignKey
ALTER TABLE "products_categories" ADD CONSTRAINT "products_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
