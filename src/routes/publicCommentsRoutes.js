import { Router } from "express";
import { createComment, listCommentsByProduct } from "../controllers/publicCommentsController.js";

const router = Router();

router.post("/", createComment);
router.get("/", listCommentsByProduct);

export default router;
