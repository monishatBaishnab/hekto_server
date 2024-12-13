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
exports.category_services = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const sanitize_paginate_1 = __importDefault(require("../../utils/sanitize_paginate"));
const wc_builder_1 = __importDefault(require("../../utils/wc_builder"));
const upload_1 = require("../../middlewares/upload");
// Fetch all categories with pagination, sorting, and filtering
const fetch_all_from_db = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // Sanitize query parameters for pagination and sorting
    const { page, limit, skip, sortBy, sortOrder } = (0, sanitize_paginate_1.default)(query);
    // Build where conditions based on the query (e.g., filtering by 'name')
    const whereConditions = (0, wc_builder_1.default)(query, ["name"], ["name"]);
    // Fetch categories from the database with the applied conditions, pagination, and sorting
    const categories = yield prisma_1.default.category.findMany({
        where: {
            AND: whereConditions,
        },
        skip: skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
            productCategory: {
                select: {
                    product: { select: { _count: true } },
                },
            },
        },
    });
    const total = yield prisma_1.default.category.count({
        where: { AND: whereConditions },
    });
    // Return the list of categories
    return { categories, meta: { limit, page, total } };
});
// Fetch a single category by its ID, ensuring it is not deleted
const fetch_single_from_db = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Find a unique category by ID, throwing an error if not found
    const category = yield prisma_1.default.category.findUniqueOrThrow({
        where: { id, isDeleted: false },
    });
    // Return the found category
    return category;
});
// Create a new category in the database
const create_one_into_db = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    const upload_file = yield (0, upload_1.cloudinary_uploader)(file);
    if (upload_file === null || upload_file === void 0 ? void 0 : upload_file.secure_url) {
        payload.image = upload_file.secure_url;
    }
    // Create a new category using the provided payload data
    const created_category = yield prisma_1.default.category.create({
        data: payload,
    });
    // Return the newly created category
    return created_category;
});
// Update an existing category by its ID
const update_one_from_db = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure the category exists before updating
    yield prisma_1.default.category.findUniqueOrThrow({
        where: { id },
    });
    // Update the category with the new data
    const updated_category = yield prisma_1.default.category.update({
        where: { id },
        data: payload,
    });
    // Return the updated category
    return updated_category;
});
// Mark a category as deleted by updating its 'isDeleted' status
const delete_one_from_db = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure the category exists before marking it as deleted
    yield prisma_1.default.category.findUniqueOrThrow({
        where: { id },
    });
    // Update the category to mark it as deleted
    const updated_category = yield prisma_1.default.category.update({
        where: { id },
        data: { isDeleted: true },
    });
    // Return the updated category
    return updated_category;
});
exports.category_services = {
    fetch_all_from_db,
    fetch_single_from_db,
    create_one_into_db,
    update_one_from_db,
    delete_one_from_db,
};
