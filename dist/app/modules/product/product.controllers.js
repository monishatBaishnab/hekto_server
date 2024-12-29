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
exports.product_controllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../utils/catch_async"));
const send_response_1 = __importDefault(require("../../utils/send_response"));
const product_services_1 = require("./product.services");
// Controller to fetch all Products
const fetch_all = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.product_services.fetch_all_from_db(req.query);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "Products retrieved successfully.",
        data: result.products,
        meta: result.meta,
    });
}));
// Controller to fetch a single Product by ID
const fetch_single = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.product_services.fetch_single_from_db(req.params.id);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "Product retrieved successfully.",
        data: result,
    });
}));
// Controller to create a new Product
const create_one = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.product_services.create_one_into_db(req.body, req.files, req.user);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.CREATED,
        message: "Product created successfully.",
        data: result,
    });
}));
// Controller to update an existing Product by ID
const update_one = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.product_services.update_one_from_db(req.params.id, req.body, req.files, req.user);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "Product updated successfully.",
        data: result,
    });
}));
// Controller to delete an existing Product by ID
const delete_one = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield product_services_1.product_services.delete_one_from_db(req.params.id, req.user);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "Product deleted successfully.",
    });
}));
exports.product_controllers = {
    fetch_all,
    fetch_single,
    create_one,
    update_one,
    delete_one,
};
