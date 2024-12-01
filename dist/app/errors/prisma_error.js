"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sanitize_prisma_error = (error) => {
    switch (error.code) {
        case "P2025":
            return { statusCode: 404, message: error === null || error === void 0 ? void 0 : error.message };
        case "P2002":
            return { statusCode: 409, message: "Duplicate value" };
        case "P2003":
            return { statusCode: 400, message: "Invalid foreign key" };
        case "P2004":
            return { statusCode: 400, message: "Required field missing" };
        case "P2014":
            return { statusCode: 400, message: "Batch operation failed" };
        case "P2000":
            return { statusCode: 400, message: "Value out of range" };
        case "P2023":
            return { statusCode: 400, message: "Invalid `where` field" };
        case "P2024":
            return { statusCode: 400, message: "Invalid foreign key reference" };
        case "P2001":
            return { statusCode: 400, message: "Record required" };
        case "P2015":
            return { statusCode: 400, message: "Record not found during nested write" };
        default:
            return { statusCode: 500, message: "Internal Server Error" };
    }
};
exports.default = sanitize_prisma_error;
