import { Router } from "express";
import aventura_service from "../services/aventura_service.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    console.log("Method: GET\nURI: /v1/aventuras");

    const aventuras = await aventura_service.getAllAventuras();
<<<<<<< HEAD
    console.log(`Response: ${JSON.stringify(res_body)}`);

    res.status(200).send(aventuras);
=======
    console.log("Response:", aventuras);
    
    res.json(aventuras); 
>>>>>>> 27fd7e1 (ya funciona crear aventura y agregar capitulos (aun falta terminar y pulir algunas cosas))
  } catch (error) {
    console.error("Error al obtener aventuras:", error);
    res.status(500).json({ error: "Error al obtener todas las aventuras" });
  }
});

export default router;
