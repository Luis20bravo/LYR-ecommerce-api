// src/routes/adminProductsRoutes.js
import { Router } from "express";
import upload from "../middlewares/upload.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

import {
  adminCreateProduct,
  adminUpdateProduct,
  adminListProducts,
  adminDeleteProduct,
  hardDeleteProduct
} from "../controllers/adminProductsController.js";

const router = Router();

// Listar productos
router.get("/", adminListProducts);

// Crear con imagen
router.post("/", upload.single("image"), adminCreateProduct);

// Editar con imagen
router.put("/:id", upload.single("image"), adminUpdateProduct);

// Hard delete (⚠ elimina de la BD)
router.delete("/hard/:id", hardDeleteProduct);

// Soft delete (inactivar producto)
router.delete("/:id", adminDeleteProduct);

export default router;

