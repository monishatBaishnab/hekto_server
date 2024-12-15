import { Router } from "express";
import { auth_controllers } from "./auth.controllers";
import { multer_up } from "../../middlewares/upload";
import parse_json from "../../middlewares/parse_json";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/login", auth_controllers.login);

router.post("/forgot-password", auth_controllers.forgot_pass);

router.post(
  "/reset-password",
  auth(UserRole.ADMIN, UserRole.VENDOR, UserRole.CUSTOMER),
  auth_controllers.reset_pass
);

router.post("/register", multer_up.single("file"), parse_json, auth_controllers.register);

export const auth_routes = router;
