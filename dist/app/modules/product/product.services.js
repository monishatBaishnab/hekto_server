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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.product_services = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const upload_1 = require("../../middlewares/upload");
const http_error_1 = __importDefault(require("../../errors/http_error"));
const http_status_1 = __importDefault(require("http-status"));
const sanitize_paginate_1 = __importDefault(require("../../utils/sanitize_paginate"));
const wc_builder_1 = __importDefault(require("../../utils/wc_builder"));
const sanitize_queries_1 = __importDefault(require("../../utils/sanitize_queries"));
const fetch_all_from_db = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { min_price, max_price } = query !== null && query !== void 0 ? query : {};
    // Sanitize query parameters for pagination and sorting
    const { page, limit, skip, sortBy, sortOrder } = (0, sanitize_paginate_1.default)(query);
    // Build where conditions based on the query (e.g., filtering by 'name')
    const whereConditions = (0, wc_builder_1.default)(query, ["name"], ["name", "shop_id"]);
    const { categories: categoriesStr } = (0, sanitize_queries_1.default)(query, ["categories"]) || {};
    const categories = (categoriesStr === null || categoriesStr === void 0 ? void 0 : categoriesStr.split(", ").map((str) => str.trim()).filter((category) => category !== "")) || [];
    const and_conditions = [
        { AND: whereConditions },
        { shop: { isDeleted: false } }, // Filter shops that are not deleted
        {
            price: {
                gte: min_price ? Number(min_price) : 0,
                lte: max_price ? Number(max_price) : 1000,
            },
        },
        ...(categories.length > 0
            ? [
                {
                    productCategory: {
                        some: {
                            OR: categories.map((category) => ({
                                category_id: { contains: category },
                            })),
                        },
                    },
                },
            ]
            : []),
    ];
    // Fetch products with conditions, pagination, sorting, and nested data
    const products = yield prisma_1.default.product.findMany({
        where: {
            AND: [{ AND: and_conditions }],
        },
        skip: skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
            productCategory: {
                select: { category: { select: { id: true, name: true } } },
            },
            shop: {
                select: {
                    id: true,
                    name: true,
                    logo: true,
                    createdAt: true,
                },
            },
            review: {
                select: {
                    rating: true,
                },
            },
        },
    });
    // Count total products matching the query (ignores pagination)
    const total = yield prisma_1.default.product.count({
        where: {
            AND: [{ AND: and_conditions, shop: { status: "ACTIVE" } }],
        },
    });
    // Reshape data: transform productCategory into categories
    const filteredProducts = products.map((product) => (Object.assign(Object.assign({}, product), { categories: product.productCategory.map((pc) => pc.category), productCategory: undefined })));
    return { products: filteredProducts, meta: { page, limit, total } };
});
const fetch_single_from_db = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Query the product, ensuring both the product and its shop are not deleted
    const product = yield prisma_1.default.product.findUnique({
        where: { id, isDeleted: false, shop: { isDeleted: false } },
        include: {
            productCategory: {
                select: { category: { select: { id: true, name: true } } },
            },
            shop: {
                select: {
                    id: true,
                    name: true,
                    logo: true,
                },
            },
            review: {
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profilePhoto: true,
                            createdAt: true,
                        },
                    },
                    product: { select: { name: true } },
                },
            },
            // OrderProduct: {
            //   select: {
            //     order: {
            //       select: {
            //         user_id: true,
            //       },
            //     },
            //   },
            // },
        },
    });
    // Extract and reshape product categories
    const categories = (_a = product === null || product === void 0 ? void 0 : product.productCategory) === null || _a === void 0 ? void 0 : _a.map((category) => category.category);
    // Return product with reshaped categories
    return Object.assign(Object.assign({}, product), { productCategory: undefined, categories });
});
// Function to create a new product in the database
const create_one_into_db = (data, file, user) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = data !== null && data !== void 0 ? data : {}, { categories } = _a, payload = __rest(_a, ["categories"]);
    // Validate if an image file is provided
    if (!file) {
        throw new http_error_1.default(http_status_1.default.BAD_REQUEST, "Please select an image.");
    }
    // Prepare product data and set available quantity
    const shop_data = Object.assign(Object.assign({}, payload), { price: Number(payload.price), discount: Number(payload.discount), quantity: Number(payload.quantity), availableQuantity: Number(payload.quantity) });
    // Retrieve shop information for the authenticated user
    const shop_info = yield prisma_1.default.shop.findUniqueOrThrow({
        where: { user_id: user.id, isDeleted: false },
        select: { id: true },
    });
    shop_data.shop_id = shop_info.id;
    // Upload the product image to Cloudinary and add uploaded image URL to product data
    const uploaded_image = yield (0, upload_1.cloudinary_uploader)(file);
    if (uploaded_image === null || uploaded_image === void 0 ? void 0 : uploaded_image.secure_url) {
        shop_data.images = uploaded_image.secure_url;
    }
    // Save product and associated categories in a database transaction
    const created_product = yield prisma_1.default.$transaction((prisma_t) => __awaiter(void 0, void 0, void 0, function* () {
        // Create the product record
        const product = yield prisma_t.product.create({
            data: shop_data,
        });
        // Link the product with its categories
        for (const category of categories || []) {
            yield prisma_t.productCategory.create({
                data: { product_id: product.id, category_id: category.id },
            });
        }
        // Return the created product
        return product;
    }));
    // Return the created product with all associations
    return created_product;
});
// Updates a product in the database along with its associated categories.
const update_one_from_db = (id, data, file, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure the product exists before updating
    if (user.role === client_1.UserRole.VENDOR) {
        yield prisma_1.default.product.findUniqueOrThrow({
            where: { id, isDeleted: false, shop: { isDeleted: false, user_id: user.id } },
        });
    }
    else {
        yield prisma_1.default.product.findUniqueOrThrow({
            where: { id, isDeleted: false, shop: { isDeleted: false } },
        });
    }
    const _a = data !== null && data !== void 0 ? data : {}, { categories } = _a, payload = __rest(_a, ["categories"]);
    // Prepare product data, including available quantity
    const shop_data = Object.assign(Object.assign({}, payload), { discount: Number(payload.discount), price: Number(payload.price), quantity: Number(payload.quantity), availableQuantity: Number(payload.quantity) });
    // Upload product image to Cloudinary and add the URL to product data
    const uploaded_image = yield (0, upload_1.cloudinary_uploader)(file);
    if (uploaded_image === null || uploaded_image === void 0 ? void 0 : uploaded_image.secure_url) {
        shop_data.images = uploaded_image.secure_url;
    }
    // Separate categories into those to link and unlink
    const c_categories = (categories === null || categories === void 0 ? void 0 : categories.filter((category) => !category.isDeleted)) || [];
    const d_categories = (categories === null || categories === void 0 ? void 0 : categories.filter((category) => category.isDeleted)) || [];
    // Perform database operations in a transaction
    yield prisma_1.default.$transaction((prisma_t) => __awaiter(void 0, void 0, void 0, function* () {
        // Update product details
        const product = yield prisma_t.product.update({
            where: { id },
            data: shop_data,
        });
        // Link product to new categories
        for (const category of c_categories) {
            yield prisma_t.productCategory.create({
                data: { product_id: product.id, category_id: category.id },
            });
        }
        // Unlink product from removed categories
        for (const category of d_categories) {
            yield prisma_t.productCategory.deleteMany({
                where: { product_id: product.id, category_id: category.id },
            });
        }
    }));
    // Fetch and return the updated product with associations
    const updated_product = yield fetch_single_from_db(id);
    return updated_product;
});
const delete_one_from_db = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure the product exists before deleting
    if (user.role === client_1.UserRole.VENDOR) {
        yield prisma_1.default.product.findUniqueOrThrow({
            where: { id, isDeleted: false, shop: { isDeleted: false, user_id: user.id } },
        });
    }
    else {
        yield prisma_1.default.product.findUniqueOrThrow({
            where: { id, isDeleted: false, shop: { isDeleted: false } },
        });
    }
    yield prisma_1.default.product.update({ data: { isDeleted: true }, where: { id } });
});
exports.product_services = {
    fetch_all_from_db,
    fetch_single_from_db,
    create_one_into_db,
    update_one_from_db,
    delete_one_from_db,
};
