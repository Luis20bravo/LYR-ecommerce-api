import pool from "../config/db.js";

/**
 * 🔹 Listar pedidos disponibles (estado = "pendiente")
 * RUTA: GET /api/driver/orders/available
 */
export const listAvailableOrders = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT o.id, o.customer_name, o.address, o.total, o.status, o.created_at
       FROM orders o
       WHERE o.status = 'pendiente'
       ORDER BY o.created_at ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ listAvailableOrders:", err);
    res.status(500).json({ error: "Error al obtener pedidos disponibles" });
  }
};

/**
 * 🔹 Aceptar un pedido (asignar repartidor)
 * RUTA: PUT /api/driver/orders/accept/:id
 */
export const acceptOrder = async (req, res) => {
  const { id } = req.params;
  const driverId = req.user.id; // viene del middleware requireDriver

  try {
    const [r] = await pool.query(
      `UPDATE orders
       SET status = 'asignado', driver_id = ?
       WHERE id = ? AND status = 'pendiente'`,
      [driverId, id]
    );

    if (r.affectedRows === 0) {
      return res.status(400).json({ error: "El pedido no está disponible" });
    }

    res.json({ message: "✅ Pedido aceptado correctamente" });
  } catch (err) {
    console.error("❌ acceptOrder:", err);
    res.status(500).json({ error: "Error al aceptar pedido" });
  }
};

/**
 * 🔹 Listar pedidos asignados al repartidor logueado
 * RUTA: GET /api/driver/orders
 */
export const listOrders = async (req, res) => {
  try {
    const driverId = req.user.id; // viene del middleware requireDriver
    const [rows] = await pool.query(
      `SELECT id, customer_name, address, status, created_at
       FROM orders
       WHERE driver_id = ?
       ORDER BY created_at DESC`,
      [driverId]
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ listOrders:", err);
    res.status(500).json({ error: "Error al cargar pedidos" });
  }
};

/**
 * 🔹 Obtener detalle de un pedido específico asignado al repartidor
 * RUTA: GET /api/driver/orders/:id
 */
export const getOrder = async (req, res) => {
  try {
    const driverId = req.user.id;
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT id, customer_name, address, phone, items, total, status, created_at
       FROM orders
       WHERE id = ? AND driver_id = ?`,
      [id, driverId]
    );

    if (!rows.length) {
      return res
        .status(404)
        .json({ error: "Pedido no encontrado o no asignado a este repartidor" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ getOrder:", err);
    res.status(500).json({ error: "Error al cargar detalle del pedido" });
  }
};
