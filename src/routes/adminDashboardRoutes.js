import { Router } from "express";
import { getAdminDashboard } from "../controllers/adminDashboardController.js";
import { requireAdmin } from "../middlewares/auth.js";

const router = Router();
// GET /api/admin/dashboard
router.get("/dashboard", requireAdmin, getAdminDashboard);

export default router;
