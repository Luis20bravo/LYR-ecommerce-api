import jwt from "jsonwebtoken";

/**
 * Middleware para proteger rutas de repartidores
 */
export const requireDriver = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = authHeader.split(" ")[1]; // formato: "Bearer TOKEN"
  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validar rol de repartidor
    if (decoded.role !== "driver") {
      return res.status(403).json({ error: "Acceso denegado: no eres repartidor" });
    }

    // Guardar datos del usuario en req.user
    req.user = {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("❌ requireDriver:", err.message);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};
