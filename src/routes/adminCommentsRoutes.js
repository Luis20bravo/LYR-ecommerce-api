import { Router } from "express";
import { adminListComments } from "../controllers/commentsController.js";
import { requireAdmin } from "../middlewares/auth.js";

const router = Router();
router.get("/", requireAdmin, adminListComments); // GET /api/admin/comments
export default router;
