import pool from "../config/db.js";

// Público: crear comentario
export const createComment = async (req, res) => {
  const { name, email = null, phone = null, message } = req.body || {};
  if (!name?.trim() || !message?.trim()) {
    return res.status(400).json({ error: "Nombre y mensaje son obligatorios" });
  }
  try {
    await pool.query(
      "INSERT INTO comments (name, email, phone, message) VALUES (?, ?, ?, ?)",
      [name.trim(), email || null, phone || null, message.trim()]
    );
    res.status(201).json({ message: "Comentario enviado" });
  } catch (e) {
    console.error("❌ createComment:", e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Admin: listar comentarios
export const adminListComments = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, phone, message, created_at FROM comments ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (e) {
    console.error("❌ adminListComments:", e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
