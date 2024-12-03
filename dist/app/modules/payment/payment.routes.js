"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payment_routes = void 0;
const express_1 = require("express");
const payment_controllers_1 = require("./payment.controllers");
const router = (0, express_1.Router)();
router.post("/success", payment_controllers_1.payment_controllers.success);
router.post("/failed", payment_controllers_1.payment_controllers.failed);
exports.payment_routes = router;
