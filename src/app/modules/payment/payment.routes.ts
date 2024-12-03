import { Router } from "express";
import { payment_controllers } from "./payment.controllers";

const router = Router();

router.post("/success", payment_controllers.success);
router.post("/failed", payment_controllers.failed);

export const payment_routes = router;
