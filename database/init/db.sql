
-- entidad 1
CREATE TABLE aventura (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200) NOT NULL
);

-- entidad 2
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    contraseña VARCHAR(100) NOT NULL
);

-- entidad 3
CREATE TABLE pagina (
    id SERIAL PRIMARY KEY,
    id_aventura INT NOT NULL REFERENCES aventura(id),
    titulo VARCHAR(100) NOT NULL,
    contenido VARCHAR(255) NOT NULL,
    imagen VARCHAR(255)
);

-- relacion entre paginas
CREATE TABLE opcion (
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(200) NOT NULL,
    id_pagina_origen INT NOT NULL REFERENCES pagina(id),
    id_pagina_destino INT REFERENCES pagina(id)
);

-- relacion entre aventura y pagina
-- paginas finales de una aventura
CREATE TABLE finales (
    id SERIAL PRIMARY KEY,
    id_pagina INT NOT NULL REFERENCES pagina(id) UNIQUE
);

-- relacion entre usuario y finales
CREATE TABLE usuario_final (
    id SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id),
    id_final INT NOT NULL REFERENCES finales(id)
);

-- PARA HACER: INSERTAR DATOS INICIALES DE LA BASE DE DATOS

