import { Router } from "express";
import { getCompanyInfo } from "../controllers/publicController.js";

const router = Router();

// GET /api/public/company-info
router.get("/company-info", getCompanyInfo);

export default router;
