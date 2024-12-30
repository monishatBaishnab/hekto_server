import { User, UserRole, UserStatus } from "@prisma/client";
import { TFile } from "../../types";
import bcrypt from "bcrypt";
import { local_config } from "../../config";
import { cloudinary_uploader } from "../../middlewares/upload";
import prisma from "../../utils/prisma";
import { generate_token, sanitize_token_data } from "../../utils/jsonwebtoken";
import { JwtPayload, Secret } from "jsonwebtoken";
import sanitize_paginate from "../../utils/sanitize_paginate";
import wc_builder from "../../utils/wc_builder";
import http_error from "../../errors/http_error";
import httpStatus from "http-status";
import { summarize_orders_by_date } from "./user.utils";

// Service for fetching all states
const fetch_all_states_from_db = async (user: JwtPayload) => {
  const shop_info = await prisma.shop.findUnique({
    where: { user_id: user.id },
  });

  const total_products = await prisma.product.count({
    where: { ...(user.role === UserRole.VENDOR && { shop_id: shop_info?.id }) },
  });
  const total_sales = await prisma.order.count({
    where: {
      ...(user.role === UserRole.VENDOR && {
        orderProduct: { some: { product: { shop_id: shop_info?.id } } },
      }),
    },
  });
  const orders = await prisma.order.findMany({
    where: {
      ...(user.role === UserRole.VENDOR && {
        orderProduct: { some: { product: { shop_id: shop_info?.id } } },
      }),
    },
    orderBy: { createdAt: "asc" },
  });
  const total_revenue = orders?.reduce((sum, order) => {
    return (sum = sum + Number(order.total_price));
  }, 0);

  const total_users = await prisma.user.count();

  const now = new Date();

  // Get the date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  const orders_of_this_months = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
      ...(user.role === UserRole.VENDOR && {
        orderProduct: { some: { product: { shop_id: shop_info?.id } } },
      }),
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const orders_by_date = summarize_orders_by_date(orders_of_this_months);
  const result: Record<string, unknown> = {
    total_products,
    total_sales,
    total_revenue,
    orders_by_date,
  };

  if (user.role === "ADMIN") {
    result.total_users = total_users;
  }
console.log(result);
  return result;
};

// Service for fetching all users from the database
const fetch_all_from_db = async (query: Record<string, unknown>) => {
  // Sanitize query parameters for pagination and sorting
  const { page, limit, skip, sortBy, sortOrder } = sanitize_paginate(query);

  // Define fields for search and filtering
  const searchable_filds = ["name", "email"];
  const filterable_filds = ["name", "email", "address", "role", "status"];

  // Build query conditions based on input
  const whereConditions = wc_builder(query, searchable_filds, filterable_filds);

  // Fetch users with applied filters, pagination, and sorting
  const users = await prisma.user.findMany({
    where: {
      AND: whereConditions,
    },
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  });

  // Count total users for meta information
  const total = await prisma.user.count({
    where: { AND: whereConditions },
  });

  // Return users and metadata
  return { users, meta: { limit, page, total } };
};

// Service for fetching a single user by ID
const fetch_single_from_db = async (id: string) => {
  // Retrieve user details, ensuring the record is not marked as deleted
  const user_info = await prisma.user.findUniqueOrThrow({
    where: { id, isDeleted: false },
    select: {
      password: false,
      id: true,
      name: true,
      email: true,
      profilePhoto: true,
      address: true,
      bio: true,
      role: true,
      shop: {
        select: {
          name: true,
          id: true,
          description: true,
          logo: true,
          follow: { select: { user_id: true } },
        },
      },
    },
  });

  const followers = await prisma.follow.count({
    where: {
      shop: {
        user_id: id,
      },
    },
  });

  return { ...user_info, followers };
};

// Service for creating an admin user
const create_admin_into_db = async (payload: User, file: TFile) => {
  // Prepare user data with 'ADMIN' role
  const user_data: User = { ...payload, role: "ADMIN" };

  // Hash password and assign it to user data
  const hashed_password = await bcrypt.hash(payload.password, Number(local_config.bcrypt_salt));
  user_data.password = hashed_password;

  // Upload profile photo to Cloudinary and set the URL in user data
  const uploaded_image_info = await cloudinary_uploader(file);
  if (uploaded_image_info?.secure_url) {
    user_data.profilePhoto = uploaded_image_info.secure_url;
  }

  // Create user in the database
  const created_user = await prisma.user.create({
    data: user_data,
  });

  // Generate JWT token for the new user
  const token_data = sanitize_token_data(created_user);
  const token = generate_token(token_data, local_config.user_jwt_secret as Secret);

  return { token };
};

// Service for updating user details
const update_one_from_db = async (
  id: string,
  payload: Partial<User>,
  file: TFile,
  user: JwtPayload
) => {
  // Verify if the user exists and matches the logged-in user
  const user_info = await prisma.user.findUniqueOrThrow({
    where: { id, isDeleted: false },
  });

  if (user_info.id !== user.id) {
    throw new http_error(httpStatus.UNAUTHORIZED, "You are not authorized.");
  }

  // Prepare updated user data
  const user_data = { ...payload };
  delete user_data.password; // Exclude sensitive fields
  delete user_data.profilePhoto;

  // Upload new profile photo if provided
  const uploaded_image_info = await cloudinary_uploader(file);
  if (uploaded_image_info?.secure_url) {
    user_data.profilePhoto = uploaded_image_info.secure_url;
  }

  // Update user data in the database
  const u = await prisma.user.update({
    where: { id },
    data: user_data,
  });

  return;
};

// Service for update status a user
const update_status_from_db = async (
  id: string,
  payload: { isDeleted: boolean; status: UserStatus; role: UserRole }
) => {
  // Ensure user exists and matches the logged-in user
  await prisma.user.findUniqueOrThrow({
    where: { id },
  });

  let user_data = {};

  if (payload?.status) {
    user_data = {
      status: payload.status,
      isDeleted: payload.status === UserStatus.BLOCKED ? true : false,
    };
  }
  if (payload?.role) {
    user_data = {
      role: payload.role,
    };
  }

  if (payload?.isDeleted) {
    user_data = {
      isDeleted: true,
    };
  }

  await prisma.user.update({
    where: { id },
    data: user_data,
  });

  return;
};

// Service for soft-deleting a user
const delete_one_from_db = async (id: string, user: JwtPayload) => {
  // Ensure user exists and matches the logged-in user
  const user_info = await prisma.user.findUniqueOrThrow({
    where: { id, isDeleted: false },
  });
  const shop_info = await prisma.shop.findUnique({
    where: { user_id: id, isDeleted: false },
  });

  if (user_info.id !== user.id) {
    throw new http_error(httpStatus.UNAUTHORIZED, "You are not authorized.");
  }

  // Handle related shop data if applicable
  if (shop_info) {
    await prisma.$transaction(async (prisma_t) => {
      await prisma_t.user.update({
        where: { id },
        data: { isDeleted: true },
      });
      await prisma_t.shop.update({
        where: { user_id: id },
        data: { isDeleted: true },
      });
    });
  } else {
    await prisma.user.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  return;
};

export const user_services = {
  fetch_all_from_db,
  fetch_all_states_from_db,
  fetch_single_from_db,
  create_admin_into_db,
  update_one_from_db,
  update_status_from_db,
  delete_one_from_db,
};
