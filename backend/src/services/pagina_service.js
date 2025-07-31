import conn from "./db_connection.js";
import Pagina from "../models/pagina.js";
import Opcion from "../models/opcion.js";

//
// Create
//
async function createPagina(
  id_aventura,
  numero,
  titulo,
  contenido,
  imagen = null
) {
  try {
    if (!Number.isInteger(id_aventura) || id_aventura <= 0)
      throw new Error("El id de la aventura es invalido");

    if (!Number.isInteger(numero) || numero <= 0)
      throw new Error("El número de página debe ser un entero positivo");

    if (typeof titulo !== "string" || titulo.trim() === "")
      throw new Error("El titulo debe ser un string no vacío");

    if (typeof contenido !== "string" || contenido.trim() === "")
      throw new Error("El contenido debe ser un string no vacío");

    if (imagen !== null && typeof imagen !== "string")
      throw new Error("Imagen inválida: debe ser string o null");

    const res = await conn.query(
      `INSERT INTO pagina (id_aventura, numero, titulo, contenido, imagen)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_aventura, numero, titulo.trim(), contenido.trim(), imagen]
    );

    const {
      id,
      id_aventura: idAv,
      numero: num,
      titulo: tit,
      contenido: cont,
      imagen: img,
    } = res.rows[0];

    return new Pagina(
      res.rows[0].id,
      res.rows[0].id_aventura,
      res.rows[0].numero,
      res.rows[0].titulo,
      res.rows[0].contenido,
      res.rows[0].imagen
    );
  } catch (error) {
    console.error("Error en createPagina:", error);
    throw error;
  }
}

//
// Read
//

async function getPaginaById(id) {
  try {
    const res = await conn.query("SELECT * FROM pagina WHERE id = $1", [id]);

    if (res.rowCount === 0) throw new Error("Pagina no encontrada");

    return new Pagina(
      res.rows[0].id,
      res.rows[0].id_aventura,
      res.rows[0].numero,
      res.rows[0].titulo,
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
    const res = await conn.query(
      "SELECT * FROM pagina WHERE id_aventura = $1 AND numero = $2",
      [id_aventura, numero]
    );

    if (res.rowCount === 0) throw new Error("Página no encontrada");

    return new Pagina(
      res.rows[0].id,
      res.rows[0].id_aventura,
      res.rows[0].numero,
      res.rows[0].titulo,
      res.rows[0].contenido,
      res.rows[0].imagen
    );
  } catch (error) {
    throw new Error("Error en getPaginaByNumero", error);
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
          row.numero,
          row.titulo,
          row.contenido,
          row.imagen
        )
    );
  } catch (error) {
    console.error("Error en getAllPaginasFinalesByUsuarioId:", error);
    throw error;
  }
}

//
// Update
//

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
    // Validación mejorada del ID
    if (!id || isNaN(parseInt(id))) {
      throw new Error("ID de página inválido: debe ser un número");
    }
    id = parseInt(id);

    // Verificar existencia
    if (!(await validateIdPagina(id))) {
      throw new Error(`Página con ID ${id} no encontrada`);
    }

    // Construir consulta dinámica
    const updates = [];
    const params = [id];
    let paramIndex = 2; // $1 es el id

    if (titulo !== null) {
      if (typeof titulo !== "string" || titulo.trim() === "") {
        throw new Error("Título inválido: debe ser string no vacío");
      }
      updates.push("titulo = $" + paramIndex);
      params.push(titulo.trim());
      paramIndex++;
    }

    if (contenido !== null) {
      if (typeof contenido !== "string" || contenido.trim() === "") {
        throw new Error("Contenido inválido: debe ser string no vacío");
      }
      updates.push("contenido = $" + paramIndex);
      params.push(contenido.trim());
      paramIndex++;
    }

    if (imagen !== null) {
      if (typeof imagen !== "string") {
        throw new Error("Imagen inválida: debe ser string o null");
      }
      updates.push("imagen = $" + paramIndex);
      params.push(imagen);
      paramIndex++;
    }

    // Si hay campos para actualizar
    if (updates.length > 0) {
      await conn.query(
        `UPDATE pagina SET ${updates.join(", ")} WHERE id = $1`,
        params
      );
    }

    // Retornar la página actualizada
    return await getPaginaById(id);
  } catch (error) {
    console.error(`Error en updatePaginaById [ID:${id}]:`, error);
    throw error;
  }
}

async function validatePaginaByNumero(id_aventura, numero) {
  return (
    (
      await conn.query(
        "SELECT 1 FROM pagina WHERE id_aventura = $1 AND numero = $2 LIMIT 1",
        [id_aventura, numero]
      )
    ).rowCount !== 0
  );
}

async function updatePaginaByNumero(
  id_aventura,
  numero,
  titulo = null,
  contenido = null,
  imagen = null
) {
  try {
    if (!id_aventura || isNaN(parseInt(id_aventura))) {
      throw new Error("id_aventura debe ser un número válido");
    }
    id_aventura = parseInt(id_aventura);

    if (!numero || isNaN(parseInt(numero))) {
      throw new Error("numero de página debe ser un número válido");
    }
    numero = parseInt(numero);

    if (!(await validatePaginaByNumero(id_aventura, numero))) {
      throw new Error(
        `Página no encontrada (Aventura: ${id_aventura}, Número: ${numero})`
      );
    }

    const updates = [];
    const params = [id_aventura, numero];
    let paramIndex = 3;

    if (titulo !== null) {
      if (typeof titulo !== "string" || titulo.trim() === "") {
        throw new Error("Título inválido: debe ser string no vacío");
      }
      updates.push(`titulo = $${paramIndex}`);
      params.push(titulo.trim());
      paramIndex++;
    }

    if (contenido !== null) {
      if (typeof contenido !== "string" || contenido.trim() === "") {
        throw new Error("Contenido inválido: debe ser string no vacío");
      }
      updates.push(`contenido = $${paramIndex}`);
      params.push(contenido.trim());
      paramIndex++;
    }

    if (imagen !== null) {
      if (typeof imagen !== "string") {
        throw new Error("Imagen inválida: debe ser string o null");
      }
      updates.push(`imagen = $${paramIndex}`);
      params.push(imagen);
      paramIndex++;
    }

    if (updates.length > 0) {
      await conn.query(
        `UPDATE pagina SET ${updates.join(", ")} 
         WHERE id_aventura = $1 AND numero = $2`,
        params
      );
    }

    const res = await conn.query(
      "SELECT * FROM pagina WHERE id_aventura = $1 AND numero = $2",
      [id_aventura, numero]
    );

    const row = res.rows[0];
    return new Pagina(
      row.id,
      row.id_aventura,
      row.numero,
      row.titulo,
      row.contenido,
      row.imagen
    );
  } catch (error) {
    console.error(
      `Error en updatePaginaByNumero [Aventura:${id_aventura}, Número:${numero}]:`,
      error
    );
    throw error;
  }
}

//
// Delete
//

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

    if (res.rowCount === 0) throw new Error("Página no encontrada");
  } catch (error) {
    console.error("Error en deletePaginaByNumero:", error);
    throw error;
  }
}

export default {
  createPagina,
  getPaginaById,
  getPaginaByNumero,
  getAllPaginasFinalesByUsuarioId,
  updatePaginaById,
  updatePaginaByNumero,
  deletePaginaById,
  deletePaginaByNumero,
};
