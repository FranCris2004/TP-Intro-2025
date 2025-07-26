export default class Opcion {
    constructor(id, descripcion, id_aventura, numero_pagina_destino, numero_pagina_origen) {

        if (typeof id !== "number" || !Number.isInteger(id) || id <= 0)
        throw new Error("id invalido: debe ser un entero positivo");
        
        if (typeof descripcion !== "string" || titulo.length == 0)
            throw new Error("descripcion invalida: debe ser un string no vacio");

        if (typeof id_aventura !== "number" || !Number.isInteger(id_aventura) || id_aventura <= 0)
            throw new Error("id_aventura invalido: debe ser un entero positivo");

        if (typeof numero_pagina_destino !== "number" || !Number.isInteger(numero_pagina_destino) || numero_pagina_destino <= 0)
            throw new Error("numero_pagina_destino invalido: debe ser un entero positivo");

        if (typeof numero_pagina_origen !== "number" || !Number.isInteger(numero_pagina_origen) || numero_pagina_origen <= 0)
            throw new Error("numero_pagina_origen invalido: debe ser un entero positivo");

        
    
        this.id = id;
        this.descripcion = descripcion;
        this.id_aventura = id_aventura;
        this.numero_pagina_destino = numero_pagina_destino;
        this.numero_pagina_origen = numero_pagina_origen;

    }
}