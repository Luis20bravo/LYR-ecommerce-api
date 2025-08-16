import { Router } from "express";
import { requireAdmin } from "../middlewares/auth.js";
import {
  adminListCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory
} from "../controllers/adminCategoriesController.js";

const router = Router();

router.get("/",    requireAdmin, adminListCategories);
router.post("/",   requireAdmin, adminCreateCategory);
router.put("/:id", requireAdmin, adminUpdateCategory);
router.delete("/:id", requireAdmin, adminDeleteCategory);

export default router;
