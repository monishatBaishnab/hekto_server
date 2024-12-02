import { Shop, User, UserRole } from "@prisma/client";
import { TFile } from "../../types";
import bcrypt from "bcrypt";
import { local_config } from "../../config";
import { cloudinary_uploader } from "../../middlewares/upload";
import prisma from "../../utils/prisma_client";
import http_error from "../../errors/http_error";
import httpStatus from "http-status";
import { generate_token, sanitize_token_data } from "../../utils/jsonwebtoken";
import { Secret } from "jsonwebtoken";

const fetch_all_from_db = async () => {};

const fetch_single_from_db = async (id: string) => {};

const create_admin_into_db = async (payload: User, file: TFile) => {
  const user_data: User = { ...payload, role: "ADMIN" };

  // Hashed password and set this in user data
  const hashed_password = await bcrypt.hash(payload.password, Number(local_config.bcrypt_salt));
  user_data.password = hashed_password;

  // Upload image in cloudinary and set the image link in user data
  const uploaded_image_info = await cloudinary_uploader(file);
  if (uploaded_image_info?.secure_url) {
    user_data.profilePhoto = uploaded_image_info.secure_url;
  }

  const created_user = await prisma.user.create({
    data: user_data,
  });

  const token_data = sanitize_token_data(created_user);

  const token = generate_token(token_data, local_config.user_jwt_secret as Secret);
  
  return {token};
};

const update_one_from_db = async (id: string, payload: Partial<User>) => {};

const delete_one_from_db = async (id: string) => {};

export const user_services = {
  fetch_all_from_db,
  fetch_single_from_db,
  create_admin_into_db,
  update_one_from_db,
  delete_one_from_db,
};
