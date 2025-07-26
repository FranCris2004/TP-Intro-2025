import conn from "./db_connection.js";
import Opcion from "../models/opcion.js";

async function getAllOpcionesByPaginaNumero(numero_pagina_origen, id_aventura) {
  try {
    const res = await conn.query(
      "SELECT * FROM opcion WHERE numero_pagina_origen = $1 AND id_aventura = $2",
      [numero_pagina_origen, id_aventura]
    );

    if (res.rowCount === 0)
      throw new Error("Fallo al optener las opciones de la pagina");

    return res.rows.map((row) =>
      Opcion(
        row.id,
        row.descripcion,
        row.id_aventura,
        row.numero_pagina_origen,
        row.numero_pagina_destino
      )
    );
  } catch (error) {
    console.error("Error en getAllOpcionesByPaginaId", error);
    throw error;
  }
}

async function createOpcion(descripcion, numero_pagina_origen, numero_pagina_destino, id_aventura) {
  try {
    const res = await conn.query(
      "INSERT INTO opcion (descripcion, numero_pagina_origen, numero_pagina_destino, id_aventura) VALUES ($1, $2, $3, $4) RETURNING *",
      [descripcion, numero_pagina_origen, numero_pagina_destino, id_aventura]
    );

    if (res.rowCount === 0) throw new Error("No se pudo crear la opción");

    return new Opcion(
      res.rows[0].id,
      res.rows[0].id_aventura,
      res.rows[0].descripcion,
      res.rows[0].numero_pagina_origen,
      res.rows[0].numero_pagina_destino
    );
  } catch (error) {
    console.error("Error en createOpcion:", error);
    throw error;
  }
}

async function deleteOpcionById(id) {
  try{
    const res = await conn.query("DELETE FROM opcion WHERE id = $1", [id]);

    if (res.rowCount === 0) throw new Error("Opcion no encontrada");

  } catch (error) {
    console.error("Error en deleteOpcionById:", error);
    throw error;
  }
}

async function validateOpcionByNumero(id_aventura, numero_pagina_origen) {
  return (await conn.query("SELECT 1 FROM opcion WHERE id_aventura = $1 AND numero_pagina_origen = $2 LIMIT 1",[id_aventura, numero_pagina_origen])).rowCount !== 0;
}

async function updateOpcionByNumero(
  id_aventura,
  numero_pagina_origen,
  descripcion = null,
  numero_pagina_destino = null,
  
) {try {
    if (!id_aventura || !numero_pagina_origen)
      throw new Error("id_aventura y numero_pagina_origen de opcion son requeridos");

    if (await validateOpcionByNumero(id_aventura, numero_pagina_origen) === false)
      throw new Error("Opcion no encontrada");
    
    if (descripcion)
      await conn.query("UPDATE opcion SET descripcion= $3 WHERE id_aventura = $1 AND numero_pagina_origen = $2", [id_aventura, numero_pagina_origen, descripcion]);

    if (numero_pagina_destino)
      await conn.query("UPDATE opcion SET numero_pagina_destino= $3 WHERE id_aventura = $1 AND numero_pagina_origen = $2", [id_aventura, numero_pagina_origen, numero_pagina_destino]);

    return new Opcion(
     res.rows[0].id,
     res.rows[0].id_aventura,
     res.rows[0].descripcion,
     res.rows[0].numero_pagina_origen,
     res.rows[0].numero_pagina_destino
    );
  } catch (error) {
    console.error("Error en updateOpcionById:", error);
    throw error;
  }
}


export default {
  getAllOpcionesByPaginaNumero,
  createOpcion,
  deleteOpcionById,
  updateOpcionByNumero,
};
