import { Coupon } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../utils/prisma";
import sanitize_paginate from "../../utils/sanitize_paginate";
import http_error from "../../errors/http_error";
import httpStatus from "http-status";

// Service for apply coupon in order
const apply_coupon = async (payload: Partial<Coupon>) => {
  const coupon_info = await prisma.coupon.findUniqueOrThrow({
    where: { id: payload.id },
  });
  await prisma.shop.findUniqueOrThrow({
    where: { id: payload.shop_id },
  });

  // Adjust 'now' to GMT+6
  const now = new Date(new Date().getTime() + 6 * 60 * 60 * 1000);

  // Dates from coupon info
  const start_date = new Date(coupon_info.start_date);
  const end_date = new Date(coupon_info.end_date);

  // Extend end_date to include the full day
  const end_of_day = new Date(end_date);
  end_of_day.setUTCHours(23, 59, 59, 999);

  // Validate coupon validity
  if (start_date && start_date > now) {
    throw new Error("Coupon is not yet valid.");
  }
  if (end_date && end_of_day < now) {
    throw new Error("Coupon has expired.");
  }

  if (coupon_info.shop_id !== payload.shop_id) {
    throw new Error("Coupon is not valid for this shop.");
  }

  return "Coupon applied successfully.";
};


// Fetch All coupons from database with pagination
const fetch_all_from_db = async (query: Record<string, unknown>) => {
  const { shop_id, active } = query;

  // Sanitize query parameters for pagination and sorting
  const { page, limit, skip, sortBy, sortOrder } = sanitize_paginate(query);
  const now = new Date(new Date().getTime() + 6 * 60 * 60 * 1000);
  // Fetch coupons from the database with the applied conditions, pagination, and sorting
  const coupons = await prisma.coupon.findMany({
    where: {
      isDeleted: false,
      is_active: true,
      ...(shop_id ? { shop_id: shop_id as string } : {}),
      ...(active ? { start_date: { lte: now }, end_date: { gte: now } } : {}),
    },
    skip: skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.coupon.count({
    where: {
      isDeleted: false,
      is_active: true,
      ...(shop_id ? { shop_id: shop_id as string } : {}),
      ...(active ? { start_date: { lte: now }, end_date: { gte: now } } : {}),
    },
  });

  // Return the list of coupons
  return { coupons, meta: { limit, page, total } };
};

// Creates a new coupon in the database
const create_one_into_db = async (payload: Coupon, user: JwtPayload) => {
  // Ensure the shop exists and is not deleted
  await prisma.shop.findFirstOrThrow({ where: { id: payload.shop_id, isDeleted: false } });

  // Prepare coupon data with the user ID
  const coupon_data = { ...payload };

  // Create and save the coupon
  const created_coupon = await prisma.coupon.create({
    data: coupon_data,
  });

  return created_coupon;
};

// Updates an existing coupon in the database
const update_one_from_db = async (id: string, payload: Coupon, user: JwtPayload) => {
  // Find the coupon and ensure it exists and is not deleted
  await prisma.coupon.findUniqueOrThrow({ where: { id, isDeleted: false } });

  // Ensure the shop exists and is not deleted
  await prisma.shop.findFirstOrThrow({ where: { id: payload.shop_id, isDeleted: false } });

  // Update the coupon with the new data
  const coupon_data = { ...payload };

  const updated_coupon = await prisma.coupon.update({
    where: { id },
    data: coupon_data,
  });

  return updated_coupon;
};

// Soft deletes a coupon from the database
const delete_one_from_db = async (id: string, user: JwtPayload) => {
  // Find the coupon and ensure it exists and is not deleted
  await prisma.coupon.findUniqueOrThrow({ where: { id, isDeleted: false } });

  await prisma.coupon.update({
    where: { id },
    data: { isDeleted: true },
  });

  return;
};

export const coupon_services = {
  apply_coupon,
  fetch_all_from_db,
  create_one_into_db,
  update_one_from_db,
  delete_one_from_db,
};
