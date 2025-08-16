import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son obligatorios" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, email, password_hash FROM users WHERE email = ? AND role = 'admin' LIMIT 1",
      [email]
    );
    if (rows.length === 0) return res.status(401).json({ error: "Credenciales inválidas" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.json({ message: "Login admin exitoso", token });
  } catch (e) {
    console.error("❌ Error loginAdmin:", e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
