"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionKeys = void 0;
const sanitize_queries_1 = __importDefault(require("./sanitize_queries"));
// List of keys that can be part of the query options
exports.optionKeys = ["page", "limit", "sortBy", "sortOrder"];
/**
 * Sanitizes and extracts pagination and sorting options from the query.
 *
 * @param query - The query object containing pagination and sorting options.
 *
 * @returns An object with sanitized pagination and sorting options, including:
 *   - page: The current page number.
 *   - limit: The number of items per page.
 *   - skip: The number of items to skip for pagination.
 *   - sortBy: The field by which to sort.
 *   - sortOrder: The order of sorting, either 'asc' or 'desc'.
 */
const sanitize_paginate = (query) => {
    // Sanitize and extract the options from the query based on the allowed keys
    const options = (0, sanitize_queries_1.default)(query, exports.optionKeys);
    // Get the page number, defaulting to 1 if not provided
    const page = Number((options === null || options === void 0 ? void 0 : options.page) || 1);
    // Get the limit, defaulting to 10 if not provided
    const limit = Number((options === null || options === void 0 ? void 0 : options.limit) || 10);
    // Calculate the skip value for pagination
    const skip = (page - 1) * limit;
    // Get the sort field, defaulting to 'createdAt' if not provided
    const sortBy = (options === null || options === void 0 ? void 0 : options.sortBy) || "createdAt";
    // Get the sort order, defaulting to 'asc' if not provided
    const sortOrder = (options === null || options === void 0 ? void 0 : options.sortOrder) || "asc";
    // Return the sanitized pagination and sorting options
    return { page, limit, skip, sortBy, sortOrder };
};
exports.default = sanitize_paginate;
