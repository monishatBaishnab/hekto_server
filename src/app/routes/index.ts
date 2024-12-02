import { Router } from "express";
import { user_routes } from "../modules/user/user.routes";

const routes = [
  {
    path: "/users",
    element: user_routes,
  },
];

const router = Router();

routes.forEach((route) => router.use(route.path, route.element));

export const app_routes = router;
