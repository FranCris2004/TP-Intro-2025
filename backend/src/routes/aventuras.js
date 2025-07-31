import { Router } from "express";
import aventura_service from "../services/aventura_service.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    console.log("Method: GET\nURI: /v1/aventuras");

    const aventuras = await aventura_service.getAllAventuras();
<<<<<<< HEAD
    console.log("Response:", aventuras);
    
    res.json(aventuras); 
=======

    res.status(200).json(aventuras);
>>>>>>> 52bb0c45f45539c90915c774885a3755ab1980b6
  } catch (error) {
    console.error("Error al obtener aventuras:", error);
    res.status(500).json({ error: "Error al obtener todas las aventuras" });
  }
});

export default router;
