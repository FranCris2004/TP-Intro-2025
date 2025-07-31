const API_BASE = "http://localhost:3000/v1";

async function obtenerAventuraPorId(id_aventura) {
  const res = fetch(`${API_BASE}/v1/aventura/${aventura}`, { method: "GET" });
}

async function obtenerPaginaPorNumero(id_aventura, numero_pagina) {
  const res = fetch(`${API_BASE}/v1/aventura/${aventura}/${numero_pagina}`, {
    method: "GET",
  });
}

async function obtenerOpcionesPorNumeroPagina(id_aventura, numero_pagina) {
  const res = fetch(
    `${API_BASE}/v1/aventura/${aventura}/${numero_pagina}/opciones`,
    { method: "GET" }
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idAventura = parseInt(urlParams.get("id"));
  const numeroPagina = parseInt(urlParams.get("pagina")) || 1;

  if (!idAventura) {
    document.querySelector(".contenido").innerHTML =
      "<p class='font-Lato'>Aventura no especificada. Volvé al inicio.</p>";
    return;
  }

  const aventura = obtenerAventuraPorId(idAventura);

  // Filtrar las páginas de esta aventura
  const paginasDeAventura = obtenerPaginaPorNumero(idAventura, numeroPagina);

  // Página actual por posición (n-ésima página de la aventura)
  const pagina = obtenerPaginaPorNumero(idAventura, numeroPagina); // porque el índice arranca en 0

  if (!pagina) {
    document.querySelector(".contenido").innerHTML =
      "<p class='font-Lato'>Página no encontrada. Volvé al inicio.</p>";
    return;
  }

  document.getElementById("titulo-capitulo").textContent = pagina.titulo;
  document.getElementById("subtitulo-capitulo").textContent = pagina.contenido.slice(0, 80) + "...";
  document.getElementById("texto-capitulo").textContent = pagina.contenido;

  const contenedorImagen = document.querySelector(".contenedor-imagen");
  const imagenIlustracion = document.getElementById("imagen-ilustracion");

  if (pagina.imagen && pagina.imagen.trim() !== "") {
    imagenIlustracion.src = pagina.imagen;
    contenedorImagen.style.display = "flex";
  } else {
    contenedorImagen.style.display = "none";
  }

  if (aventura) {
    document.getElementById("barra-titulo").textContent = aventura.titulo;
    document.getElementById("barra-portada").src =
      aventura.portada || "./imagenes/portada_default.jpg";
    const autor = usuariosFijos.find((u) => u.id === aventura.id_usuario);
    document.getElementById("barra-autor").textContent = autor
      ? `${autor.nombre} ${autor.apellido}`
      : "Autor desconocido";
    document.title = `${pagina.titulo} - ${aventura.titulo}`;
  }

  const opciones = obtenerOpcionesPorNumeroPagina(idAventura, numeroPagina);

  const contenedorOpciones = document.querySelector(".opciones");
  contenedorOpciones.innerHTML = ""; //limpiamos

  if (opciones.length === 0) {
    contenedorOpciones.style.display = "none"; // Si no hay opciones, ocultar el contenedor completo para que no se vea nada
  } else {
    // Mostrar el contenedor con título y botones
    contenedorOpciones.style.display = "flex";
    const tituloOpciones = document.createElement("h3");
    tituloOpciones.className = "font-Lato";
    tituloOpciones.textContent = "Elegí tu camino . . .";
    contenedorOpciones.appendChild(tituloOpciones);

    opciones.forEach((op) => {
      const a = document.createElement("a");
      a.className = "btn sb-negra btn-opc font-Lato";
      a.textContent = op.descripcion;
      // Al avanzar, siempre se mantiene la aventura
      a.href = `leer.html?id=${idAventura}&pagina=${
        paginasDeAventura.findIndex((p) => p.id === op.id_pagina_destino) + 1
      }`;
      contenedorOpciones.appendChild(a);
    });
  }

  const btnAnterior = document.getElementById("btn-anterior");
  const btnSiguiente = document.getElementById("btn-siguiente");

  btnAnterior.onclick = () => {
    if (numeroPagina > 1) {
      window.location.href = `leer.html?id=${idAventura}&pagina=${
        numeroPagina - 1
      }`;
    }
  };

  btnSiguiente.onclick = () => {
    if (numeroPagina < paginasDeAventura.length) {
      window.location.href = `leer.html?id=${idAventura}&pagina=${
        numeroPagina + 1
      }`;
    }
  };
});
