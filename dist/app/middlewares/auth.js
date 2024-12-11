"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catch_async_1 = __importDefault(require("../utils/catch_async"));
const http_error_1 = __importDefault(require("../errors/http_error"));
const jsonwebtoken_1 = require("../utils/jsonwebtoken");
const config_1 = require("../config");
const http_status_1 = __importDefault(require("http-status"));
const auth = (...roles) => {
    return (0, catch_async_1.default)((req, res, next) => {
        var _a;
        const token = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
        console.log(token);
        if (!token) {
            console.log(token);
            throw new http_error_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized.");
        }
        const verified_user = (0, jsonwebtoken_1.verify_token)(token, config_1.local_config.user_jwt_secret);
        if ((roles === null || roles === void 0 ? void 0 : roles.length) && roles.includes(verified_user.role)) {
            req.user = verified_user;
            next();
        }
        else {
            throw new http_error_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized.");
        }
    });
};
exports.default = auth;
