import { crearUsuario } from "./api-libros.js";

function mostrarFormulario(tipo) {
  const login = document.getElementById('form-login');
  const registro = document.getElementById('form-registro');

  if (tipo === 'login') {
  login.classList.add('active'); /*Añade una clase CSS (active) al elemento (login).*/
  registro.classList.remove('active'); /*Elimina una clase CSS (active) del elemento (registro).*/
  } else if (tipo === 'registro') {
  login.classList.remove('active');
  registro.classList.add('active');
  } else {
  // Por defecto mostrar login
  login.classList.add('active');
  registro.classList.remove('active');
  }
}
const urlParams = new URLSearchParams(window.location.search);
/* window.location.search -> Obtiene la parte de la URL después del ? (query string).
new URLSearchParams -> Crea un objeto especial que convierte el query string en una estructura manipulable.
urlParams ahora es un objeto que representa:
{ "form" => "registro"}
*/
const form = urlParams.get('form'); 
/*
urlParams.get('clave'):
Busca el valor del parámetro 'form' en la URL.
Si existe: Retorna su valor (ej: "registro").
Si no existe: Retorna null
*/
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

    // Ocultar después de 3 segundos
    setTimeout(() => {
      elemento.textContent = "";
      elemento.style.display = "none";
    }, 3000);
  }

  // Validaciones antes de enviar al servidor
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
