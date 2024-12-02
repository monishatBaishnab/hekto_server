import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { review_controllers } from "./review.controllers";

const router = Router();

// Route to fetch all reviews
router.get("/", review_controllers.fetch_all);

// Route to create a new review
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
  review_controllers.create_one
);

// Route to update an existing review by ID
router.put(
  "/:id",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
  review_controllers.update_one
);

// Route to delete an existing review by ID
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
  review_controllers.delete_one
);

export const review_routes = router;
