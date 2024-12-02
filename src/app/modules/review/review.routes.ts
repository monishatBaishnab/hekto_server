import { Router } from "express";

const router = Router();

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

export const review_routes = router;
