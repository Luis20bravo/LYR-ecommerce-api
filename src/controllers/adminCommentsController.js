// controllers/adminCommentsController.js
import pool from "../config/db.js";

// Listar comentarios
export const adminListComments = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.name, c.email, c.phone, c.message, c.status, c.created_at,
              p.name AS product_name
       FROM comments c
       LEFT JOIN products p ON p.id = c.product_id
       ORDER BY c.created_at DESC`
    );
    res.json(rows);
  } catch (e) {
    console.error("❌ adminListComments:", e);
    res.status(500).json({ error: "Error al listar comentarios" });
  }
};

// Cambiar estado (aprobar/rechazar)
export const adminUpdateCommentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Estado inválido" });
  }

  try {
    const [r] = await pool.query(
      "UPDATE comments SET status = ? WHERE id = ?",
      [status, id]
    );
    if (r.affectedRows === 0)
      return res.status(404).json({ error: "Comentario no encontrado" });

    res.json({ message: `✅ Comentario ${status}` });
  } catch (e) {
    console.error("❌ adminUpdateCommentStatus:", e);
    res.status(500).json({ error: "Error al actualizar comentario" });
  }
};

// Eliminar comentario
export const adminDeleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const [r] = await pool.query("DELETE FROM comments WHERE id = ?", [id]);
    if (r.affectedRows === 0)
      return res.status(404).json({ error: "Comentario no encontrado" });

    res.json({ message: "🗑️ Comentario eliminado" });
  } catch (e) {
    console.error("❌ adminDeleteComment:", e);
    res.status(500).json({ error: "Error al eliminar comentario" });
  }
};



