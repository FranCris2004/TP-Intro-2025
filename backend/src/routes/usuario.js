import { Router } from "express";
import usuario_service from "../services/usuario_service.js";
import pagina_service from "../services/pagina_service.js";

const router = Router();

// POST /v1/usuario//login
router.post("/login", async (req, res) => {
  try {
    console.log("Method: POST\nURI: /v1/usuario/login");

    const { nombre, contrasenia } = req.body;
    console.log(`nombre: ${nombre}`);

    const usuario = await usuario_service.getUsuarioByNombre(nombre);
    console.log(`usuario: ${usuario}`);

    if (usuario.contrasenia !== contrasenia) {
      res.status(401).json("Nombre o contrasenia incorrectos");
      return;
    }

    res.status(200).send(usuario);
  } catch (error) {
    res.status(500).json("Error al logear");
  }
});

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
    res.status(500).json("Error al crear el usuario");
  }
});

// GET /v1/usuario/:id_usuario
router.get("/:id_usuario", async (req, res) => {
  try {
    console.log("Method: GET\nURI: /v1/usuario/:id_usuario");

    const id_usuario = req.params.id_usuario;
    console.log(`id_usuario: ${id_usuario}`);

    const usuario = await usuario_service.getUsuarioById(id_usuario);
    console.log(`Response: ${usuario}`);

    res.status(200).send(usuario);
  } catch (error) {
    res.status(500).json("Error al obtener el usuario");
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
    res.status(500).json("Error al obtener los finales del usuario");
  }
});

// PUT /v1/usuario/:id_usuario
router.put("/:id_usuario", async (req, res) => {
  try {
    console.log("Method: PUT\nURI: /v1/usuario/:id_usuario");

    const id_usuario = req.params.id_usuario;
    console.log(`id_usuario: ${id_usuario}`);

    if (id_usuario != req.body.auth.id) {
      res.status(400).send("La id de usuario en la URI y en auth no coinciden");
      return;
    }

    const autorizado = await usuario_service.validateContrasenia(
      req.body.auth.id,
      req.body.auth.contrasenia
    );
    console.log(`Autorizado: ${autorizado}`);

    if (!autorizado) {
      res.status(401).json("Unauthorized");
      return;
    }

    const { nueva_contrasenia, nombre, email, fecha_de_nacimiento } = req.body;

    const usuario_actualizado = await usuario_service.updateUsuarioById(
      id_usuario,
      nombre || null,
      nueva_contrasenia || null,
      email || null,
      fecha_de_nacimiento || null
    );
    console.log(`Response: ${usuario_actualizado}`);

    res.status(200).send(usuario_actualizado);
  } catch (error) {
    res.status(500).json("Error al actualizar el usuario");
  }
});

// DELETE /v1/usuario/:id_usuario
router.delete("/:id_usuario", async (req, res) => {
  try {
    console.log(`Eliminar usuario ${req.params.id_usuario}`);
    
    const id_usuario = req.params.id_usuario;
    console.log(`id_usuario: ${id_usuario}`);

    if (id_usuario != req.body.auth.id) {
      res.status(400).send("La id de usuario en la URI y en auth no coinciden");
      return;
    }

    const autorizado = await usuario_service.validateContrasenia(
      req.body.auth.id,
      req.body.auth.contrasenia
    );
    console.log(`Autorizado: ${autorizado}`);

    if (!autorizado) {
      res.status(401).json("Unauthorized");
      return;
    }

    await usuario_service.deleteUsuarioById(id_usuario);

    res.status(200).json("OK");
  } catch (error) {
    res.status(500).json("Error al eliminar el usuario");
  }
});

export default router;
