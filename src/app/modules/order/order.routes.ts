import { Router } from "express";
import { order_controllers } from "./order.controllers";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

// Route to fetch all orders
router.get("/all", auth(UserRole.ADMIN), order_controllers.fetch_all);

// Route to fetch my orders
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.VENDOR, UserRole.CUSTOMER),
  order_controllers.fetch_my
);

// Route to create a new order
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.VENDOR, UserRole.CUSTOMER),
  order_controllers.create_one
);

export const order_routes = router;
