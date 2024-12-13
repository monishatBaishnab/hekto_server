import { Review, UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../utils/prisma";
import http_error from "../../errors/http_error";
import httpStatus from "http-status";
import sanitize_paginate from "../../utils/sanitize_paginate";

// Fetch All reviews from database with pagination
const fetch_all_from_db = async (query: Record<string, unknown>) => {
  const { shop_id } = query;
  // Sanitize query parameters for pagination and sorting
  const { page, limit, skip, sortBy, sortOrder } = sanitize_paginate(query);

  // Fetch reviews from the database with the applied conditions, pagination, and sorting
  const reviews = await prisma.review.findMany({
    where: { isDeleted: false, product: { shop_id: shop_id as string } },
    skip: skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    select: {
      id: true,
      rating: true,
      comment: true,
      user: { select: { id: true, name: true, email: true, address: true, profilePhoto: true, createdAt:true } },
      product: { select: { name: true } },
    },
  });

  const total = await prisma.review.count();

  // Return the list of reviews
  return { reviews, meta: { limit, page, total } };
};

// Creates a new review in the database
const create_one_into_db = async (payload: Review, user: JwtPayload) => {
  // Ensure the product exists and is not deleted
  await prisma.product.findFirstOrThrow({ where: { id: payload.product_id, isDeleted: false } });

  // Ensure the user exists and is not deleted
  await prisma.user.findUniqueOrThrow({ where: { id: user.id, isDeleted: false } });

  // Prepare review data with the user ID
  const review_data = { ...payload, rating: Number(payload.rating), user_id: user.id };

  // Create and save the review
  const created_review = await prisma.review.create({
    data: review_data,
  });

  return created_review;
};

// Updates an existing review in the database
const update_one_from_db = async (id: string, payload: Review, user: JwtPayload) => {
  // Find the review and ensure it exists and is not deleted
  const review_info = await prisma.review.findUniqueOrThrow({ where: { id, isDeleted: false } });

  // Ensure the user who created the review exists and is not deleted
  await prisma.user.findUniqueOrThrow({ where: { id: review_info.user_id, isDeleted: false } });

  // Ensure the associated product exists and is not deleted
  await prisma.product.findFirstOrThrow({
    where: { id: review_info.product_id, isDeleted: false },
  });

  // Check if the user has permission to update the review
  if (user.role !== UserRole.ADMIN && review_info.user_id !== user.id) {
    throw new http_error(httpStatus.UNAUTHORIZED, "You have no access to update this.");
  }

  // Update the review with the new data
  const review_data = { ...payload };

  const updated_review = await prisma.review.update({
    where: { id },
    data: review_data,
  });

  return updated_review;
};

// Soft deletes a review from the database
const delete_one_from_db = async (id: string, user: JwtPayload) => {
  // Find the review and ensure it exists and is not deleted
  const review_info = await prisma.review.findUniqueOrThrow({ where: { id, isDeleted: false } });

  // Ensure the user who created the review exists and is not deleted
  await prisma.user.findUniqueOrThrow({ where: { id: review_info.user_id, isDeleted: false } });

  // Ensure the associated product exists and is not deleted
  await prisma.product.findFirstOrThrow({
    where: { id: review_info.product_id, isDeleted: false },
  });

  // Check if the user has permission to delete the review
  if (user.role !== UserRole.ADMIN && review_info.user_id !== user.id) {
    throw new http_error(httpStatus.UNAUTHORIZED, "You have no access to delete this.");
  }

  // Mark the review as deleted
  await prisma.review.update({
    where: { id },
    data: { isDeleted: true },
  });

  return;
};

export const review_services = {
  fetch_all_from_db,
  create_one_into_db,
  update_one_from_db,
  delete_one_from_db,
};
