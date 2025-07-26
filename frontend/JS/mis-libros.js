import { obtenerLibros, portada_defecto } from "./paraBorrar.js";

document.addEventListener("DOMContentLoaded", async () => {
  const cargando = document.getElementById("cargando");
  const error = document.getElementById("error");
  const sinHistorias = document.getElementById("sin-historias");
  const container = document.getElementById("historias-container");

  // Mostrar cargando al principio
  cargando.style.display = "block";
  error.style.display = "none";
  sinHistorias.style.display = "none";

  try {
    // Simular usuario logueado si no hay
    if (!localStorage.getItem("usuario")) {
      localStorage.setItem("usuario", JSON.stringify({ id: 1, nombre: "Ana García", usuario: "ana" }));
    }

    // Obtener usuario logueado (una vez que existe)
    const usuarioActualStr = localStorage.getItem("usuario");
    const usuarioActual = JSON.parse(usuarioActualStr);
    if (!usuarioActual || !usuarioActual.id) throw new Error("Usuario inválido.");

    console.log("Usuario actual:", usuarioActual);

    // Obtener aventuras y usuarios (desde la API o datos fijos)
    const { aventuras, usuarios } = await obtenerLibros();

    console.log("Aventuras:", aventuras);
    console.log("Usuarios:", usuarios);

    // Filtrar solo las aventuras del usuario actual
    const misAventuras = aventuras.filter(av => av.id_usuario === usuarioActual.id);

    console.log("Mis aventuras:", misAventuras);

    // Mostrar las historias
    mostrarHistorias(misAventuras, usuarios);
  } catch (err) {
    console.error("Error:", err.message);
    error.style.display = "block";
  } finally {
    cargando.style.display = "none";
  }

  function mostrarHistorias(historias, usuarios) {
    container.innerHTML = "";

    if (!historias || historias.length === 0) {
      sinHistorias.style.display = "block";
      return;
    }

    historias.forEach(h => {
      const usuario = usuarios.find(u => u.id === h.id_usuario);
      const nombreAutor = usuario ? usuario.nombre : "Autor desconocido";
      const portada = h.portada && h.portada.trim() !== "" ? h.portada : portada_defecto;

      const card = document.createElement("div");
      card.className = "historia sb-blanco";

      card.innerHTML = `
        <div class="contenido-izq">
          <div class="rel-portada">
            <img src="${portada}" alt="Portada de ${h.titulo}" class="card-imagen img-pequeña">
          </div>
          <div class="datos">
            <h4 class="card-titulo">${h.titulo}</h4>
            <p class="card-autor">${h.descripcion || "Sin descripción."}</p>
            <p class="card-autor"><small>Autor: ${nombreAutor}</small></p>
          </div>
        </div>
        <div class="botones">
          <a href="./editar.html?id=${h.id}" class="btn btn-verde-blanco btn-icon cb-verde"><span class="material-symbols-outlined">edit</span>Editar</a>
          <a href="./editar.html?id=${h.id}" class="btn btn-icon btn-borrar cb-verde"><span class="material-symbols-outlined">delete</span>Borrar</a>
        </div>
      `;

      container.appendChild(card);
    });
  }
});
