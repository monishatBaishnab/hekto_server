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
exports.coupon_services = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const sanitize_paginate_1 = __importDefault(require("../../utils/sanitize_paginate"));
// Service for apply coupon in order
const apply_coupon = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon_info = yield prisma_1.default.coupon.findUniqueOrThrow({
        where: { id: payload.id },
    });
    yield prisma_1.default.shop.findUniqueOrThrow({
        where: { id: payload.shop_id },
    });
    // Adjust 'now' to GMT+6
    const now = new Date(new Date().getTime() + 6 * 60 * 60 * 1000);
    // Dates from coupon info
    const start_date = new Date(coupon_info.start_date);
    const end_date = new Date(coupon_info.end_date);
    // Extend end_date to include the full day
    const end_of_day = new Date(end_date);
    end_of_day.setUTCHours(23, 59, 59, 999);
    // Validate coupon validity
    if (start_date && start_date > now) {
        throw new Error("Coupon is not yet valid.");
    }
    if (end_date && end_of_day < now) {
        throw new Error("Coupon has expired.");
    }
    if (coupon_info.shop_id !== payload.shop_id) {
        throw new Error("Coupon is not valid for this shop.");
    }
    return "Coupon applied successfully.";
});
// Fetch All coupons from database with pagination
const fetch_all_from_db = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { shop_id, active } = query;
    // Sanitize query parameters for pagination and sorting
    const { page, limit, skip, sortBy, sortOrder } = (0, sanitize_paginate_1.default)(query);
    const now = new Date(new Date().getTime() + 6 * 60 * 60 * 1000);
    // Fetch coupons from the database with the applied conditions, pagination, and sorting
    const coupons = yield prisma_1.default.coupon.findMany({
        where: Object.assign(Object.assign({ isDeleted: false, is_active: true }, (shop_id ? { shop_id: shop_id } : {})), (active ? { start_date: { lte: now }, end_date: { gte: now } } : {})),
        skip: skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
    });
    const total = yield prisma_1.default.coupon.count({
        where: Object.assign(Object.assign({ isDeleted: false, is_active: true }, (shop_id ? { shop_id: shop_id } : {})), (active ? { start_date: { lte: now }, end_date: { gte: now } } : {})),
    });
    // Return the list of coupons
    return { coupons, meta: { limit, page, total } };
});
// Creates a new coupon in the database
const create_one_into_db = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure the shop exists and is not deleted
    yield prisma_1.default.shop.findFirstOrThrow({ where: { id: payload.shop_id, isDeleted: false } });
    // Prepare coupon data with the user ID
    const coupon_data = Object.assign({}, payload);
    // Create and save the coupon
    const created_coupon = yield prisma_1.default.coupon.create({
        data: coupon_data,
    });
    return created_coupon;
});
// Updates an existing coupon in the database
const update_one_from_db = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the coupon and ensure it exists and is not deleted
    yield prisma_1.default.coupon.findUniqueOrThrow({ where: { id, isDeleted: false } });
    // Ensure the shop exists and is not deleted
    yield prisma_1.default.shop.findFirstOrThrow({ where: { id: payload.shop_id, isDeleted: false } });
    // Update the coupon with the new data
    const coupon_data = Object.assign({}, payload);
    const updated_coupon = yield prisma_1.default.coupon.update({
        where: { id },
        data: coupon_data,
    });
    return updated_coupon;
});
// Soft deletes a coupon from the database
const delete_one_from_db = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the coupon and ensure it exists and is not deleted
    yield prisma_1.default.coupon.findUniqueOrThrow({ where: { id, isDeleted: false } });
    yield prisma_1.default.coupon.update({
        where: { id },
        data: { isDeleted: true },
    });
    return;
});
exports.coupon_services = {
    apply_coupon,
    fetch_all_from_db,
    create_one_into_db,
    update_one_from_db,
    delete_one_from_db,
};
