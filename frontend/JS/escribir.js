/*
 * Sistema de Escritura de Historias Interactivas
 * 
 * Este script maneja:
 * - Creación/edición de libros (aventuras)
 * - Gestión de capítulos (páginas)
 * - Sistema de opciones/decisiones
 * - Conexión con backend API
 */


// 1. ESTADO GLOBAL Y CONFIGURACIÓN

const config = {
  apiBaseUrl: 'http://localhost:3000/v1'
};

let estado = {
  libro: {
    id: null,
    titulo: "",
    descripcion: "",
    genero: "",
    portada: "",
    capitulos: [],
    usuario: JSON.parse(localStorage.getItem("usuario")) || null
  },
  capituloActual: 0,
  modoEdicion: false
};


// 2. FUNCIONES DE INICIALIZACIÓN


/*
 * Inicializa la aplicación
 */
function inicializar() {
  configurarEventos();
  verificarEdicionExistente();
  actualizarUI();
}

/*
 * Configura los event listeners
 */
function configurarEventos() {
  // Botón Siguiente (de detalles a editor)
  document.getElementById("boton-siguiente").addEventListener("click", manejarBotonSiguiente);
  
  // Subida de portada
  document.querySelector(".upload-container .file-input").addEventListener("change", manejarSubidaPortada);
  
  // Botón Agregar Capítulo
  document.getElementById("agregar-capitulo").addEventListener("click", agregarNuevoCapitulo);
  
  // Botón Guardar
  document.querySelector(".btn-guardar").addEventListener("click", guardarTodo);
  
  // Botón Agregar Opción
  document.getElementById("botonAgregarOpcion").addEventListener("click", mostrarFormularioOpcion);
  
  // Cancelar formulario opción
  document.querySelector(".formulario-opcion .btn-gris").addEventListener("click", ocultarFormularioOpcion);
  
  // Aceptar formulario opción
  document.querySelector(".formulario-opcion .btn-verde").addEventListener("click", guardarOpcion);
}

/*
 * Verifica si estamos editando una aventura existente
 */
function verificarEdicionExistente() {
  const params = new URLSearchParams(window.location.search);
  const idAventura = params.get('id');
  
  if (idAventura) {
    cargarAventuraExistente(idAventura);
    estado.modoEdicion = true;
  }
}


// 3. MANEJO DE LIBROS (AVENTURAS)


/*
 * Maneja el botón "Siguiente" para crear la aventura inicial
 */
async function manejarBotonSiguiente() {
  // Validar campos obligatorios
  const titulo = document.querySelector(".input[type='text']").value.trim();
  const genero = document.getElementById("categoria").value.trim();
  
  if (!titulo || !genero) {
    mostrarAlerta("Por favor completá el título y seleccioná una categoría.");
    return;
  }

  // Actualizar estado
  estado.libro = {
    ...estado.libro,
    titulo,
    genero,
    descripcion: document.querySelector(".textarea").value.trim()
  };

  try {
    // Crear aventura en backend
    const aventuraCreada = await crearAventura(estado.libro);
    
    // Actualizar estado con ID recibido
    estado.libro.id = aventuraCreada.id;
    
    // Crear primer capítulo por defecto
    const primerCapitulo = {
      numero: 1,
      titulo: "Capítulo 1",
      contenido: "Escribe tu contenido aquí...",
      imagen: null,
      opciones: []
    };
    
    const capituloCreado = await crearCapitulo(primerCapitulo);
    
    // Actualizar estado
    estado.libro.capitulos = [capituloCreado];
    estado.capituloActual = 0;
    
    // Cambiar vista
    document.querySelector(".informacion-principal").style.display = "none";
    document.querySelector(".editor-container").style.display = "flex";
    
    // Actualizar UI
    actualizarUI();
    
  } catch (error) {
    console.error("Error al crear aventura:", error);
    mostrarAlerta("Error al crear la aventura. Por favor intentá nuevamente.");
  }
}

/*
 * Crea una aventura en el backend
 */
async function crearAventura(libro) {
  const response = await fetch(`${config.apiBaseUrl}/aventura`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth: {
        id_usuario: libro.usuario.id,
        contrasenia: libro.usuario.contrasenia
      },
      titulo: libro.titulo,
      descripcion: libro.descripcion,
      genero: libro.genero,
      portada: libro.portada
    })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

/*
 * Carga una aventura existente
 */
