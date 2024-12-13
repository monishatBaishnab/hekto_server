"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_routes = void 0;
const express_1 = require("express");
const user_controllers_1 = require("./user.controllers");
const parse_json_1 = __importDefault(require("../../middlewares/parse_json"));
const upload_1 = require("../../middlewares/upload");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Route to fetch all users
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controllers_1.user_controllers.fetch_all);
// Route to fetch a single user by ID
router.get("/:id", (0, auth_1.default)(client_1.UserRole.CUSTOMER, client_1.UserRole.VENDOR, client_1.UserRole.ADMIN), user_controllers_1.user_controllers.fetch_single);
// Route to create a new user as 'ADMIN'
router.post("/create-admin", (0, auth_1.default)(client_1.UserRole.ADMIN), upload_1.multer_up.single("file"), parse_json_1.default, user_controllers_1.user_controllers.create_admin);
// Route to update an existing user by ID
router.put("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), upload_1.multer_up.single("file"), parse_json_1.default, user_controllers_1.user_controllers.update_one);
// Route to update an existing user status by ID
router.put("/status/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controllers_1.user_controllers.update_status);
// Route to delete an existing user by ID
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.CUSTOMER, client_1.UserRole.VENDOR, client_1.UserRole.ADMIN), user_controllers_1.user_controllers.delete_one);
exports.user_routes = router;
