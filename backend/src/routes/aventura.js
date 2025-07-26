import { Router } from "express";
import aventura_service from "../services/aventura_service.js";
import pagina_service from "../services/pagina_service.js";
import opcion_service from "../services/opcion_service.js";

const router = Router();

// POST /v1/aventura
router.post("/", async (req, res) => {
  try {
    console.log("Method: POST\nURI: /v1/aventura");

    const { titulo, descripcion, autor_id, genero } = req.body;
    console.log(
      `
      titulo: ${titulo},
      descripcion: ${descripcion},
      autor_id: ${autor_id},
      genero: ${genero}
      `
    );

    const nueva_aventura = aventura_service.createAventura(
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

    const { id_aventura, titulo, contenido, imagen, imagen_de_fondo } =
      req.body;
    console.log(
      `
        id_aventura: ${id_aventura},
        titulo: ${titulo},
        contenido: ${contenido},
        imagen: ${imagen},
        imagen_de_fondo: ${imagen_de_fondo}
        `
    );

    const nueva_pagina = pagina_service.createPagina(
      titulo,
      id_aventura,
      contenido,
      imagen,
      imagen_de_fondo
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
  res.send(`Actualizar aventura ${req.params.id_aventura}`);
});

// PUT /v1/aventura/:id_aventura/pagina
router.put("/:id_aventura/pagina", async (req, res) => {
  res.send(`Actualizar página en aventura ${req.params.id_aventura}`);
});

// PUT /v1/aventura/:id_aventura/:numero_pagina/opcion
router.put("/:id_aventura/:numero_pagina/opcion", async (req, res) => {
  res.send(
    `Actualizar opción en página ${req.params.numero_pagina} de aventura ${req.params.id_aventura}`
  );
});

// DELETE /v1/aventura/:id_aventura
router.delete("/:id_aventura", async (req, res) => {
  try {
    console.log(`Method: DELETE\nURI: /v1/aventura/:id_aventura`);

    const id_aventura = req.params.id_aventura;
    console.log(`id_aventura: ${id_aventura}`);

    if (aventura_service.deleteAventuraById(id_aventura)) {
      res.status(200).send("OK");
    } else {
      res.status(401).send("Unauthorized");
    }
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

    const id_aventura = req.params.id_aventura;
    console.log(`id_aventura: ${id_aventura}`);

    const numero_pagina = req.params.numero_pagina;
    console.log(`numero_pagina: ${numero_pagina}`);

    if (pagina_service.deletePaginaByNumero(id_aventura, numero_pagina)) {
      res.status(200).send("OK");
    } else {
      res.status(401).send("Unauthorized");
    }
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

    const id_aventura = req.params.id_aventura;
    console.log(`id_aventura: ${id_aventura}`);

    const numero_pagina = req.params.numero_pagina;
    console.log(`numero_pagina: ${numero_pagina}`);

    const id_opcion = req.params.id_opcion;
    console.log(`id_opcion: ${id_opcion}`);

    // id_aventura y numero_pagina no se usan realmente
    // estan en la URI por un error de diseño
    // se pueden rellenar con cualquier numero
    // e igual funcionaria para la misma opcion

    if (opcion_service.deleteOpcionById(id_opcion)) {
      res.status(200).send("OK");
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    res.status(500).send("Error al eliminar la opcion");
  }
});

export default router;
