// controllers/adminDashboardController.js
import pool from "../config/db.js";

export const getAdminDashboard = async (_req, res) => {
  try {
    // Totales
    const [[{ totalCategories }]] = await pool.query(
      "SELECT COUNT(*) AS totalCategories FROM categories WHERE active = 1"
    );

    const [[{ totalProducts }]] = await pool.query(
      "SELECT COUNT(*) AS totalProducts FROM products WHERE active = 1"
    );

    const [[{ stockTotal }]] = await pool.query(
      "SELECT IFNULL(SUM(stock),0) AS stockTotal FROM products WHERE active = 1"
    );

    const [[{ totalComments }]] = await pool.query(
      "SELECT COUNT(*) AS totalComments FROM comments"
    );

    // Productos con poco stock
    const [lowStockProducts] = await pool.query(
      "SELECT id, name, stock FROM products WHERE stock < 5 AND active = 1 ORDER BY stock ASC LIMIT 5"
    );

    res.json({
      totalCategories,
      totalProducts,
      stockTotal,
      totalComments,
      lowStockProducts,
    });
  } catch (err) {
    console.error("❌ Error getAdminDashboard:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
