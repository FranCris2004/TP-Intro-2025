# Segundo Trabajo Practico Intro 2025 (Camejo)

## Integrantes:

- Catherine Merida Tapia 
- Matías Urbani
- Franco Cristaldo
- Bautista Reinaldo Lopez

## Como iniciar
desde el directorio del proyecto

* `docker-compose down -v` para cerrar contenedores anteriores
* `docker-compose up --build` para buildear y lanzar tanto la pagina como el backend
* `docker-compose up --build -d database` para buildear y lanzar solo la database
* `docker-compose up --build -d api` para buildear y lanzar la api y la database (dependencia)
* `docker-compose up --build -d web` para buildear y lanzar la pagina
