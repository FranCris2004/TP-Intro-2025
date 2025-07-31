import { Router } from "express";
import aventura_service from "../services/aventura_service.js";

const router = Router();

// GET /v1/aventuras
router.get("/", async (req, res) => {
  try {
    console.log("Method: GET\nURI: /v1/aventuras");

    const aventuras = await aventura_service.getAllAventuras();
    
    res.status(200).send(aventuras);
  } catch (error) {
    res.status(500).json("Error al obtener todas las aventuras");
  }
});

export default router;
