const conn = require("./db_connection");
const Aventura = require("../models/aventura");

async function getAllAventuras() {
  const res = await conn.query("SELECT * FROM aventura");

  return res.rows.map(
    (row) => new Aventura(row.id, row.titulo, row.descripcion, row.autor_id, row.genero, row.fecha_creacion)
  );
}

async function getAventuraById(id) {
  try {
    const res = await conn.query("SELECT * FROM aventura WHERE id = $1", [id]);

    if (res.rowCount === 0) throw new Error("Aventura no encontrada");

    return new Aventura(
      res.rows[0].id,
      res.rows[0].titulo,
      res.rows[0].descripcion,
      res.rows[0].autor_id,
      res.rows[0].genero,
      res.rows[0].fecha_creacion
    );
  } catch (error) {
    console.error("Error en getAventuraById:", error);
    throw error;
  }
}

// devuelve las aventuras que tengan titulo similar al ingresado
// (busca coincidencias parciales del titulo)
// o lanza una excepcion en caso de error
async function getAventurasByTitle(titulo) {
  try {
    const res = await conn.query(
      // ILIKE matchea coincidencias parciales
      "SELECT * FROM aventura WHERE titulo ILIKE $1",
      [`%${titulo}%`]
    );

    return res.rows.map(
      (row) => new Aventura(row.id, row.titulo, row.descripcion, row.autor_id, row.genero, row.fecha_creacion)
    );
  } catch (error) {
    console.error("Error en getAventuraByTitle:", error);
    throw error;
  }
}

async function createAventura(titulo, descripcion, autor_id, genero, fecha_creacion) {
  try {
    const res = await conn.query(
      "INSERT INTO aventura (titulo, descripcion, autor_id, genero, fecha_creacion) VALUES ($1, $2, $3, $4, $5)",
      [titulo, descripcion, autor_id, genero, fecha_creacion]
    );

    return res.rows[0].id;
  } catch (error) {
    console.error("Error en createAventura:", error);
    throw error;
  }
}

module.exports = { getAllAventuras, getAventuraById, getAventurasByTitle, createAventura};
