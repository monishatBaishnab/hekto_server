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
exports.coupon_controllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../utils/catch_async"));
const send_response_1 = __importDefault(require("../../utils/send_response"));
const coupon_services_1 = require("./coupon.services");
// Controller to fetch all Coupons
const fetch_all = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupon_services_1.coupon_services.fetch_all_from_db(req.query);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "Coupons retrieved successfully.",
        data: result.coupons,
        meta: result.meta,
    });
}));
// Controller to create a new Coupon
const create_one = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupon_services_1.coupon_services.create_one_into_db(req.body, req.user);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.CREATED,
        message: "Coupon created successfully.",
        data: result,
    });
}));
// Controller to update an existing Coupons by ID
const update_one = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupon_services_1.coupon_services.update_one_from_db(req.params.id, req.body, req.user);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "Coupons updated successfully.",
        data: result,
    });
}));
// Controller to delete an existing Coupons by ID
const delete_one = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield coupon_services_1.coupon_services.delete_one_from_db(req.params.id, req.user);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "Coupons deleted successfully.",
    });
}));
exports.coupon_controllers = {
    fetch_all,
    create_one,
    update_one,
    delete_one,
};
