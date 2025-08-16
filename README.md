# LYRinnovatech — API (Incremento 1)

Backend Node.js (Express + MySQL2) — Incremento 1: Fundamentos y Catálogo.

## Requisitos
- Node.js 18+ / 20+ (recomendado)
- MySQL 8.x

## Configuración
1. Crear base de datos `ecommerce`.
2. Ejecutar migraciones y seeds (ya incluidos).
3. Crear un archivo `.env` (este NO se sube al repo) con este contenido de ejemplo:

DB_HOST=localhost
DB_USER=root
DB_PASS=root
DB_NAME=ecommerce
JWT_SECRET=pon_una_clave_segura
PORT=4000

## Scripts
- `npm run dev` — levantar API con nodemon
- `npm run db:seed:js` — ejecutar seed con mysql2/promise

## Endpoints clave (Incremento 1)
**Público**
- `GET /api/company`
- `GET /api/categories`
- `GET /api/products/:categoryId`
- `GET /api/products/spec/:id`
- `POST /api/public/comments`

**Auth**
- `POST /api/auth/admin/login`
- `POST /api/auth/repartidor/login`

**Admin (Bearer token)**
- `GET /api/admin/dashboard`
- `GET/POST/PUT/DELETE/PATCH /api/admin/categories`
- `GET/POST/PUT/DELETE /api/admin/products`
- `GET /api/admin/comments`