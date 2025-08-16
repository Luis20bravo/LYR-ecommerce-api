import { Router } from "express";
import { loginAdmin } from "../controllers/authAdminController.js";

const router = Router();
// POST /api/auth/admin/login
router.post("/admin/login", loginAdmin);

export default router;
