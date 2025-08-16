// hash.js
import bcrypt from "bcrypt"; // npm i bcrypt

//const passwordPlano = "Admin#2025"; 
const passwordPlano = "Repartidor#2025"; 
const saltRounds = 12; // seguridad alta (recomendado mínimo 10)

const run = async () => {
  const hash = await bcrypt.hash(passwordPlano, saltRounds);
  console.log("BCRYPT_HASH ->", hash);
};

run();
