"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.category_routes = void 0;
const express_1 = require("express");
const category_controllers_1 = require("./category.controllers");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const upload_1 = require("../../middlewares/upload");
const parse_json_1 = __importDefault(require("../../middlewares/parse_json"));
const router = (0, express_1.Router)();
// Route to fetch all categories
router.get("/", category_controllers_1.category_controllers.fetch_all);
// Route to fetch a single category by ID
router.get("/:id", category_controllers_1.category_controllers.fetch_single);
// Route to create a new category
router.post("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR), upload_1.multer_up.single("file"), parse_json_1.default, category_controllers_1.category_controllers.create_one);
// Route to update an existing category by ID
router.put("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), category_controllers_1.category_controllers.update_one);
// Route to delete an existing category by ID
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), category_controllers_1.category_controllers.delete_one);
exports.category_routes = router;
