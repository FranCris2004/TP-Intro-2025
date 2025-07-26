export default class Usuario {
  constructor(id, nombre, email, fecha_registro, fecha_de_nacimiento) {
    if (typeof id !== "number" || !Number.isInteger(id) || id <= 0)
      throw new Error("id invalido: debe ser un entero positivo");

    if (typeof nombre !== "string" || nombre.length == 0)
      throw new Error("nombre invalido: debe ser un string no vacio");

    if (typeof email !== "string" || email.length == 0)
      throw new Error("email inválido: debe ser un string no nulo");

    if (
      !(typeof fecha_registro === "string" || fecha_registro instanceof Date)
    )
      throw new Error("fecha_registro inválida");

    if (
      !(typeof fecha_de_nacimiento === "string" || fecha_de_nacimiento instanceof Date)
    )
      throw new Error("fecha_de_nacimiento inválida");

    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.fecha_registro = new Date(fecha_registro).toLocaleTimeString();
    this.fecha_de_nacimiento = new Date(fecha_de_nacimiento).toLocaleDateString();
  }
}
