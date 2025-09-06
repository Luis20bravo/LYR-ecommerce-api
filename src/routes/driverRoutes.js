import { Router } from "express";
import { requireDriver } from "../middlewares/requireDriver.js";
import { listOrders, getOrder } from "../controllers/driverOrdersController.js";

const router = Router();

// 🔒 Ruta de prueba protegida
router.get("/privado", requireDriver, (req, res) => {
  res.json({ ok: true, user: req.user });
});

// 🚚 Listar pedidos asignados al repartidor
router.get("/orders", requireDriver, listOrders);

// 🚚 Detalle de un pedido
router.get("/orders/:id", requireDriver, getOrder);

export default router;
