// src/routes/authDriverRoutes.js
import { Router } from "express";
import { loginDriver } from "../controllers/authDriverController.js";

const router = Router();

router.post("/login", loginDriver);

export default router;
