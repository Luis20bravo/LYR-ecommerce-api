import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "root",
      database: process.env.DB_NAME || "ecommerce",
      multipleStatements: true,
    });

    const sql = fs.readFileSync(path.resolve("db/seeds/03_seed.sql"), "utf8");
    await conn.query(sql);

    console.log("✅ Seed ejecutado correctamente");
    await conn.end();
  } catch (err) {
    console.error("❌ Error ejecutando seed:", err);
    process.exit(1);
  }
};

run();
