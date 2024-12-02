import { Router } from "express";
import { user_controllers } from "./user.controllers";
import parse_json from "../../middlewares/parse_json";
import { multer_up } from "../../middlewares/upload";

const router = Router();

// Route to fetch all users
router.get("/", user_controllers.fetch_all);

// Route to fetch a single user by ID
router.get("/:id", user_controllers.fetch_single);

// Route to create a new user
router.post("/create-admin", multer_up.single("file"), parse_json, user_controllers.create_admin);

// Route to update an existing user by ID
router.put("/:id", user_controllers.update_one);

// Route to delete an existing user by ID
router.delete("/:id", user_controllers.delete_one);

export const user_routes = router;
