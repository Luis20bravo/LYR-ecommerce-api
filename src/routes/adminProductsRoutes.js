// src/routes/adminProductsRoutes.js
import { Router } from "express";
import upload from "../middlewares/upload.js";
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

// Soft delete (inactivar producto)
router.delete("/:id", adminDeleteProduct);

// Hard delete (⚠ elimina de la BD)
router.delete("/:id/hard", hardDeleteProduct);

export default router;
