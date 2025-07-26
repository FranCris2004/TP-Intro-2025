import { Pool } from "pg";

const conn = new Pool({
  user: "testUser",
  host: "database", // el nombre del servicio en docker-compose
  database: "testDb",
  password: "testPass",
  port: 5432,
});

async function waitForDbConnection(intentos = 10, delay_ms = 2000) {
  for (let i = 0; i < intentos; i++) {
    try {
      await conn.query("SELECT 1");
      console.log("Conectado a la base de datos");
      return;
    } catch (err) {
      console.warn(
        `No se pudo conectar a la base de datos (intento ${i + 1}/${intentos})`
      );
      if (i === intentos - 1) throw err;
      await new Promise((res) => setTimeout(res, delay_ms));
    }
  }
}

await waitForDbConnection();

export default conn;
