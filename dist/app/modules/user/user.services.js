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
exports.user_services = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../../config");
const upload_1 = require("../../middlewares/upload");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const jsonwebtoken_1 = require("../../utils/jsonwebtoken");
const sanitize_paginate_1 = __importDefault(require("../../utils/sanitize_paginate"));
const wc_builder_1 = __importDefault(require("../../utils/wc_builder"));
const http_error_1 = __importDefault(require("../../errors/http_error"));
const http_status_1 = __importDefault(require("http-status"));
// Service for fetching all users from the database
const fetch_all_from_db = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // Sanitize query parameters for pagination and sorting
    const { page, limit, skip, sortBy, sortOrder } = (0, sanitize_paginate_1.default)(query);
    // Define fields for search and filtering
    const searchable_filds = ["name", "email"];
    const filterable_filds = ["name", "email", "address", "role", "status"];
    // Build query conditions based on input
    const whereConditions = (0, wc_builder_1.default)(query, searchable_filds, filterable_filds);
    // Fetch users with applied filters, pagination, and sorting
    const users = yield prisma_1.default.user.findMany({
        where: {
            AND: whereConditions,
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
    });
    // Count total users for meta information
    const total = yield prisma_1.default.user.count({
        where: { AND: whereConditions },
    });
    // Return users and metadata
    return { users, meta: { limit, page, total } };
});
// Service for fetching a single user by ID
const fetch_single_from_db = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Retrieve user details, ensuring the record is not marked as deleted
    const user_info = yield prisma_1.default.user.findUniqueOrThrow({
        where: { id, isDeleted: false },
        select: {
            password: false,
            id: true,
            name: true,
            email: true,
            profilePhoto: true,
            address: true,
            role: true,
            shop: {
                select: {
                    name: true,
                    id: true,
                    description: true,
                    logo: true,
                },
            },
        },
    });
    return user_info;
});
// Service for creating an admin user
const create_admin_into_db = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    // Prepare user data with 'ADMIN' role
    const user_data = Object.assign(Object.assign({}, payload), { role: "ADMIN" });
    // Hash password and assign it to user data
    const hashed_password = yield bcrypt_1.default.hash(payload.password, Number(config_1.local_config.bcrypt_salt));
    user_data.password = hashed_password;
    // Upload profile photo to Cloudinary and set the URL in user data
    const uploaded_image_info = yield (0, upload_1.cloudinary_uploader)(file);
    if (uploaded_image_info === null || uploaded_image_info === void 0 ? void 0 : uploaded_image_info.secure_url) {
        user_data.profilePhoto = uploaded_image_info.secure_url;
    }
    // Create user in the database
    const created_user = yield prisma_1.default.user.create({
        data: user_data,
    });
    // Generate JWT token for the new user
    const token_data = (0, jsonwebtoken_1.sanitize_token_data)(created_user);
    const token = (0, jsonwebtoken_1.generate_token)(token_data, config_1.local_config.user_jwt_secret);
    return { token };
});
// Service for updating user details
const update_one_from_db = (id, payload, file, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify if the user exists and matches the logged-in user
    const user_info = yield prisma_1.default.user.findUniqueOrThrow({
        where: { id, isDeleted: false },
    });
    if (user_info.id !== user.id) {
        throw new http_error_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized.");
    }
    // Prepare updated user data
    const user_data = Object.assign({}, payload);
    delete user_data.password; // Exclude sensitive fields
    delete user_data.profilePhoto;
    // Upload new profile photo if provided
    const uploaded_image_info = yield (0, upload_1.cloudinary_uploader)(file);
    if (uploaded_image_info === null || uploaded_image_info === void 0 ? void 0 : uploaded_image_info.secure_url) {
        user_data.profilePhoto = uploaded_image_info.secure_url;
    }
    // Update user data in the database
    yield prisma_1.default.user.update({
        where: { id },
        data: user_data,
    });
    return;
});
// Service for update status a user
const update_status_from_db = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure user exists and matches the logged-in user
    yield prisma_1.default.user.findUniqueOrThrow({
        where: { id },
    });
    let user_data = {};
    if (payload === null || payload === void 0 ? void 0 : payload.status) {
        user_data = {
            status: payload.status,
            isDeleted: payload.status === client_1.UserStatus.BLOCKED ? true : false,
        };
    }
    if (payload === null || payload === void 0 ? void 0 : payload.role) {
        user_data = {
            role: payload.role,
        };
    }
    if (payload === null || payload === void 0 ? void 0 : payload.isDeleted) {
        user_data = {
            isDeleted: true,
        };
    }
    console.log(user_data);
    yield prisma_1.default.user.update({
        where: { id },
        data: user_data,
    });
    return;
});
// Service for soft-deleting a user
const delete_one_from_db = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure user exists and matches the logged-in user
    const user_info = yield prisma_1.default.user.findUniqueOrThrow({
        where: { id, isDeleted: false },
    });
    const shop_info = yield prisma_1.default.shop.findUnique({
        where: { user_id: id, isDeleted: false },
    });
    if (user_info.id !== user.id) {
        throw new http_error_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized.");
    }
    // Handle related shop data if applicable
    if (shop_info) {
        yield prisma_1.default.$transaction((prisma_t) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma_t.user.update({
                where: { id },
                data: { isDeleted: true },
            });
            yield prisma_t.shop.update({
                where: { user_id: id },
                data: { isDeleted: true },
            });
        }));
    }
    else {
        yield prisma_1.default.user.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
    return;
});
exports.user_services = {
    fetch_all_from_db,
    fetch_single_from_db,
    create_admin_into_db,
    update_one_from_db,
    update_status_from_db,
    delete_one_from_db,
};
