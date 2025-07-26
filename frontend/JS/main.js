// import { obtenerLibros } from "./api-libros.js";

// // Llamar directamente a la función al cargar el módulo
// obtenerLibros();


// JS/libros-main.js
import { mostrarLibros } from "./api-libros.js";

const aventurasFijos = [
  {
    id: 1,
    titulo: "La Cueva Misteriosa",
    id_usuario: 1,
    portada: "",
    fecha_creacion: "2010-06-01T12:00:00Z"
  },
  {
    id: 2,
    titulo: "El Tesoro de los Mares",
    id_usuario: 2,
    portada: "https://picsum.photos/200/300",
    fecha_creacion: "2022-03-01T12:00:00Z"
  },
  {
    id: 3,
    titulo: "El Laberinto del Tiempo",
    id_usuario: 3,
    portada: "https://picsum.photos/id/1003/200/300",
    fecha_creacion: "2024-9-01T12:00:00Z"
  },
  {
    id: 4,
    titulo: "Sombras en el Bosque",
    id_usuario: 1,
    portada: "",
    fecha_creacion: "2020-06-01T12:00:00Z"
  },
  {
    id: 5,
    titulo: "Escape del Planeta Rojo",
    id_usuario: 4,
    portada: "https://picsum.photos/id/1012/200/300",
    fecha_creacion: "2024-09-01T12:00:00Z"
  },
  {
    id: 6,
    titulo: "Los Secretos del Castillo",
    id_usuario: 5,
    portada: "https://picsum.photos/id/1025/200/300",
    fecha_creacion: "2014-06-01T12:00:00Z"
  },
  {
    id: 7,
    titulo: "Bajo Cero: Misión Antártica",
    id_usuario: 2,
    portada: "",
    fecha_creacion: "2021-06-01T12:00:00Z"
  },
  {
    id: 8,
    titulo: "Viaje al Centro de la Tierra",
    id_usuario: 3,
    portada: "https://picsum.photos/id/1035/200/300",
    fecha_creacion: "2024-06-01T12:00:00Z"
  }
];

const usuariosFijos = [
  {
    id: 1,
    nombre: "Ana García",
    usuario: "ana",
    password: "1234"
  },
  {
    id: 2,
    nombre: "Carlos Pérez",
    usuario: "carlos",
    password: "abcd"
  },
  {
    id: 3,
    nombre: "Lucía Fernández",
    usuario: "lucia",
    password: "pass123"
  },
  {
    id: 4,
    nombre: "Matías Gómez",
    usuario: "matias",
    password: "qwerty"
  },
  {
    id: 5,
    nombre: "Sofía Rodríguez",
    usuario: "sofia",
    password: "sofia2024"
  },
  {
    id: 6,
    nombre: "Diego López",
    usuario: "diego",
    password: "admin123"
  }
];

let aventurasGlobal = [...aventurasFijos];
let usuariosGlobal = [...usuariosFijos];

function agregarOrdenamiento() {
  const selector = document.getElementById("ordenar");

  selector.addEventListener("change", () => {
    const criterio = selector.value;
    let aventurasOrdenadas = [...aventurasGlobal]; // Copia para no modificar el original

    switch (criterio) {
      case "titulo":
        aventurasOrdenadas.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case "titulo-desc":
        aventurasOrdenadas.sort((a, b) => b.titulo.localeCompare(a.titulo));
        break;
      case "reciente":
        aventurasOrdenadas.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
        break;
      case "antiguo":
        aventurasOrdenadas.sort((a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion));
        break;
    }

    mostrarLibros(aventurasOrdenadas, usuariosGlobal);
  });
}

mostrarLibros(aventurasGlobal, usuariosGlobal);
agregarOrdenamiento();


