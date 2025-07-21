const conn = require("./db_connection");
const Pagina = require("../models/pagina");

/*
id SERIAL PRIMARY KEY,
id_aventura INT NOT NULL REFERENCES aventura(id),
titulo VARCHAR(100) NOT NULL,
contenido VARCHAR(255) NOT NULL,
imagen VARCHAR(255) NULL
*/

async function getAllPaginas() {
  const res = await conn.query("SELECT * FROM paginas");

  return res.rows.map(
    (row) =>
      new Pagina(row.id, row.id_aventura, row.title, row.contenido, row.imagen)
  );
}

async function getPaginaById(id) {
  try {
    const res = await conn.query("SELECT * FROM paginas WHERE id = $1", [id]);

    if (res.rowCount === 0) throw new Error("Pagina no encontrada");

    return new Pagina(
      res.rows[0].id,
      res.rows[0].id_aventura,
      res.rows[0].title,
      res.rows[0].contenido,
      res.rows[0].imagen
    );
  } catch (error) {
    console.error("Error en getPaginaById:", error);
    throw error;
  }
}

// devuelve las Paginas que tengan titulo similar al ingresado
// (busca coincidencias parciales del titulo)
// o lanza una excepcion en caso de error
async function getPaginasByTitle(title) {
  try {
    const res = await conn.query(
      // ILIKE matchea coincidencias parciales
      "SELECT * FROM paginas WHERE title ILIKE $1",
      [`%${title}%`]
    );

    return res.rows.map(
      (row) =>
        new Pagina(
          row.id,
          row.id_aventura,
          row.title,
          row.contenido,
          row.imagen
        )
    );
  } catch (error) {
    console.error("Error en getPaginaByTitle:", error);
    throw error;
  }
}

async function createPagina(title, id_aventura, title, contenido, imagen) {
  try {
    if (!id_aventura)
      throw new Error("El id de la aventura es invalido");

    if (title === "")
      throw new Error("El titulo debe ser un string no vacio");

    if (contenido === "")
      throw new Error("El contenido debe ser un string no vacio");

    const res = await conn.query(
      "INSERT INTO paginas (id_aventura, title, contenido, imagen) VALUES ($1, $2, $3, $4)",
      [id_aventura, title, contenido, imagen]
    );
  } catch (error) {
    console.error("Error en createPagina:", error);
    throw error;
  }
}

module.exports = { getAllPaginas, getPaginaById, getPaginasByTitle, createPagina };
