import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { product_controllers } from "./product.controllers";
import { multer_up } from "../../middlewares/upload";
import parse_json from "../../middlewares/parse_json";

const router = Router();

// Route to fetch all products
router.get("/", product_controllers.fetch_all);

// Route to fetch a single product by ID
router.get("/:id", product_controllers.fetch_single);

// Route to create a new product
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.VENDOR),
  multer_up.single("file"),
  parse_json,
  product_controllers.create_one
);

// Route to update an existing product by ID
router.put(
  "/:id",
  auth(UserRole.ADMIN, UserRole.VENDOR),
  multer_up.single("file"),
  parse_json,
  product_controllers.update_one
);

// Route to delete an existing product by ID
router.delete("/:id", auth(UserRole.ADMIN, UserRole.VENDOR), product_controllers.delete_one);

export const product_routes = router;
