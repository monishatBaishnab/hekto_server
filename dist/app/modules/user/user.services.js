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
exports.user_services = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../../config");
const upload_1 = require("../../middlewares/upload");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const jsonwebtoken_1 = require("../../utils/jsonwebtoken");
const fetch_all_from_db = () => __awaiter(void 0, void 0, void 0, function* () { });
const fetch_single_from_db = (id) => __awaiter(void 0, void 0, void 0, function* () { });
const create_admin_into_db = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    const user_data = Object.assign(Object.assign({}, payload), { role: "ADMIN" });
    // Hashed password and set this in user data
    const hashed_password = yield bcrypt_1.default.hash(payload.password, Number(config_1.local_config.bcrypt_salt));
    user_data.password = hashed_password;
    // Upload image in cloudinary and set the image link in user data
    const uploaded_image_info = yield (0, upload_1.cloudinary_uploader)(file);
    if (uploaded_image_info === null || uploaded_image_info === void 0 ? void 0 : uploaded_image_info.secure_url) {
        user_data.profilePhoto = uploaded_image_info.secure_url;
    }
    const created_user = yield prisma_1.default.user.create({
        data: user_data,
    });
    const token_data = (0, jsonwebtoken_1.sanitize_token_data)(created_user);
    const token = (0, jsonwebtoken_1.generate_token)(token_data, config_1.local_config.user_jwt_secret);
    return { token };
});
const update_one_from_db = (id, payload) => __awaiter(void 0, void 0, void 0, function* () { });
const delete_one_from_db = (id) => __awaiter(void 0, void 0, void 0, function* () { });
exports.user_services = {
    fetch_all_from_db,
    fetch_single_from_db,
    create_admin_into_db,
    update_one_from_db,
    delete_one_from_db,
};
