// controllers/adminCategoriesController.js
import pool from "../config/db.js";

// ✅ Listar todas las categorías (admin)
export const adminListCategories = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, active, created_at, updated_at FROM categories ORDER BY name"
    );
    res.json(rows);
  } catch (e) {
    console.error("❌ adminListCategories:", e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ✅ Crear categoría (o actualizar si ya existe con mismo nombre)
export const adminCreateCategory = async (req, res) => {
  const { name, active = 1 } = req.body || {};
  if (!name?.trim()) {
    return res.status(400).json({ error: "Nombre requerido" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO categories (name, active)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE
         active = VALUES(active),
         updated_at = NOW()`,
      [name.trim(), active ? 1 : 0]
    );

    const created = result.affectedRows === 1;

    if (created) {
      // Caso: insert nuevo
      return res.status(201).json({
        message: "Categoría creada",
        id: result.insertId,
      });
    } else {
      // Caso: update por duplicado
      const [rows] = await pool.query(
        "SELECT id, name, active FROM categories WHERE name = ?",
        [name.trim()]
      );
      return res.status(200).json({
        message: "Categoría ya existía; se actualizó",
        category: rows[0],
      });
    }
  } catch (e) {
    console.error("❌ adminCreateCategory:", e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ✅ Actualizar categoría (por ID)
export const adminUpdateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, active } = req.body || {};
  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({ error: "Id inválido" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE categories SET name = COALESCE(?, name), active = COALESCE(?, active) WHERE id = ?",
      [name?.trim() ?? null, active === undefined ? null : (active ? 1 : 0), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json({ message: "Categoría actualizada" });
  } catch (e) {
    console.error("❌ adminUpdateCategory:", e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ✅ Inactivar categoría (soft delete)
export const adminDeleteCategory = async (req, res) => {
  const { id } = req.params;
  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({ error: "Id inválido" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE categories SET active = 0 WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json({ message: "Categoría inactivada" });
  } catch (e) {
    console.error("❌ adminDeleteCategory:", e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
