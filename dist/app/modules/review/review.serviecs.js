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
exports.review_services = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const http_error_1 = __importDefault(require("../../errors/http_error"));
const http_status_1 = __importDefault(require("http-status"));
const sanitize_paginate_1 = __importDefault(require("../../utils/sanitize_paginate"));
// Fetch All reviews from database with pagination
const fetch_all_from_db = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { shop_id } = query;
    // Sanitize query parameters for pagination and sorting
    const { page, limit, skip, sortBy, sortOrder } = (0, sanitize_paginate_1.default)(query);
    // Fetch reviews from the database with the applied conditions, pagination, and sorting
    const reviews = yield prisma_1.default.review.findMany({
        where: { isDeleted: false, product: { shop_id: shop_id } },
        skip: skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
            id: true,
            rating: true,
            comment: true,
            user: { select: { id: true, name: true, email: true, address: true, profilePhoto: true, createdAt: true } },
            product: { select: { name: true } },
        },
    });
    const total = yield prisma_1.default.review.count();
    // Return the list of reviews
    return { reviews, meta: { limit, page, total } };
});
// Creates a new review in the database
const create_one_into_db = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure the product exists and is not deleted
    yield prisma_1.default.product.findFirstOrThrow({ where: { id: payload.product_id, isDeleted: false } });
    // Ensure the user exists and is not deleted
    yield prisma_1.default.user.findUniqueOrThrow({ where: { id: user.id, isDeleted: false } });
    // Prepare review data with the user ID
    const review_data = Object.assign(Object.assign({}, payload), { rating: Number(payload.rating), user_id: user.id });
    // Create and save the review
    const created_review = yield prisma_1.default.review.create({
        data: review_data,
    });
    return created_review;
});
// Updates an existing review in the database
const update_one_from_db = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the review and ensure it exists and is not deleted
    const review_info = yield prisma_1.default.review.findUniqueOrThrow({ where: { id, isDeleted: false } });
    // Ensure the user who created the review exists and is not deleted
    yield prisma_1.default.user.findUniqueOrThrow({ where: { id: review_info.user_id, isDeleted: false } });
    // Ensure the associated product exists and is not deleted
    yield prisma_1.default.product.findFirstOrThrow({
        where: { id: review_info.product_id, isDeleted: false },
    });
    // Check if the user has permission to update the review
    if (user.role !== client_1.UserRole.ADMIN && review_info.user_id !== user.id) {
        throw new http_error_1.default(http_status_1.default.UNAUTHORIZED, "You have no access to update this.");
    }
    // Update the review with the new data
    const review_data = Object.assign({}, payload);
    const updated_review = yield prisma_1.default.review.update({
        where: { id },
        data: review_data,
    });
    return updated_review;
});
// Soft deletes a review from the database
const delete_one_from_db = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the review and ensure it exists and is not deleted
    const review_info = yield prisma_1.default.review.findUniqueOrThrow({ where: { id, isDeleted: false } });
    // Ensure the user who created the review exists and is not deleted
    yield prisma_1.default.user.findUniqueOrThrow({ where: { id: review_info.user_id, isDeleted: false } });
    // Ensure the associated product exists and is not deleted
    yield prisma_1.default.product.findFirstOrThrow({
        where: { id: review_info.product_id, isDeleted: false },
    });
    // Check if the user has permission to delete the review
    if (user.role !== client_1.UserRole.ADMIN && review_info.user_id !== user.id) {
        throw new http_error_1.default(http_status_1.default.UNAUTHORIZED, "You have no access to delete this.");
    }
    // Mark the review as deleted
    yield prisma_1.default.review.update({
        where: { id },
        data: { isDeleted: true },
    });
    return;
});
exports.review_services = {
    fetch_all_from_db,
    create_one_into_db,
    update_one_from_db,
    delete_one_from_db,
};
