import { Router } from "express";
import aventura_service from "../services/aventura_service.js";
import pagina_service from "../services/pagina_service.js";
import opcion_service from "../services/opcion_service.js";

const router = Router();

// POST /v1/aventura
router.post("/", async (req, res) => {
  try {
    console.log("Method: POST\nURI: /v1/aventura");

    const autorizado = await usuario_service.validateContrasenia(
      req.body.auth.id,
      req.body.auth.contrasenia
    );
    console.log(`Autorizado: ${autorizado}`);

    if (!autorizado) {
      res.status(401).send("Unauthorized");
      return;
    }

    const { titulo, descripcion, autor_id, genero, portada } = req.body;
    console.log(
      `
      titulo: ${titulo},
      descripcion: ${descripcion},
      autor_id: ${autor_id},
      genero: ${genero},
      portada: ${portada}
      `
    );

    const nueva_aventura = await aventura_service.createAventura(
      titulo,
      descripcion,
      autor_id,
      genero
    );
    console.log(`Response: ${nueva_aventura}`);

    res.send(nueva_aventura);
  } catch (error) {
    res.status(500).send("Error al agregar una aventura");
  }
});

// POST /v1/aventura/:id_aventura/pagina
router.post("/:id_aventura/pagina", async (req, res) => {
  try {
    console.log("Method: POST\nURI: /v1/aventura/:id_aventura/pagina");

    const autorizado = await usuario_service.validateContrasenia(
      req.body.auth.id,
      req.body.auth.contrasenia
    );
    console.log(`Autorizado: ${autorizado}`);

    if (!autorizado) {
      res.status(401).send("Unauthorized");
      return;
    }

    const { id_aventura, numero, titulo, contenido, imagen } = req.body;
    console.log(
      `
        id_aventura: ${id_aventura},
        numero: ${numero},
        titulo: ${titulo},
        contenido: ${contenido},
        imagen: ${imagen}
        `
    );

    const nueva_pagina = pagina_service.createPagina(
      id_aventura,
      numero,
      titulo,
      contenido,
      imagen
    );
    console.log(`Response: ${nueva_pagina}`);

    res.send(nueva_pagina);
  } catch (error) {
    res.status(500).send("Error al crear la pagina");
  }
});

// POST /v1/aventura/:id_aventura/:numero_pagina/opcion
router.post("/:id_aventura/:numero_pagina/opcion", async (req, res) => {
  try {
    console.log(
      "Method: POST\nURI: /v1/aventura/:id_aventura/:numero_pagina/opcion"
    );

    const autorizado = await usuario_service.validateContrasenia(
      req.body.auth.id,
      req.body.auth.contrasenia
    );
    console.log(`Autorizado: ${autorizado}`);

    if (!autorizado) {
      res.status(401).send("Unauthorized");
      return;
    }

    const id_aventura = req.params.id_aventura;
    console.log(`id_aventura: ${id_aventura}`);

    const numero_pagina = req.params.numero_pagina;
    console.log(`numero_pagina: ${numero_pagina}`);

    const { descripcion, numero_pagina_destino } = req.body;
    console.log(
      `
      id_aventura: ${id_aventura},
      descripcion: ${descripcion},
      numero_pagina_origen: ${numero_pagina},
      numero_pagina_destino: ${numero_pagina_destino}
      `
    );

    const nueva_opcion = opcion_service.createOpcion(
      id_aventura,
      descripcion,
      numero_pagina,
      numero_pagina_destino
    );
    console.log(`Response: ${nueva_opcion}`);

    res.send(nueva_opcion);
  } catch (error) {
    res.status(500).send("Error al crear la opcion");
  }
});

// GET /v1/aventura/:id_aventura
router.get("/:id_aventura", async (req, res) => {
  try {
    console.log(`Method: GET\nURI: /v1/aventura/:id_aventura`);

    const id_aventura = req.params.id_aventura;
    console.log(`id_aventura: ${id_aventura}`);

    const aventura = aventura_service.getAventuraById(id_aventura);
    console.log(`Response: ${aventura}`);

    res.send(aventura);
  } catch (error) {
    res.status(500).send("Error al obtener la aventura");
  }
});

