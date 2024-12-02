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
exports.review_controllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../utils/catch_async"));
const send_response_1 = __importDefault(require("../../utils/send_response"));
const review_serviecs_1 = require("./review.serviecs");
// Controller to fetch all Reviews
const fetch_all = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_serviecs_1.review_services.fetch_all_from_db(req.query);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "Reviews retrieved successfully.",
        data: result.reviews,
        meta: result.meta,
    });
}));
// Controller to create a new Review
const create_one = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_serviecs_1.review_services.create_one_into_db(req.body, req.user);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.CREATED,
        message: "Review created successfully.",
        data: result,
    });
}));
// Controller to update an existing Reviews by ID
const update_one = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_serviecs_1.review_services.update_one_from_db(req.params.id, req.body, req.user);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "Reviews updated successfully.",
        data: result,
    });
}));
// Controller to delete an existing Reviews by ID
const delete_one = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield review_serviecs_1.review_services.delete_one_from_db(req.params.id, req.user);
    (0, send_response_1.default)(res, {
        status: http_status_1.default.OK,
        message: "Reviews deleted successfully.",
    });
}));
exports.review_controllers = {
    fetch_all,
    create_one,
    update_one,
    delete_one,
};
