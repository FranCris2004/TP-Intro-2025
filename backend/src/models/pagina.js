class Pagina {
  constructor(id, id_aventura, titulo, contenido, imagen, es_inicio) {
    if (typeof id !== "number" || !Number.isInteger(id) || id <= 0)
      throw new Error("id invalido: debe ser un entero positivo");

    if (typeof id_aventura !== "number" || !Number.isInteger(id_aventura) || id_aventura <= 0)
      throw new Error("id_aventura invalido: debe ser un entero positivo");

    if (typeof titulo !== "string" || titulo.length == 0)
      throw new Error("titulo invalido: debe ser un string no vacio");

    if (typeof contenido !== "string" || contenido.length == 0)
      throw new Error("contenido invalido: debe ser un string no vacio");

    if (typeof imagen !== "string" && imagen !== null )
      throw new Error("imagen inválida: debe ser un string o null");

    if (typeof es_inicio !== "boolean")
      throw new Error("es_inicio inválido: debe ser true o false");

    this.id = id;
    this.id_aventura = id_aventura;
    this.titulo = titulo;
    this.contenido = contenido;
    this.imagen = imagen;
    this.es_inicio = es_inicio;
  }
}

module.exports = Pagina;
