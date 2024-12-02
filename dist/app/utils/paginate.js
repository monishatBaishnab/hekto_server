"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionKeys = void 0;
const sanitize_queries_1 = __importDefault(require("./sanitize_queries"));
// List of keys that can be part of the query options
exports.optionKeys = ["page", "limit", "sortBy", "sortOrder"];
const sanitize_paginate = (query) => {
    // Sanitize and extract the options from the query based on the allowed keys
    const options = (0, sanitize_queries_1.default)(query, exports.optionKeys);
    const page = Number((options === null || options === void 0 ? void 0 : options.page) || 1);
    const limit = Number((options === null || options === void 0 ? void 0 : options.limit) || 10);
    const skip = (page - 1) * limit;
    const sortBy = options === null || options === void 0 ? void 0 : options.sortBy;
    const sortOrder = (options === null || options === void 0 ? void 0 : options.sortOrder) || "asc";
    return { page, limit, skip, sortBy, sortOrder };
};
exports.default = sanitize_paginate;
