"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.order_routes = void 0;
const express_1 = require("express");
const order_controllers_1 = require("./order.controllers");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Route to fetch all orders
router.get("/all", (0, auth_1.default)(client_1.UserRole.ADMIN), order_controllers_1.order_controllers.fetch_all);
// Route to fetch my orders
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), order_controllers_1.order_controllers.fetch_my);
// Route to create a new order
router.post("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), order_controllers_1.order_controllers.create_one);
exports.order_routes = router;
