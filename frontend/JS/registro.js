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
    localStorage.setItem("usuario", JSON.stringify(usuario));
    window.location.href = "index.html"; 

  } catch (error) {
    console.error("Error en login:", error);
    mostrarMensaje(error.message || "Error al iniciar sesión.", errorDiv);
  }
});
