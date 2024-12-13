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
exports.shop_services = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const sanitize_paginate_1 = __importDefault(require("../../utils/sanitize_paginate"));
const wc_builder_1 = __importDefault(require("../../utils/wc_builder"));
const upload_1 = require("../../middlewares/upload");
const http_error_1 = __importDefault(require("../../errors/http_error"));
const http_status_1 = __importDefault(require("http-status"));
const fetch_all_from_db = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // Sanitize query parameters for pagination and sorting
    const { page, limit, skip, sortBy, sortOrder } = (0, sanitize_paginate_1.default)(query);
    // Build where conditions based on the query (e.g., filtering by 'name')
    const whereConditions = (0, wc_builder_1.default)(query, ["name"], ["name"]);
    // Fetch shops from the database with the applied conditions, pagination, and sorting
    const shops = yield prisma_1.default.shop.findMany({
        where: {
            AND: whereConditions,
        },
        skip: skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
            user: {
                select: { name: true, email: true, role: true },
            },
        },
    });
    const total = yield prisma_1.default.shop.count({
        where: { AND: whereConditions },
    });
    // Return the list of shops
    return { data: shops, meta: { limit, page, total } };
});
const fetch_single_from_db = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Find a unique shop by ID, throwing an error if not found
    const shop = yield prisma_1.default.shop.findUniqueOrThrow({
        where: { id, isDeleted: false },
        include: {
            follow: {
                select: { user_id: true },
            },
        },
    });
    // Return the found shop
    return shop;
});
const create_one_from_db = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    const user_shop = yield prisma_1.default.shop.findUnique({ where: { user_id: payload.user_id } });
    if (user_shop) {
        throw new http_error_1.default(http_status_1.default.CONFLICT, "User already have a shop.");
    }
    const upload_file = yield (0, upload_1.cloudinary_uploader)(file);
    if (upload_file === null || upload_file === void 0 ? void 0 : upload_file.secure_url) {
        payload.logo = upload_file.secure_url;
    }
    // Create a new shop using the provided payload data
    const created_shop = yield prisma_1.default.shop.create({
        data: payload,
    });
    // Return the newly created shop
    return created_shop;
});
const update_one_from_db = (id, payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure the category exists before updating
    yield prisma_1.default.shop.findUniqueOrThrow({
        where: { id },
    });
    const upload_file = yield (0, upload_1.cloudinary_uploader)(file);
    if (upload_file === null || upload_file === void 0 ? void 0 : upload_file.secure_url) {
        payload.logo = upload_file.secure_url;
    }
    // Create a new shop using the provided payload data
    const updated_shop = yield prisma_1.default.shop.update({
        where: { id },
        data: payload,
    });
    // Return the newly created shop
    return updated_shop;
});
exports.shop_services = {
    fetch_all_from_db,
    fetch_single_from_db,
    create_one_from_db,
    update_one_from_db,
};
