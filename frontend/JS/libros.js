import { mostrarLibros } from "./api-libros.js";

let aventurasGlobal = [];
let usuariosGlobal = [];

async function cargarDatos() {
  const cargandoEl = document.getElementById("cargando");
  const errorEl = document.getElementById("error");

  cargandoEl.style.display = "block";
  errorEl.style.display = "none";

  try {
    // Obtener aventuras
    const resAventuras = await fetch("http://localhost:3000/v1/aventuras");
    aventurasGlobal = await resAventuras.json();

    // Obtener usuarios
    const resUsuarios = await fetch("http://localhost:3000/v1/usuarios");
    usuariosGlobal = await resUsuarios.json();

    // Mostrar libros
    mostrarLibros(aventurasGlobal, usuariosGlobal);

  } catch (error) {
    console.error("Error cargando datos:", error);
    errorEl.style.display = "block";
  } finally {
    // Ocultar cargando siempre, haya o no libros
    cargandoEl.style.display = "none";
  }
}

function agregarOrdenamiento() {
  const selector = document.getElementById("ordenar");

  selector.addEventListener("change", () => {
    const criterio = selector.value;
    let aventurasOrdenadas = [...aventurasGlobal];

    switch (criterio) {
      case "titulo":
        aventurasOrdenadas.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case "titulo-desc":
        aventurasOrdenadas.sort((a, b) => b.titulo.localeCompare(a.titulo));
        break;
      case "reciente":
        aventurasOrdenadas.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
        break;
      case "antiguo":
        aventurasOrdenadas.sort((a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion));
        break;
    }

    mostrarLibros(aventurasOrdenadas, usuariosGlobal);
  });
}

// Iniciar
cargarDatos();
agregarOrdenamiento();
