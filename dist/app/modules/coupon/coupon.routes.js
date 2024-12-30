"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coupon_routes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const coupon_controllers_1 = require("./coupon.controllers");
const router = (0, express_1.Router)();
// Route to fetch all coupons
router.get("/", coupon_controllers_1.coupon_controllers.fetch_all);
// Route to create a new coupon
router.post("/", (0, auth_1.default)(client_1.UserRole.VENDOR), coupon_controllers_1.coupon_controllers.create_one);
// Route to update an existing coupon by ID
router.put("/:id", (0, auth_1.default)(client_1.UserRole.VENDOR), coupon_controllers_1.coupon_controllers.update_one);
// Route to delete an existing coupon by ID
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR), coupon_controllers_1.coupon_controllers.delete_one);
exports.coupon_routes = router;
