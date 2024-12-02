import { Router } from "express";

const router = Router();

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

export const product_routes = router;
