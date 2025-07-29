// import { crearUsuario } from "./api-libros.js";

// function mostrarFormulario(tipo) {
//   const login = document.getElementById('form-login');
//   const registro = document.getElementById('form-registro');

//   if (tipo === 'login') {
//   login.classList.add('active'); /*Añade una clase CSS (active) al elemento (login).*/
//   registro.classList.remove('active'); /*Elimina una clase CSS (active) del elemento (registro).*/
//   } else if (tipo === 'registro') {
//   login.classList.remove('active');
//   registro.classList.add('active');
//   } else {
//   // Por defecto mostrar login
//   login.classList.add('active');
//   registro.classList.remove('active');
//   }
// }
// const urlParams = new URLSearchParams(window.location.search);
// /* window.location.search -> Obtiene la parte de la URL después del ? (query string).
// new URLSearchParams -> Crea un objeto especial que convierte el query string en una estructura manipulable.
// urlParams ahora es un objeto que representa:
// { "form" => "registro"}
// */
// const form = urlParams.get('form'); 
// /*
// urlParams.get('clave'):
// Busca el valor del parámetro 'form' en la URL.
// Si existe: Retorna su valor (ej: "registro").
// Si no existe: Retorna null
// */
// mostrarFormulario(form);
// document.querySelector("#form-registro form").addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const nombre = document.getElementById("usuario-registro").value.trim();
//   const email = document.getElementById("email-registro").value.trim();
//   const fecha = document.getElementById("fecha-nacimiento").value.trim();
//   const contrasenia = document.getElementById("contraseña-registro").value.trim();
//   const confirmar = document.getElementById("validar-contraseña").value.trim();

//   const errorDiv = document.getElementById("registro-error");
//   const exitoDiv = document.getElementById("registro-exito");

//   errorDiv.textContent = "";
//   exitoDiv.textContent = "";
//   errorDiv.style.display = "none";
//   exitoDiv.style.display = "none";

//   function mostrarMensaje(mensaje, elemento, color = "red") {
//     elemento.textContent = mensaje;
//     elemento.style.color = color;
//     elemento.style.display = "block";

//     // Ocultar después de 3 segundos
//     setTimeout(() => {
//       elemento.textContent = "";
//       elemento.style.display = "none";
//     }, 3000);
//   }

//   // Validaciones antes de enviar al servidor
//   if (!nombre || !email || !fecha || !contrasenia || !confirmar) {
//     mostrarMensaje("Todos los campos son obligatorios.", errorDiv);
//     return;
//   }

//   if (contrasenia !== confirmar) {
//     mostrarMensaje("Las contraseñas no coinciden.", errorDiv);
//     return;
//   }

//   const datosUsuario = {
//     nombre,
//     contrasenia,
//     email,
//     fecha_de_nacimiento: fecha,
//   };

//   try {
//     await crearUsuario(datosUsuario);

//     mostrarMensaje("¡Registro exitoso!", exitoDiv, "green");
//     document.querySelector("#form-registro form").reset();

//     setTimeout(() => {
//       mostrarFormulario('login');
//     }, 1000);
  
//   } catch (error) {
//     console.error("Error al registrar usuario:", error);
//     const mensaje = error?.mensaje || "Error al conectar con el servidor.";
//     mostrarMensaje(mensaje, errorDiv);  
//   }

// });
import { crearUsuario } from "./api-libros.js";

function mostrarFormulario(tipo) {
  const login = document.getElementById('form-login');
  const registro = document.getElementById('form-registro');

  if (tipo === 'login') {
    login.classList.add('active'); 
    registro.classList.remove('active'); 
  } else if (tipo === 'registro') {
    login.classList.remove('active');
    registro.classList.add('active');
  } else {
    login.classList.add('active');
    registro.classList.remove('active');
  }
}

const urlParams = new URLSearchParams(window.location.search);
const form = urlParams.get('form'); 
mostrarFormulario(form);

document.querySelector("#form-registro form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("usuario-registro").value.trim();
  const email = document.getElementById("email-registro").value.trim();
  const fecha = document.getElementById("fecha-nacimiento").value.trim();
  const contrasenia = document.getElementById("contraseña-registro").value.trim();
  const confirmar = document.getElementById("validar-contraseña").value.trim();

  const errorDiv = document.getElementById("registro-error");
  const exitoDiv = document.getElementById("registro-exito");

  errorDiv.textContent = "";
  exitoDiv.textContent = "";
  errorDiv.style.display = "none";
  exitoDiv.style.display = "none";

  function mostrarMensaje(mensaje, elemento, color = "red") {
    elemento.textContent = mensaje;
    elemento.style.color = color;
    elemento.style.display = "block";

    setTimeout(() => {
      elemento.textContent = "";
      elemento.style.display = "none";
    }, 3000);
  }

  if (!nombre || !email || !fecha || !contrasenia || !confirmar) {
    mostrarMensaje("Todos los campos son obligatorios.", errorDiv);
    return;
  }

  if (contrasenia !== confirmar) {
    mostrarMensaje("Las contraseñas no coinciden.", errorDiv);
    return;
  }

  const datosUsuario = {
    nombre,
    contrasenia,
    email,
    fecha_de_nacimiento: fecha,
  };

  try {
    await crearUsuario(datosUsuario);

    mostrarMensaje("¡Registro exitoso!", exitoDiv, "green");
    document.querySelector("#form-registro form").reset();

    setTimeout(() => {
      mostrarFormulario('login');
    }, 1000);

  } catch (error) {
    console.error("Error al registrar usuario:", error);
    const mensaje = error?.mensaje || "Error al conectar con el servidor.";
    mostrarMensaje(mensaje, errorDiv);  
  }
});

document.querySelector("#form-login form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("usuario-login").value.trim();
  const contrasenia = document.getElementById("contraseña-login").value.trim();
  const errorDiv = document.getElementById("login-error");

  errorDiv.textContent = "";
  errorDiv.style.display = "none";

  function mostrarMensaje(mensaje, elemento, color = "red") {
    elemento.textContent = mensaje;
    elemento.style.color = color;
    elemento.style.display = "block";
    setTimeout(() => {
      elemento.textContent = "";
      elemento.style.display = "none";
    }, 3000);
  }

  if (!nombre || !contrasenia) {
    mostrarMensaje("Completa todos los campos.", errorDiv);
    return;
  }

  try {
    const respuesta = await fetch("http://localhost:3000/v1/usuario/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, contrasenia }),
    });

    if (!respuesta.ok) {
  const texto = await respuesta.text();
  console.warn("Respuesta no-OK (no es JSON):", texto);
  throw new Error(data?.mensaje || "Credenciales incorrectas");

}

    const usuario = await respuesta.json();
    console.log("Usuario logueado:", usuario);

    // Redirigir a página principal o guardar en localStorage
    // Por ejemplo:
    localStorage.setItem("usuario", JSON.stringify(usuario));
    window.location.href = "index.html"; // O donde quieras redirigir

  } catch (error) {
    console.error("Error en login:", error);
    mostrarMensaje(error.message || "Error al iniciar sesión.", errorDiv);
  }
});
