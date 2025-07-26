const API_BASE = "http://localhost:3000/v1";
const portada_defecto = "./imagenes/portada_default2.jpg";

async function obtenerLibros() {
  try {
    const [libros, autores] = await Promise.all([
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
    throw error;
  } finally {
    const cargandoDiv = document.getElementById("cargando");
    if (cargandoDiv) cargandoDiv.style.display = "none";
  }
}

// --- USUARIOS ---

async function obtenerUsuarios() {
  try {
    const response = await fetch(`${API_BASE}/usuarios`);
    if (!response.ok) throw new Error("Error al obtener usuarios");
    const usuarios = await response.json();
    console.log("Usuarios obtenidos: ", usuarios);
    return usuarios;
  } catch (error) {
    console.error("Error al obtener usuarios: ", error.message);
    throw error;
  }
}

async function crearUsuario(usuarioData) {
  try {
    const res = await fetch(`${API_BASE}/usuario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuarioData),
    });

    if (!res.ok) throw new Error("Error al crear usuario");

    const nuevoUsuario = await res.json();
    console.log("Usuario creado:", nuevoUsuario);
    return nuevoUsuario;
  } catch (error) {
    console.error("Error al intentar crear un usuario:", error.message);
    throw error;
  }
}

async function actualizarUsuario(id, usuarioData) {
  try {
    const res = await fetch(`${API_BASE}/usuario/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuarioData),
    });

    if (!res.ok) throw new Error("Error al actualizar usuario");

    const usuarioActualizado = await res.json();
    console.log("Usuario actualizado:", usuarioActualizado);
    return usuarioActualizado;
  } catch (error) {
    console.error("Error al intentar actualizar el usuario: ", error.message);
    throw error;
  }
}

async function eliminarUsuario(id) {
  try {
    const res = await fetch(`${API_BASE}/usuario/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Error al eliminar usuario");

    console.log(`Usuario de ID ${id} eliminado correctamente`);
    return true;
  } catch (error) {
    console.error("Error al tratar de eliminar un usuario: ", error.message);
    throw error;
  }
}

async function obtenerFinalesPorUsuario(id) {
  try {
    const res = await fetch(`${API_BASE}/usuario/${id}/finales`);

    if (!res.ok) throw new Error("No se pudieron obtener los finales conseguidos por el usuario");

    const finales = await res.json();
    console.log(`Finales del usuario ${id}:`, finales);
    return finales;
  } catch (error) {
    console.error("Error al tratar de obtener finales: ", error.message);
    throw error;
  }
}

async function obtenerUnicoUsuario(idUsuario) {
  try {
    const response = await fetch(`${API_BASE}/usuario/${idUsuario}`);
    const usuario = await response.json();
    if (!usuario) throw new Error("El usuario no existe o el id es invalido.");
    return usuario;
  } catch (error) {
    console.error("Hubo un error al encontrar el usuario: ", error.message);
    throw error;
  }
}

// --- LIBROS ---

async function obtenerAventuraPorID(id) {
  try {
    const res = await fetch(`${API_BASE}/aventuras/${id}`);
    if (!res.ok) throw new Error(`No se pudo obtener la aventura de id ${id}`);
    const aventura = await res.json();
    return aventura;
  } catch (err) {
    console.error("Hubo un error al obtener la aventura: ", err);
    return null;
  }
}

async function mostrarAventuraEnLectura(id, paginaN = 1) {
  const aventura = await obtenerAventuraPorID(id);
  if (!aventura) return;

  const contenedor = document.getElementById("contenido-aventura");
  if (!contenedor) {
    console.warn("No se encontró el contenedor para mostrar la aventura.");
    return;
  }

  const pagina = aventura.paginas?.find(p => p.numero == paginaN);
  if (!pagina) {
    contenedor.innerHTML = `<p>Página no encontrada.</p>`;
    return;
  }

  contenedor.innerHTML = `
    <h2>${aventura.titulo}</h2>
    <div class="pagina-texto">${pagina.texto}</div>
    <div class="opciones">
      ${pagina.opciones.map(op => `
        <a href="leer.html?id=${id}&pagina=${op.ir_a}" class="btn-opcion">${op.texto}</a>
      `).join("")}
    </div>
  `;
}

async function crearLibro(infoLibro) {
  try {
    const libro = {
      autor_id: infoLibro.autor_id || 0,
      contrasenia: infoLibro.contrasenia || "",
      titulo: infoLibro.titulo || "",
      descripcion: infoLibro.descripcion || "",
      genero: infoLibro.genero || "",
      portada: infoLibro.portada || "",
      id_pagina_inicial: 0
    };

    const response = await fetch(`${API_BASE}/aventuras`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(libro),
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

async function actualizarLibro(id, infoLibro) {
  try {
    const response = await fetch(`${API_BASE}/aventuras/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(infoLibro),
    });

    if (!response.ok) throw new Error("Error al actualizar el libro");

    const libroActualizado = await response.json();
    console.log("Libro actualizado: ", libroActualizado);
    return libroActualizado;
  } catch (error) {
    console.error("Error al intentar actualizar el libro: ", error.message);
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
    const urlLectura = `leer.html?id=${aventura.id}&pagina=1`;
    card.innerHTML = `
      <img class="card-imagen" src="${portada}" alt="Portada de ${aventura.titulo}" />
      <h3 class="card-titulo">${aventura.titulo}</h3>
      <h4 class="card-autor">${nombreAutor}</h4>
      <div class="card-actions">
        <a class="btn-libros"  href="${urlLectura}">
          <span class="btn-icon">▶</span>
          <span class="btn-text">Empezar a leer</span>
        </a>
      </div>
    `;

    container.appendChild(card);
  });
}

