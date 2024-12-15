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
exports.auth_controllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../utils/catch_async"));
const send_response_1 = __importDefault(require("../../utils/send_response"));
const auth_services_1 = require("./auth.services");
const login = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_services_1.auth_services.login(req.body);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "User logged in successfully.",
        data: result,
    });
}));
const forgot_pass = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_services_1.auth_services.forgot_pass(req.body);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "Check your email.",
        data: result,
    });
}));
const reset_pass = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_services_1.auth_services.reset_pass_from_db(req.headers.authorization, req.body);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "Password Reset Successfully.",
        data: result,
    });
}));
// Controller to register a new user
const register = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_services_1.auth_services.register_into_db(req.body, req.file);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.CREATED,
        message: "User registered successfully.",
        data: result,
    });
}));
exports.auth_controllers = {
    register,
    forgot_pass,
    reset_pass,
    login,
};
