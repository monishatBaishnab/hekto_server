import { Router } from "express";
import { user_routes } from "../modules/user/user.routes";
import { auth_routes } from "../modules/auth/auth.routes";
import { category_routes } from "../modules/category/category.routes";
import { review_routes } from "../modules/review/review.routes";
import { product_routes } from "../modules/product/product.routes";

// Define all available routes and their corresponding route handlers
const routes = [
  {
    path: "/auth",
    element: auth_routes,
  },
  {
    path: "/users",
    element: user_routes,
  },
  {
    path: "/categories",
    element: category_routes,
  },
  {
    path: "/products",
    element: product_routes,
  },
  {
    path: "/reviews",
    element: review_routes,
  },
];

// Create a new Express router instance
const router = Router();

// Loop through the routes and register each with the router
routes.forEach((route) => router.use(route.path, route.element));

// Export the configured router to be used in the application
export const app_routes = router;
