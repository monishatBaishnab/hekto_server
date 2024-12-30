import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { coupon_controllers } from "./coupon.controllers";

const router = Router();

// Route to fetch all coupons
router.get("/", coupon_controllers.fetch_all);

// Route to create a new coupon
router.post("/", auth(UserRole.VENDOR), coupon_controllers.create_one);

// Route to update an existing coupon by ID
router.put("/:id", auth(UserRole.VENDOR), coupon_controllers.update_one);

// Route to delete an existing coupon by ID
router.delete("/:id", auth(UserRole.ADMIN, UserRole.VENDOR), coupon_controllers.delete_one);

export const coupon_routes = router;
