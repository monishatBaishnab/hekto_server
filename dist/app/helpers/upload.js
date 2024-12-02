"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multer_up = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(process.cwd(), "/upload"));
    },
    filename: function (req, file, cb) {
        cb(null, `hekto-${Date.now()}.${file.originalname.split(".").pop()}`);
    },
});
exports.multer_up = (0, multer_1.default)({ storage: storage });