// GET /v1/aventura/:id_aventura/:numero_pagina
router.get("/:id_aventura/:numero_pagina", async (req, res) => {
  try {
    console.log(`Method: GET\nURI: /v1/aventura/:id_aventura/:numero_pagina`);

    const id_aventura = req.params.id_aventura;
    console.log(`id_aventura: ${id_aventura}`);

    const numero_pagina = req.params.numero_pagina;
    console.log(`numero_pagina: ${numero_pagina}`);

    const pagina = pagina_service.getPaginaByNumero(id_aventura, numero_pagina);
    console.log(`Response: ${pagina}`);

    res.send(pagina);
  } catch (error) {
    res.status(500).send("Error al obtener la pagina");
  }
});

// GET /v1/aventura/:id_aventura/:numero_pagina/opciones
router.get("/:id_aventura/:numero_pagina/opciones", async (req, res) => {
  try {
    console.log(
      `Method: GET\nURI: /v1/aventura/:id_aventura/:numero_pagina/opciones`
    );

    const id_aventura = req.params.id_aventura;
    console.log(`id_aventura: ${id_aventura}`);

    const numero_pagina = req.params.numero_pagina;
    console.log(`numero_pagina: ${numero_pagina}`);

    const opciones = opcion_service.getAllOpcionesByNumeroPagina(
      id_aventura,
      numero_pagina
    );
    console.log(`Response: ${opciones}`);

    res.send(opciones);
  } catch (error) {
    res.status(500).send("Error al obtener las opciones de la pagina");
  }
});

// PUT /v1/aventura/:id_aventura
router.put("/:id_aventura", async (req, res) => {
  try {
    console.log(`Method: PUT\nURI: /v1/aventura/:id_aventura`);

    const autorizado = await usuario_service.validateContrasenia(
      req.body.auth.id,
      req.body.auth.contrasenia
    );
    console.log(`Autorizado: ${autorizado}`);

    if (!autorizado) {
      res.status(401).send("Unauthorized");
      return;
    }

    const id_aventura = req.params.id_aventura;
    console.log(`id_aventura: ${id_aventura}`);

    const { titulo, descripcion, autor_id, genero, portada } = req.body;
    console.log(
      `
      titulo: ${titulo},
      descripcion: ${descripcion},
      autor_id: ${autor_id},
      genero: ${genero}
      `
    );

    const aventura_actualizada = await aventura_service.updateAventuraById(
      id_aventura,
      titulo,
      descripcion,
      autor_id,
      genero,
      portada
    );
    console.log(`Response: ${aventura_actualizada}`);

    res.status(200).send(aventura_actualizada);
  } catch (error) {
    res.status(500).send("Fallo al actualizar la aventura");
  }
});

// PUT /v1/aventura/:id_aventura/:numero_pagina
router.put("/:id_aventura/:numero_pagina", async (req, res) => {
  try {
    console.log("Method: POST\nURI: /v1/aventura/:id_aventura/pagina");

    const autorizado = await usuario_service.validateContrasenia(
      req.body.auth.id,
      req.body.auth.contrasenia
    );
    console.log(`Autorizado: ${autorizado}`);

    if (!autorizado) {
      res.status(401).send("Unauthorized");
      return;
    }

    const numero_pagina = req.params.numero_pagina;
    console.log(`numero_pagina: ${numero_pagina}`);

    const { id_aventura, titulo, contenido, imagen } = req.body;
    console.log(
      `
        id_aventura: ${id_aventura},
        titulo: ${titulo},
        contenido: ${contenido},
        imagen: ${imagen}
        `
    );

    const pagina_actualizada = pagina_service.updatePaginaByNumero(
      id_aventura,
      numero_pagina,
      titulo,
      contenido,
      imagen
    );
    console.log(`Response: ${pagina_actualizada}`);

    res.send(pagina_actualizada);
  } catch (error) {
    res.status(500).send("Error al crear la pagina");
  }
});

