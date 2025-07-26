let capitulos = [
  {
    id: 1,
    titulo: "Capítulo 1",
    contenido: "",
    opciones: [],
    imagen: "" // Nueva propiedad
  }
];


let capituloActual = 0; // <-- Muy importante para saber qué capítulo estás editando

// Renderiza el sidebar con los capítulos
function renderizarSidebar() {
  const ul = document.querySelector(".lista-capitulos");
  ul.innerHTML = "";

  capitulos.forEach((c, i) => {
    const li = document.createElement("li");
    li.textContent = `Capítulo ${i + 1}: ${c.titulo || "Sin título"}`;
    li.classList.toggle("activo", capituloActual === i);
    li.addEventListener("click", () => {
        guardarCambiosEnCapitulo();
        capituloActual = i;    
        cargarCapitulo(i);
        renderizarSidebar();    
    });

    ul.appendChild(li);
  });

  const botonLi = document.createElement("li");
  const btn = document.createElement("button");
  btn.id = "agregar-capitulo";
  btn.textContent = "+ Agregar capítulo";
  btn.addEventListener("click", () => {
    guardarCambiosEnCapitulo();
    agregarCapitulo();
  });
  botonLi.appendChild(btn);
  ul.appendChild(botonLi);
}

// Agrega nuevo capítulo
function agregarCapitulo() {
  const nuevo = {
    id: capitulos.length + 1,
    titulo: `Capítulo ${capitulos.length + 1}`,
    contenido: "",
    opciones: [],
    imagen: "" 
  };
  capitulos.push(nuevo);
  capituloActual = capitulos.length - 1; 
  renderizarSidebar();                
  cargarCapitulo(capituloActual);   
}


function cargarCapitulo(indice) {
  capituloActual = indice;
  const capitulo = capitulos[indice];
  document.getElementById("titulo").value = capitulo.titulo;
  document.getElementById("contenido").value = capitulo.contenido;

  // Imagen
  const imagenCapitulo = document.querySelector(".subida-imagen img");
  imagenCapitulo.src = capitulo.imagen || "./imagenes/image-combiner-svgrepo-com.svg";

  // Opciones
  const contenedor = document.getElementById("opcionesContainer");
  contenedor.innerHTML = "";
  capitulo.opciones.forEach(op => {
    const card = document.createElement("div");
    card.className = "card-opcion";
    card.innerHTML = `<p>${op.mensaje}</p><a>Ir a página: ${op.redirigir}</a>`;
    contenedor.appendChild(card);
  });
}


// Guarda cambios escritos en el capítulo actual
function guardarCambiosEnCapitulo() {
  const titulo = document.getElementById("titulo").value.trim();
  const contenido = document.getElementById("contenido").value.trim();
  const imagen = document.querySelector(".subida-imagen img").src;

  const opciones = Array.from(document.querySelectorAll(".card-opcion")).map(card => {
    const texto = card.querySelector("p")?.textContent;
    const redirigir = parseInt(card.querySelector("a")?.textContent.replace(/\D+/g, ""));
    return { mensaje: texto, redirigir };
  });

  capitulos[capituloActual].titulo = titulo;
  capitulos[capituloActual].contenido = contenido;
  capitulos[capituloActual].imagen = imagen;
  capitulos[capituloActual].opciones = opciones;
}


function generarId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function guardarHistoriaLocal(historia) {
  const historias = JSON.parse(localStorage.getItem("historias")) || [];
  historias.push(historia);
  localStorage.setItem("historias", JSON.stringify(historias));
  mostrarAlerta("¡Historia guardada con éxito!");
}

// Evento guardar historia
document.querySelector(".cb-verde").addEventListener("click", () => {
  guardarCambiosEnCapitulo();

  const titulo = document.querySelector(".input[type='text']").value.trim();
  const descripcion = document.querySelector(".textarea").value.trim();
  const categoria = document.getElementById("categoria").value;
  const portada = document.querySelector(".portada").src;

  if (!titulo || !capitulos[0].titulo || !capitulos[0].contenido) {
    mostrarAlerta("Faltan completar campos obligatorios.");
    return;
  }

  const historia = {
    id: generarId(),
    titulo,
    descripcion,
    categoria,
    portada,
    capitulos,
    fecha_creacion: new Date().toISOString(),
    id_usuario: 1
  };

  guardarHistoriaLocal(historia);
  setTimeout(() => {
    window.location.href = "mis-historias.html";
    }, 1000);
});

// Render inicial
window.addEventListener("DOMContentLoaded", () => {
  renderizarSidebar();
  cargarCapitulo(0);
});
