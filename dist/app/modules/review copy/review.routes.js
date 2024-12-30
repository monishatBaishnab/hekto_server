"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.review_routes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const review_controllers_1 = require("./review.controllers");
const router = (0, express_1.Router)();
// Route to fetch all reviews
router.get("/", review_controllers_1.review_controllers.fetch_all);
// Route to create a new review
router.post("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER, client_1.UserRole.VENDOR), review_controllers_1.review_controllers.create_one);
// Route to update an existing review by ID
router.put("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER, client_1.UserRole.VENDOR), review_controllers_1.review_controllers.update_one);
// Route to delete an existing review by ID
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER, client_1.UserRole.VENDOR), review_controllers_1.review_controllers.delete_one);
exports.review_routes = router;
