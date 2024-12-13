"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const send_response_1 = __importDefault(require("./app/utils/send_response"));
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("./app/utils/catch_async"));
const not_found_1 = __importDefault(require("./app/middlewares/not_found"));
const global_error_1 = __importDefault(require("./app/middlewares/global_error"));
const routes_1 = require("./app/routes");
// Create an instance of the Express application
const app = (0, express_1.default)();
// Middlewares to parse json and cookies
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Enable Cross-Origin Resource Sharing (CORS) with specified options
app.use((0, cors_1.default)({
    credentials: true,
    origin: [
        "*",
        "http://localhost:5173",
        "https://hekto-1a747.firebaseapp.com",
        "https://hekto-1a747.web.app",
    ],
}));
// Define a GET route for the root URL
app.get("/", (0, catch_async_1.default)((req, res) => {
    (0, send_response_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "Hekto Server Running Smoothly.",
    });
}));
// Define all routes for the application
app.use("/api/v1/", routes_1.app_routes);
// Middleware to handle 404 (Not Found) errors
app.use("*", not_found_1.default);
// Middleware to handle global errors
app.use(global_error_1.default);
exports.default = app;
