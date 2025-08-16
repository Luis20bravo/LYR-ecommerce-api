import pool from "../config/db.js";

export const getCompanyInfo = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, mission, vision, about, phone, email, address FROM company_info ORDER BY id DESC LIMIT 1"
    );
    if (!rows.length) {
      return res.json({
        mission: null,
        vision: null,
        about: "Información aún no configurada.",
        phone: null, email: null, address: null
      });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error getCompanyInfo:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
