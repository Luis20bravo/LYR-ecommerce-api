import pool from "../config/db.js";

// Umbral simple de stock bajo
const LOW_STOCK = 5;

export const getAdminDashboard = async (_req, res) => {
  try {
    const [[{ total_categories }]] = await pool.query("SELECT COUNT(*) AS total_categories FROM categories WHERE active = 1");
    const [[{ total_products }]]   = await pool.query("SELECT COUNT(*) AS total_products FROM products WHERE active = 1");
    const [[{ low_stock }]]        = await pool.query("SELECT COUNT(*) AS low_stock FROM products WHERE active = 1 AND stock <= ?", [LOW_STOCK]);

    res.json({
      categories: total_categories,
      products: total_products,
      low_stock,
      low_stock_threshold: LOW_STOCK,
      server_time: new Date().toISOString()
    });
  } catch (e) {
    console.error("❌ Error getAdminDashboard:", e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
