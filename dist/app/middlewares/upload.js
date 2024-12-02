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
exports.cloudinary_uploader = exports.multer_up = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const config_1 = require("../config");
cloudinary_1.v2.config({
    cloud_name: config_1.local_config.cloudinary_cloud_name,
    api_key: config_1.local_config.cloudinary_api_key,
    api_secret: config_1.local_config.cloudinary_api_secret,
});
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(process.cwd(), "/upload"));
    },
    filename: function (req, file, cb) {
        cb(null, `hekto-${Date.now()}.${file.originalname.split(".").pop()}`);
    },
});
exports.multer_up = (0, multer_1.default)({ storage: storage });
const cloudinary_uploader = (file) => __awaiter(void 0, void 0, void 0, function* () {
    if (file === undefined)
        return;
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(file.path, (error, result) => {
            fs_1.default.unlinkSync(file.path);
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
});
exports.cloudinary_uploader = cloudinary_uploader;