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
exports.payment_controllers = void 0;
const catch_async_1 = __importDefault(require("../../utils/catch_async"));
const payment_services_1 = require("./payment.services");
const success = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { trans_id } = req === null || req === void 0 ? void 0 : req.query;
    const result = yield payment_services_1.payment_services.success(trans_id);
    res.send(result);
}));
const failed = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { trans_id } = req === null || req === void 0 ? void 0 : req.query;
    const result = yield payment_services_1.payment_services.failed(trans_id);
    res.send(result);
}));
exports.payment_controllers = { success, failed };
