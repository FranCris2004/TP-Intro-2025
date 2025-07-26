FROM node:lts-alpine3.22

# directorio de trabajo que usara la api dentro del contenedor
WORKDIR /api

# al instalar la imagen copia los archivos de npm e instala los paquetes
COPY package*.json ./
RUN npm install

# copia los archivos restantes
COPY . .

# cuando se ejecute el contenedor, ejecuta la api
CMD ["npm", "start"]

# expone el puerto que utilizara la api dentro del contenedor
EXPOSE 3000
