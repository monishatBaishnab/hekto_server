import { JwtPayload } from "jsonwebtoken";
import { TFile } from "../../types";
import { Product, UserRole } from "@prisma/client";
import prisma from "../../utils/prisma";
import { cloudinary_uploader } from "../../middlewares/upload";
import http_error from "../../errors/http_error";
import httpStatus from "http-status";
import sanitize_paginate from "../../utils/sanitize_paginate";
import wc_builder from "../../utils/wc_builder";
import sanitize_queries from "../../utils/sanitize_queries";

type TProductCategories = { categories: { id: string; isDeleted: boolean }[] };

const fetch_all_from_db = async (query: Record<string, unknown>) => {
  const { min_price, max_price } = query ?? {};
  // Sanitize query parameters for pagination and sorting
  const { page, limit, skip, sortBy, sortOrder } = sanitize_paginate(query);

  // Build where conditions based on the query (e.g., filtering by 'name')
  const whereConditions = wc_builder(
    query,
    ["name"],
    ["name", "shop_id", "featured", "flash_sale"]
  );
  const { categories: categoriesStr } = sanitize_queries(query, ["categories"]) || {};

  const categories =
    (categoriesStr as string)
      ?.split(", ")
      .map((str) => str.trim())
      .filter((category) => category !== "") || [];

  const and_conditions = [
    { AND: whereConditions },
    { shop: { isDeleted: false } }, // Filter shops that are not deleted
    {
      price: {
        gte: min_price ? Number(min_price) : 0,
        lte: max_price ? Number(max_price) : 1000,
      },
    },
    ...(categories.length > 0
      ? [
          {
            productCategory: {
              some: {
                OR: categories.map((category) => ({
                  category_id: { contains: category },
                })),
              },
            },
          },
        ]
      : []),
  ];

  // Fetch products with conditions, pagination, sorting, and nested data
  const products = await prisma.product.findMany({
    where: {
      AND: [{ AND: and_conditions }],
    },
    skip: skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      productCategory: {
        select: { category: { select: { id: true, name: true } } },
      },
      shop: {
        select: {
          id: true,
          name: true,
          logo: true,
          createdAt: true,
        },
      },
      review: {
        select: {
          rating: true,
        },
      },
    },
  });

  // Count total products matching the query (ignores pagination)
  const total = await prisma.product.count({
    where: {
      AND: [{ AND: and_conditions, shop: { status: "ACTIVE" } }],
    },
  });

  // Reshape data: transform productCategory into categories
  const filteredProducts = products.map((product) => ({
    ...product,
    categories: product.productCategory.map((pc) => pc.category),
    productCategory: undefined, // Remove original productCategory field
  }));

  return { products: filteredProducts, meta: { page, limit, total } };
};

const fetch_single_from_db = async (id: string) => {
  // Query the product, ensuring both the product and its shop are not deleted
  const product = await prisma.product.findUnique({
    where: { id, isDeleted: false, shop: { isDeleted: false } },
    include: {
      productCategory: {
        select: { category: { select: { id: true, name: true } } },
      },
      shop: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
      review: {
        select: {
          id: true,
          rating: true,
          comment: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profilePhoto: true,
              createdAt: true,
            },
          },
          product: { select: { name: true } },
        },
      },
      // OrderProduct: {
      //   select: {
      //     order: {
      //       select: {
      //         user_id: true,
      //       },
      //     },
      //   },
      // },
    },
  });

  // Extract and reshape product categories
  const categories = product?.productCategory?.map((category) => category.category);

  // Return product with reshaped categories
  return { ...product, productCategory: undefined, categories };
};

// Function to create a new product in the database
const create_one_into_db = async (
  data: Product & TProductCategories,
  files: TFile[],
  user: JwtPayload
) => {
  const { categories, ...payload } = data ?? {};
  // Validate if an image file is provided
  if (!files?.length) {
    throw new http_error(httpStatus.BAD_REQUEST, "Please select an image.");
  }

  // Prepare product data and set available quantity
  const product_data: Product = {
    ...payload,
    price: Number(payload.price),
    discount: Number(payload.discount),
    quantity: Number(payload.quantity),
    availableQuantity: Number(payload.quantity),
  };

  // Retrieve shop information for the authenticated user
  const shop_info = await prisma.shop.findUniqueOrThrow({
    where: { user_id: user.id, isDeleted: false },
    select: { id: true },
  });
  product_data.shop_id = shop_info.id;

  // Upload the product images to Cloudinary and add uploaded image URL to product data
  const promises = files?.map((file) => cloudinary_uploader(file));
  const uploaded_images = await Promise.all(promises);
  if (uploaded_images?.length) {
    product_data.images = uploaded_images?.map((image) => image?.secure_url as string);
  }

  // Save product and associated categories in a database transaction
  const created_product = await prisma.$transaction(async (prisma_t) => {
    // Create the product record
    const product = await prisma_t.product.create({
      data: product_data,
    });

    // Link the product with its categories
    for (const category of categories || []) {
      await prisma_t.productCategory.create({
        data: { product_id: product.id, category_id: category.id },
      });
    }

    // Return the created product
    return product;
  });

  // Return the created product with all associations
  return created_product;
};

