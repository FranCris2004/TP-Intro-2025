import express, { json } from "express";
import dotenv from "dotenv";
import usuarioRouter from "./routes/usuario.js";
import usuariosRouter from "./routes/usuarios.js";
import aventuraRouter from "./routes/aventura.js";
import aventurasRouter from "./routes/aventuras.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use([
  json(),
  (req, res, next) => {
    res.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.set("Surrogate-Control", "no-store");
    next();
  },
]);

// Routers
app.use("/v1/usuario", usuarioRouter);
app.use("/v1/usuarios", usuariosRouter);
app.use("/v1/aventura", aventuraRouter);
app.use("/v1/aventuras", aventurasRouter);

app.listen(port, () => {
  console.log(`API escuchando en el puerto ${port}`);
});
