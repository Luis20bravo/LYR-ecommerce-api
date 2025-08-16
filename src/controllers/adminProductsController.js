import pool from "../config/db.js";

export const adminListProducts = async (req, res) => {
  const search = (req.query.search || "").trim();
  const params = [];
  let where = "WHERE p.active = 1";

  if (search) {
    where += " AND p.name LIKE ?";
    params.push(`%${search}%`);
  }

  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.price, p.stock, p.spec_url, p.active,
              c.id AS category_id, c.name AS category
       FROM products p
       JOIN categories c ON c.id = p.category_id
       ${where}
       ORDER BY p.name`,
      params
    );
    res.json(rows);
  } catch (e) {
    console.error("❌ adminListProducts:", e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const adminCreateProduct = async (req, res) => {
  const { category_id, name, price, stock = 0, spec_url = null, active = 1, description = null } = req.body || {};
  if (!category_id || !name?.trim() || price === undefined) {
    return res.status(400).json({ error: "category_id, name y price son obligatorios" });
  }

  if (Number(price) <= 0) return res.status(400).json({ error: "price debe ser > 0" });

  try {
    await pool.query(
      `INSERT INTO products (category_id, name, description, price, stock, spec_url, active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [category_id, name.trim(), description, price, stock, spec_url, active ? 1 : 0]
    );
    res.status(201).json({ message: "Producto creado" });
  } catch (e) {
    console.error("❌ adminCreateProduct:", e);
    if (e.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "El producto ya existe" });
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const adminUpdateProduct = async (req, res) => {
  const { id } = req.params;
  const { category_id, name, description, price, stock, spec_url, active } = req.body || {};
  if (!Number.isInteger(Number(id))) return res.status(400).json({ error: "Id inválido" });

  try {
    await pool.query(
      `UPDATE products SET
        category_id = COALESCE(?, category_id),
        name        = COALESCE(?, name),
        description = COALESCE(?, description),
        price       = COALESCE(?, price),
        stock       = COALESCE(?, stock),
        spec_url    = COALESCE(?, spec_url),
        active      = COALESCE(?, active)
       WHERE id = ?`,
      [
        category_id ?? null,
        name?.trim() ?? null,
        description ?? null,
        price ?? null,
        stock ?? null,
        spec_url ?? null,
        active === undefined ? null : (active ? 1 : 0),
        id
      ]
    );
    res.json({ message: "Producto actualizado" });
  } catch (e) {
    console.error("❌ adminUpdateProduct:", e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Inactivar (soft delete)
export const adminDeleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!Number.isInteger(Number(id))) return res.status(400).json({ error: "Id inválido" });

  try {
    await pool.query("UPDATE products SET active = 0 WHERE id = ?", [id]);
    res.json({ message: "Producto inactivado" });
  } catch (e) {
    console.error("❌ adminDeleteProduct:", e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
