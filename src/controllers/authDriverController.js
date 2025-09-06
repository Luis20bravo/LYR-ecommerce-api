import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const loginDriver = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email y contraseña requeridos" });

  try {
    const [[driver]] = await pool.query("SELECT * FROM drivers WHERE email = ?", [email]);
    if (!driver) return res.status(401).json({ error: "Credenciales inválidas" });

    const match = await bcrypt.compare(password, driver.password);
    if (!match) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: driver.id, role: "driver" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ message: "Login repartidor exitoso", token });
  } catch (e) {
    console.error("❌ loginDriver:", e);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
