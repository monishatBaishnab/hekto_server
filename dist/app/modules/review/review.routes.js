"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.review_routes = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
// Route to fetch all reviews
router.get("/");
// Route to fetch a single review by ID
router.get("/:id");
// Route to create a new review
router.post("/");
// Route to update an existing review by ID
router.put("/:id");
// Route to delete an existing review by ID
router.delete("/:id");
exports.review_routes = router;
