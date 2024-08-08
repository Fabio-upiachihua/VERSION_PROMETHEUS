# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de tu proyecto al contenedor
COPY package*.json ./
RUN npm install
COPY . .

# Expone el puerto en el que tu exportador estará escuchando
EXPOSE 8080

# Comando para iniciar el exportador
CMD [ "node", "exporter.js" ]
