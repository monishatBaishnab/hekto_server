"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth_routes = void 0;
const express_1 = require("express");
const auth_controllers_1 = require("./auth.controllers");
const upload_1 = require("../../middlewares/upload");
const parse_json_1 = __importDefault(require("../../middlewares/parse_json"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post("/login", auth_controllers_1.auth_controllers.login);
router.post("/forgot-password", auth_controllers_1.auth_controllers.forgot_pass);
router.post("/reset-password", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), auth_controllers_1.auth_controllers.reset_pass);
router.post("/register", upload_1.multer_up.single("file"), parse_json_1.default, auth_controllers_1.auth_controllers.register);
exports.auth_routes = router;
