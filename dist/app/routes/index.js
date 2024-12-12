"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app_routes = void 0;
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const category_routes_1 = require("../modules/category/category.routes");
const review_routes_1 = require("../modules/review/review.routes");
const product_routes_1 = require("../modules/product/product.routes");
const payment_routes_1 = require("../modules/payment/payment.routes");
const order_routes_1 = require("../modules/order/order.routes");
const follow_routes_1 = require("../modules/follow/follow.routes");
const shop_routes_1 = require("../modules/shop/shop.routes");
// Define all available routes and their corresponding route handlers
const routes = [
    {
        path: "/auth",
        element: auth_routes_1.auth_routes,
    },
    {
        path: "/users",
        element: user_routes_1.user_routes,
    },
    {
        path: "/categories",
        element: category_routes_1.category_routes,
    },
    {
        path: "/products",
        element: product_routes_1.product_routes,
    },
    {
        path: "/reviews",
        element: review_routes_1.review_routes,
    },
    {
        path: "/payments",
        element: payment_routes_1.payment_routes,
    },
    {
        path: "/orders",
        element: order_routes_1.order_routes,
    },
    {
        path: "/follows",
        element: follow_routes_1.follow_routes,
    },
    {
        path: "/shops",
        element: shop_routes_1.shop_routes,
    },
];
// Create a new Express router instance
const router = (0, express_1.Router)();
// Loop through the routes and register each with the router
routes.forEach((route) => router.use(route.path, route.element));
// Export the configured router to be used in the application
exports.app_routes = router;
