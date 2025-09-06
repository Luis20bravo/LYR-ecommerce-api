// src/routes/adminCommentsRoutes.js
import { Router } from "express";
import {
  adminListComments,
  adminUpdateCommentStatus,
  adminDeleteComment
} from "../controllers/adminCommentsController.js";
import { requireAdmin } from "../middlewares/auth.js";

const router = Router();

// Listar todos los comentarios
router.get("/", requireAdmin, adminListComments);

// Aprobar o rechazar un comentario (cambiar estado)
router.put("/:id", requireAdmin, adminUpdateCommentStatus);

// Eliminar un comentario
router.delete("/:id", requireAdmin, adminDeleteComment);

export default router;
