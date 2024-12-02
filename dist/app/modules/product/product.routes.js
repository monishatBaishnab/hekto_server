"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.product_routes = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
// Route to fetch all products
router.get("/");
// Route to fetch a single product by ID
router.get("/:id");
// Route to create a new product
router.post("/");
// Route to update an existing product by ID
router.put("/:id");
// Route to delete an existing product by ID
router.delete("/:id");
exports.product_routes = router;
