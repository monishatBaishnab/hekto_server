"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sanitize_queries = (object, keys) => {
    const finalObject = {};
    keys.forEach((key) => {
        if (object && Object.hasOwnProperty.call(object, key)) {
            finalObject[key] = object[key];
        }
    });
    return finalObject;
};
exports.default = sanitize_queries;
