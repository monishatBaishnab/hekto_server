"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth_services = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = require("../../config");
const http_error_1 = __importDefault(require("../../errors/http_error"));
const upload_1 = require("../../middlewares/upload");
const prisma_client_1 = __importDefault(require("../../utils/prisma_client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("../../utils/jsonwebtoken");
const register_into_db = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.user.role === client_1.UserRole.ADMIN) {
        throw new http_error_1.default(http_status_1.default.UNAUTHORIZED, "You do not have permission.");
    }
    const user_data = Object.assign(Object.assign({}, payload.user), { role: payload.user.role.toUpperCase() });
    // Hashed password and set this in user data
    const hashed_password = yield bcrypt_1.default.hash(payload.user.password, Number(config_1.local_config.bcrypt_salt));
    user_data.password = hashed_password;
    // Upload image in cloudinary and set the image link in user data
    const uploaded_image_info = yield (0, upload_1.cloudinary_uploader)(file);
    if (uploaded_image_info === null || uploaded_image_info === void 0 ? void 0 : uploaded_image_info.secure_url) {
        user_data.profilePhoto = uploaded_image_info.secure_url;
    }
    let created_user;
    // Check if the user's role is 'VENDOR'
    if (user_data.role === client_1.UserRole.VENDOR) {
        // Ensure shop information is provided for vendors
        if (!payload.shop) {
            throw new http_error_1.default(http_status_1.default.BAD_REQUEST, "Please provide shop information.");
        }
        // Prepare the shop data, including the logo URL
        const shop_data = Object.assign({}, payload.shop);
        shop_data.logo = uploaded_image_info === null || uploaded_image_info === void 0 ? void 0 : uploaded_image_info.secure_url;
        // Use a transaction to create the user and shop records together
        created_user = yield prisma_client_1.default.$transaction((prisma_t) => __awaiter(void 0, void 0, void 0, function* () {
            // Create the user and store the created user object
            const user = yield prisma_t.user.create({
                data: user_data,
            });
            // Create the shop record and associate it with the created user
            yield prisma_t.shop.create({
                data: Object.assign(Object.assign({}, shop_data), { user_id: user.id }),
            });
            return user;
        }));
    }
    else {
        // For non-vendor users, simply create the user record
        created_user = yield prisma_client_1.default.user.create({
            data: user_data,
        });
    }
    const token_data = (0, jsonwebtoken_1.sanitize_token_data)(created_user);
    const token = (0, jsonwebtoken_1.generate_token)(token_data, config_1.local_config.user_jwt_secret);
    return { token };
});
exports.auth_services = {
    register_into_db,
};
