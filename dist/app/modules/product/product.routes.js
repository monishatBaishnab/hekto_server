"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.product_routes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const product_controllers_1 = require("./product.controllers");
const upload_1 = require("../../middlewares/upload");
const parse_json_1 = __importDefault(require("../../middlewares/parse_json"));
const router = (0, express_1.Router)();
// Route to fetch all products
router.get("/", product_controllers_1.product_controllers.fetch_all);
// Route to fetch a single product by ID
router.get("/:id", product_controllers_1.product_controllers.fetch_single);
// Route to create a new product
router.post("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR), upload_1.multer_up.single("file"), parse_json_1.default, product_controllers_1.product_controllers.create_one);
// Route to update an existing product by ID
router.put("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR), upload_1.multer_up.single("file"), parse_json_1.default, product_controllers_1.product_controllers.update_one);
// Route to delete an existing product by ID
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR), product_controllers_1.product_controllers.delete_one);
exports.product_routes = router;
