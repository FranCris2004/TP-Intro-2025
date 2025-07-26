export default class Aventura {
  constructor(id, titulo, descripcion, autor_id, genero, fecha_creacion, portada) {
    if (typeof id !== "number" || !Number.isInteger(id) || id <= 0)
      throw new Error("id invalido: debe ser un entero positivo");

    if (typeof titulo !== "string" || titulo.length == 0)
      throw new Error("titulo invalido: debe ser un string no vacio");

    if (typeof descripcion !== "string" && descripcion !== null)
      throw new Error("descripcion invalida: debe ser un string");

    if (typeof autor_id !== "number" || autor_id <= 0)
      throw new Error("autor_id inválido");

    if (typeof genero !== "string" || genero.length === 0)
      throw new Error("género inválido");

    if (!(typeof fecha_creacion === "string" || fecha_creacion instanceof Date))
      throw new Error("fecha_creacion inválida");

    if (typeof portada !== "string" && portada !== null)
      throw new Error("portada inválida: debe ser un string o vacio ");

    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.autor_id = autor_id;
    this.genero = genero;
    this.fecha_creacion = new Date(fecha_creacion).toLocaleTimeString();
    this.portada = portada;
  }
}
