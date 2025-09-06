// controllers/adminProductsController.js
import pool from "../config/db.js";
import fs from "fs";
import path from "path";

const isUrl = (s) => typeof s === "string" && /^https?:\/\/.+/i.test(s);

// 🔹 Función auxiliar: eliminar archivo local si existe
const deleteLocalFile = (filePath) => {
  if (!filePath) return;
  if (isUrl(filePath)) return; // si es URL remota, no tocar
  const fullPath = path.join(process.cwd(), filePath); // filePath ya es /uploads/...
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log(`🗑️ Imagen eliminada: ${fullPath}`);
  }
};

// ✅ Listar productos (con búsqueda opcional)
export const adminListProducts = async (req, res) => {
  const search = (req.query.search || "").trim();
  const params = [];
  let where = "WHERE 1=1";

  if (search) {
    where += " AND p.name LIKE ?";
    params.push(`%${search}%`);
  }

  try {
    const [rows] = await pool.query(
      `SELECT
          p.id, p.name, p.price, p.stock, p.active,
          p.description, p.spec_url, p.image_url, p.updated_at,
          c.id AS category_id, c.name AS category
       FROM products p
       JOIN categories c ON c.id = p.category_id
       ${where}
       ORDER BY p.name`,
      params
    );
    return res.json(rows);
  } catch (err) {
    console.error("❌ adminListProducts:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ✅ Crear producto
export const adminCreateProduct = async (req, res) => {
  const {
    category_id,
    name,
    price,
    stock = 0,
    spec_url = null,
    active = 1,
    description = null,
  } = req.body || {};

  // Manejo flexible de imagen
  const image_url = req.file
    ? `/uploads/products/${req.file.filename}`
    : (req.body.image_url && isUrl(req.body.image_url))
      ? req.body.image_url
      : null;

  if (!category_id || !name?.trim() || price === undefined) {
    return res
      .status(400)
      .json({ error: "category_id, name y price son obligatorios" });
  }
  if (Number(price) <= 0) {
    return res.status(400).json({ error: "price debe ser > 0" });
  }
  if (Number(stock) < 0) {
    return res.status(400).json({ error: "stock debe ser >= 0" });
  }
  if (spec_url && spec_url !== "" && !(isUrl(spec_url) || spec_url.startsWith("/uploads/"))) {
    return res
      .status(400)
      .json({ error: "spec_url debe ser URL válida (http/https o /uploads/...)" });
  }

  try {
    await pool.query(
      `INSERT INTO products
         (category_id, name, description, price, stock, spec_url, image_url, active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        category_id,
        name.trim(),
        description,
        price,
        stock,
        spec_url,
        image_url,
        active ? 1 : 0,
      ]
    );
    return res
      .status(201)
      .json({ message: "✅ Producto creado correctamente" });
  } catch (err) {
    console.error("❌ adminCreateProduct:", err);
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "El producto ya existe" });
    }
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ✅ Actualizar producto
export const adminUpdateProduct = async (req, res) => {
  const { id } = req.params;
  let {
    category_id,
    name,
    description,
    price,
    stock,
    spec_url,
    active,
    image_url: bodyImageUrl,
  } = req.body || {};

  // Normalizar valores vacíos
  if (category_id === "") category_id = null;
  if (description === "") description = null;
  if (price === "") price = null;
  if (stock === "") stock = null;
  if (spec_url === "") spec_url = null;
  if (bodyImageUrl === "") bodyImageUrl = null;

  // Imagen: archivo > URL remota > null
  const image_url = req.file
    ? `/uploads/products/${req.file.filename}`
    : (bodyImageUrl && (isUrl(bodyImageUrl) || bodyImageUrl.startsWith("/uploads/")))
      ? bodyImageUrl
      : null;

  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({ error: "Id inválido" });
  }

  // Validaciones
  if (price !== null && price !== undefined && Number(price) <= 0) {
    return res.status(400).json({ error: "price debe ser > 0" });
  }
  if (stock !== null && stock !== undefined && Number(stock) < 0) {
    return res.status(400).json({ error: "stock debe ser >= 0" });
  }
  if (spec_url && spec_url !== "" && !(isUrl(spec_url) || spec_url.startsWith("/uploads/"))) {
    return res
      .status(400)
      .json({ error: "spec_url debe ser URL válida (http/https o /uploads/...)" });
  }

  try {
    // Imagen actual
    const [[current]] = await pool.query(
      "SELECT image_url FROM products WHERE id = ?",
      [id]
    );
    if (!current) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Actualizar
    const [r] = await pool.query(
      `UPDATE products SET
         category_id = COALESCE(?, category_id),
         name        = COALESCE(?, name),
         description = COALESCE(?, description),
         price       = COALESCE(?, price),
         stock       = COALESCE(?, stock),
         spec_url    = COALESCE(?, spec_url),
         image_url   = COALESCE(?, image_url),
         active      = COALESCE(?, active),
         updated_at  = NOW()
       WHERE id = ?`,
      [
        category_id,
        name?.trim() ?? null,
        description,
        price,
        stock,
        spec_url,
        image_url,
        active === undefined ? null : active ? 1 : 0,
        id,
      ]
    );

    if (r.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Si hay nueva imagen, borrar la anterior
    if (req.file && current.image_url && current.image_url !== image_url) {
      deleteLocalFile(current.image_url);
    }

    return res.json({ message: "✅ Producto actualizado correctamente" });
  } catch (err) {
    console.error("❌ adminUpdateProduct:", err);
    return res.status(500).json({ error: "Error al actualizar producto" });
  }
};

// ✅ Soft delete
export const adminDeleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({ error: "Id inválido" });
  }

  try {
    const [r] = await pool.query(
      "UPDATE products SET active = 0, updated_at = NOW() WHERE id = ?",
      [id]
    );
    if (r.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    return res.json({ message: "🛑 Producto inactivado" });
  } catch (err) {
    console.error("❌ adminDeleteProduct:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ✅ Hard delete
export const hardDeleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({ error: "Id inválido" });
  }

  try {
    const [[current]] = await pool.query(
      "SELECT image_url FROM products WHERE id = ?",
      [id]
    );
    if (!current) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const [r] = await pool.query("DELETE FROM products WHERE id = ?", [id]);
    if (r.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    deleteLocalFile(current.image_url);

    return res.json({ message: "🗑️ Producto eliminado permanentemente" });
  } catch (err) {
    console.error("❌ hardDeleteProduct:", err);
    return res.status(500).json({ error: "Error al eliminar producto" });
  }
};
