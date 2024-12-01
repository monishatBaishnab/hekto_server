"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const send_response_1 = __importDefault(require("../utils/send_response"));
const not_found = (req, res) => {
    (0, send_response_1.default)(res, {
        success: false,
        status: 404,
        message: `The API endpoint '${req === null || req === void 0 ? void 0 : req.baseUrl}' was not found.`,
    });
};
exports.default = not_found;
