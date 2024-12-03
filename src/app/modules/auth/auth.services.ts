import { User, Shop, UserRole, UserStatus } from "@prisma/client";
import httpStatus from "http-status";
import { local_config } from "../../config";
import http_error from "../../errors/http_error";
import { cloudinary_uploader } from "../../middlewares/upload";
import { TFile } from "../../types";
import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";
import { generate_token, sanitize_token_data } from "../../utils/jsonwebtoken";
import { Secret } from "jsonwebtoken";

const login = async (payload: { email: string; password: string }) => {
  const user_info = await prisma.user.findUniqueOrThrow({
    where: { email: payload.email, status: UserStatus.ACTIVE, isDeleted: false },
  });

  const is_match_pass = await bcrypt.compare(payload.password, user_info.password);

  if (!is_match_pass) {
    throw new http_error(httpStatus.UNAUTHORIZED, "Password not matched.");
  }

  const token_data = sanitize_token_data(user_info);

  const token = generate_token(token_data, local_config.user_jwt_secret as string);

  return { token };
};

const register_into_db = async (payload: { user: User; shop?: Shop }, file: TFile) => {
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

  const token_data = sanitize_token_data(created_user);

  const token = generate_token(token_data, local_config.user_jwt_secret as Secret);

  return { token };
};

export const auth_services = {
  register_into_db,
  login,
};
