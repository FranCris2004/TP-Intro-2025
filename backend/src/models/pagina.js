export default class Pagina {
  constructor(id, id_aventura, numero, titulo, contenido, imagen) {
    if (typeof id !== "number" || !Number.isInteger(id) || id <= 0)
      throw new Error("id invalido: debe ser un entero positivo");

    if (typeof id_aventura !== "number" || !Number.isInteger(id_aventura) || id_aventura <= 0)
      throw new Error("id_aventura invalido: debe ser un entero positivo");

    if (typeof numero !== "number" || !Number.isInteger(numero) || numero <= 0)
      throw new Error("numero invalido: debe ser un entero positivo");

    if (typeof titulo !== "string" || titulo.length == 0)
      throw new Error("titulo invalido: debe ser un string no vacio");

    if (typeof contenido !== "string" || contenido.length == 0)
      throw new Error("contenido invalido: debe ser un string no vacio");

    if (typeof imagen !== "string" && imagen !== null )
      throw new Error("imagen inválida: debe ser un string o null");

    this.id = id;
    this.id_aventura = id_aventura;
    this.numero = numero;
    this.titulo = titulo;
    this.contenido = contenido;
    this.imagen = imagen;
  }
}
