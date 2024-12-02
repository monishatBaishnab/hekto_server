import { Router } from "express";
import { auth_controllers } from "./auth.controllers";
import { multer_up } from "../../middlewares/upload";
import parse_json from "../../middlewares/parse_json";

const router = Router();

router.post("/login", auth_controllers.login);

router.post("/register", multer_up.single("file"), parse_json, auth_controllers.register);

export const auth_routes = router;
