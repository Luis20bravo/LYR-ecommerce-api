// src/controllers/publicCommentsController.js
import pool from "../config/db.js";

// 📌 Crear comentario público
export const createComment = async (req, res) => {
  const { product_id, name, email, message } = req.body;

  if (!product_id || !message?.trim()) {
    return res.status(400).json({ error: "product_id y message son obligatorios" });
  }

  try {
    await pool.query(
      `INSERT INTO comments (product_id, name, email, message, created_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [product_id, name?.trim() || "Anónimo", email || null, message.trim()]
    );
    res.status(201).json({ message: "✅ Comentario enviado" });
  } catch (err) {
    console.error("❌ createComment:", err);
    res.status(500).json({ error: "Error al enviar comentario" });
  }
};

// 📌 Listar comentarios de un producto
export const listCommentsByProduct = async (req, res) => {
  const { product_id } = req.query;

  if (!product_id) {
    return res.status(400).json({ error: "Falta product_id" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT id, name, message, created_at 
       FROM comments 
       WHERE product_id = ? 
       ORDER BY created_at DESC`,
      [product_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ listCommentsByProduct:", err);
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
};
