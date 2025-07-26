// import { crearUsuario, obtenerUsuarios } from "./api-libros.js";

// function mostrarErrorAuth(mensaje, idElemento) {
//   const errorElem = document.getElementById(idElemento);
//   if (errorElem) {
//     errorElem.textContent = mensaje;
//     errorElem.style.color = 'red';
//     errorElem.style.display = 'block';
//   }
// }

// function mostrarExito(mensaje, idElemento) {
//   const exitoElem = document.getElementById(idElemento);
//   if (exitoElem) {
//     exitoElem.textContent = mensaje;
//     exitoElem.style.color = 'green';
//     exitoElem.style.display = 'block';
//   }
// }

// export function mostrarFormulario(tipo) {
//   const login = document.getElementById('form-login');
//   const registro = document.getElementById('form-registro');

//   if (tipo === 'login') {
//     login.classList.add('active');
//     registro.classList.remove('active');
//   } else if (tipo === 'registro') {
//     login.classList.remove('active');
//     registro.classList.add('active');
//   } else {
//     login.classList.add('active');
//     registro.classList.remove('active');
//   }
// }

// async function login(nombre, contraseña) {
//   try {
//     const usuarios = await obtenerUsuarios();
//     const usuario = usuarios.find(
//       u => u.usuario === nombre && u.contrasenia === contraseña
//     );

//     if (usuario) {
//       localStorage.setItem('usuario', JSON.stringify(usuario));
//       window.location.href = "index.html";
//     } else {
//       mostrarErrorAuth("Credenciales incorrectas.", "login-error");
//     }
//   } catch (error) {
//     console.error("Error en login:", error);
//     mostrarErrorAuth("Error al intentar iniciar sesión.", "login-error");
//   }
// }

// async function registrar(nombre, email, fechaNacimiento, contraseña, validarContraseña) {
//   if (!nombre || !email || !fechaNacimiento || !contraseña || !validarContraseña) {
//     mostrarErrorAuth("Faltan datos.", "registro-error");
//     return;
//   }

//   if (contraseña !== validarContraseña) {
//     mostrarErrorAuth("Las contraseñas no coinciden.", "registro-error");
//     return;
//   }

//   try {
//     const usuarios = await obtenerUsuarios();
//     const existe = usuarios.some(u => u.usuario === nombre);

//     if (existe) {
//       mostrarErrorAuth("El usuario ya existe.", "registro-error");
//       return;
//     }

//     await crearUsuario({
//       nombre: nombre,
//       usuario: nombre,
//       email: email,
//       contrasenia: contraseña,
//       fecha_de_nacimiento: fechaNacimiento,
//       fecha_registro: new Date().toISOString()
//     });

//     mostrarExito("Registro exitoso. Ya podés iniciar sesión.", "registro-exito");
//     mostrarFormulario('login');
//   } catch (error) {
//     console.error("Error al registrar:", error);
//     mostrarErrorAuth("Error al registrar el usuario.", "registro-error");
//   }
// }

// // Agregamos escucha para los formularios y pasamos los datos nuevos al registrar
// document.querySelector('#form-login form')?.addEventListener('submit', e => {
//   e.preventDefault();
//   const nombre = document.getElementById('usuario-login').value.trim();
//   const pass = document.getElementById('contraseña-login').value.trim();

//   if (nombre && pass) {
//     login(nombre, pass);
//   } else {
//     mostrarErrorAuth("Completá los campos.", "login-error");
//   }
// });

// document.querySelector('#form-registro form')?.addEventListener('submit', e => {
//   e.preventDefault();

//   const nombre = document.getElementById('usuario-registro').value.trim();
//   const email = document.getElementById('email-registro').value.trim();
//   const fechaNacimiento = document.getElementById('fecha-nacimiento').value;
//   const pass1 = document.getElementById('contraseña-registro').value.trim();
//   const pass2 = document.getElementById('validar-contraseña').value.trim();

//   registrar(nombre, email, fechaNacimiento, pass1, pass2);
// });



const usuariosFijos = [
  { id: 1, nombre: "Ana García", usuario: "ana", password: "1234" },
  { id: 2, nombre: "Carlos Pérez", usuario: "carlos", password: "abcd" },
  { id: 3, nombre: "Lucía Fernández", usuario: "lucia", password: "pass123" },
  { id: 4, nombre: "Matías Gómez", usuario: "matias", password: "qwerty" },
  { id: 5, nombre: "Sofía Rodríguez", usuario: "sofia", password: "sofia2024" },
  { id: 6, nombre: "Diego López", usuario: "diego", password: "admin123" }
];

// Mostrar mensaje de error o éxito
function mostrarErrorAuth(mensaje, idElemento) {
  const errorElem = document.getElementById(idElemento);
  if (errorElem) {
    errorElem.textContent = mensaje;
    errorElem.style.color = 'red';
    errorElem.style.display = 'block';
  }
}

function mostrarExito(mensaje, idElemento) {
  const exitoElem = document.getElementById(idElemento);
  if (exitoElem) {
    exitoElem.textContent = mensaje;
    exitoElem.style.color = 'green';
    exitoElem.style.display = 'block';
  }
}

// Mostrar formulario login o registro
export function mostrarFormulario(tipo) {
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

// Login con usuariosFijos
function login(nombre, contraseña) {
  const usuario = usuariosFijos.find(
    u => u.usuario === nombre && u.password === contraseña
  );

  if (usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    window.location.href = "index.html";
  } else {
    mostrarErrorAuth("Credenciales incorrectas.", "login-error");
  }
}

// Registro con usuariosFijos
function registrar(nombre, contraseña, validarContraseña) {
  if (!nombre || !contraseña || !validarContraseña) {
    mostrarErrorAuth("Faltan datos.", "registro-error");
    return;
  }

  if (contraseña !== validarContraseña) {
    mostrarErrorAuth("Las contraseñas no coinciden.", "registro-error");
    return;
  }

  const existe = usuariosFijos.some(u => u.usuario === nombre);

  if (existe) {
    mostrarErrorAuth("El usuario ya existe.", "registro-error");
    return;
  }

  const nuevoUsuario = {
    id: usuariosFijos.length + 1,
    nombre,
    usuario: nombre,
    password: contraseña
  };

  usuariosFijos.push(nuevoUsuario);
  mostrarExito("Registro exitoso. Ya podés iniciar sesión.", "registro-exito");
  mostrarFormulario('login');
}

// Manejadores de eventos de formularios
document.querySelector('#form-login form')?.addEventListener('submit', e => {
  e.preventDefault();
  const nombre = document.getElementById('usuario-login').value.trim();
  const pass = document.getElementById('contraseña-login').value.trim();

  if (nombre && pass)
    login(nombre, pass);
  else
    mostrarErrorAuth("Completá los campos.", "login-error");
});

document.querySelector('#form-registro form')?.addEventListener('submit', e => {
  e.preventDefault();

  const nombre = document.getElementById('usuario-registro').value.trim();
  const pass1 = document.getElementById('contraseña-registro').value.trim();
  const pass2 = document.getElementById('validar-contraseña').value.trim();

  registrar(nombre, pass1, pass2);
});
