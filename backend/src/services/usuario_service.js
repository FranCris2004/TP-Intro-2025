import conn from "../services/db_connection.js";
import Usuario from "../models/usuario.js";

//
// Misc
//

async function validateIdUsuario(id) {
  return (
    (await conn.query("SELECT 1 FROM usuario WHERE id = $1 LIMIT 1", [id]))
      .rowCount !== 0
  );
}

async function validateContrasenia(id, contrasenia) {
  try {
    const usuario = await getUsuarioById(id);

    return usuario.contrasenia === contrasenia;
  } catch (error) {
    console.log("Error en validateContrasenia:", error);
    throw error;
  }
}

//
// Create
//

async function createUsuario(nombre, contrasenia, email, fecha_de_nacimiento) {
  try {
    if (!nombre || nombre == "")
      throw new Error("El nombre debe ser un string no vacio");

    if (!contrasenia || contrasenia == "")
      throw new Error("La contrasenia debe ser un string no vacio");

    const res = await conn.query(
      `
      INSERT INTO usuario (nombre, contrasenia, email, fecha_de_nacimiento)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [nombre, contrasenia, email, fecha_de_nacimiento]
    );

    if (res.rowCount === 0)
      throw new Error("Fallo al insertar el nuevo usuario a la base de datos");

    return new Usuario(
      res.rows[0].id,
      res.rows[0].nombre,
      res.rows[0].email,
      res.rows[0].fecha_registro,
      res.rows[0].fecha_de_nacimiento
    );
  } catch (error) {
    console.error("Error en createUsuario:", error);
    throw error;
  }
}

//
// Read
//

async function getAllUsuarios() {
  try {
    const res = await conn.query("SELECT * FROM usuario");

    return res.rows.map(
      (row) =>
        new Usuario(
          row.id,
          row.nombre,
          row.email,
          row.fecha_registro,
          row.fecha_de_nacimiento
        )
    );
  } catch (error) {
    console.log(`Error en getAllUsuarios: ${error}`);
    throw error;
  }
}

async function getUsuarioById(id) {
  try {
    const res = await conn.query("SELECT * FROM usuario WHERE id = $1", [id]);

    if (res.rowCount === 0) throw new Error("Usuario no encontrado");

    return new Usuario(
      res.rows[0].id,
      res.rows[0].nombre,
      res.rows[0].email,
      res.rows[0].fecha_registro,
      res.rows[0].fecha_de_nacimiento
    );
  } catch (error) {
    console.error("Error en getUsuarioById:", error);
    throw error;
  }
}

async function getUsuarioByNombre(nombre) {
  try {
    const res = conn.query("SELECT * FROM usuario WHERE nombre = $1", [nombre]);

    if ((await res).rowCount === 0) throw new Error("Usuario no encontrado");

    return new Usuario(
      res.rows[0].id,
      res.rows[0].nombre,
      res.rows[0].email,
      res.rows[0].fecha_registro,
      res.rows[0].fecha_de_nacimiento
    );
  } catch (error) {
    console.error("Error en getUsuarioByNombre", error);
    throw error;
  }
}

//
// Update
//

async function updateUsuarioById(
  id,
  nombre,
  contrasenia,
  email,
  fecha_de_nacimiento
) {
  try {
    if (!id) throw new Error("ID de usuario requerido");

    if (validateIdUsuario(id) == false)
      throw new Error("Usuario no encontrado");

    if (nombre)
      await conn.query("UPDATE usuario SET nombre = $2 WHERE id = $1", [
        id,
        nombre,
      ]);

    if (contrasenia)
      await conn.query("UPDATE usuario SET contrasenia= $2 WHERE id = $1", [
        id,
        contrasenia,
      ]);

    if (email)
      await conn.query("UPDATE usuario SET email = $2 WHERE id = $1", [
        id,
        email,
      ]);

    if (fecha_de_nacimiento)
      await conn.query(
        "UPDATE usuario SET fecha_nacimiento = $2 WHERE id = $1",
        [id, fecha_nacimiento]
      );

    return await getUsuarioById(id);
  } catch (error) {
    console.error("Error en updateUsuarioById:", error);
    throw error;
  }
}

//
// Delete
//

async function deleteUsuarioById(id) {
  try {
    const res = await conn.query("DELETE FROM usuario WHERE id = $1", [id]);

    if (res.rowCount === 0) throw new Error("Usuario no encontrado");
  } catch (error) {
    console.error("Error en deleteUsuarioById:", error);
    throw error;
  }
}

export default {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuarioById,
  deleteUsuarioById,
  validateContrasenia,
};
