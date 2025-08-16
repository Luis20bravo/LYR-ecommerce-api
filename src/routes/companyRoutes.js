import { Router } from "express";
import { getCompany } from "../controllers/companyController.js";

const router = Router();

// Página informativa pública
// GET /api/company
router.get("/", getCompany);

export default router;
