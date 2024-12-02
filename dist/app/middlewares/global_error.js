"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const zod_1 = require("zod");
const http_error_1 = __importDefault(require("../errors/http_error"));
const prisma_error_1 = __importDefault(require("../errors/prisma_error"));
const global_error = (err, req, res, next) => {
    const success = false;
    let status = (err === null || err === void 0 ? void 0 : err.statusCode) || http_status_1.default.BAD_REQUEST;
    let message = (err === null || err === void 0 ? void 0 : err.name) || "Something want wrong.";
    // console.log(err);
    if (err instanceof zod_1.ZodError) {
        message = "Validation failed, check the input data for errors.";
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        const prismaError = (0, prisma_error_1.default)(err);
        message = prismaError.message;
        status = prismaError.statusCode;
    }
    else if (err instanceof http_error_1.default) {
        status = err.statusCode;
        message = err.message;
    }
    console.log(err);
    res.status(status).send({
        success,
        status,
        message,
    });
};
exports.default = global_error;
