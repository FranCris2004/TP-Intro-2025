// JS/api-libros.js
const API_BASE = "http://localhost:3002";
const portada_defecto = "../imagenes/portada_default.jpg";

async function obtenerLibros() {
  try {
    const [libros, autores] = await Promise.all([ // promise.all ejecuta promesas en paralelo y no una detras de otra
      fetch(`${API_BASE}/aventuras`),
      fetch(`${API_BASE}/usuarios`)
    ]);
    
    const aventuras = await libros.json();
    const usuarios = await autores.json();

    console.log("Aventuras:", aventuras);
    console.log("Usuarios:", usuarios);

    return { aventuras, usuarios };
  } catch (error) {
    console.error("Error al obtener libros:", error.message);
    const errorDiv = document.getElementById("error");
    if (errorDiv) errorDiv.style.display = "block";
    throw error; // Re-lanzamos el error para manejarlo donde se llame
  } finally {
    const cargandoDiv = document.getElementById("cargando");
    if (cargandoDiv) cargandoDiv.style.display = "none";
  }
}

async function crearLibro(libroData) {
  try {
    const response = await fetch(`${API_BASE}/aventuras`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(libroData),
    });

    if (!response.ok) throw new Error("Error al crear el libro");

    const nuevoLibro = await response.json();
    console.log("Libro creado:", nuevoLibro);
    return nuevoLibro;
  } catch (error) {
    console.error("Error al crear un nuevo libro:", error.message);
    throw error;
  }
}

async function actualizarLibro(id, libroData) {
  try {
    const response = await fetch(`${API_BASE}/aventuras/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(libroData),
    });

    if (!response.ok) throw new Error("Error al actualizar el libro");

    const libroActualizado = await response.json();
    console.log("Libro actualizado:", libroActualizado);
    return libroActualizado;
  } catch (error) {
    console.error("Error al actualizar el libro:", error.message);
    throw error;
  }
}

async function eliminarLibro(id) {
  try {
    const response = await fetch(`${API_BASE}/aventuras/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Error al eliminar el libro");

    console.log(`Libro con ID ${id} eliminado correctamente`);
    return true;
  } catch (error) {
    console.error("Error al tratar de eliminar el libro:", error.message);
    throw error;
  }
}

function mostrarLibros(aventuras, usuarios) {
  const container = document.getElementById("container-libros");
  container.innerHTML = "";

  aventuras.forEach((aventura) => {
    const usuario = usuarios.find(u => u.id == aventura.id_usuario);
    const nombreAutor = usuario ? usuario.nombre : "Autor desconocido";
    const portada = aventura.portada || portada_defecto;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img class="card-imagen" src="${portada}" alt="Portada de ${aventura.titulo}" />
      <h3 class="card-titulo">${aventura.titulo}</h3>
      <h4 class="card-autor">${nombreAutor}</h4>
      <div class="card-actions">
        <a class="btn-libros" href="./leer.html">
          <span class="btn-icon">▶</span>
          <span class="btn-text">Empezar a leer</span>
        </a>
      </div>
    `;

    container.appendChild(card);
  });
}

export { obtenerLibros, mostrarLibros, actualizarLibro, eliminarLibro, crearLibro, portada_defecto };