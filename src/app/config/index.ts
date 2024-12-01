import env from "dotenv";
import path from "path";

env.config({ path: path.join(process.cwd(), ".env") });

export const local_config = {
  port: process.env.PORT,
};
