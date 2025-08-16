import { Router } from "express";
import { requireDriver } from "../middlewares/auth.js";

const router = Router();

// GET /api/driver/privado  (protegida con JWT)
router.get("/privado", requireDriver, (req, res) => {
  res.json({ ok: true, user: req.user });
});

export default router;
