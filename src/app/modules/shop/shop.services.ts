import { Shop } from "@prisma/client";
import { TFile } from "../../types";
import prisma from "../../utils/prisma";
import sanitize_paginate from "../../utils/sanitize_paginate";
import wc_builder from "../../utils/wc_builder";
import { cloudinary_uploader } from "../../middlewares/upload";
import http_error from "../../errors/http_error";
import httpStatus from "http-status";

const fetch_all_from_db = async (query: Record<string, unknown>) => {
  // Sanitize query parameters for pagination and sorting
  const { page, limit, skip, sortBy, sortOrder } = sanitize_paginate(query);

  // Build where conditions based on the query (e.g., filtering by 'name')
  const whereConditions = wc_builder(query, ["name"], ["name"]);

  // Fetch shops from the database with the applied conditions, pagination, and sorting
  const shops = await prisma.shop.findMany({
    where: {
      AND: whereConditions,
    },
    skip: skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      user: {
        select: { name: true, email: true, role: true },
      },
    },
  });

  const total = await prisma.shop.count({
    where: { AND: whereConditions },
  });

  // Return the list of shops
  return { data: shops, meta: { limit, page, total } };
};

const fetch_single_from_db = async (id: string) => {
  // Find a unique shop by ID, throwing an error if not found
  const shop = await prisma.shop.findUniqueOrThrow({
    where: { id, isDeleted: false },
    include: {
      follow: {
        select: { user_id: true },
      },
    },
  });

  // Return the found shop
  return shop;
};

const create_one_from_db = async (payload: Shop, file: TFile) => {
  const user_shop = await prisma.shop.findUnique({ where: { user_id: payload.user_id } });
  if (user_shop) {
    throw new http_error(httpStatus.CONFLICT, "User already have a shop.");
  }
  const upload_file = await cloudinary_uploader(file);

  if (upload_file?.secure_url) {
    payload.logo = upload_file.secure_url;
  }

  // Create a new shop using the provided payload data
  const created_shop = await prisma.shop.create({
    data: payload,
  });

  // Return the newly created shop
  return created_shop;
};

const update_one_from_db = async (id: string, payload: Shop, file: TFile) => {
  // Ensure the category exists before updating
  await prisma.shop.findUniqueOrThrow({
    where: { id },
  });

  const upload_file = await cloudinary_uploader(file);

  if (upload_file?.secure_url) {
    payload.logo = upload_file.secure_url;
  }

  // Create a new shop using the provided payload data
  const updated_shop = await prisma.shop.update({
    where: { id },
    data: payload,
  });

  // Return the newly created shop
  return updated_shop;
};

export const shop_services = {
  fetch_all_from_db,
  fetch_single_from_db,
  create_one_from_db,
  update_one_from_db,
};