async function mostrarUnicoLibro(id) {
  try {
    const libroRes = await fetch(`${API_BASE}/aventuras/${id}`);
    const libro = await libroRes.json();

    if (!libro) {
      throw new Error("Libro no encontrado");
    }

    const autorRes = await fetch(`${API_BASE}/usuarios/${libro.id_usuario}`);
    const autor = await autorRes.json();

    const nombreAutor = autor ? autor.nombre : "Autor desconocido";
    const portada = libro.portada || portada_defecto;

    const container = document.getElementById("container-libros");
    container.innerHTML = `
      <div class="card">
        <img class="card-imagen" src="${portada}" alt="Portada de ${libro.titulo}" />
        <h3 class="card-titulo">${libro.titulo}</h3>
        <h4 class="card-autor">${nombreAutor}</h4>
        <div class="card-descripcion">
          <p>${libro.descripcion || "Sin descripción disponible."}</p>
        </div>
        <div class="card-actions">
          <a class="btn-libros" href="./leer.html">
            <span class="btn-icon">▶</span>
            <span class="btn-text">Empezar a leer</span>
          </a>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Error al intentar mostrar el libro: ", error.message);
    const errorDiv = document.getElementById("error");
    if (errorDiv) errorDiv.style.display = "block";
  }
}

// --- PÁGINAS ---

async function crearPagina(idAventura, infoPagina) {
  try {
    const pagina = {
      titulo: infoPagina.titulo || "",
      contenido: infoPagina.contenido || "",
      imagen: infoPagina.imagen || "",
      imagen_de_fondo: infoPagina.imagen_de_fondo || "",
    };

    const response = await fetch(`${API_BASE}/aventuras/${idAventura}/pagina`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pagina),
    });

    if (!response.ok) throw new Error("Error al crear la página");

    const nuevaPagina = await response.json();
    console.log("Página creada:", nuevaPagina);
    return nuevaPagina;
  } catch (error) {
    console.error("Error al crear una nueva página:", error.message);
    throw error;
  }
}

// --- EXPORTACIÓN ---

export {
  obtenerLibros, obtenerUsuarios,
  crearUsuario, actualizarUsuario, eliminarUsuario, obtenerFinalesPorUsuario,
  obtenerAventuraPorID, mostrarAventuraEnLectura,
  crearLibro, actualizarLibro, eliminarLibro,
  mostrarLibros, mostrarUnicoLibro,
  crearPagina,
  obtenerUnicoUsuario,
  portada_defecto
};
