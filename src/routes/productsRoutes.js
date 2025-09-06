// src/routes/productsRoutes.js
import { Router } from "express";
import { 
  getProductsByCategory, 
  getProductSpec, 
  searchProducts,
  getProductDetail
} from "../controllers/productsController.js";

const router = Router();

// 🔎 Búsqueda global
router.get("/", searchProducts);

// 📄 URL / Detalle con spec (primero para no chocar con :categoryId)
router.get("/spec/:id", getProductSpec);

// 📋 Detalle completo de producto
router.get("/detail/:id", getProductDetail);

// 📂 Productos por categoría (siempre al final porque usa :categoryId)
router.get("/:categoryId", getProductsByCategory);

export default router;
