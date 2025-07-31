///////port de una aventura
// function renderizarSidebar() {
//     const ul = document.querySelector(".lista-capitulos");
//     ul.innerHTML = "";

//     capitulos.forEach((c, i) => {
//         const li = document.createElement("li");
//         li.textContent = `Capítulo ${c.numero}: ${c.titulo || "Sin título"}`;
//         li.classList.toggle("activo", capituloActual === i);
//         li.addEventListener("click", () => {
//             capituloActual = i;
//             cargarCapitulo(i);
//             renderizarSidebar();
//         });
//         ul.appendChild(li);
//     });
// }

let idAventura = null; 
document.getElementById("boton-siguiente").addEventListener("click", async function () {
  const titulo = document.querySelector(".input[type='text']").value.trim();
  const genero = document.getElementById("categoria").value.trim();
  const descripcion = document.querySelector(".textarea").value.trim();

  if (!titulo || !genero) {
    mostrarAlerta("Por favor completá el título y seleccioná una categoría.");
    return;
  }

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    mostrarAlerta("Debes iniciar sesión para crear una historia.");
    return;
  }

  // Asegurate que portada tenga valor, o usa null:
  const portada = ""; // o null, o obtenela de algún input si la tenés

  try {
    // Crear aventura y esperar la respuesta
    const respuesta = await fetch("http://localhost:3000/v1/aventura", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth: {
          id_usuario: usuario.id,
          contrasenia: usuario.contrasenia
        },
        titulo: titulo,
        descripcion: descripcion,
        genero: genero,
        portada: portada
      })
    });

    if (!respuesta.ok) {
      throw new Error("Error al crear la aventura");
    }

    const nuevaAventura = await respuesta.json();
    console.log("Aventura creada:", nuevaAventura);

    idAventura = nuevaAventura.id;
    console.log("ID de la aventura guardado:", idAventura);

    // Crear página 1 y esperar respuesta
    const respPagina = await fetch(`http://localhost:3000/v1/aventura/${idAventura}/pagina`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth: {
          id: usuario.id,
          contrasenia: usuario.contrasenia
        },
        id_aventura: idAventura,
        numero: 1,
        titulo: "Capítulo 1",
        contenido: "pagina 1",
        imagen: null
      })
    });

    if (!respPagina.ok) throw new Error("Error al crear la primera página");

    const paginaCreada = await respPagina.json();
    console.log("Página creada:", paginaCreada);

    capitulos = [{
      numero: 1,
      titulo: paginaCreada.titulo || "Capítulo 1",
      contenido: paginaCreada.contenido || "",
      imagen: paginaCreada.imagen || "",
      opciones: []
    }];

    // renderizarSidebar();

    document.querySelector(".informacion-principal").style.display = "none";
    document.querySelector(".editor-container").style.display = "flex";

  } catch (error) {
    console.error("Error:", error);
    mostrarAlerta("No se pudo crear la historia.");
  }
});

/////////////


window.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".editor-container").style.display = "none";
});

function mostrarAlerta(mensaje) {
    const alerta = document.getElementById('alerta');
    const mensajeAlerta = document.getElementById('mensajeAlerta');

    mensajeAlerta.textContent = mensaje;
    alerta.style.display = 'block';

    setTimeout(() => {
        alerta.style.display = 'none';
    }, 3000);
}

/////////////



// async function aceptarOpcion(idAventura, numeroPagina) {
//   const mensaje = document.getElementById('mensajeOpcion').value.trim();
//   const redireccion = document.getElementById('redirigirOpcion').value.trim();

//   if (mensaje === '' || redireccion === '') {
//     mostrarAlerta('¡Completá ambos campos!');
//     return;
//   }

//   try {
//     const usuarioActual = JSON.parse(localStorage.getItem("usuario"));
//     if (!usuarioActual) {
//       mostrarAlerta("No estás autenticado.");
//       return;
//     }

//     const respuesta = await fetch(`http://localhost:3000/v1/aventura/${idAventura}/${numeroPagina}/opcion`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         auth: {
//           id: usuarioActual.id,
//           contrasenia: usuarioActual.contrasenia
//         },
//         descripcion: mensaje,
//         numero_pagina_destino: redireccion
//       })
//     });

//     if (!respuesta.ok) {
//       throw new Error('Error al crear la opción en el servidor');
//     }

//     const opcionCreada = await respuesta.json();

//     // Crear la tarjeta con los datos confirmados del servidor
//     const card = document.createElement('div');
//     card.className = 'card-opcion';
//     card.innerHTML = `
//       <p>${opcionCreada.descripcion}</p>
//       <a href="#">Ir a pagina : ${opcionCreada.numero_pagina_destino}</a>
//     `;

//     document.getElementById('opcionesContainer').appendChild(card);

//     // Reset formulario y UI
//     document.getElementById('mensajeOpcion').value = '';
//     document.getElementById('redirigirOpcion').value = '';
//     document.getElementById('formularioOpcion').style.display = 'none';
//     document.getElementById('botonAgregarOpcion').style.display = 'block';

//   } catch (error) {
//     console.error(error);
//     mostrarAlerta('No se pudo crear la opción, intentá de nuevo.');
//   }
// }















////////////





