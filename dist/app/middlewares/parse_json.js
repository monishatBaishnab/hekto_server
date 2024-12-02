"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse_json = (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
};
exports.default = parse_json;
