import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimiter } from "./middlewares/rate-limit.js";
import { router } from "./routes/index.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(rateLimiter);

// monta todas las rutas centralizadas
app.use("/api", router);

// health check
app.get("/health", (_req, res) => res.json({ ok: true }));
