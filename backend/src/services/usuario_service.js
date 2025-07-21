const conn = require("../services/db_connection");
const Usuario = require("../models/usuario");

async function getAllUsuarios() {
  const res = await conn.query("SELECT * FROM usuarios");

  return res.rows.map((row) => new Usuario(row.id, row.nombre));
}

async function getUsuarioById(id) {
  try {
    const res = await conn.query("SELECT * FROM usuarios WHERE id = $1", [id]);

    if (res.rowCount === 0) throw new Error("Usuario no encontrada");

    return new Usuario(res.rows[0].id, res.rows[0].nombre);
  } catch (error) {
    console.error("Error en getUsuarioById:", error);
    throw error;
  }
}

async function createUsuario(nombre, contrasenia) {
  try {
    if (!nombre || nombre == "")
      throw new Error("El nombre debe ser un string no vacio");

    if (!contrasenia || contrasenia == "")
      throw new Error("La contrasenia debe ser un string no vacio");

    const res = await conn.query(
      "INSERT INTO usuarios (nombre, contrasenia) VALUES ($1, $2)",
      [nombre, contrasenia]
    );
  } catch (error) {
    console.error("Error en createUsuario:", error);
    throw error;
  }
}

module.exports = { getAllUsuarios, getUsuarioById, createUsuario };
