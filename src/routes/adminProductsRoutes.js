import { Router } from "express";
import { requireAdmin } from "../middlewares/auth.js";
import {
  adminListProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct
} from "../controllers/adminProductsController.js";

const router = Router();

router.get("/",     requireAdmin, adminListProducts);
router.post("/",    requireAdmin, adminCreateProduct);
router.put("/:id",  requireAdmin, adminUpdateProduct);
router.delete("/:id", requireAdmin, adminDeleteProduct);

export default router;
