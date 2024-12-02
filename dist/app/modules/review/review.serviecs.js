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
Object.defineProperty(exports, "__esModule", { value: true });
exports.product_services = void 0;
const fetch_all_from_db = () => __awaiter(void 0, void 0, void 0, function* () { });
const fetch_single_from_db = (id) => __awaiter(void 0, void 0, void 0, function* () { });
const create_one_into_db = (payload) => __awaiter(void 0, void 0, void 0, function* () { });
const update_one_from_db = (id, payload) => __awaiter(void 0, void 0, void 0, function* () { });
const delete_one_from_db = (id) => __awaiter(void 0, void 0, void 0, function* () { });
exports.product_services = {
    fetch_all_from_db,
    fetch_single_from_db,
    create_one_into_db,
    update_one_from_db,
    delete_one_from_db,
};
