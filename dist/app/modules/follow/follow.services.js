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
exports.follow_services = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const http_error_1 = __importDefault(require("../../errors/http_error"));
const http_status_1 = __importDefault(require("http-status"));
const follow_shop = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const shop_info = yield prisma_1.default.shop.findUniqueOrThrow({
        where: { id: payload.shop_id },
    });
    const user_info = yield prisma_1.default.user.findUniqueOrThrow({
        where: { id: user.id },
    });
    if (shop_info.user_id === user_info.id) {
        throw new http_error_1.default(http_status_1.default.BAD_REQUEST, "You can not follow your own shop.");
    }
    const follow = yield prisma_1.default.follow.create({
        data: { shop_id: shop_info.id, user_id: user_info.id },
    });
    return follow;
});
exports.follow_services = { follow_shop };
