import { Router } from "express";
import { loginRepartidor } from "../controllers/authController.js";

const router = Router();

// POST /api/auth/repartidor/login
router.post("/repartidor/login", loginRepartidor);

// Ruta de prueba rápida: GET /api/auth/ping  → debería responder {ok:true}
router.get("/ping", (_req, res) => res.json({ ok: true }));

export default router;
