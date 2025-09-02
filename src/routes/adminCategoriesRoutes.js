// routes/adminCategories.js
import { Router } from "express";
import { requireAdmin } from "../middlewares/auth.js";
import {
  adminListCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory, // soft delete
  toggleCategory,
  hardDeleteCategory    // hard delete
} from "../controllers/adminCategoriesController.js";

const router = Router();

// CRUD
router.get("/", requireAdmin, adminListCategories);
router.post("/", requireAdmin, adminCreateCategory);
router.put("/:id", requireAdmin, adminUpdateCategory);

// Soft delete (inactivar)
router.delete("/:id", requireAdmin, adminDeleteCategory);

// Activar / desactivar
router.patch("/:id/toggle", requireAdmin, toggleCategory);

// Hard delete (⚠ elimina de la BD)
router.delete("/:id/hard", requireAdmin, hardDeleteCategory);

export default router;
