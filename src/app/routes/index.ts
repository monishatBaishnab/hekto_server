import { Router } from "express";
import { user_routes } from "../modules/user/user.routes";
import { auth_routes } from "../modules/auth/auth.routes";

const routes = [
  {
    path: "/auth",
    element: auth_routes,
  },
  {
    path: "/users",
    element: user_routes,
  },
];

const router = Router();

routes.forEach((route) => router.use(route.path, route.element));

export const app_routes = router;
