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
exports.order_controllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../utils/catch_async"));
const send_response_1 = __importDefault(require("../../utils/send_response"));
const order_services_1 = require("./order.services");
// Controller to delete an existing Orders by ID
const fetch_all = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_services_1.order_services.fetch_all_from_db(req.query);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "Orders retrieved successfully.",
        data: result.orders,
        meta: result.meta,
    });
}));
// Controller to delete an existing Orders by ID
const fetch_my = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_services_1.order_services.fetch_my_from_db(req.query, req.user);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "My orders retrieved successfully.",
        data: result.orders,
        meta: result.meta,
    });
}));
// Controller to delete an existing Orders by ID
const create_one = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_services_1.order_services.create_one_into_db(req.body, req.user);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.CREATED,
        message: "Order created successfully.",
        data: result,
    });
}));
exports.order_controllers = {
    fetch_all,
    fetch_my,
    create_one,
};