async function cargarAventuraExistente(idAventura) {
  try {
    // Cargar datos básicos
    const responseAventura = await fetch(`${config.apiBaseUrl}/aventura/${idAventura}`);
    if (!responseAventura.ok) throw new Error("Error al cargar aventura");
    
    const datosAventura = await responseAventura.json();
    
    // Cargar capítulos
    const responseCapitulos = await fetch(`${config.apiBaseUrl}/aventura/${idAventura}/paginas`);
    if (!responseCapitulos.ok) throw new Error("Error al cargar capítulos");
    const capitulos = await responseCapitulos.json();
    
    // Para cada capítulo, cargar opciones
    for (const capitulo of capitulos) {
      const responseOpciones = await fetch(
        `${config.apiBaseUrl}/aventura/${idAventura}/${capitulo.numero}/opciones`
      );
      capitulo.opciones = responseOpciones.ok ? await responseOpciones.json() : [];
    }
    
    // Actualizar estado
    estado.libro = {
      ...estado.libro,
      id: datosAventura.id,
      titulo: datosAventura.titulo,
      descripcion: datosAventura.descripcion,
      genero: datosAventura.genero,
      portada: datosAventura.portada,
      capitulos: capitulos
    };
    
    // Mostrar editor
    document.querySelector(".informacion-principal").style.display = "none";
    document.querySelector(".editor-container").style.display = "flex";
    
    // Cargar primer capítulo
    if (capitulos.length > 0) {
      estado.capituloActual = 0;
      cargarCapituloEnEditor(capitulos[0]);
    }
    
    // Actualizar UI
    actualizarUI();
    
  } catch (error) {
    console.error("Error al cargar aventura:", error);
    mostrarAlerta("Error al cargar la aventura. Por favor intentá nuevamente.");
  }
}

// 4. MANEJO DE CAPÍTULOS (PÁGINAS)

/*
 Agrega un nuevo capítulo
 */
async function agregarNuevoCapitulo() {
  const nuevoNumero = estado.libro.capitulos.length + 1;
  const nuevoCapitulo = {
    numero: nuevoNumero,
    titulo: `Capítulo ${nuevoNumero}`,
    contenido: "Escribe tu contenido aquí...",
    imagen: null,
    opciones: []
  };
  
  try {
    const capituloCreado = await crearCapitulo(nuevoCapitulo);
    estado.libro.capitulos.push(capituloCreado);
    estado.capituloActual = estado.libro.capitulos.length - 1;
    actualizarUI();
    cargarCapituloEnEditor(capituloCreado);
  } catch (error) {
    console.error("Error al crear capítulo:", error);
    mostrarAlerta("Error al crear el capítulo. Por favor intentá nuevamente.");
  }
}

/*
 Crea un capítulo en el backend
 */
async function crearCapitulo(capitulo) {
  try {
    // Validar que tenemos un ID de aventura válido
    if (!estado.libro.id || isNaN(estado.libro.id)) {
      throw new Error("ID de aventura inválido");
    }

    const response = await fetch(`${config.apiBaseUrl}/aventura/${estado.libro.id}/pagina`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth: {
          id: estado.libro.usuario.id,
          contrasenia: estado.libro.usuario.contrasenia
        },
        id_aventura: estado.libro.id,
        numero: capitulo.numero,
        titulo: capitulo.titulo,
        contenido: capitulo.contenido,
        imagen: capitulo.imagen
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al crear capítulo");
    }

    const data = await response.json();
    return { ...capitulo, id: data.id };
  } catch (error) {
    console.error("Error en crearCapitulo:", error);
    throw error;
  }
}

/*
  Carga un capítulo en el editor
 */
function cargarCapituloEnEditor(capitulo) {
  document.getElementById("titulo").value = capitulo.titulo || "";
  document.getElementById("contenido").value = capitulo.contenido || "";
  
  // Actualizar opciones
  const opcionesContainer = document.getElementById("opcionesContainer");
  opcionesContainer.innerHTML = "<h3 class='font-Lato'>Opciones del capítulo:</h3>";
  
  if (capitulo.opciones && capitulo.opciones.length > 0) {
    capitulo.opciones.forEach(opcion => {
      const card = document.createElement("div");
      card.className = "card-opcion";
      card.innerHTML = `
        <p>${opcion.descripcion}</p>
        <a>Ir a página: ${opcion.numero_pagina_destino}</a>
        <button class="btn-eliminar-opcion" data-id="${opcion.id}">Eliminar</button>
      `;
      opcionesContainer.appendChild(card);
    });
    
    // Agregar event listeners a los botones de eliminar
    document.querySelectorAll(".btn-eliminar-opcion").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const opcionId = e.target.getAttribute("data-id");
        await eliminarOpcion(opcionId);
      });
    });
  }
}

// 5. MANEJO DE OPCIONES

/*
  Muestra el formulario para agregar una opción
 */
function mostrarFormularioOpcion() {
  document.getElementById("formularioOpcion").style.display = "block";
  document.getElementById("botonAgregarOpcion").style.display = "none";
}

/*
  Oculta el formulario de opción
 */
function ocultarFormularioOpcion() {
  document.getElementById("formularioOpcion").style.display = "none";
  document.getElementById("botonAgregarOpcion").style.display = "block";
  document.getElementById("mensajeOpcion").value = "";
  document.getElementById("redirigirOpcion").value = "";
}

