import { Category } from "@prisma/client";
import prisma from "../../utils/prisma";
import sanitize_paginate from "../../utils/sanitize_paginate";
import wc_builder from "../../utils/wc_builder";
import { TFile } from "../../types";
import { cloudinary_uploader } from "../../middlewares/upload";

// Fetch all categories with pagination, sorting, and filtering
const fetch_all_from_db = async (query: Record<string, unknown>) => {
  // Sanitize query parameters for pagination and sorting
  const { page, limit, skip, sortBy, sortOrder } = sanitize_paginate(query);

  // Build where conditions based on the query (e.g., filtering by 'name')
  const whereConditions = wc_builder(query, ["name"], ["name"]);

  // Fetch categories from the database with the applied conditions, pagination, and sorting
  const categories = await prisma.category.findMany({
    where: {
      AND: whereConditions,
    },
    skip: skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      productCategory: {
        select: {
          product: { select: { _count: true } },
        },
      },
    },
  });

  const total = await prisma.category.count({
    where: { AND: whereConditions },
  });

  // Return the list of categories
  return { categories, meta: { limit, page, total } };
};

// Fetch a single category by its ID, ensuring it is not deleted
const fetch_single_from_db = async (id: string) => {
  // Find a unique category by ID, throwing an error if not found
  const category = await prisma.category.findUniqueOrThrow({
    where: { id, isDeleted: false },
  });

  // Return the found category
  return category;
};

// Create a new category in the database
const create_one_into_db = async (payload: Category, file: TFile) => {
  const upload_file = await cloudinary_uploader(file);

  if (upload_file?.secure_url) {
    payload.image = upload_file.secure_url;
  }

  // Create a new category using the provided payload data
  const created_category = await prisma.category.create({
    data: payload,
  });

  // Return the newly created category
  return created_category;
};

// Update an existing category by its ID
const update_one_from_db = async (id: string, payload: any) => {
  // Ensure the category exists before updating
  await prisma.category.findUniqueOrThrow({
    where: { id },
  });

  // Update the category with the new data
  const updated_category = await prisma.category.update({
    where: { id },
    data: payload,
  });

  // Return the updated category
  return updated_category;
};

// Mark a category as deleted by updating its 'isDeleted' status
const delete_one_from_db = async (id: string) => {
  // Ensure the category exists before marking it as deleted
  await prisma.category.findUniqueOrThrow({
    where: { id },
  });

  // Update the category to mark it as deleted
  const updated_category = await prisma.category.update({
    where: { id },
    data: { isDeleted: true },
  });

  // Return the updated category
  return updated_category;
};

export const category_services = {
  fetch_all_from_db,
  fetch_single_from_db,
  create_one_into_db,
  update_one_from_db,
  delete_one_from_db,
};
