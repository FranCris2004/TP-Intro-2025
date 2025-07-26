export const portada_defecto = "./imagenes/portada_default2.jpg";

export async function obtenerLibros() {
  // Datos fijos simulados
  const aventuras = [
    {
      id: 1,
      titulo: "La Cueva Misteriosa",
      descripcion: "Una aventura llena de secretos y sorpresas.",
      id_usuario: 2,
      portada: "https://picsum.photos/200"
    },
    {
      id: 2,
      titulo: "El Tesoro de los Mares",
      descripcion: "Un viaje épico en busca del oro perdido.",
      id_usuario: 2,
      portada: "https://picsum.photos/200/300"
    },
    {
      id: 3,
      titulo: "Bosque Encantado",
      descripcion: "Magia, peligro y decisiones difíciles.",
      id_usuario: 2,
      portada: "https://picsum.photos/200/300"
    }
  ];

  const usuarios = [
    {
      id: 1,
      nombre: "Ana García",
      email: "ana@example.com",
      fecha_de_nacimiento: "1990-01-01",
      fecha_registro: "2023-01-01"
    },
    {
      id: 2,
      nombre: "Pedro López",
      email: "pedro@example.com",
      fecha_de_nacimiento: "1985-05-12",
      fecha_registro: "2022-12-15"
    }
  ];

  return { aventuras, usuarios };
}
