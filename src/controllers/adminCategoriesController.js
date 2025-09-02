// controllers/adminCategoriesController.js
import pool from "../config/db.js";

// ✅ Listar todas las categorías
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

// ✅ Crear categoría (o actualizar si existe)
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
      return res.status(201).json({ message: "Categoría creada", id: result.insertId });
    } else {
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
      "UPDATE categories SET name = COALESCE(?, name), active = COALESCE(?, active), updated_at = NOW() WHERE id = ?",
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

// ✅ Cambiar estado (activar / desactivar)
export const toggleCategory = async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;
  if (active !== 0 && active !== 1) {
    return res.status(400).json({ error: "Valor de 'active' inválido" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE categories SET active = ?, updated_at = NOW() WHERE id = ?",
      [active, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.json({ message: `Categoría ${active ? "activada" : "desactivada"} correctamente` });
  } catch (err) {
    console.error("❌ toggleCategory:", err.message);
    res.status(500).json({ error: "Error al cambiar estado de categoría" });
  }
};

// ✅ Soft delete (inactivar categoría)
export const adminDeleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("UPDATE categories SET active = 0, updated_at = NOW() WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.json({ message: "Categoría inactivada" });
  } catch (e) {
    console.error("❌ adminDeleteCategory:", e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ✅ Hard delete (eliminación definitiva)
export const hardDeleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.json({ message: "Categoría eliminada permanentemente" });
  } catch (err) {
    console.error("❌ hardDeleteCategory:", err.message);
    res.status(500).json({ error: "Error al eliminar categoría" });
  }
};
