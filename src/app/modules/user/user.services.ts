import { Shop, User, UserRole } from "@prisma/client";
import { TFile } from "../../types";
import bcrypt from "bcrypt";
import { local_config } from "../../config";
import { cloudinary_uploader } from "../../middlewares/upload";
import prisma from "../../utils/prisma_client";
import http_error from "../../errors/http_error";
import httpStatus from "http-status";

const fetch_all_from_db = async () => {};

const fetch_single_from_db = async (id: string) => {};

const create_one_into_db = async (payload: { user: User; shop?: Shop }, file: TFile) => {
  if (payload.user.role === UserRole.ADMIN) {
    throw new http_error(httpStatus.UNAUTHORIZED, "You do not have permission.");
  }

  const user_data: User = { ...payload.user, role: payload.user.role.toUpperCase() as UserRole };

  // Hashed password and set this in user data
  const hashed_password = await bcrypt.hash(
    payload.user.password,
    Number(local_config.bcrypt_salt)
  );
  user_data.password = hashed_password;

  // Upload image in cloudinary and set the image link in user data
  const uploaded_image_info = await cloudinary_uploader(file);
  if (uploaded_image_info?.secure_url) {
    user_data.profilePhoto = uploaded_image_info.secure_url;
  }

  let created_user;

  // Check if the user's role is 'VENDOR'
  if (user_data.role === UserRole.VENDOR) {
    // Ensure shop information is provided for vendors
    if (!payload.shop) {
      throw new http_error(httpStatus.BAD_REQUEST, "Please provide shop information.");
    }

    // Prepare the shop data, including the logo URL
    const shop_data = { ...payload.shop };
    shop_data.logo = uploaded_image_info?.secure_url as string;

    // Use a transaction to create the user and shop records together
    created_user = await prisma.$transaction(async (prisma_t) => {
      // Create the user and store the created user object
      const user = await prisma_t.user.create({
        data: user_data,
      });

      // Create the shop record and associate it with the created user
      await prisma_t.shop.create({
        data: { ...shop_data, user_id: user.id },
      });

      return user;
    });
  } else {
    // For non-vendor users, simply create the user record
    created_user = await prisma.user.create({
      data: user_data,
    });
  }

  // Return the created user (vendor or not)
  return created_user;
};

const update_one_from_db = async (id: string, payload: Partial<User>) => {};

const delete_one_from_db = async (id: string) => {};

export const user_services = {
  fetch_all_from_db,
  fetch_single_from_db,
  create_one_into_db,
  update_one_from_db,
  delete_one_from_db,
};
