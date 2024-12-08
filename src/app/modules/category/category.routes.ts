import { Router } from "express";
import { category_controllers } from "./category.controllers";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { multer_up } from "../../middlewares/upload";
import parse_json from "../../middlewares/parse_json";

const router = Router();

// Route to fetch all categories
router.get("/", category_controllers.fetch_all);

// Route to fetch a single category by ID
router.get("/:id", category_controllers.fetch_single);

// Route to create a new category
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.VENDOR),
  multer_up.single("file"),
  parse_json,
  category_controllers.create_one
);

// Route to update an existing category by ID
router.put("/:id", auth(UserRole.ADMIN), category_controllers.update_one);

// Route to delete an existing category by ID
router.delete("/:id", auth(UserRole.ADMIN), category_controllers.delete_one);

export const category_routes = router;
