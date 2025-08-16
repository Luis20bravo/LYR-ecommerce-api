import pool from "../config/db.js";

// Obtener todas las categorías activas
export const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name FROM categories WHERE active = 1 ORDER BY name"
    );
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener categorías:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
