import { Router } from "express";
import aventura_service from "../services/aventura_service.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    console.log("Method: GET\nURI: /v1/aventuras");

    const aventuras = await aventura_service.getAllAventuras();
    
    res.status(200).json(aventuras);
  } catch (error) {
    console.error("Error al obtener aventuras:", error);
    res.status(500).json({ error: "Error al obtener todas las aventuras" });
  }
});

export default router;
