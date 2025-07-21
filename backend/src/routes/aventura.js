const router = express.Router();
const aventura_service = require("../services/aventura_service");

// POST /v1/aventura
router.post("/", (req, res) => {
  try {
    const aventura_id = aventura_service.createAventura(
      req.params.titulo,
      req.params.descripcion,
      req.params.autor_id,
      req.params.genero
    );

    console.log("/v1/aventura");
    console.log("response: " + aventura_id);

    console.log(
      `aventura creada: ${JSON.stringify(
        aventura_service.getAventuraById(aventura_id)
      )}`
    );

    res.send(aventura_id);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

// POST /v1/aventura/:id_aventura/pagina
router.post("/:id_aventura/pagina", (req, res) => {
  res.send(`Crear página en aventura ${req.params.id_aventura}`);
});

// POST /v1/aventura/:id_aventura/:id_pagina/opcion
router.post("/:id_aventura/:id_pagina/opcion", (req, res) => {
  res.send(
    `Crear opción en página ${req.params.id_pagina} de aventura ${req.params.id_aventura}`
  );
});

// GET /v1/aventura/:id_aventura
router.get("/:id_aventura", (req, res) => {
  res.send(`Obtener aventura ${req.params.id_aventura}`);
});

// GET /v1/aventura/:id_aventura/paginas
router.get("/:id_aventura/paginas", (req, res) => {
  res.send(`Obtener páginas de aventura ${req.params.id_aventura}`);
});

// GET /v1/aventura/:id_aventura/:id_pagina
router.get("/:id_aventura/:id_pagina", (req, res) => {
  res.send(
    `Obtener página ${req.params.id_pagina} de aventura ${req.params.id_aventura}`
  );
});

// GET /v1/aventura/:id_aventura/:id_pagina/opciones
router.get("/:id_aventura/:id_pagina/opciones", (req, res) => {
  res.send(
    `Obtener opciones de la página ${req.params.id_pagina} en aventura ${req.params.id_aventura}`
  );
});

// PUT /v1/aventura/:id_aventura
router.put("/:id_aventura", (req, res) => {
  res.send(`Actualizar aventura ${req.params.id_aventura}`);
});

// PUT /v1/aventura/:id_aventura/pagina
router.put("/:id_aventura/pagina", (req, res) => {
  res.send(`Actualizar página en aventura ${req.params.id_aventura}`);
});

// PUT /v1/aventura/:id_aventura/:id_pagina/opcion
router.put("/:id_aventura/:id_pagina/opcion", (req, res) => {
  res.send(
    `Actualizar opción en página ${req.params.id_pagina} de aventura ${req.params.id_aventura}`
  );
});

// DELETE /v1/aventura/:id_aventura
router.delete("/:id_aventura", (req, res) => {
  res.send(`Eliminar aventura ${req.params.id_aventura}`);
});

// DELETE /v1/aventura/:id_aventura/:id_pagina
router.delete("/:id_aventura/:id_pagina", (req, res) => {
  res.send(
    `Eliminar página ${req.params.id_pagina} de aventura ${req.params.id_aventura}`
  );
});

// DELETE /v1/aventura/:id_aventura/:id_pagina/:id_opcion
router.delete("/:id_aventura/:id_pagina/:id_opcion", (req, res) => {
  res.send(
    `Eliminar opción ${req.params.id_opcion} de página ${req.params.id_pagina} en aventura ${req.params.id_aventura}`
  );
});

module.exports = router;
