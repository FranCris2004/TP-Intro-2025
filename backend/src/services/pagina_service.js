import conn from "./db_connection.js";
import Pagina from "../models/pagina.js";
import Opcion from "../models/opcion.js";

async function getPaginaById(id) {
  try {
    const res = await conn.query("SELECT * FROM pagina WHERE id = $1", [id]);

    if (res.rowCount === 0) throw new Error("Pagina no encontrada");

    return new Pagina(
          res.rows[0].id,
          res.rows[0].titulo,
          res.rows[0].id_aventura,
          res.rows[0].numero,
          res.rows[0].contenido,
          res.rows[0].imagen
        );
  } catch (error) {
    console.error("Error en getPaginaById:", error);
    throw error;
  }
}

async function getPaginaByNumero(id_aventura, numero) {
  try {
    const res = await conn.query( "SELECT * FROM pagina WHERE id_aventura = $1 AND numero = $2",[id_aventura, numero]);

    if (res.rowCount === 0) throw new Error("Página no encontrada");

    return new Pagina(
          res.rows[0].id,
          res.rows[0].titulo,
          res.rows[0].id_aventura,
          res.rows[0].numero,
          res.rows[0].contenido,
          res.rows[0].imagen
        );
  } catch (error) {
    throw new Error("Error en getPaginaByNumero", error);
  }
}

async function createPagina(
  titulo,
  id_aventura,
  contenido,
  imagen
) {
  try {
    if (!id_aventura) throw new Error("El id de la aventura es invalido");

    if (titulo === "") throw new Error("El titulo debe ser un string no vacio");

    if (contenido === "")
      throw new Error("El contenido debe ser un string no vacio");

    if (imagen === "")
      throw new Error("Imagen inválida: debe ser string o null");

    const res = await conn.query(
      "INSERT INTO paginas (id_aventura, titulo, contenido, imagen) VALUES ($1, $2, $3, $4) RETURNING *",
      [id_aventura, titulo, contenido, imagen]
    );
    return new Pagina(
      res.rows[0].id,
      res.rows[0].numero,
      res.rows[0].titulo,
      res.rows[0].id_aventura,
      res.rows[0].contenido,
      res.rows[0].imagen
    );
  } catch (error) {
    console.error("Error en createPagina:", error);
    throw error;
  }
}

async function validateIdPagina(id) {
  return (
    (await conn.query("SELECT 1 FROM pagina WHERE id = $1 LIMIT 1", [id]))
      .rowCount !== 0
  );
}

async function updatePaginaById(
  id,
  titulo = null,
  contenido = null,
  imagen = null
) {
  try {
    if (!id) throw new Error("ID de pagina requerido");

    if (validateIdPagina(id) == false) throw new Error("Pagina no encontrado");

    if (titulo)
      await conn.query("UPDATE pagina SET titulo = $2 WHERE id = $1", [id, titulo]);

    if (contenido)
      await conn.query("UPDATE pagina SET contenido = $2 WHERE id = $1", [
        id,
        contenido,
      ]);

    if (imagen)
      await conn.query("UPDATE pagina SET imagen = $2 WHERE id = $1", [id, imagen]);

    return getPaginaById(id);
  } catch (error) {
    console.error("Error en updatePaginaById:", error);
    throw error;
  }
}

async function validatePaginaByNumero(id_aventura, numero) {
  return (await conn.query("SELECT 1 FROM pagina WHERE id_aventura = $1 AND numero = $2 LIMIT 1",[id_aventura, numero])).rowCount !== 0;
}



async function updatePaginaByNumero(id_aventura, numero, titulo = null, contenido = null, imagen = null) {
  try {
    if (!id_aventura || !numero)
      throw new Error("id_aventura y numero de página son requeridos");

    if (await validatePaginaByNumero(id_aventura, numero) === false)
      throw new Error("Página no encontrada");
    if (titulo)
      await conn.query("UPDATE pagina SET titulo = $3 WHERE id_aventura = $1 AND numero = $2", [id_aventura, numero, titulo]);

    if (contenido)
      await conn.query("UPDATE pagina SET contenido = $3 WHERE id_aventura = $1 AND numero = $2", [id_aventura, numero, contenido]);

    if (imagen)
      await conn.query("UPDATE pagina SET imagen = $3 WHERE id_aventura = $1 AND numero = $2", [id_aventura, numero, imagen]);

    const res = await conn.query(
      "SELECT * FROM pagina WHERE id_aventura = $1 AND numero = $2",
      [id_aventura, numero]
    );

    return new Pagina(
      res.rows[0].id,
      res.rows[0].titulo,
      res.rows[0].id_aventura,
      res.rows[0].contenido,
      res.rows[0].imagen
    );
  } catch (error) {
    console.error("Error en updatePaginaByNumero:", error);
    throw error;
  }
}



async function deletePaginaById(id) {  
  try {
    const res = await conn.query("DELETE FROM pagina WHERE id = $1", [id]);

    if (res.rowCount === 0) throw new Error("Página no encontrada");
  } catch (error) {
    console.error("Error en deletePaginaById:", error);
    throw error;
  }
}

async function deletePaginaByNumero(id_aventura, numero) {
  try {
    if (!id_aventura || !numero)
      throw new Error("id_aventura y número de página son requeridos");

    const res = await conn.query(
      "DELETE FROM pagina WHERE id_aventura = $1 AND numero = $2 ",
      [id_aventura, numero]
    );

    if (res.rowCount === 0)
      throw new Error("Página no encontrada");

  } catch (error) {
    console.error("Error en deletePaginaByNumero:", error);
    throw error;
  }
}


async function getAllPaginasFinalesByUsuarioId(id_usuario) {
  try {
    const res = await conn.query(
      `
      SELECT p.* FROM pagina p
      JOIN finales f ON p.id = f.id_pagina
      JOIN usuario_final uf ON uf.id_final = f.id
      WHERE uf.id_usuario = $1
      `,
      [id_usuario]
    );

    return res.rows.map(
      async (row) =>
        new Pagina(
          row.id,
          row.id_aventura,
          row.titulo,
          row.contenido,
          row.imagen,
        )
    );
  } catch (error) {
    console.error("Error en getAllPaginasFinalesByUsuarioId:", error);
    throw error;
  }
}

export default {
  getPaginaById,
  getPaginaByNumero,
  createPagina,
  updatePaginaById,
  updatePaginaByNumero,
  deletePaginaById,
  deletePaginaByNumero,
  getAllPaginasFinalesByUsuarioId
};
