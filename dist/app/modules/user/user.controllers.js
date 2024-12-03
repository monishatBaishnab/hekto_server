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
exports.user_controllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../utils/catch_async"));
const send_response_1 = __importDefault(require("../../utils/send_response"));
const user_services_1 = require("./user.services");
// Controller to fetch all users
const fetch_all = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.user_services.fetch_all_from_db(req.query);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "Users retrieved successfully.",
        data: result.users,
        meta: result.meta,
    });
}));
// Controller to fetch a single user by ID
const fetch_single = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.user_services.fetch_single_from_db(req.params.id);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "User retrieved successfully.",
        data: result,
    });
}));
// Controller to create a new user as 'ADMIN'
const create_admin = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.user_services.create_admin_into_db(req.body, req.file);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.CREATED,
        message: "Admin created successfully.",
        data: result,
    });
}));
// Controller to update an existing user by ID
const update_one = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_services_1.user_services.update_one_from_db(req.params.id, req.body, req.file, req.user);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "User updated successfully.",
    });
}));
// Controller to update an existing user by ID
const update_status = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body;
    yield user_services_1.user_services.update_status_from_db(req.params.id, req.body);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "User status updated successfully.",
    });
}));
// Controller to delete an existing user by ID
const delete_one = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_services_1.user_services.delete_one_from_db(req.params.id, req.user);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "User deleted successfully.",
    });
}));
exports.user_controllers = {
    fetch_all,
    fetch_single,
    create_admin,
    update_one,
    update_status,
    delete_one,
};
