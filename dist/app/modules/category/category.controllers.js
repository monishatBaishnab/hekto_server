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
exports.category_controllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../utils/catch_async"));
const send_response_1 = __importDefault(require("../../utils/send_response"));
const category_services_1 = require("./category.services");
// Controller to fetch all categories
const fetch_all = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_services_1.category_services.fetch_all_from_db(req.query);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "Categories retrieved successfully.",
        data: result.categories,
        meta: result.meta,
    });
}));
// Controller to fetch a single Category by ID
const fetch_single = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "Category retrieved successfully.",
    });
}));
// Controller to create a new Category as 'ADMIN'
const create_one = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_services_1.category_services.create_one_into_db(req.body, req.file);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.CREATED,
        message: "Category created successfully.",
        data: result,
    });
}));
// Controller to update an existing Category by ID
const update_one = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "Category updated successfully.",
    });
}));
// Controller to delete an existing Category by ID
const delete_one = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "Category deleted successfully.",
    });
}));
exports.category_controllers = {
    fetch_all,
    fetch_single,
    create_one,
    update_one,
    delete_one,
};
