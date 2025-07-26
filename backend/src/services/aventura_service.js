import conn from "./db_connection.js";
import Aventura from "../models/aventura.js";

async function getAllAventuras() {
  const res = await conn.query("SELECT * FROM aventura");

  return res.rows.map(
    (row) => new Aventura(row.id, row.titulo, row.descripcion, row.autor_id, row.genero, row.fecha_creacion, row.portada)
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
      res.rows[0].fecha_creacion,
      res.rows[0].portada
    );
  } catch (error) {
    console.error("Error en getAventuraById:", error);
    throw error;
  }
}

async function createAventura(titulo, descripcion, autor_id, genero, portada) {
  try {
    const res = await conn.query(
      "INSERT INTO aventura (titulo, descripcion, autor_id, genero, portada) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [titulo, descripcion, autor_id, genero, portada]
    );

    if (res.rowCount === 0) throw new Error("No se pudo crear la Aventura");

    return new Aventura(
      res.rows[0].id,
      res.rows[0].titulo,
      res.rows[0].descripcion,
      res.rows[0].autor_id,
      res.rows[0].genero,
      res.rows[0].fecha_creacion,
      res.rows[0].portada
    );
  } catch (error) {
    console.error("Error en createAventura:", error);
    throw error;
  }
}

async function deleteAventuraById(id) {  try {
    const res = await conn.query("DELETE FROM aventura WHERE id = $1", [id]);

    if (res.rowCount === 0) throw new Error("Aventura no encontrada");

  } catch (error) {
    console.error("Error en deleteAventuraById:", error);
    throw error;
  }
}

async function validateIdAventura(id) {
  return (await conn.query("SELECT 1 FROM aventura WHERE id = $1 LIMIT 1", [id])).rowCount !== 0;
}

async function updateAventuraById(id, titulo = null, descripcion = null, autor_id = null, genero = null, portada = null) {
  try {
    if (!id)
      throw new Error("ID de Aventura requerido");
    
    if (validateIdAventura(id) == false)
      throw new Error("ID de la aventura invalida");

    if (titulo)
      await conn.query("UPDATE aventura SET titulo = $2 WHERE id = $1", [id, titulo]);
   
    if (descripcion)
      await conn.query("UPDATE aventura SET descripcion= $2 WHERE id = $1", [id, descripcion]);
 
    if (autor_id)
      await conn.query("UPDATE aventura SET autor_id = $2 WHERE id = $1", [id, autor_id]);

    if (genero)
      await conn.query("UPDATE aventura SET genero = $2 WHERE id = $1", [id, genero]);

    if (portada)
      await conn.query("UPDATE aventura SET portada = $2 WHERE id = $1", [id, portada]);

    return getAventuraById(id);
  } catch (error) {
    console.error("Error en updateAventuraById:", error);
    throw error;
  }
}

export default { getAllAventuras, getAventuraById, createAventura, deleteAventuraById, updateAventuraById};
