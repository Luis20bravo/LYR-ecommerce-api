import { Router } from "express";
import { listAvailableOrders, acceptOrder } from "../controllers/driverOrdersController.js";
import { requireDriver } from "../middlewares/auth.js"; // protección con token repartidor

const router = Router();

router.get("/available", requireDriver, listAvailableOrders);
router.put("/:id/accept", requireDriver, acceptOrder);

export default router;