// Updates a product in the database along with its associated categories.
const update_one_from_db = async (
  id: string,
  data: Product & TProductCategories,
  files: TFile[],
  user: JwtPayload
) => {
  // Ensure the product exists before updating
  await prisma.product.findUniqueOrThrow({
    where: { id, isDeleted: false, shop: { isDeleted: false, user_id: user.id } },
  });

  // Destructure filds from client data
  const { categories, discount, price, quantity, images, ...payload } = data ?? {};

  // Prepare product data, including available quantity
  const product_data: Partial<Product> = {
    ...payload,
  };

  // Change the type
  if (discount) {
    product_data.discount = Number(discount);
  }
  if (price) {
    product_data.price = Number(price);
  }
  if (quantity) {
    product_data.quantity = Number(quantity);
  }

  // Upload the product images to Cloudinary and add uploaded image URL to product data
  const promises = files?.map((file) => cloudinary_uploader(file));
  const uploaded_files = await Promise.all(promises);

  if (uploaded_files?.length) {
    const uploaded_images = uploaded_files?.map((image) => image?.secure_url as string);
    product_data.images = [...uploaded_images];
  }
  if (images) {
    product_data.images?.unshift(...images);
  }

  // Separate categories into those to link and unlink
  const c_categories = categories?.filter((category) => !category.isDeleted) || [];
  const d_categories = categories?.filter((category) => category.isDeleted) || [];

  // Perform database operations in a transaction
  await prisma.$transaction(async (prisma_t) => {
    // Update product details
    const product = await prisma_t.product.update({
      where: { id },
      data: product_data,
    });

    // Link product to new categories
    for (const category of c_categories) {
      await prisma_t.productCategory.create({
        data: { product_id: product.id, category_id: category.id },
      });
    }

    // Unlink product from removed categories
    for (const category of d_categories) {
      await prisma_t.productCategory.deleteMany({
        where: { product_id: product.id, category_id: category.id },
      });
    }
  });

  // Fetch and return the updated product with associations
  const updated_product = await fetch_single_from_db(id);
  return updated_product;
};

const update_status_from_db = async (
  id: string,
  data: Product & TProductCategories,
  user: JwtPayload
) => {
  // Ensure the product exists before updating
  await prisma.product.findUniqueOrThrow({
    where: { id, isDeleted: false},
  });

  // Destructure filds from client data
  const { featured, flash_sale } = data ?? {};

  // Prepare product data, including available quantity
  const product_data: Partial<Product> = {};

  if (featured) {
    product_data.featured = true;
  } else {
    product_data.featured = false;
  }

  if (flash_sale) {
    product_data.flash_sale = true;
  } else {
    product_data.flash_sale = false;
  }

  await prisma.product.update({
    where: { id },
    data: product_data,
  });

  // Fetch and return the updated product with associations
  const updated_product = await fetch_single_from_db(id);
  return updated_product;
};

const delete_one_from_db = async (id: string, user: JwtPayload) => {
  // Ensure the product exists before deleting
  if (user.role === UserRole.VENDOR) {
    await prisma.product.findUniqueOrThrow({
      where: { id, isDeleted: false, shop: { isDeleted: false, user_id: user.id } },
    });
  } else {
    await prisma.product.findUniqueOrThrow({
      where: { id, isDeleted: false, shop: { isDeleted: false } },
    });
  }

  await prisma.product.update({ data: { isDeleted: true }, where: { id } });
};

export const product_services = {
  fetch_all_from_db,
  fetch_single_from_db,
  create_one_into_db,
  update_one_from_db,
  delete_one_from_db,
  update_status_from_db,
};
