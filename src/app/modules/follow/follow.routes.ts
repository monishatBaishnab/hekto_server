import { Router } from "express";
import { follow_controllers } from "./follow.controllers";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/shop",
  auth(UserRole.CUSTOMER, UserRole.VENDOR, UserRole.ADMIN),
  follow_controllers.follow_shop
);

export const follow_routes = router;
