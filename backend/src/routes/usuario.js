import { Router } from "express";
import usuario_service from "../services/usuario_service.js";
import pagina_service from "../services/pagina_service.js";

const router = Router();

// POST /v1/usuario
router.post("/", async (req, res) => {
  try {
    console.log("Method: POST\nURI: /v1/usuario");

    const { nombre, contrasenia, email, fecha_de_nacimiento } = req.body;

    console.log(
      `
      nombre: ${nombre},
      contrasenia: ${contrasenia},
      email: ${email},
      fecha_de_nacimiento: ${fecha_de_nacimiento}
      `
    );

    const nuevo_usuario = await usuario_service.createUsuario(
      nombre,
      contrasenia,
      email,
      fecha_de_nacimiento
    );

    console.log(`Response: ${nuevo_usuario}`);

    res.status(200).send(nuevo_usuario);
  } catch (error) {
    res.status(500).send("Error al crear el usuario");
  }
});

// GET /v1/usuario/:id_usuario
router.get("/:id_usuario", async (req, res) => {
  try {
    console.log("Method: GET\nURI: /v1/usuario/:id_usuario");

    const { id } = res.params;
    console.log(`id_usuario: ${id}`);

    const usuario = await usuario_service.getUsuarioById(id);
    console.log(`Response: ${usuario}`);

    res.status(200).send(usuario);
  } catch (error) {
    res.status(500).send("Error al obtener el usuario");
  }
});

// GET /v1/usuario/:id_usuario/finales
router.get("/:id_usuario/finales", async (req, res) => {
  try {
    console.log("Method: GET\nURI: /v1/usuario/:id_usuario/finales");

    const id_usuario = req.params.id_usuario;
    console.log(`id_usuario: ${id}`);

    const finales = await pagina_service.getAllPaginasFinalesByUsuarioId(
      id_usuario
    );
    console.log(`Response: ${finales}`);

    res.status(200).send(finales);
  } catch (error) {
    res.status(500).send("Error al obtener los finales del usuario");
  }
});

// PUT /v1/usuario/:id_usuario
router.put("/:id_usuario", async (req, res) => {
  console.log(`Actualizar usuario ${req.params.id_usuario}`);
  res.status(501).send("Error al actualizar el usuario");
});

// DELETE /v1/usuario/:id_usuario
router.delete("/:id_usuario", async (req, res) => {
  try {
    console.log(`Eliminar usuario ${req.params.id_usuario}`);
    res.status(501).send("Error al eliminar el usuario");

    const id_usuario = req.params.id_usuario;
    console.log(`id_usuario: ${id_usuario}`);

    if (usuario_service.deleteUsuarioById(id_usuario)) {
      res.status(200).send("OK");
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    res.status(500).send("Error al eliminar el usuario");
  }
});

export default router;
