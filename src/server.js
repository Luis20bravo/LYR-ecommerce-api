// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js"; 

// Rutas
import categoriesRoutes from "./routes/categoriesRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import authAdminRoutes from "./routes/authAdminRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import adminCategoriesRoutes from "./routes/adminCategoriesRoutes.js";
import adminProductsRoutes from "./routes/adminProductsRoutes.js";
import publicCommentsRoutes from "./routes/publicCommentsRoutes.js";
import adminCommentsRoutes from "./routes/adminCommentsRoutes.js";

dotenv.config();

const app = express();

// Para __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// Probar conexión a la base de datos
const testDB = async () => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS fecha");
    console.log("✅ Conectado a MySQL. Fecha actual:", rows[0].fecha);
  } catch (error) {
    console.error("❌ Error conectando a MySQL:", error.message);
    process.exit(1);
  }
};
testDB();

// Rutas
app.use("/api/categories", categoriesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/company", companyRoutes);

// ⚠️ mejor cambiar admin auth a un prefijo distinto
app.use("/api/auth/admin", authAdminRoutes);

app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/categories", adminCategoriesRoutes);
app.use("/api/admin/products", adminProductsRoutes);
app.use("/api/public/comments", publicCommentsRoutes);
app.use("/api/admin/comments", adminCommentsRoutes);

// Servir carpeta uploads como pública
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
