import { Router } from "express";
import { 
  getProductsByCategory, 
  getProductSpec, 
  searchProducts 
} from "../controllers/productsController.js";

const router = Router();

// 🔎 Búsqueda global: /api/products?search=...
router.get("/", searchProducts);

// 📂 Productos por categoría (con filtros opcionales): /api/products/:categoryId
router.get("/:categoryId", getProductsByCategory);

// 📄 URL de especificaciones de un producto: /api/products/:id/spec
router.get("/:id/spec", getProductSpec);

export default router;
