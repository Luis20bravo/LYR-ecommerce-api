// src/controllers/products.controller.js
import pool from "../config/db.js";

/**
 * GET /api/products/:categoryId
 * Lista productos activos de una categoría
 */
export const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  const idNum = Number(categoryId);
  if (!Number.isInteger(idNum) || idNum <= 0) {
    return res.status(400).json({ error: "categoryId inválido" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT id, name, price, stock, spec_url
       FROM products
       WHERE category_id = ? AND active = 1
       ORDER BY name`,
      [idNum]
    );
    res.json(rows);
  } catch (error) {
    console.error("❌ Error getProductsByCategory:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * GET /api/product/:id/spec
 * Obtiene la URL de especificaciones de un producto activo
 */
export const getProductSpec = async (req, res) => {
  const { id } = req.params;

  const idNum = Number(id);
  if (!Number.isInteger(idNum) || idNum <= 0) {
    return res.status(400).json({ error: "Id inválido" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, name, spec_url FROM products WHERE id = ? AND active = 1 LIMIT 1",
      [idNum]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const { spec_url } = rows[0];
    if (!spec_url) {
      return res.status(204).send(); // sin contenido
    }

    res.json({ spec_url });
  } catch (error) {
    console.error("❌ Error getProductSpec:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
