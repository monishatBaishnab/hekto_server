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
exports.payment_services = void 0;
const http_status_1 = __importDefault(require("http-status"));
const path_1 = __importDefault(require("path"));
const http_error_1 = __importDefault(require("../../errors/http_error"));
const fs_1 = require("fs");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const client_1 = require("@prisma/client");
const success = (trans_id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const filePath = path_1.default.join(__dirname, "../../views/success.html");
    try {
        const data = yield fs_1.promises.readFile(filePath, "utf8");
        const checkPayment = yield axios_1.default.get(`https://sandbox.aamarpay.com/api/v1/trxcheck/request.php?request_id=${trans_id}&store_id=${config_1.local_config.store_id}&signature_key=${config_1.local_config.signature_key}&type=json`);
        if (((_a = checkPayment === null || checkPayment === void 0 ? void 0 : checkPayment.data) === null || _a === void 0 ? void 0 : _a.pay_status) === "Successful") {
            yield prisma_1.default.order.updateMany({
                where: { transaction_id: trans_id },
                data: { payment_status: client_1.PaymentStatus.COMPLETED },
            });
        }
        return data;
    }
    catch (error) {
        throw new http_error_1.default(Number(http_status_1.default[500]), "Error reading file");
    }
});
const failed = (trans_id) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.join(__dirname, "../../views/failed.html");
    try {
        const data = yield fs_1.promises.readFile(filePath, "utf8");
        yield prisma_1.default.order.updateMany({
            where: { transaction_id: trans_id },
            data: { payment_status: client_1.PaymentStatus.FAILED },
        });
        return data;
    }
    catch (error) {
        throw new http_error_1.default(Number(http_status_1.default[500]), "Error reading file");
    }
});
exports.payment_services = { success, failed };
