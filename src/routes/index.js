import { Router } from "express";
import auth from "./auth.routes.js";
import categories from "./categories.routes.js";
import products from "./products.routes.js";
export const router = Router();
router.use("/auth", auth);
router.use("/categories", categories);
router.use("/products", products);
