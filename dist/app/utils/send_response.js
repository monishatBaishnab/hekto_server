"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const send_response = (res, payload) => {
    var _a;
    const response_data = Object.assign({ success: (_a = payload === null || payload === void 0 ? void 0 : payload.success) !== null && _a !== void 0 ? _a : true }, payload);
    res.status(payload.status).send(response_data);
};
exports.default = send_response;
