import { Router } from "express";
import { getAdminDashboard } from "../controllers/adminDashboardController.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

// Solo accesible para admins
router.get("/", requireAdmin, getAdminDashboard);

export default router;
