import { Router } from "express";
import { getProductsByCategory, getProductSpec } from "../controllers/productsController.js";

const router = Router();
router.get("/:categoryId", getProductsByCategory);
router.get("/spec/:id", getProductSpec); // GET /api/products/spec/:id

export default router;
