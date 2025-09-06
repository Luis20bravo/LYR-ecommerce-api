// src/controllers/productsController.js
import pool from "../config/db.js";

/**
 * GET /api/products/:categoryId
 * Lista productos de una categoría con filtros opcionales
 */
export const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { search, minPrice, maxPrice, inStock } = req.query;

  const idNum = Number(categoryId);
  if (!Number.isInteger(idNum) || idNum <= 0) {
    return res.status(400).json({ error: "categoryId inválido" });
  }

  let where = "WHERE p.category_id = ? AND p.active = 1";
  const params = [idNum];

  if (search) {
    where += " AND p.name LIKE ?";
    params.push(`%${search}%`);
  }
  if (minPrice) {
    where += " AND p.price >= ?";
    params.push(minPrice);
  }
  if (maxPrice) {
    where += " AND p.price <= ?";
    params.push(maxPrice);
  }
  if (inStock) {
    where += " AND p.stock > 0";
  }

  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.price, p.stock, p.image_url, p.spec_url, c.name AS category
       FROM products p
       JOIN categories c ON c.id = p.category_id
       ${where}
       ORDER BY p.name`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error getProductsByCategory:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * GET /api/products/spec/:id
 * Obtiene detalle del producto (incluye spec_url)
 */
export const getProductSpec = async (req, res) => {
  const { id } = req.params;
  const idNum = Number(id);

  if (!Number.isInteger(idNum) || idNum <= 0) {
    return res.status(400).json({ error: "Id inválido" });
  }

  try {
    const [[row]] = await pool.query(
      `SELECT 
         p.id, p.name, p.description, p.price, p.stock, 
         p.image_url, p.spec_url, p.active,
         c.id AS category_id, c.name AS category
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.id = ? AND p.active = 1`,
      [idNum]
    );

    if (!row) return res.status(404).json({ error: "Producto no encontrado" });

    res.json(row);
  } catch (err) {
    console.error("❌ getProductSpec:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * GET /api/products?search=...
 * Búsqueda global en productos activos
 */
export const searchProducts = async (req, res) => {
  const { search } = req.query;

  let where = "WHERE p.active = 1";
  const params = [];

  if (search) {
    where += " AND (p.name LIKE ? OR p.description LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.price, p.stock, p.image_url, p.spec_url, c.name AS category
       FROM products p
       JOIN categories c ON c.id = p.category_id
       ${where}
       ORDER BY p.name`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error searchProducts:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * GET /api/products/detail/:id
 * Detalle completo de producto
 */
export const getProductDetail = async (req, res) => {
  const { id } = req.params;
  const idNum = Number(id);

  if (!Number.isInteger(idNum) || idNum <= 0) {
    return res.status(400).json({ error: "Id inválido" });
  }

  try {
    const [[row]] = await pool.query(
      `SELECT p.id, p.name, p.description, p.price, p.stock, 
              p.image_url, p.spec_url, p.active,
              c.id AS category_id, c.name AS category
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.id = ? AND p.active = 1`,
      [idNum]
    );

    if (!row) return res.status(404).json({ error: "Producto no encontrado" });

    res.json(row);
  } catch (err) {
    console.error("❌ getProductDetail:", err);
    res.status(500).json({ error: "Error al obtener detalle del producto" });
  }
};
