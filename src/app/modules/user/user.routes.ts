import { Router } from "express";
import { user_controllers } from "./user.controllers";
import parse_json from "../../middlewares/parse_json";
import { multer_up } from "../../middlewares/upload";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

// Route to fetch all users
router.get("/", auth(UserRole.ADMIN), user_controllers.fetch_all);

// Route to fetch a single user by ID
router.get(
  "/:id",
  auth(UserRole.CUSTOMER, UserRole.VENDOR, UserRole.ADMIN),
  user_controllers.fetch_single
);

// Route to create a new user as 'ADMIN'
router.post(
  "/create-admin",
  auth(UserRole.ADMIN),
  multer_up.single("file"),
  parse_json,
  user_controllers.create_admin
);

// Route to update an existing user by ID
router.put(
  "/:id",
  auth(UserRole.ADMIN, UserRole.VENDOR, UserRole.CUSTOMER),
  multer_up.single("file"),
  parse_json,
  user_controllers.update_one
);

// Route to update an existing user status by ID
router.put("/status/:id", auth(UserRole.ADMIN), user_controllers.update_status);

// Route to delete an existing user by ID
router.delete(
  "/:id",
  auth(UserRole.CUSTOMER, UserRole.VENDOR, UserRole.ADMIN),
  user_controllers.delete_one
);

export const user_routes = router;
