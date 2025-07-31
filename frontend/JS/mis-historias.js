import { obtenerLibros, portada_defecto } from "./api-libros.js";

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
    const usuarioActualStr = localStorage.getItem("usuario");
    const usuarioActual = JSON.parse(usuarioActualStr);
    if (!usuarioActual || !usuarioActual.id) throw new Error("Usuario inválido.");

    console.log("Usuario actual:", usuarioActual);

    const { aventuras, usuarios } = await obtenerLibros();

    console.log("Aventuras:", aventuras);
    console.log("Usuarios:", usuarios);

    const misAventuras = aventuras.filter(av => av.autor_id === usuarioActual.id);

    console.log("Mis aventuras:", misAventuras);

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
    sinHistorias.style.display = "none";
    
    historias.forEach(h => {
      const usuario = usuarios.find(u => u.id === h.autor_id);
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
          <a href="./editar.html?id=${h.id}" class="btn btn-verde-blanco btn-icon cb-verde">
            <span class="material-symbols-outlined">edit</span>Editar
          </a>
         <button class="btn btn-icon btn-borrar cb-verde" data-id="${h.id}">
          <span class="material-symbols-outlined">delete</span>Borrar
        </button>
        </div>
      `;

      container.appendChild(card);
    });
    document.querySelectorAll(".btn-borrar").forEach(btn => {
     btn.addEventListener("click", async function (e) {
  e.preventDefault();

  // Guardar referencia antes de hacer nada que modifique el DOM
  const boton = this; // <-- con function() "this" apunta al botón
  const idAventura = boton.dataset.id;

  if (!idAventura) return;

  const confirmar = confirm("¿Seguro que quieres borrar esta historia?");
  if (!confirmar) return;

  try {
    const usuarioActual = JSON.parse(localStorage.getItem("usuario"));

    const resp = await fetch(`http://localhost:3000/v1/aventura/${idAventura}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth: { id: usuarioActual.id, contrasenia: usuarioActual.contrasenia }
      })
    });

    if (!resp.ok) throw new Error("Error al eliminar en el servidor");

    // Quitar la tarjeta del DOM
    boton.closest(".historia").remove();

    // Si ya no quedan historias, mostrar mensaje
    if (container.querySelectorAll(".historia").length === 0) {
      sinHistorias.style.display = "block";
    }

    alert("Historia eliminada exitosamente");
  } catch (error) {
    console.error(error);
    alert("Ocurrió un error al borrar la historia.");
  }
});
    });
  }
});