/*
  Guarda una nueva opción
 */
async function guardarOpcion(e) {
  if (e) e.preventDefault(); // por si la llaman desde un submit

  const mensaje = document.getElementById("mensajeOpcion").value.trim();
  const redireccion = document.getElementById("redirigirOpcion").value.trim();

  if (!mensaje || !redireccion) {
    mostrarAlerta("¡Completá ambos campos!");
    return;
  }

  const capituloActual = estado.libro.capitulos[estado.capituloActual];

  const nuevaOpcion = {
    descripcion: mensaje, // ya está trim arriba
    numero_pagina_origen: capituloActual.numero,
    numero_pagina_destino: parseInt(redireccion)
  };

  try {
    const opcionCreada = await crearOpcion(nuevaOpcion);

    if (!capituloActual.opciones) capituloActual.opciones = [];
    capituloActual.opciones.push(opcionCreada);

    cargarCapituloEnEditor(capituloActual);
    ocultarFormularioOpcion();
  } catch (error) {
    console.error("Error al guardar opción:", error);
    mostrarAlerta("Error al guardar la opción. Por favor intentá nuevamente.");
  }
}

/*
 * Borra un capítulo por número y lo elimina del estado y UI
 */
async function borrarCapitulo(numeroCapitulo) {
  try {
    const capitulo = estado.libro.capitulos.find(c => c.numero === numeroCapitulo);
    if (!capitulo) {
      mostrarAlerta("Capítulo no encontrado");
      return;
    }

    if (!confirm(`¿Seguro que querés borrar el capítulo ${numeroCapitulo}?`)) {
      return;
    }

    const response = await fetch(
      `${config.apiBaseUrl}/aventura/${estado.libro.id}/${capitulo.numero}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth: {
            id: estado.libro.usuario.id,
            contrasenia: estado.libro.usuario.contrasenia
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error("Error al borrar capítulo en backend");
    }

    // Sacarlo del estado local
    estado.libro.capitulos = estado.libro.capitulos.filter(c => c.numero !== numeroCapitulo);

    // Ajustar capituloActual
    if (estado.capituloActual >= estado.libro.capitulos.length) {
      estado.capituloActual = estado.libro.capitulos.length - 1;
    }

    // Si quedan capítulos, cargamos el nuevo actual, si no, limpiamos
    if (estado.capituloActual >= 0) {
      cargarCapituloEnEditor(estado.libro.capitulos[estado.capituloActual]);
    } else {
      document.getElementById("titulo").value = "";
      document.getElementById("contenido").value = "";
      document.getElementById("opcionesContainer").innerHTML = "<h3 class='font-Lato'>Opciones del capítulo:</h3>";
    }

    actualizarUI();
    mostrarAlerta("Capítulo borrado correctamente");

  } catch (error) {
    console.error("Error en borrarCapitulo:", error);
    mostrarAlerta("Error al borrar capítulo");
  }
}

/*
  Crea una opción en el backend
 */
async function crearOpcion(opcion) {
  const response = await fetch(
    `${config.apiBaseUrl}/aventura/${estado.libro.id}/${opcion.numero_pagina_origen}/opcion`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth: {
          id: estado.libro.usuario.id,
          contrasenia: estado.libro.usuario.contrasenia
        },
        id_aventura: estado.libro.id,
        descripcion: String(opcion.descripcion).trim(),
        numero_pagina_destino: opcion.numero_pagina_destino
      })
    }
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

/*
  Elimina una opción
 */
async function eliminarOpcion(opcionId) {
  try {
    const response = await fetch(
      `${config.apiBaseUrl}/aventura/0/0/${opcionId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth: {
            id: estado.libro.usuario.id,
            contrasenia: estado.libro.usuario.contrasenia
          }
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Actualizar estado
    const capitulo = estado.libro.capitulos[estado.capituloActual];
    capitulo.opciones = capitulo.opciones.filter(op => op.id !== opcionId);
    
    // Actualizar UI
    cargarCapituloEnEditor(capitulo);
    
  } catch (error) {
    console.error("Error al eliminar opción:", error);
    mostrarAlerta("Error al eliminar la opción. Por favor intentá nuevamente.");
  }
}

// 6. MANEJO DE ARCHIVOS (PORTADA/IMÁGENES)


/*
  Maneja la subida de la portada
 */
function manejarSubidaPortada(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    const imgPreview = document.querySelector(".portada");
    imgPreview.src = event.target.result;
    estado.libro.portada = event.target.result;
  };
  reader.readAsDataURL(file);
}


// 7. FUNCIONES DE UTILIDAD


/*
 * Muestra una alerta al usuario
 */
function mostrarAlerta(mensaje) {
  const alerta = document.getElementById("alerta");
  const mensajeAlerta = document.getElementById("mensajeAlerta");
  
  mensajeAlerta.textContent = mensaje;
  alerta.style.display = "block";
  
  setTimeout(() => {
    alerta.style.display = "none";
  }, 3000);
}

/*
 * Actualiza la UI basada en el estado actual
 */
function actualizarUI() {
  // Actualizar sidebar
  const listaCapitulos = document.querySelector(".lista-capitulos");
  listaCapitulos.innerHTML = "";
  
  // Agregar botón "Agregar capítulo" primero
  const agregarLi = document.createElement("li");
  agregarLi.innerHTML = `<button id="agregar-capitulo" class="btn gr btn-simple btn-verde">+ Agregar capítulo</button>`;
  agregarLi.querySelector("button").addEventListener("click", agregarNuevoCapitulo);
  listaCapitulos.appendChild(agregarLi);
  
  // Agregar capítulos existentes
  estado.libro.capitulos.forEach((capitulo, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <span>Capítulo ${capitulo.numero}: ${capitulo.titulo || "Sin título"}</span>
    <button class="btn-borrar-capitulo" title="Borrar capítulo">Borrar</button>
    `;
    li.querySelector("span").addEventListener("click", () => {
      estado.capituloActual = index;
      cargarCapituloEnEditor(capitulo);
      actualizarUI();
    });
    li.querySelector(".btn-borrar-capitulo").addEventListener("click", async (e) => {
    e.stopPropagation(); 
    if (confirm(`¿Querés borrar el capítulo ${capitulo.numero}? Esto no se puede deshacer.`)) {
      await borrarCapitulo(capitulo.numero);
    }
  });
    listaCapitulos.appendChild(li);
  });
  
  // Actualizar encabezado sidebar
  document.getElementById("encabezado-sidebar").textContent = estado.libro.titulo || "Nueva Aventura";
}

/*
 * Guarda todos los cambios (capítulo actual)
 */
async function guardarTodo() {
  try {
    const capitulo = estado.libro.capitulos[estado.capituloActual];
    
    // Validar datos
    if (!capitulo) throw new Error("No hay capítulo seleccionado");
    
    // Obtener datos del formulario
    capitulo.titulo = document.getElementById("titulo").value.trim();
    capitulo.contenido = document.getElementById("contenido").value.trim();
    
    if (!capitulo.titulo) throw new Error("El título no puede estar vacío");
    if (!capitulo.contenido) throw new Error("El contenido no puede estar vacío");

    let response;
    
    // Si es un capítulo nuevo (sin ID)
    if (!capitulo.id) {
      response = await fetch(`${config.apiBaseUrl}/aventura/${estado.libro.id}/pagina`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth: {
            id: estado.libro.usuario.id,
            contrasenia: estado.libro.usuario.contrasenia
          },
          id_aventura: estado.libro.id,
          numero: capitulo.numero,
          titulo: capitulo.titulo,
          contenido: capitulo.contenido,
          imagen: capitulo.imagen
        })
      });
    } 
    // Si es un capítulo existente
    else {
      response = await fetch(
        `${config.apiBaseUrl}/aventura/${estado.libro.id}/${capitulo.numero}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            auth: {
              id: estado.libro.usuario.id,
              contrasenia: estado.libro.usuario.contrasenia
            },
            titulo: capitulo.titulo,
            contenido: capitulo.contenido,
            imagen: capitulo.imagen
          })
        }
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al guardar");
    }

    const data = await response.json();
    if (!capitulo.id) capitulo.id = data.id;
    
    mostrarAlerta("Capítulo guardado correctamente");
    actualizarUI();
    
  } catch (error) {
    console.error("Error al guardar:", error);
    mostrarAlerta(error.message || "Error al guardar el capítulo");
  }
}
/*
 * Actualiza un capítulo en el backend
 */
async function actualizarCapitulo(capitulo) {
  try {
    // Validar que tenemos un ID de aventura válido
    if (!estado.libro.id || isNaN(estado.libro.id)) {
      throw new Error("ID de aventura inválido");
    }

    // Validar que el capítulo tiene número válido
    if (!capitulo.numero || isNaN(capitulo.numero)) {
      throw new Error("Número de capítulo inválido");
    }

    const response = await fetch(
      `${config.apiBaseUrl}/aventura/${estado.libro.id}/${capitulo.numero}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth: {
            id: estado.libro.usuario.id,
            contrasenia: estado.libro.usuario.contrasenia
          },
          titulo: capitulo.titulo,
          contenido: capitulo.contenido,
          imagen: capitulo.imagen
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al actualizar capítulo");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en actualizarCapitulo:", error);
    throw error;
  }
}


// INICIALIZACIÓN DE LA APLICACIÓN

document.addEventListener("DOMContentLoaded", inicializar);