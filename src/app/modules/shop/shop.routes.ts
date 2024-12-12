import { Router } from "express";
import { shop_controllers } from "./shop.controllers";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { multer_up } from "../../middlewares/upload";
import parse_json from "../../middlewares/parse_json";

const router = Router();

// Route to fetch a all shop
router.get("/", shop_controllers.fetch_all);

// Route to fetch a single shop by ID
router.get("/:id", shop_controllers.fetch_single);

// Route to create a shop
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.VENDOR),
  multer_up.single("file"),
  parse_json,
  shop_controllers.create_one
);

// Route to update a single shop by ID
router.put(
  "/:id",
  auth(UserRole.ADMIN, UserRole.VENDOR),
  multer_up.single("file"),
  parse_json,
  shop_controllers.update_one
);

export const shop_routes = router;
