
-- entidad 1
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    contrasenia VARCHAR(100) NOT NULL,
    email VARCHAR(250) UNIQUE NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_de_nacimiento DATE NOT NULL
);

-- entidad 2
CREATE TABLE aventura (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(50) NOT NULL,
    descripcion VARCHAR(500) NULL,
    autor_id INT NOT NULL REFERENCES usuario(id),
    genero VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    portada TEXT NULL
);

-- entidad 3
CREATE TABLE pagina (
    id SERIAL PRIMARY KEY,
    id_aventura INT NOT NULL REFERENCES aventura(id),
    numero INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    contenido VARCHAR(500) NOT NULL,
    imagen TEXT NULL
);

-- relacion entre paginas
CREATE TABLE opcion (
    id SERIAL PRIMARY KEY,
    id_aventura INT NOT NULL REFERENCES aventura(id),
    descripcion VARCHAR(500) NOT NULL,
    numero_pagina_origen INT,
<<<<<<< HEAD
    numero_pagina_destino INT 
=======
    numero_pagina_destino INT
>>>>>>> 52bb0c45f45539c90915c774885a3755ab1980b6
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
