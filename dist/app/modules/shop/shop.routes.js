"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shop_routes = void 0;
const express_1 = require("express");
const shop_controllers_1 = require("./shop.controllers");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const upload_1 = require("../../middlewares/upload");
const parse_json_1 = __importDefault(require("../../middlewares/parse_json"));
const router = (0, express_1.Router)();
// Route to fetch a all shop
router.get("/", shop_controllers_1.shop_controllers.fetch_all);
// Route to fetch a single shop by ID
router.get("/:id", shop_controllers_1.shop_controllers.fetch_single);
// Route to create a shop
router.post("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR), upload_1.multer_up.single("file"), parse_json_1.default, shop_controllers_1.shop_controllers.create_one);
// Route to update a single shop by ID
router.put("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR), upload_1.multer_up.single("file"), parse_json_1.default, shop_controllers_1.shop_controllers.update_one);
exports.shop_routes = router;
