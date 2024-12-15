import env from "dotenv";
import path from "path";

env.config({ path: path.join(process.cwd(), ".env") });

export const local_config = {
  port: process.env.PORT,
  bcrypt_salt: process.env.BCRYPT_SALT,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  admin_jwt_secret: process.env.ADMIN_JWT_SECRET,
  user_jwt_secret: process.env.USER_JWT_SECRET,
  base_url: process.env.BASE_URL,
  store_id: process.env.STORE_ID,
  signature_key: process.env.SIGNATURE_KEY,
  app_pass: process.env.APP_PASS
};
