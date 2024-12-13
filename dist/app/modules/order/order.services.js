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
exports.order_services = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const payment_utils_1 = require("../payment/payment.utils");
const sanitize_paginate_1 = __importDefault(require("../../utils/sanitize_paginate"));
const wc_builder_1 = __importDefault(require("../../utils/wc_builder"));
const order_filterable_filds = ["payment_method", "payment_status", "order_status"];
const fetch_all_from_db = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // Sanitize query parameters for pagination and sorting
    const { page, limit, skip, sortBy, sortOrder } = (0, sanitize_paginate_1.default)(query);
    // Build where conditions based on the query (e.g., filtering by "payment_method", "payment_status", "order_status")
    const whereConditions = (0, wc_builder_1.default)(query, [], order_filterable_filds);
    // Fetch orders from the database with the applied conditions, pagination, and sorting
    const orders = yield prisma_1.default.order.findMany({
        where: {
            AND: whereConditions,
        },
        skip: skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
            orderProduct: { select: { product: { select: { id: true, name: true, images: true } } } },
            user: { select: { id: true, email: true, profilePhoto: true, name: true } },
        },
    });
    const total = yield prisma_1.default.order.count({
        where: { AND: whereConditions },
    });
    // Return the list of orders
    return { orders: orders, meta: { limit, page, total } };
});
const fetch_my_from_db = (query, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Sanitize query parameters for pagination and sorting
    const { page, limit, skip, sortBy, sortOrder } = (0, sanitize_paginate_1.default)(query);
    // Build where conditions based on the query (e.g., filtering by "payment_method", "payment_status", "order_status")
    const whereConditions = (0, wc_builder_1.default)(query, [], order_filterable_filds);
    const { shop_id } = query;
    // Fetch orders from the database with the applied conditions, pagination, and sorting
    const orders = yield prisma_1.default.order.findMany({
        where: {
            AND: [
                ...whereConditions, // Ensure whereConditions is correctly formed as an array
                shop_id ? { orderProduct: { some: { product: { shop_id } } } } : { user_id: user.id },
            ],
        },
        skip: skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
            orderProduct: { select: { product: { select: { id: true, name: true, images: true } } } },
            user: { select: { id: true, email: true, profilePhoto: true, name: true } },
        },
    });
    const total = yield prisma_1.default.order.count({
        where: {
            AND: [
                {
                    AND: whereConditions,
                },
                {
                    user_id: user.id,
                },
            ],
        },
    });
    // Return the list of orders
    return { orders: orders, meta: { limit, page, total } };
});
const create_one_into_db = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = data !== null && data !== void 0 ? data : {}, { products, total_price: t_price } = _a, payload = __rest(_a, ["products", "total_price"]);
    const user_info = yield prisma_1.default.user.findUniqueOrThrow({
        where: { id: user.id },
    });
    const trans_id = (0, payment_utils_1.generate_tran_id)();
    const payment_data = {
        trans_id,
        amount: t_price,
        customer: { name: user_info.name, email: user_info.email },
    };
    const payment = yield (0, payment_utils_1.initiate_payment)(payment_data);
    yield prisma_1.default.$transaction((prisma_t) => __awaiter(void 0, void 0, void 0, function* () {
        const order_data = {
            payment_method: client_1.PaymentMethod.AMARPAY,
            transaction_id: trans_id,
            user_id: user_info.id,
            total_price: t_price,
        };
        const created_order = yield prisma_t.order.create({
            data: order_data,
        });
        for (const product of products || []) {
            const order_product_data = {
                order_id: created_order.id,
                price: Number(product.price),
                product_id: product.id,
                quantity: Number(product.quantity),
            };
            yield prisma_t.orderProduct.create({
                data: order_product_data,
            });
        }
        return;
    }));
    return payment;
});
exports.order_services = {
    fetch_all_from_db,
    fetch_my_from_db,
    create_one_into_db,
};
