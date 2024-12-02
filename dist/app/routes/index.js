"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app_routes = void 0;
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const category_routes_1 = require("../modules/category/category.routes");
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
];
const router = (0, express_1.Router)();
routes.forEach((route) => router.use(route.path, route.element));
exports.app_routes = router;
