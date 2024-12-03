"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.follow_routes = void 0;
const express_1 = require("express");
const follow_controllers_1 = require("./follow.controllers");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post("/shop", (0, auth_1.default)(client_1.UserRole.CUSTOMER, client_1.UserRole.VENDOR, client_1.UserRole.ADMIN), follow_controllers_1.follow_controllers.follow_shop);
exports.follow_routes = router;