// PUT /v1/aventura/:id_aventura/:numero_pagina/:id_opcion
router.put("/:id_aventura/:numero_pagina/:id_opcion", async (req, res) => {
  try {
    console.log(
      "Method: POST\nURI: /v1/aventura/:id_aventura/:numero_pagina/opcion"
    );

    const autorizado = await usuario_service.validateContrasenia(
      req.body.auth.id,
      req.body.auth.contrasenia
    );
    console.log(`Autorizado: ${autorizado}`);

    if (!autorizado) {
      res.status(401).send("Unauthorized");
      return;
    }

    const id_aventura = req.params.id_aventura;
    console.log(`id_aventura: ${id_aventura}`);

    const numero_pagina = req.params.numero_pagina;
    console.log(`numero_pagina: ${numero_pagina}`);

    const { descripcion, numero_pagina_destino } = req.body;
    console.log(
      `
      descripcion: ${descripcion},
      numero_pagina_destino: ${numero_pagina_destino}
      `
    );

    const opcion_actualizada = opcion_service.updateOpcionByNumero(
      id_aventura,
      numero_pagina,
      descripcion,
      numero_pagina_destino
    );
    console.log(`Response: ${opcion_actualizada}`);

    res.send(opcion_actualizada);
  } catch (error) {
    res.status(500).send("Error al crear la opcion");
  }
});

// DELETE /v1/aventura/:id_aventura
router.delete("/:id_aventura", async (req, res) => {
  try {
    console.log(`Method: DELETE\nURI: /v1/aventura/:id_aventura`);

    const autorizado = await usuario_service.validateContrasenia(
      req.body.auth.id,
      req.body.auth.contrasenia
    );
    console.log(`Autorizado: ${autorizado}`);

    if (!autorizado) {
      res.status(401).send("Unauthorized");
      return;
    }

    const id_aventura = req.params.id_aventura;
    console.log(`id_aventura: ${id_aventura}`);

    await aventura_service.deleteAventuraById(id_aventura);
    res.status(200).send("OK");
  } catch (error) {
    res.status(500).send("Error al eliminar la aventura");
  }
});

// DELETE /v1/aventura/:id_aventura/:numero_pagina
router.delete("/:id_aventura/:numero_pagina", async (req, res) => {
  try {
    console.log(
      `Method: DELETE\nURI: /v1/aventura/:id_aventura/:numero_pagina`
    );

    const autorizado = await usuario_service.validateContrasenia(
      req.body.auth.id,
      req.body.auth.contrasenia
    );
    console.log(`Autorizado: ${autorizado}`);

    if (!autorizado) {
      res.status(401).send("Unauthorized");
      return;
    }

    const id_aventura = req.params.id_aventura;
    console.log(`id_aventura: ${id_aventura}`);

    const numero_pagina = req.params.numero_pagina;
    console.log(`numero_pagina: ${numero_pagina}`);

    await pagina_service.deletePaginaByNumero(id_aventura, numero_pagina);
    res.status(200).send("OK");
  } catch (error) {
    res.status(500).send("Error al eliminar la pagina");
  }
});

// DELETE /v1/aventura/:id_aventura/:numero_pagina/:id_opcion
router.delete("/:id_aventura/:numero_pagina/:id_opcion", async (req, res) => {
  try {
    console.log(
      `Method: DELETE\nURI: /v1/aventura/:id_aventura/:numero_pagina/:id_opcion`
    );

    const autorizado = await usuario_service.validateContrasenia(
      req.body.auth.id,
      req.body.auth.contrasenia
    );
    console.log(`Autorizado: ${autorizado}`);

    if (!autorizado) {
      res.status(401).send("Unauthorized");
      return;
    }

    // id_aventura y numero_pagina no se usan realmente
    // estan en la URI por un error de diseño
    // se pueden rellenar con cualquier numero
    // e igual funcionaria para la misma opcion

    // const id_aventura = req.params.id_aventura;
    // console.log(`id_aventura: ${id_aventura}`);

    // const numero_pagina = req.params.numero_pagina;
    // console.log(`numero_pagina: ${numero_pagina}`);

    const id_opcion = req.params.id_opcion;
    console.log(`id_opcion: ${id_opcion}`);

    await opcion_service.deleteOpcionById(id_opcion);
    res.status(200).send("OK");
  } catch (error) {
    res.status(500).send("Error al eliminar la opcion");
  }
});

export default router;
