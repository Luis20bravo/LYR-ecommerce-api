import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    multipleStatements: true,
  });

  // 01: crear BD
  const schemaSql = fs.readFileSync(path.resolve("db/migrations/01_schema.sql"), "utf8");
  await conn.query(schemaSql);

  // 02: tablas (ya usando la BD)
  const tablesSql = fs.readFileSync(path.resolve("db/migrations/02_tables.sql"), "utf8");
  await conn.query(tablesSql);

  console.log("✅ Migraciones ejecutadas");
  await conn.end();
};
run().catch((e) => { console.error(e); process.exit(1); });
